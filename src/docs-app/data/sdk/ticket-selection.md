
# Ticket Selection Widget

## Overview
Opens the widget for a specific event (slug) that allows the user to select ticket quantities and proceed to checkout.

```javascript
showpass.tickets.eventPurchaseWidget(slug, params);
```

## Parameters


| Parameter | Type | Status | Description |
|-----------|------|--------|-------------|
| slug | String | Required | The unique slug of the event on Showpass<br>showpass.com/this-is-the-slug/ |
| params.theme-primary | String | Optional | Hex code value for main widget color |
| params.show-specific-tickets | String | Optional | Only show specific ticket types in the widget. Accepts a comma separated list of ticket type ids in a string format |
| params.keep-shopping | Boolean | Optional | Displays "Keep Shopping" instead of "Close" on button verbiage |
| params.tracking-id | String | Optional | Tracking link tracking-id, for affiliate tracking, bypassing passwords, displaying hidden ticket types etc. |
| params.show-description | Boolean | Optional | Displays or hides event description<br>default: true<br>(deploy date: October 15th 2019) |


## Example

```javascript
let params = {
   'theme-primary': '#dd3333',
   'keep-shopping': false,
   'tracking-id': '123ABC34',
   'show-description': true,
   'show-specific-tickets': '1234,5678',
};

showpass.tickets.eventPurchaseWidget('this-is-the-slug', params);
```
