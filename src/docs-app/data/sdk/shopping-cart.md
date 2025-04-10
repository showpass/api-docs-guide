
# Shopping Cart Widget

## Overview
Opens a widget to display shopping cart contents.

```javascript
showpass.tickets.shoppingCartWidget(params);
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

showpass.tickets.shoppingCartWidget(params);
```
