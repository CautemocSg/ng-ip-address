// Karma configuration
module.exports = function(config) {
	config.set({

		// Base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: '',

		// Frameworks to use
		frameworks: ['jasmine'],

		// List of files / patterns to load in the browser
		files: [
			'bower_components/jquery/dist/jquery.min.js',
			'bower_components/angular/angular.min.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'ngIpAddress.min.js',
			'test/*.spec.js'
		],

		// List of files to exclude
		exclude: [
		],

		// Pre-process matching files before serving them to the browser
		preprocessors: {
		},

		// Test results reporter to use
		reporters: ['progress'],

		// Web server port
		port: 8080,

		// Enable / disable colors in the output (reporters and logs)
		colors: true,

		// Level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_DISABLE,

		// Enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,

		// Start these browsers
		browsers: ['Chrome'],

		// Continuous Integration mode
		singleRun: true
	});
};