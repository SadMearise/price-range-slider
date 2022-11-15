// Импортируем модули
import notify from "gulp-notify";
import plumber from "gulp-plumber";
import ifPlugin from "gulp-if";
import rename from 'gulp-rename';
import newer from 'gulp-newer';

// Экспортируем объект
export const plugins = {
	notify,
	if: ifPlugin,
	plumber,
	rename,
	newer

}