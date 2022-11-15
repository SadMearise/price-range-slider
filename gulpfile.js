// Импорт основного модуля
import gulp from "gulp";
// Импорт общих плагинов
import { plugins } from "./config/gulp-plugins.js";
// Импорт путей
import { path } from "./config/gulp-settings.js";

// Передаем значения в глобальную переменную
global.app = {
	gulp: gulp, 
	path: path,
	plugins: plugins,
	isProd: process.argv.includes('--build'),
	isDev: !process.argv.includes('--build'),
}

// Импорт задач
import { reset } from "./config/gulp-tasks/reset.js";
import { html } from "./config/gulp-tasks/html.js";
import { js } from "./config/gulp-tasks/js.js";
import { css } from "./config/gulp-tasks/css.js";
import { images } from "./config/gulp-tasks/images.js";
import { sprite } from "./config/gulp-tasks/sprite.js";
import { zip } from "./config/gulp-tasks/zip.js";
import { otfToTtf, ttfToWoff, fonstStyle } from "./config/gulp-tasks/fonts.js";

// Задачи
const fonts = gulp.series(otfToTtf, ttfToWoff, fonstStyle);
const devTasks = gulp.series(reset, fonts, gulp.parallel(html));
const buildTasks = gulp.series(reset, fonts, css, js, gulp.parallel(html, images));

export { html }
export { reset }
export { js }
export { css }
export { images }
export { sprite }
export { zip }

const development = gulp.series(devTasks);
const build = gulp.series(buildTasks);
const deployZIP = gulp.series(buildTasks, zip)

// Экспорт сценариев
export { development }
export { build }
export { deployZIP }

// Выполнение сценария по умолчанию
gulp.task('default', development);






