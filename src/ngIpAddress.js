(function() {
	'use strict';
	angular
	.module('ng-ip-address', [])
	.directive('ngIpAddress', ngIpAddress);

	function ngIpAddress() {
		return {
			restrict: 'A',
			require: '?ngModel',
			scope: {
				config: '=?ngIpConfig'
			},
			link: function(scope, element, attrs, ngModelCtrl) {
				if (!ngModelCtrl) {
					return;
				}

				// Initialize regex var that will match disallowed characters
				var regexDisallowed;
				// Set up regex to match leading zero
				var regexLeadingZero = new RegExp('^0', 'g');
				// Set up regex to match duplicate period
				var regexDupePeriods = new RegExp('\\.\\.+', 'g');
				// Set up regex to match colons
				var regexColon = new RegExp(':', 'g');
				// Set up regex to match leading colons
				var regexLeadingColon = new RegExp('^:', 'g');

				ngModelCtrl.$parsers.push(function(val) {

					// If val is empty...
					if (val.length < 1) {
						// Set the field validity to true since it should be the responsibility of 'required' to stop blank entries
						ngModelCtrl.$setValidity('ipAddress', true);
						// Return the value
						return val;
					}

					var allowPort, requirePort;

					// If configuration is undefined...
					if (angular.isUndefined(scope.config)) {
						// Set additional options to false
						allowPort = false;
						requirePort = false;
					} else {
						// Otherwise, track if configuration option to require port is set
						var requirePortIsBool = typeof(scope.config.requirePort) === 'boolean';
						// If port is either optional or required, allow port to be entered
						allowPort = (requirePortIsBool && scope.config.requirePort) || ((typeof(scope.config.allowPort) === 'boolean') && scope.config.allowPort);
						// Require port if it is set
						requirePort = requirePortIsBool && scope.config.requirePort;
					}

					// If the user configured options to allow ports...
					if (allowPort) {
						// Set disallowed regex to match leading periods or anything other than numbers, periods, and colons
						regexDisallowed = new RegExp('^\\.|[^0-9\\.:]+', 'g');
					} else {
						// Otherwise, set disallowed regex to match leading periods or anything other than numbers and periods
						regexDisallowed = new RegExp('^\\.|[^0-9\\.]+', 'g');
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

						// If the user configured options to allow ports...
						if (allowPort) {
							// Check for colon in section other than the fourth
							if (i < 3) {
								// Delete colon
								cleanValArray[i] = cleanValArray[i].replace(regexColon, '');
							} else {
								// Delete colon if it is leading
								cleanValArray[i] = cleanValArray[i].replace(regexLeadingColon, '');
								// If there is a port...
								if (cleanValArray[i].indexOf(':') !== -1) {
									// Break the segment into ip segment and ports
									var segmentArray = cleanValArray[i].split(':');
									// Set the ip segment
									cleanValArray[i] = segmentArray[0];
									// Set the port, clean leading zeroes and remove any number after the fifth
									var port = segmentArray[1].replace(regexLeadingZero, '').substring(0, 5);
									// If the port is empty or the value is greater than max
									if (port.length < 1 || port > 65535) {
										// Set validity  tracker to false
										validationResult = false;
									}
								}
								// Otherwise, if port is required...
								else if (requirePort) {
									// Set validity  tracker to false
									validationResult = false;
								}
							}
						}

						// Check if the ip segment length is longer than 1...
						if (cleanValArray[i].length > 1) {
							// Clean leading zeroes and any number after the third
							cleanValArray[i] = cleanValArray[i].replace(regexLeadingZero, '').substring(0, 3);
							// If the value is greater than 255...
							if (cleanValArray[i] > 255) {
								// Set validity  tracker to false
								validationResult = false;
							}
						}
						// Otherwise, check if the length is 0...
						else if (cleanValArray[i].length < 1) {
							// Set validity tracker to false
							validationResult = false;
						}

					}

					// Reassemble the segments
					cleanVal = cleanValArray.join('.');

					// Attach the port if it exists
					if (angular.isDefined(port)) {
						cleanVal = cleanVal + ':' + port;
					}

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
