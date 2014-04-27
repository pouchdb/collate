/*jshint node:true*/

"use strict";

var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  mocha = require('gulp-mocha'),
  istanbul = require('gulp-istanbul');

gulp.task('hint', function () {
  return gulp.src(['lib/*.js', 'test/*.js', 'gulpfile.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('test', function (cb) {
  return gulp.src(['lib/*.js'])
    .pipe(istanbul())
    .on('end', function () {
      gulp.src('test/*.js')
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .on('end', cb);
    });
});


