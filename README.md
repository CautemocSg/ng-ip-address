# ng-ip-address

An attribute directive that will limit an input to appropriate IP address characters and structure, as well as validate
the value.

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

Include `ip-address.min.js` in your build or directly with a `<script>` tag and require the module in your module definition:

```js
angular  
    .module('App', [  
        'ng-ip-address',
        ... // other dependencies  
    ]);
```

```html
<input ng-ip-address />
```

[plnkr-url]: http://plnkr.co/edit/7n2muGs78kXqIx7MHB7E?p=preview
