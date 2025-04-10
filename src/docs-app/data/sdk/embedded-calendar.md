
# Embedded Calendar Widget

## Overview
Attaches the calendar widget for a specific venue (id) to a `<div>` tag with the id `showpass-calendar-widget` that allows the user to select ticket quantities for multiple events on different days and proceed to checkout.

```javascript
showpass.tickets.mountCalendarWidget(ORG_ID, params);
```

## Parameters


| Parameter | Type | Status | Description |
|-----------|------|--------|-------------|
| params.theme-primary | String | Optional | Hex code value for main widget color |
| params.tags | String | Optional | Comma separated string which will tell calendar to only display events with these tags |
| params.tracking-id | String | Optional | Tracking link tracking-id, for tracking, bypassing passwords, displaying hidden ticket types etc. |


## Example

```html
<div id="showpass-calendar-widget"></div>
<script type="text/javascript">
let params = {
   'theme-primary': '#000000',
};

showpass.tickets.mountCalendarWidget(ORG_ID, params);
</script>
```
