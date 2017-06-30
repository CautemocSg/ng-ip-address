module.exports = function(config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: [
			'bower_components/jquery/dist/jquery.js',
			'bower_components/angular/angular.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'src/ngIpAddress.js',
			'test/*.spec.js'
		],
		plugins : [
			'karma-jasmine',
			'karma-chrome-launcher',
			'karma-phantomjs-launcher'
		],
		reporters: ['progress'],
		port: 8080,
		colors: true,
		logLevel: config.LOG_DISABLE,
		autoWatch: false,
		browsers: ['Chrome'],
		singleRun: true
	});
};