
# Login Widget

## Overview
Opens the Showpass widget and asks the user to log in, if not already.

Used for ensuring a user is already logged in when adding tickets to their basket for features like auto ticket credit applications etc.

```javascript
showpass.tickets.loginWidget(params);
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

showpass.tickets.loginWidget(params);
```
