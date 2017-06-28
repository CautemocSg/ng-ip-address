var demoApp = angular.module('demoApp', ['ng-ip-address']);

demoApp.controller('DemoAppController', ['$scope', function($scope) {
	$scope.allowPort = {allowPort: true};
	$scope.requirePort = {requirePort: true};
	$scope.portConfig = {requirePort: false, allowPort: true};
}]);