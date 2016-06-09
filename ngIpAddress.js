(function() {
	'use strict';
	angular
	.module('ng-ip-address', [])
	.directive('ngIpAddress', ngIpAddress);

	function ngIpAddress() {
		return {
			restrict: 'A',
			require: '?ngModel',
			link: function(scope, element, attrs, ngModelCtrl) {
				if(!ngModelCtrl) {
					return;
				}

				var regexNumeric = new RegExp('^\\.|[^0-9\\.]+', 'g');
				var regexLeadingZero = new RegExp('^0', 'g');
				var regexDupePeriods = new RegExp('\\.\\.+', 'g');

				ngModelCtrl.$parsers.push(function(val) {

					// If val is undefined...
					if (angular.isUndefined(val)) {
						// Change the value to an empty string
						val = '';
						// Set the field validity to false
						ngModelCtrl.$setValidity('ipAddress', false);
						// Return the value
						return val;
					}

					// Initialize validation result tracker
					var validationResult = true;

					// Clean any non-numeric input
					var cleanVal = val.replace(regexNumeric, '');

					// Break the IP address into segments
					var cleanValArray = cleanVal.split('.');

					// Check if there are less than 4 segments...
					if (cleanValArray.length < 4) {
						// Set validity tracker to false
						validationResult = false;
					}
					// Otherwise, check if there are more than 4 segments...
					else if (cleanValArray.length > 4) {
						// Enforce 4 segment limit
						cleanValArray.length = 4;
					}

					// For each segment...
					for (var i = 0, lenI = cleanValArray.length; i < lenI; i++) {

						// Check if the segment length is longer than 1...
						if (cleanValArray[i].length > 1) {
							// Clean leading zeroes
							cleanValArray[i] = cleanValArray[i].replace(regexLeadingZero, '');
							// Clean any number after the third
							cleanValArray[i] = cleanValArray[i].substring(0,3);
							// If the value is greater than 255...
							if (cleanValArray[i] > 255) {
								// Set validity  tracker to false
								validationResult = false;
							}
						}
						// Otherwise, check if the length is 0...
						else if (cleanValArray[i].length < 1) {
							// Set validity  tracker to false
							validationResult = false;
						}

					}

					// Reassemble the segments
					cleanVal = cleanValArray.join('.');

					// Cleanup any scrap periods
					cleanVal = cleanVal.replace(regexDupePeriods, '.');

					// If the original value differs from the clean value...
					if (val !== cleanVal) {
						// Replace the input value with the cleaned value in the view
						ngModelCtrl.$setViewValue(cleanVal);
						ngModelCtrl.$render();
					}

					// Set validity of field (will be displayed as class 'ng-valid-ip-address' or 'ng-invalid-ip-address')
					ngModelCtrl.$setValidity('ipAddress', validationResult);

					// Return the cleaned value
					return cleanVal;
				});

				// Prevent spaces
				element.bind('keypress', function(event) {
					if(event.keyCode === 32) {
						event.preventDefault();
					}
				});

			}
		};
	}
})();
