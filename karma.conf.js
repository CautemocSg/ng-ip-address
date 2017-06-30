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
			'karma-phantomjs-launcher'
		],
		port: 9876,
		colors: true,
		logLevel: config.LOG_DISABLE,
		autoWatch: false,
		browsers: ['PhantomJS'],
		singleRun: true
	});
};