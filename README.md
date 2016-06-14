# ng-ip-address

### Description

An attribute directive that will limit an input to appropriate IP address characters and structure, as well as validate
the value.

*Currently only supports IPv4 Addresses*

View a live demo on [Plnkr][plnkr-url], [CodePen][codepen-url], or [jsFiddle][jsfiddle-url].

### Install

It is available through NPM:

```text
npm install ng-ip-address
```

Or, via bower:

```text
bower install ng-ip-address --save
```

### Usage

Include `ngIpAddress.min.js` or `ngIpAddress.vanilla.min.js` in your build or directly with a `<script>` tag and require the module in your module definition:

```js
angular  
    .module('App', [  
        'ng-ip-address',
        ... // other dependencies  
    ]);
```

```html
<input ng-model="model" ng-ip-address />
```

Entries breaking one of the validation rules will cause the input to become invalid and gain the `ng-invalid-ip-address` class. Valid entries will have `ng-valid-ip-address` class.

###### Additional Options

*Vanilla version does not include additional options so is a smaller file and may perform faster*

Port options are accessed through `ng-ip-config` property. Options default to false and requirePort overrides allowPort.

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

### Features

###### Limits User Input

* Four segments with optional port (ex: 172.16.254.1:24213)
* Each segment limited to 3 numbers
* Leading zeroes are removed (ex: 2.02 will be turned into 2.2)
* Duplicate periods are removed
* Characters limited to numbers and period

*with allowPort set to true*

* Limited to one colon in the fourth IP segment
* Port is limited to 5 numbers

###### Validates User Input

* Each segment must be between 0 and 255
* Must be 4 segments

*with allowPort set to true*

* If port exists, it must be between 1 and 65535

*with requirePort set to true*

* Port must be present

### Planned Releases

###### Version 1.2.0

* Support for IPv6

[plnkr-url]: http://plnkr.co/edit/7n2muGs78kXqIx7MHB7E?p=preview
[codepen-url]: http://codepen.io/ScottGullen/pen/Wxrywm
[jsfiddle-url]: https://jsfiddle.net/CautemocSg/dcdrgnnh/
