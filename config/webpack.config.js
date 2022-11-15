import CopyPlugin from "copy-webpack-plugin";
import FileIncludeWebpackPlugin from 'file-include-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';

import * as path from 'path';

const srcFolder = "src";
const buildFolder = "dist";

const isProd = process.argv.includes('--build');
const isDev = !isProd;

const paths = {
	src: path.resolve(srcFolder),
	build: path.resolve(buildFolder)
}

const optimization = () => {
	if (isProd) {
		const options = {
			splitChunks: {
				chunks: 'all'
			}
		}
		options.minimizer = [
			new TerserWebpackPlugin({
				extractComments: false,
			}),
			new CssMinimizerWebpackPlugin()
		]
		return options
	}
}

const cache = () => {
	if (isProd) {
		const options = {
			type: 'filesystem'
		}
		return options
	}
}

const copyPluginPatterns = () => {
	const base = {
		patterns: [
			{
				from: `${srcFolder}/resources`,
				to: `files`,
				noErrorOnMissing: true,
				force: true
			},
			{
				from: `${paths.src}/favicon.ico`,
				to: `./`,
				noErrorOnMissing: true
			}
		],
	}
	if (isDev) {
		base.patterns.push(
			{
				from: `${paths.src}/img`,
				to: `img`,
				noErrorOnMissing: true
			}
		)
	}
	return base
}


const config = {
	mode: isDev ? "development" : "production",
	cache: cache(),
	devtool: isDev ? "inline-source-map" : false,
	entry: {
		app: ['@babel/polyfill', `${paths.src}/js/app.js`],
	},
	output: {
		path: `${paths.build}`,
		filename: `js/[name].min.js`,
		publicPath: "/",
	},
	optimization: optimization(),
	devServer: {
		historyApiFallback: true,
		static: paths.build,
		open: {
			app: {
				name: 'chrome', // 'Chrome' is 'Google Chrome' on macOS, 'google-chrome' on Linux, and 'chrome' on Windows.
			},
		},
		compress: true,
		port: "auto",
		hot: true,
		host: "local-ip",
		devMiddleware: {
			writeToDisk: true,
		},

		watchFiles: [`${paths.src}/**/*.html`, `${paths.src}/**/*.htm`],
	},
	module: {
		rules: [
			{
				test: /\.(scss|css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "string-replace-loader",
						options: {
							search: "@img",
							replace: "../img",
							flags: "g",
						},
					},
					{
						loader: "css-loader",
						options: {
							importLoaders: 0,
							sourceMap: false,
							modules: false,
							url: {
								filter: (url, resourcePath) => {
									if (url.includes("img") || url.includes("fonts")) {
										return false;
									}
									return true;
								},
							},
						},
					},
					{
						loader: "sass-loader",
						options: {
							sassOptions: {
								outputStyle: "expanded",
							},
						},
					},
				],
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		],
	},
	plugins: [
		new FileIncludeWebpackPlugin({
			source: srcFolder,
			replace: [
				{ regex: "../img", to: "img" },
				{ regex: "@img", to: "img" },
			],
		}),
		new MiniCssExtractPlugin({
			filename: `./css/style.min.css`,
		}),
		new CopyPlugin(copyPluginPatterns()),
	],
	resolve: {
		alias: {
			"@scss": `${paths.src}/scss`,
			"@js": `${paths.src}/js`,
			"@img": `${paths.src}/img`,
		},
	},
};
export default config;