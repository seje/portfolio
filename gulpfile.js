var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	less = require('gulp-less'),
	pug = require('gulp-pug'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin');
	autoprefixer = require('gulp-autoprefixer'),
	imageminJpegRecompress = require('imagemin-jpeg-recompress'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
	uglify = require('gulp-uglify');

gulp.task('server', ['less', 'pug', 'img', 'js'], function() {
	browserSync.init({
		server: { baseDir: 'build/' }
	});
	gulp.watch('src/pug/*.pug').on('change', browserSync.reload);
	gulp.watch('src/pug/*.pug', ['pug']);
	gulp.watch('src/js/*.js').on('change', browserSync.reload);
	gulp.watch('src/js/*.js', ['js']);
	gulp.watch('src/less/*.less').on('change', browserSync.reload);
	gulp.watch('src/less/*.less', ['less']);
});
gulp.task('js', function() {
	return gulp.src('src/js/*.js')
	.pipe(plumber({
		errorHandler: notify.onError(function(err) {
			return {
				title: 'Styles',
				message: err.message
			}
		})
	}))
	.pipe(uglify())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('build/js'))
	.pipe(browserSync.stream());
});
gulp.task('less', function() {
	return gulp.src('src/less/*.less')
	.pipe(plumber({
		errorHandler: notify.onError(function(err) {
			return {
				title: 'Styles',
				message: err.message
			}
		})
	}))
	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
	}))
	.pipe(less())
	.pipe(cssmin())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('build/css'))
	.pipe(browserSync.stream());
});
gulp.task('pug', function() {
	return gulp.src('src/pug/index.pug')
	.pipe(plumber({
		errorHandler: notify.onError(function(err) {
			return {
				title: 'Styles',
				message: err.message
			}
		})
	}))
	.pipe(pug({
		pretty: true
	}))
	.pipe(gulp.dest('build/'))
	.pipe(browserSync.stream());
});

gulp.task('img', function() {
  return gulp.src('src/img/*')
    .pipe(cache(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.jpegtran({progressive: true}),
      imageminJpegRecompress({
        loops: 5,
        min: 65,
        max: 70,
        quality:'medium'
      }),
      imagemin.svgo(),
      imagemin.optipng({optimizationLevel: 3}),
      pngquant({quality: '65-70', speed: 5})
    ],{
      verbose: true
    })))
    .pipe(gulp.dest('build/img/'));
});

gulp.task('clear', function (done) {
  return cache.clearAll(done);
});

gulp.task('default', ['server']);