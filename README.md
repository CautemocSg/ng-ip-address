[![Downloads][downloads-image]][npm-url]

# ng-ip-address

### Description

An attribute directive that will limit an input to appropriate IP 
address characters and structure, as well as validate the value.

*Currently only supports IPv4 Addresses*

View a live demo on [Plnkr][plnkr-url], [CodePen][codepen-url], or [jsFiddle][jsfiddle-url].

#### Versions

Vanilla does not include the additional configuration options, is a 
smaller file and has lower compatibility requirements.

#### Compatibility

###### AngularJS

| Vanilla | Full |
| --- | --- |
| 1.0+ | 1.4+ |

*AngularJS compatibility of full ngIpAddress is limited by `$watchCollection()` method.*

###### Browsers

| Chrome | Firefox | Internet Explorer | Opera | Safari |
| --- | --- | --- | --- | --- |
| 1.0+ | 1.0+ | 9+ | 8.0+ | Yes |

*Browser compatibility is limited by `setSelectionRange()` method.*

### Install

[![NPM version][npm-image]][npm-url]

```text
npm install ng-ip-address
```

[![Bower version][bower-image]][github-url]

```text
bower install ng-ip-address --save
```

### Usage

Include `ngIpAddress.min.js` or `ngIpAddress.vanilla.min.js` in your 
build or directly with a `<script>` tag and require the module in your module definition:

```js
angular  
    .module('App', [  
        'ng-ip-address',
        ... // other dependencies  
    ]);
```

```html
<input type="text" ng-model="model" ng-ip-address />
```

Entries breaking one of the validation rules will cause the input to 
become invalid and gain the `ng-invalid-ip-address` class. Valid entries 
will have `ng-valid-ip-address` class.

You can also hook to `$error` with "ipAddress", ex: `form.ipAddressInput.$error.ipAddress`.

#### Additional Options

*Vanilla version does not include additional options.*

Port options are accessed through `ng-ip-config` property.

```html
<input ng-model="model" ng-ip-address ng-ip-config="ipConfigObject" />
```

```js
$scope.ipConfigObject = {
    allowPort: true
};
```
or
```js
$scope.ipConfigObject = {
    requirePort: true
};
```

Options default to false and setting requirePort to true overrides allowPort.

### Features

#### Limits User Input

* Four segments with optional port (ex: 172.16.254.1:24213)
* Each segment limited to 3 numbers
* Leading zeroes are removed (ex: 2.02 will be turned into 2.2)
* Duplicate periods are removed
* Characters limited to numbers and period

###### *with allowPort set to true*

* Limited to one colon in the fourth IP segment
* Port is limited to 5 numbers

#### Validates User Input

* Each segment must be between 0 and 255
* Must be 4 segments

###### *with allowPort set to true*

* If port exists, it must be between 1 and 65535

###### *with requirePort set to true*

* Port must be present

[bower-image]: https://img.shields.io/bower/v/ng-ip-address.svg
[github-url]: https://github.com/CautemocSg/ng-ip-address
[npm-image]: http://img.shields.io/npm/v/ng-ip-address.svg
[downloads-image]: http://img.shields.io/npm/dm/ng-ip-address.svg
[npm-url]: https://npmjs.org/package/ng-ip-address

[plnkr-url]: http://plnkr.co/edit/7n2muGs78kXqIx7MHB7E?p=preview
[codepen-url]: http://codepen.io/CautemocSg/pen/Wxrywm
[jsfiddle-url]: https://jsfiddle.net/CautemocSg/dcdrgnnh/
