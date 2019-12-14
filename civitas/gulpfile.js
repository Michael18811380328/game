var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var header = require('gulp-header');
var del = require('del');
var pkg = require('./package.json');
var fs = require('fs');
var replace = require('gulp-replace');

gulp.task('app', function() {
	del([
		'dist/app.*.js'
    ]);
	return gulp.src([
	  	'src/js/others/functions.js',
		'src/js/constants/default.js',
		'src/js/languages/en.js',
		'src/js/constants/initial.js',
		/*
		'src/js/constants/api.js',
		*/
		'src/js/constants/religion.js',
		'src/js/constants/diplomacy.js',
		'src/js/constants/nation.js',
		'src/js/constants/climate.js',
		'src/js/constants/personality.js',
		'src/js/constants/military.js',
		'src/js/constants/buildings.js',
		'src/js/constants/settlements.js',
		'src/js/constants/events.js',
		'src/js/constants/resources.js',
		'src/js/constants/achievements.js',
		'src/js/constants/items.js',
		'src/js/constants/hero.js',
		'src/js/helpers/utils.js',
		'src/js/objects/modules/ai.js',
		/*
		'src/js/objects/modules/api.js',
		'src/js/objects/modules/jailer.js',
		*/
		'src/js/helpers/ui.js',
		'src/js/objects/core/settlement.js',
		'src/js/objects/core/event.js',
		'src/js/objects/core/building.js',
		'src/js/objects/core/battleground.js',
		'src/js/objects/core/hero.js',
		'src/js/objects/ui/window.js',
		'src/js/objects/ui/modal.js',
		'src/js/objects/ui/panel.js',
		'src/js/objects/core/game.js',
		'src/js/definitions/ui/panel/settlement.js',
		'src/js/definitions/ui/panel/help.js',
		'src/js/definitions/ui/panel/debug.js',
		'src/js/definitions/ui/panel/building.js',
		'src/js/definitions/ui/panel/campaign.js',
		'src/js/definitions/ui/panel/storage.js',
		'src/js/definitions/ui/panel/world.js',
		'src/js/definitions/ui/panel/ranks.js',
		'src/js/definitions/ui/panel/new_army.js',
		'src/js/definitions/ui/panel/new_spy.js',
		'src/js/definitions/ui/panel/new_caravan.js',
		'src/js/definitions/ui/panel/council.js',
		'src/js/definitions/ui/panel/army.js',
		'src/js/definitions/ui/panel/buildings.js',
		'src/js/definitions/ui/panel/trades.js',
		'src/js/definitions/ui/panel/building/camp.js',
		'src/js/definitions/ui/panel/building/shipyard.js',
		'src/js/definitions/ui/panel/building/church.js',
		'src/js/definitions/ui/panel/building/embassy.js',
		'src/js/definitions/ui/panel/building/tavern.js',
		'src/js/definitions/ui/panel/building/academy.js',
		'src/js/definitions/ui/window/signin.js',
		'src/js/definitions/ui/window/battle.js',
		'src/js/definitions/ui/window/signup.js',
		'src/js/definitions/ui/window/error.js',
		'src/js/definitions/ui/window/options.js'
  	])
    .pipe(concat('app.debug.js'))
    .pipe(header(fs.readFileSync('HEADER', 'utf8'), { pkg: pkg } ))
    .pipe(replace('__VERSION_NUMBER__', pkg.version +
    	'.' + ((new Date()).getMonth() + 1) + '' +
    	(new Date()).getDate() + '' + (new Date()).getFullYear()))
    .pipe(gulp.dest('dist/'))
});

gulp.task('app_minify', gulp.series(gulp.parallel('app'), function() {
	return gulp.src([
		'dist/app.debug.js'
  	])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(header(fs.readFileSync('HEADER', 'utf8'), { pkg: pkg } ))
    .pipe(replace('__VERSION_NUMBER__', pkg.version +
    	'.' + ((new Date()).getMonth() + 1) + '' +
    	(new Date()).getDate() + '' + (new Date()).getFullYear()))
    .pipe(gulp.dest('dist/'))
}));

gulp.task('lib', function() {
	del([
		'dist/libs.*.js'
    ]);
	return gulp.src([
	  	'vendor/js/jquery.js',
		'vendor/js/jquery.ui.js',
		'vendor/js/jquery.scrollto.js',
		'vendor/js/jquery.tipsy.js',
		'vendor/js/crypto.js'
  	])
    .pipe(concat('libs.debug.js'))
    .pipe(gulp.dest('dist/'))
});

gulp.task('lib_minify', gulp.series(gulp.parallel('lib'), function() {
	return gulp.src([
		'dist/libs.debug.js'
  	])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'))
}));

gulp.task('css', function() {
	del([
		'dist/app.*.css'
    ]);
	return gulp.src([
		'src/css/animation.css',
	  	'src/css/main.css',
	  	'src/css/modal.css',
	  	'src/css/notification.css',
	  	'src/css/panel.css',
	  	'src/css/progress.css',
		'src/css/resources.css',
		'src/css/table.css',
		'src/css/tabs.css',
		'src/css/tips.css',
		'src/css/window.css'
  	])
    .pipe(concat('app.debug.css'))
    .pipe(header(fs.readFileSync('HEADER', 'utf8'), { pkg: pkg } ))
    .pipe(replace('__VERSION_NUMBER__', pkg.version +
    	'.' + ((new Date()).getMonth() + 1) + '' +
    	(new Date()).getDate() + '' + (new Date()).getFullYear()))
    .pipe(gulp.dest('dist/'))
});

gulp.task('css_minify', gulp.series(gulp.parallel('css'), function() {
	return gulp.src([
		'dist/app.debug.css'
  	])
    .pipe(concat('app.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist/'))
}));

gulp.task('minify', gulp.series(gulp.parallel(['app_minify', 'lib_minify', 'css_minify']), async function() {
	return true;
}));

gulp.task('watch', function () {
	gulp.watch("src/**/*.js", gulp.parallel('app'));
	gulp.watch("src/**/*.css", gulp.parallel('css'));
	gulp.watch("vendor/**/*.js", gulp.parallel('lib'));
});

gulp.task('build', gulp.series(gulp.parallel('css', 'app', 'lib')));

gulp.task('default', gulp.series(gulp.parallel('watch', 'build')));
