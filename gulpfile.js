'use strict';
var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename');

var Server = require('karma').Server;

gulp.task('default', function() {
  return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('.'));
});

gulp.task('test', function(done) {
	new Server({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done).start();
});