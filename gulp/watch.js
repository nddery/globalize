'use strict';

var gulp = require('gulp');

gulp.task('watch', ['styles'] ,function () {
  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/js/**/*.js', ['jshint']);
  gulp.watch('app/images/**/*', ['images']);
});
