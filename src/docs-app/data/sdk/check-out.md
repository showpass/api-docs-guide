
# Check Out Widget

## Overview
Opens the checkout widget, depending on settings will prompt for login if not already logged in.

```javascript
showpass.tickets.checkoutWidget(params);
```

## Parameters


| Parameter | Type | Status | Description |
|-----------|------|--------|-------------|
| params | Object | Optional | Configuration object for the widget |
| params.theme-primary | String | Optional | Hex code value for main widget color |
| params.keep-shopping | Boolean | Optional | Displays "Keep Shopping" instead of "Close" on button verbiage |
| params.tracking-id | - | - | Not supported |


## Example

```javascript
let params = {
   'theme-primary': '#dd3333',
   'keep-shopping': false,
};

showpass.tickets.checkoutWidget(params);
```
