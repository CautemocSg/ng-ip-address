var gulp = require('gulp'),
	gulpInject = require('gulp-inject'),
	gulpRimraf = require('gulp-rimraf'),
	gulpConnect = require('gulp-connect');

var sequence = require('run-sequence'),
	modRewrite = require('connect-modrewrite'),
	merge = require('merge-stream'),
	event = require('event-stream');

var demoBuildDir = './build';

gulp.task('clean', function () {
	return gulp.src([demoBuildDir + '/**/*.*'], {read: false})
		.pipe(gulpRimraf());
});

gulp.task('configure-html', function () {
	return gulp.src('app/index.html')
		.pipe(removeReadonly())
		.pipe(gulp.dest(demoBuildDir));
});

gulp.task('configure-js', function () {
	var angularStream = gulp.src('bower_components/angular/angular.min.js')
		.pipe(removeReadonly())
		.pipe(gulp.dest(demoBuildDir + '/assets/js/'));

	var ngIpAddressStream = gulp.src('../ngIpAddress.min.js')
		.pipe(removeReadonly())
		.pipe(gulp.dest(demoBuildDir + '/assets/js/'));

	var appStream = gulp.src('app/demoApp.js')
		.pipe(removeReadonly())
		.pipe(gulp.dest(demoBuildDir + '/assets/js/'));

	return merge(angularStream, ngIpAddressStream, appStream);
});

gulp.task('inject-files', ['configure-js'], function () {
	var target = gulp.src(demoBuildDir + '/index.html');
	var sources = gulp.src('./assets/js/*.js', {read: false, cwd: __dirname + '/build'});

	return target
		.pipe(gulpInject(sources))
		.pipe(gulp.dest(demoBuildDir));
});

gulp.task('start-server:build', function () {
	gulpConnect.server({
		port: 8000,
		root: demoBuildDir,
		middleware: function () {
			return [
				modRewrite(['^[^\\.]*$ /index.html [L]'])
			];
		}
	});
});

gulp.task('build', function () {
	sequence('clean', 'configure-html', 'inject-files', function() {
		console.log('Successfully built.');
	});
});

gulp.task('default', function () {
	sequence('build', 'start-server:build');
});

function removeReadonly() {
	function transform(file, cb) {
		if ((file.stat.mode & 146) == 0) {
			file.stat.mode = file.stat.mode | 146;
		}
		cb(null, file);
	}

	return event.map(transform);
}