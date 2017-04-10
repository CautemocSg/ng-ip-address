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

				// Initialize configuration
				var allowPort = false;
				var requirePort = false;

				// Initialize regex...
				// Match leading zero
				var regexLeadingZero = new RegExp('^0', 'g');
				// Match leading period
				var regexLeadingPeriod = new RegExp('^\\.', 'g');
				// Match duplicate period
				var regexDupePeriods = new RegExp('\\.\\.+', 'g');
				// Match colons
				var regexColon = new RegExp(':', 'g');
				// Match leading colon
				var regexLeadingColon = new RegExp('^:', 'g');

				// Initialize caret position tracker
				var curPos = 0;

				// Initialize ctrl/cmd tracker
				var ctrlDown = false;

				// Shallow watch the members of the config object and evaluate changes
				scope.$watchCollection('config', evalConfiguration);

				// Attach key evaluators to the element keydown and keyup events to check
				// for when ctrl/cmd is being held down
				element.bind('keydown', evalIfCtrlDown);
				element.bind('keyup', evalIfCtrlUp);

				// Attach key evaluator to the element keypress event
				element.bind('keypress', evalKeyPress);

				// Attach input evaluator to the input model parsers
				ngModelCtrl.$parsers.push(evalInput);

				function evalConfiguration(newConfig) {
					// If configuration is truthy...
					if (newConfig) {
						// Require port if it is set
						requirePort = typeof(newConfig.requirePort) === 'boolean' && newConfig.requirePort;
						// If port is either required or optional, allow port
						allowPort = requirePort || ((typeof(newConfig.allowPort) === 'boolean') && newConfig.allowPort);
					} else {
						// Otherwise, reset the options to false
						allowPort = false;
						requirePort = false;
					}
					// If port is allowed or the value is falsey...
					if (allowPort || !ngModelCtrl.$viewValue) {
						// Trigger parser to check validity
						ngModelCtrl.$parsers[0](ngModelCtrl.$viewValue);
					} else {
						// Otherwise, remove colons and replace view value
						ngModelCtrl.$setViewValue(ngModelCtrl.$viewValue.replace(regexColon, ''));
					}
				}

				function evalIfCtrlDown(event) {
					if (event.which == 17 || event.which == 91) {
						ctrlDown = true;
					}
				}

				function evalIfCtrlUp(event) {
					if (event.which == 17 || event.which == 91) {
						ctrlDown = false;
					}
				}

				function evalKeyPress(event) {
					// If the character code is not allowed...
					if ((event.which < 46 && event.which !== 0 && event.which != 8 && event.which != 13)
						|| event.which == 47
						|| (event.which == 58 && !allowPort)
						|| event.which > 58 && !(ctrlDown && (event.which == 99 || event.which == 118 || event.which == 120))) {
						// Stop key press from propagating
						event.preventDefault();
					}
				}

				function evalInput(val) {
					// If val is falsey (undefined, empty string, etc)...
					if (!val) {
						// Set the field validity to true since it should be the responsibility of 'required' to stop blank entries
						ngModelCtrl.$setValidity('ipAddress', true);
						// Return value
						return val;
					}

					// Set caret position tracker
					curPos = element[0].selectionStart;

					// Initialize validation result tracker
					var validationResult = true;

					// Initialize port holder
					var port = null;

					// Remove leading period
					val = val.replace(regexLeadingPeriod, '');

					// Remove any duplicate periods
					val = val.replace(regexDupePeriods, '.');

					// Break the IP address into segments
					var valArray = val.split('.');
					// Eval length to be used later
					var valArrayLength = valArray.length;

					// If there are less than four IP segments...
					if (valArrayLength < 4) {
						// Set validity tracker to false
						validationResult = false;
					}
					// Otherwise, if there are more than four IP segments...
					else if (valArrayLength > 4) {
						// Enforce 4 segment limit
						valArray.length = 4;
						// Update array length
						valArrayLength = 4;
					}

					// For each segment...
					for (var i = 0; i < valArrayLength; i++) {
						// Eval array value to be used later so the array isn't getting accessed so often
						var arrayVal = valArray[i];
						// If the user configured options to allow ports...
						if (allowPort) {
							// If the current section is not the fourth...
							if (i < 3) {
								// Delete any colons
								arrayVal = arrayVal.replace(regexColon, '');
							} else {
								// Delete colon if it is leading (ex. 1.1.1.:)
								arrayVal = arrayVal.replace(regexLeadingColon, '');
								// If there is a port...
								if (arrayVal.indexOf(':') != -1) {
									// Break the segment into ip segment and ports
									var segmentArray = arrayVal.split(':');
									// Set the ip segment
									arrayVal = segmentArray[0];
									// Set the port, delete leading zeroes and remove any number after the fifth
									port = segmentArray[1].replace(regexLeadingZero, '').substring(0, 5);
									// If the port is empty or the value is greater than max
									if (!port || port > 65535) {
										// Set validity tracker to false
										validationResult = false;
									}
								}
								// Otherwise, if port is required...
								else if (requirePort) {
									// Set validity tracker to false
									validationResult = false;
								}
							}
						}
						// If the ip segment value is longer than one digit...
						if (arrayVal.length > 1) {
							// Delete leading zeroes and any number after the third
							arrayVal = arrayVal.replace(regexLeadingZero, '').substring(0, 3);
							// If the value is greater than 255...
							if (arrayVal > 255) {
								// Set validity tracker to false
								validationResult = false;
							}
						}
						// Otherwise, check if the value is empty...
						else if (!arrayVal) {
							// Set validity tracker to false
							validationResult = false;
						}
						// Set the final value back to the segment
						valArray[i] = arrayVal;
					}

					// Reassemble the segments
					val = valArray.join('.');

					// If the port is not null...
					if (port !== null) {
						// Attach it to the final value
						val += ':' + port
					}

					// Set validity of field (will be displayed as class 'ng-valid-ip-address' or 'ng-invalid-ip-address')
					ngModelCtrl.$setValidity('ipAddress', validationResult);

					// Replace the input value with the cleaned value in the view
					ngModelCtrl.$setViewValue(val);
					ngModelCtrl.$render();

					// Set the caret position back to where it was prior to re-render
					element[0].setSelectionRange(curPos, curPos);

					// Return value
					return val;
				}

			}
		};
	}
}());