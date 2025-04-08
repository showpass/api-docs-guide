
# Calendar Widget

## Overview
Opens the widget for a specific venue (id) that allows the user to select ticket quantities for multiple events on different days and proceed to checkout.

```javascript
showpass.tickets.calendarWidget(venue_id, params);
```

## Parameters

<!-- PARAMETER_TABLE_START -->
| Parameter | Type | Status | Description |
|-----------|------|--------|-------------|
| params.theme-primary | String | Optional | Hex code value for main widget color |
| params.tags | String | Optional | Comma separated string which will tell calendar to only display events with these tags |
<!-- PARAMETER_TABLE_END -->

## Example

```javascript
let params = {
   'theme-primary': '#dd3333',
   'tags': 'festivals,community',
};

showpass.tickets.calendarWidget(ORG_ID, params);
```
