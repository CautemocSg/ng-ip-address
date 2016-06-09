# ng-ip-address

An attribute directive that will limit an input to appropriate IP address characters and structure, as well as validate
the value.

**Currently only supports IPv4 Addresses**

Current Limit Rules:
1. Limit to 4 segments (xxx.xxx.xxx.xxx)
2. Each segment limited to 3 characters
3. Segments cannot have 0's followed by numbers (ex: 2.02 will be turned into 2.2)
4. Segments cannot be empty
5. Characters limited to numbers and period

Current Validation Rules:
1. Each segment must be between 0 and 255
2. Must be 4 segments

View a live demo on [Plnkr][plnkr-url].

It is available through NPM:

```text
npm install ng-ip-address
```

Or, via bower:

```text
bower install ng-ip-address --save
```

## Usage

Include `ngIpAddress.min.js` in your build or directly with a `<script>` tag and require the module in your module definition:

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

Valid entries will have `ng-valid-ip-address` class.

Entries breaking one of the validation rules will cause the input to become invalid and gain the `ng-invalid-ip-address` class.

[plnkr-url]: http://plnkr.co/edit/7n2muGs78kXqIx7MHB7E?p=preview
