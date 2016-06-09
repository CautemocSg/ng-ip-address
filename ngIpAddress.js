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
				var regexLeadingZero = new RegExp('^0+', 'g');
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

					// Clean invalid inputs
					// ---------------------------------------------
					// Clean any non-numeric input
					var cleanVal = val.replace(regexNumeric, '');
					// Break the IP address into octets
					var cleanValArray = cleanVal.split('.');
					// Check if there are more than 4 octets...
					if (cleanValArray.length > 4) {
						// Enforce 4 octet limit
						cleanValArray.length = 4;
					}
					// For each octet...
					for (var i = 0, lenI = cleanValArray.length; i < lenI; i++) {
						// If the octet length is longer than 1...
						if (cleanValArray[i].length > 1) {
							// Clean leading zeroes
							cleanValArray[i] = cleanValArray[i].replace(regexLeadingZero, '');
						}
						// Clean any number after the third
						cleanValArray[i] = cleanValArray[i].substring(0,3);
					}
					// Reassemble the octets
					cleanVal = cleanValArray.join('.');
					// Cleanup any scrap periods
					cleanVal = cleanVal.replace(regexDupePeriods, '.');
					// If the original value differs from the clean value...
					if (val !== cleanVal) {
						// Replace the input value with the cleaned value in the view
						ngModelCtrl.$setViewValue(cleanVal);
						ngModelCtrl.$render();
					}

					// Validate the overall IP address format
					// ---------------------------------------------
					// Initialize validation result tracker
					var validationResult = true;
					// Break the cleaned IP address into octets and store the length
					cleanValArray = cleanVal.split('.');
					var cleanedValArrayLength = cleanValArray.length;
					// If there are 4 octets...
					if (cleanedValArrayLength === 4) {
						// For each octet...
						for (var j = 0; j < cleanedValArrayLength; j++) {
							// If the length is shorter than 1 or the value greater than 255...
							if (cleanValArray[j].length < 1 || cleanValArray[j] > 255) {
								// Set validity  tracker to false and escape loop
								validationResult = false;
								break;
							}
						}
					} else {
						// Set validity tracker to false
						validationResult = false;
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
