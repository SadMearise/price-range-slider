import webpackConfig from '../webpack.config.js';
import webpack from 'webpack-stream';

export const js = () => {
	return app.gulp.src(app.path.src.js)
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "JS",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(webpack({
			config: webpackConfig
		}))
		.pipe(app.gulp.dest(app.path.build.js));
}