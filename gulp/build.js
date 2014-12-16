'use strict';

var gulp        = require('gulp'),
    environment = 'development';

// Instead of require'ing each plugin separately, gulp-load-plugins will load
// all plugins that match the pattern in the $ variable.
// For example, if you plugin is named gulp-html-replace, you can access it
// like so: $.htmlReplace()
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

// Compile SASS files to CSS and run autoprefixer
gulp.task('styles', function () {
  return gulp.src('app/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sass({style: 'expanded', sourcemaps: true}))
    .pipe($.autoprefixer('> 1%, last 2 versions, Firefox ESR, Opera 12.1, ie >=9'))
    .pipe(gulp.dest('.tmp/styles'))
    .pipe($.size());
});

// Run JSHint on our own JavaScript files (not vendors)
gulp.task('jshint', function () {
  return gulp.src([
      'app/js/**/*.js',
      '!app/js/vendor/**/*.js'
    ])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.size());
});

// Minifies HTML partials files
gulp.task('partials', function () {
  return gulp.src('app/**/*.html')
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

// Move data
gulp.task('data', function () {
  return gulp.src('app/data/**/*.json')
    .pipe(gulp.dest('dist/data'))
    .pipe($.size());
});

// "Compile" the index.html file. Any useref assets is taken care of in here.
gulp.task('html', ['styles', 'partials'], function () {
  var assets = $.useref.assets();

  return gulp.src('app/index.html')
    .pipe(assets)
    .pipe($.rev())
    .pipe($.if('**/*.js', $.stripDebug()))
    .pipe($.if('**/*.js', $.ngAnnotate()))
    .pipe($.if('**/*.js', $.uglify({preserveComments: $.uglifySaveLicense})))
    .pipe($.if('**/*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

// Optimize images and move them to dist.
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true,
      svgo: [
        {removeViewBox: true},
        {removeMetadata: true},
        {removeTitle: true},
        {removeDesc: true}
      ]
    }))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size());
});

// Uglify all scripts file and remove all those pesky console.log statement
// and finally move them over to the dist folder.
gulp.task('scripts', function () {
  var appJsFilter = $.filter('js/**/*.js');

  return gulp.src('app/**/*.js')
    .pipe(appJsFilter)
    .pipe($.if('development' !== environment, $.stripDebug()))
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(appJsFilter.restore())
    .pipe(gulp.dest('dist'))
    .pipe($.size())
});

// Clean up temporary project files and previous build to ensure a clean build
gulp.task('clean', function (cb) {
  $.del(['.tmp', 'dist'], cb);
});

// Clean the project before actually building it. The use of gulp.start() is not
// recommended hence the second `build-it` task. Instead of calling gulp.start()
// multiple time we call it once, and run the other tasks as dependencies of
// `build-it`.
gulp.task('build', ['clean'], function() {
  gulp.start(['html', 'images', 'jshint', 'data']);
});
