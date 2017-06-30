'use strict';

describe('ng-ip-address', function () {
	var compile, scope, directiveElem, directiveInput, form;

	beforeEach(module('ng-ip-address'));

	beforeEach(function(){
		inject(function($compile, $rootScope){
			compile = $compile;
			scope = $rootScope.$new();
		});
		directiveElem = getCompiledElement();
		directiveInput = getCompiledElementInput();
		form = scope.ipAddressForm;
	});

	function getCompiledElement(){
		var element = angular.element(
			'<form name="ipAddressForm">' +
			'<input type="text" name="ipAddressInput" ng-model="inputValue" ng-ip-address ng-ip-config="config" />' +
			'</form>'
		);
		var compiledElement = compile(element)(scope);
		scope.$digest();
		return compiledElement;
	}

	function getCompiledElementInput() {
		return directiveElem.find('input');
	}

	function isKeyPressPrevented(keyCode) {
		var keyPress = $.Event('keypress');
		keyPress.which = keyCode;
		keyPress.keyCode = keyCode;
		angular.element(directiveInput).triggerHandler(keyPress);
		return keyPress.isDefaultPrevented();
	}

	function typeString(input) {
		// Clear any existing value
		clearInput();
		// Break the input into individual characters
		var inputAr = input.split('');
		// Initialize holder for the current value in the input
		var currentVal, charCode;
		// For each character being input...
		for (var i = 0, iLen = inputAr.length; i < iLen; i++) {
			// Get the charCode of the character
			charCode = inputAr[i].charCodeAt(0);
			// If the character is not prevented...
			if (!isKeyPressPrevented(charCode)) {
				// Update the current value holder
				currentVal = angular.element(directiveInput).val();
				// Update the value in the input to the value of the holder
				angular.element(directiveInput).val(currentVal + inputAr[i]).trigger('input');
			}
		}
	}

	function clearInput() {
		angular.element(directiveInput).val('').trigger('input');
	}

	function isInputValid() {
		return form.ipAddressInput.$valid &&
			!form.ipAddressInput.$error.ipAddress &&
			angular.element(directiveInput).hasClass('ng-valid') &&
			angular.element(directiveInput).hasClass('ng-valid-ip-address');
	}

	function isInputInvalid() {
		return form.ipAddressInput.$invalid &&
			form.ipAddressInput.$error.ipAddress &&
			angular.element(directiveInput).hasClass('ng-invalid') &&
			angular.element(directiveInput).hasClass('ng-invalid-ip-address');
	}

	describe('enforcing character rules', function() {
		it('should allow all numerals', function () {
			typeString('0');
			expect(scope.inputValue).toBe('0');
			typeString('1');
			expect(scope.inputValue).toBe('1');
			typeString('2');
			expect(scope.inputValue).toBe('2');
			typeString('3');
			expect(scope.inputValue).toBe('3');
			typeString('4');
			expect(scope.inputValue).toBe('4');
			typeString('5');
			expect(scope.inputValue).toBe('5');
			typeString('6');
			expect(scope.inputValue).toBe('6');
			typeString('7');
			expect(scope.inputValue).toBe('7');
			typeString('8');
			expect(scope.inputValue).toBe('8');
			typeString('9');
			expect(scope.inputValue).toBe('9');
		});
		it('should prevent all letters', function () {
			typeString('abcdefghijklmnopqrstuvwxyz');
			expect(scope.inputValue).toBe('');
		});
		it('should prevent all non-alphanumeric (symbols), other than period and colon', function () {
			typeString('()`~!@#$%^&*-+=|\\{}[];\"\'<>,?/');
			expect(scope.inputValue).toBe('');
		});
		it('should prevent all Unicode characters', function () {
			typeString('€Γλ💩🔥');
			expect(scope.inputValue).toBe('');
		});
		it('should allow period after valid characters', function () {
			typeString('1.');
			expect(scope.inputValue).toBe('1.');
			typeString('12.');
			expect(scope.inputValue).toBe('12.');
			typeString('123.');
			expect(scope.inputValue).toBe('123.');
		});
		it('should prevent colon when port is not allowed', function () {
			typeString(':');
			expect(scope.inputValue).toBe('');
			typeString('123:');
			expect(scope.inputValue).toBe('123');
			typeString('123.123:');
			expect(scope.inputValue).toBe('123.123');
			typeString('123.123.123:');
			expect(scope.inputValue).toBe('123.123.123');
			typeString('123.123.123.123:');
			expect(scope.inputValue).toBe('123.123.123.123');
		});
		it('should limit colon to fourth segment when port is allowed', function () {
			scope.config = {allowPort: true};
			typeString(':');
			expect(scope.inputValue).toBe('');
			typeString('123:');
			expect(scope.inputValue).toBe('123');
			typeString('123.123:');
			expect(scope.inputValue).toBe('123.123');
			typeString('123.123.123:');
			expect(scope.inputValue).toBe('123.123.123');
			typeString('123.123.123.123:');
			expect(scope.inputValue).toBe('123.123.123.123:');
		});
	});

	describe('enforcing format rules', function() {
		it('should remove leading zeros from IP sections but allow sections to be only zero', function () {
			typeString('012');
			expect(scope.inputValue).toBe('12');
			typeString('001');
			expect(scope.inputValue).toBe('1');
			typeString('0.0.0.0');
			expect(scope.inputValue).toBe('0.0.0.0');
		});
		it('should remove leading zero from port section', function () {
			scope.config = {allowPort: true};
			typeString('123.123.123.123:0');
			expect(scope.inputValue).toBe('123.123.123.123:');
			typeString('123.123.123.123:01');
			expect(scope.inputValue).toBe('123.123.123.123:1');
		});
		it('should remove all characters after the third per each IP section', function () {
			typeString('12345678');
			expect(scope.inputValue).toBe('123');
			typeString('123.12345678');
			expect(scope.inputValue).toBe('123.123');
			typeString('123.123.12345678');
			expect(scope.inputValue).toBe('123.123.123');
			typeString('123.123.123.12345678');
			expect(scope.inputValue).toBe('123.123.123.123');
		});
		it('should remove all characters after the fourth IP section', function () {
			typeString('123.123.123.123.123.123.123.123');
			expect(scope.inputValue).toBe('123.123.123.123');
		});
		it('should remove all characters after the fifth in the port section', function () {
			scope.config = {allowPort: true};
			typeString('123.123.123.123:12345678');
			expect(scope.inputValue).toBe('123.123.123.123:12345');
		});
		it('should remove leading period', function () {
			typeString('.');
			expect(scope.inputValue).toBe('');
		});
		it('should remove duplicate periods', function () {
			typeString('123..');
			expect(scope.inputValue).toBe('123.');
			typeString('123..123');
			expect(scope.inputValue).toBe('123.123');
		});
		it('should remove port if the port options change to disable it', function () {
			scope.config = {allowPort: true};
			typeString('123.123.123.123:12345');
			expect(scope.inputValue).toBe('123.123.123.123:12345');
			scope.config = {allowPort: false};
			scope.$digest();
			expect(scope.inputValue).toBe('123.123.123.123');
		});
	});

	describe('validating ip address rules', function() {
		it('should validate each IP segment is between 0 and 255', function () {
			typeString('0.0.0.0');
			expect(isInputValid()).toBe(true);
			typeString('255.255.255.255');
			expect(isInputValid()).toBe(true);
			typeString('256.1.1.1');
			expect(isInputInvalid()).toBe(true);
			typeString('1.256.1.1');
			expect(isInputInvalid()).toBe(true);
			typeString('1.1.256.1');
			expect(isInputInvalid()).toBe(true);
			typeString('1.1.1.256');
			expect(isInputInvalid()).toBe(true);
		});
		it('should validate there are four IP segments', function () {
			typeString('0');
			expect(isInputInvalid()).toBe(true);
			typeString('0.0');
			expect(isInputInvalid()).toBe(true);
			typeString('0.0.0');
			expect(isInputInvalid()).toBe(true);
			typeString('0.0.0.');
			expect(isInputInvalid()).toBe(true);
			typeString('0.0.0.0');
			expect(isInputValid()).toBe(true);
		});
		it('should validate that if port exists, it is between 1 and 65535', function () {
			scope.config = {allowPort: true};
			typeString('0.0.0.0:');
			expect(isInputInvalid()).toBe(true);
			typeString('0.0.0.0:0');
			expect(isInputInvalid()).toBe(true);
			typeString('0.0.0.0:65536');
			expect(isInputInvalid()).toBe(true);
			typeString('0.0.0.0:1');
			expect(isInputValid()).toBe(true);
			typeString('0.0.0.0:65535');
			expect(isInputValid()).toBe(true);
		});
		it('should validate port exists if it is required', function () {
			scope.config = {requirePort: true};
			typeString('0.0.0.0');
			expect(isInputInvalid()).toBe(true);
			typeString('0.0.0.0:');
			expect(isInputInvalid()).toBe(true);
			typeString('0.0.0.0:1');
			expect(isInputValid()).toBe(true);
		});
	});
});