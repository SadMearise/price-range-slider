import webpcss from 'gulp-webpcss';
import autoprefixer from 'gulp-autoprefixer';
import groupCssMediaQueries from 'gulp-group-css-media-queries';

export const css = () => {
	return app.gulp.src(`${app.path.build.css}*.css`, {})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "CSS",
				message: "Error: <%= error.message %>"
			})))
		.pipe(
			app.plugins.if(
				app.isProd,
				groupCssMediaQueries()
			)
		)
		.pipe(
			app.plugins.if(
				app.isProd,
				autoprefixer({
					grid: true,
					cascade: true
				})
			)
		)
		.pipe(
			app.plugins.if(
				app.isProd,
				webpcss(
					{
						webpClass: ".webp",
						noWebpClass: ".no-webp"
					}
				)
			)
		)
		.pipe(app.gulp.dest(app.path.build.css));
}