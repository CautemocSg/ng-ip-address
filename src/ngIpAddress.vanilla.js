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
				if (!ngModelCtrl) {
					return;
				}

				// Set up regex to match leading periods or anything other than numbers and periods
				var regexDisallowed = new RegExp('^\\.|[^0-9\\.]+', 'g');
				// Set up regex to match leading zero
				var regexLeadingZero = new RegExp('^0', 'g');
				// Set up regex to match duplicate period
				var regexDupePeriods = new RegExp('\\.\\.+', 'g');

				ngModelCtrl.$parsers.push(function(val) {

					// If val is empty...
					if (val.length < 1) {
						// Set the field validity to true since it should be the responsibility of 'required' to stop blank entries
						ngModelCtrl.$setValidity('ipAddress', true);
						// Return the value
						return val;
					}

					// Initialize validation result tracker
					var validationResult = true;

					// Clean any disallowed input
					var cleanVal = val.replace(regexDisallowed, '');

					// Break the IP address into segments
					var cleanValArray = cleanVal.split('.');
					// Eval length to be used later
					var cleanValArrayLength = cleanValArray.length;

					// Check if there are less than 4 segments...
					if (cleanValArrayLength < 4) {
						// Set validity tracker to false
						validationResult = false;
					}
					// Otherwise, check if there are more than 4 segments...
					else if (cleanValArrayLength > 4) {
						// Enforce 4 segment limit
						cleanValArray.length = 4;
						// Update length
						cleanValArrayLength = 4;
					}

					// For each segment...
					for (var i = 0; i < cleanValArrayLength; i++) {

						// Check if the segment length is longer than 1...
						if (cleanValArray[i].length > 1) {
							// Clean leading zeroes and any number after the third
							cleanValArray[i] = cleanValArray[i].replace(regexLeadingZero, '').substring(0, 3);
							// If the value is greater than 255...
							if (cleanValArray[i] > 255) {
								// Set validity tracker to false
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

					// Set validity of field (will be displayed as class 'ng-valid-ip-address' or 'ng-invalid-ip-address')
					ngModelCtrl.$setValidity('ipAddress', validationResult);

					// If the original value differs from the clean value...
					if (val !== cleanVal) {
						// Replace the input value with the cleaned value in the view
						ngModelCtrl.$setViewValue(cleanVal);
						ngModelCtrl.$render();
					}

					// Return the cleaned value
					return cleanVal;
				});

				// Prevent spaces
				element.bind('keypress', function(event) {
					if (event.keyCode === 32) {
						event.preventDefault();
					}
				});

			}
		};
	}
})();