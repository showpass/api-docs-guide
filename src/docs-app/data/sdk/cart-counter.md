
# Cart Quantity Counter

## Overview
Returns the number of items in the current shopping cart.

Can be used with js-cookie (https://github.com/js-cookie/js-cookie) and jQuery to display a dynamic cart count throughout the shopping experience and on page load.

```javascript
showpass.tickets.addCartCountListener(count);
```

## Example

```javascript
jQuery.noConflict();

(function($) {

    $(window).on('load', function() {
        // Initialize counter and update count and cookie value when changed
        showpass.tickets.addCartCountListener(function (count) {
            let html = '';
            if (count > 0) {
                html = 'Cart ('+count+')';
                Cookies.set('cart', html);
                $('.menu-item-449 a span').html(html);
            } else {
                html = 'Cart';
                Cookies.set('cart', html);
                $('.menu-item-449 a span').html(html);
            }
        });
    });

    $(document).on('ready', function() {
        // Display cart quantity on page load
        if (Cookies.get('cart')) {
            $('.menu-item-449 a span').html(Cookies.get('cart'));
        }
    });

})(jQuery);
```
