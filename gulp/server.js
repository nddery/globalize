'use strict';

var gulp = require('gulp');

function browserSyncInit(baseDir, files, browser, startPath, port) {
  var browserSync = require('browser-sync');

  browser = browser === undefined ? 'default' : browser;
  startPath = startPath === undefined ? '/' : startPath;
  port = port === undefined ? 3000 : port;

  browserSync.instance = browserSync.init(files, {
    port: port,
    startPath: startPath,
    server: {
      baseDir: baseDir
    },
    browser: browser
  });

}

gulp.task('serve', ['watch'], function () {
  browserSyncInit([
    'app',
    '.tmp'
  ], [
    'app/*.html',
    '.tmp/styles/**/*.css',
    'app/js/**/*.js',
    'app/images/**/*'
  ]);
});

gulp.task('serve:dist', ['build'], function () {
  browserSyncInit('dist');
});

gulp.task('serve:test', function () {
  browserSyncInit('./', ['test/**/*'], 'default', 'test/test.html', 1234);
});
