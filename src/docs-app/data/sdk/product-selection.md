
# Product Selection Widget

## Overview
Opens the product selection widget for specified product (id).

```javascript
showpass.tickets.productPurchaseWidget(id, params);
```

## Parameters


| Parameter | Type | Status | Description                                                                                                                                                      |
|-----------|------|--------|------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id | Integer | Required | The unique id of the product on Showpass. To find, go to Dashboard > Marketplace > Edit Product https://www.showpass.com/dashboard/inventory/products/<ID>/edit/ |
| params.theme-primary | String | Optional | Hex code value for main widget color                                                                                                                             |
| params.theme-secondary | String | Optional | Hex code value for accent widget color                                                                                                                           |
| params.theme-dark | Boolean | Optional | Displays the widget in a dark theme                                                                                                                              |
| params.keep-shopping | Boolean | Optional | Displays "Keep Shopping" instead of "Close" on button verbiage                                                                                                   |
| params.tracking-id | - | - | Not supported                                                                                                                                                    |
| params.show-description | Boolean | Optional | Displays or hides event description default: true (deploy date: October 15th 2019)                                                                               |


## Example

```javascript
let params = {
   'theme-primary': '#dd3333',
   'keep-shopping': false,
};

showpass.tickets.productPurchaseWidget(1234, params);
```
