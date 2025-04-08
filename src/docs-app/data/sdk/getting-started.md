
# Showpass SDK

## Overview
Showpass has an SDK that makes it easy to embed and call the ticket selection and purchase widgets.

**Please note:** Your domain must have a valid SSL certificate installed in order to work properly.

## Including the Showpass SDK

### Option 1: Include in your JavaScript file
```javascript
(function(window, document, src) {
    let config = window.__shwps;
    if (typeof config === "undefined") {
        config = function() {
            config.c(arguments)
        };
        config.q = [];
        config.c = function(args) {
            config.q.push(args)
        };
        window.__shwps = config;

        let s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = src;
        let x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
    }
})(window, document, 'https://www.showpass.com/static/dist/sdk.js');
```

### Option 2: Include in your HTML header
```html
<script type="text/javascript" src="https://showpass.com/static/dist/sdk.js"></script>
```

## Using the SDK
You can call `showpass.tickets` using an `onclick=""` function within the HTML template, or from the JavaScript file.

### Available Functions
Showpass has 6 functions that can be called using the SDK:

1. [Ticket Selection Widget](/sdk/ticket-selection)
2. [Product Selection Widget](/sdk/product-selection)
3. [Shopping Cart Widget](/sdk/shopping-cart)
4. [Check Out Widget](/sdk/check-out)
5. [Login Widget](/sdk/login)
6. [Cart Quantity Counter](/sdk/cart-counter)
7. [Calendar Widget](/sdk/calendar)
8. [Embedded Calendar Widget](/sdk/embedded-calendar)
