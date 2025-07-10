# Calendar widget

## Overview

The Calendar Widget displays an interactive calendar of events for a specific venue (organization) or a specialized view for attractions. Users can select events, dates, and quantities, then proceed to checkout. It can be opened as a pop-up dialog or embedded directly into a page element.

**SDK Function Signature:**

```javascript
// For pop-up mode (Standard or Attraction)
showpass.tickets.calendarWidget(venueId, params);

// For embedded mode (Standard or Attraction)
showpass.tickets.calendarWidget(venueId, params, containerId);
```

## Prerequisites

Ensure the Showpass SDK is included on your page as described in the "SDK Getting Started" guide. You'll need to ensure the SDK is loaded before calling its functions.

## Finding the venue/organization ID

To find your `venueId` (Organization ID):

1.  Log in to your Showpass Dashboard.
2.  Navigate to your venue settings page (often found at a URL like `https://www.showpass.com/dashboard/venues/edit/`).
3.  The Organization ID is typically displayed in the top right corner of this page.
    For Attraction Calendars, you'll also need the event `slug` for the main attraction event, which is passed within the `params` object.

## Common parameters (applicable to Standard & Attraction Calendar within `params` object)

| Parameter Property        | Type   | Status   | Description                                                   |
| ------------------------- | ------ | -------- | ------------------------------------------------------------- |
| `params['theme-primary']` | String | Optional | Hex code value for the main widget color (e.g., `'#dd3333'`). |

## Standard calendar widget

This is for displaying a general calendar of events for a venue.

### Standard calendar specific parameters (within `params` object)

| Parameter Property | Type   | Status   | Description                                                                                                   |
| ------------------ | ------ | -------- | ------------------------------------------------------------------------------------------------------------- |
| `params['tags']`   | String | Optional | Comma-separated string of tags to filter events (e.g., `'featured,comedy'`). Applicable to standard calendar. |

### Basic usage examples (standard calendar)

These examples show the simplest way to call the functions, assuming the Showpass SDK (`showpass.tickets`) is already loaded and available. For reliable execution, especially on initial page load, see the "Robust Implementation Examples" below.

#### Pop-up mode (basic)

```javascript
const myVenueId = 123;
let params = {
  "theme-primary": "#FF7F00",
  tags: "workshops",
};
showpass.tickets.calendarWidget(myVenueId, params);
```

#### Embedded mode (basic)

```html
<div id="showpass-embedded-calendar-container"></div>
<script
  type="text/javascript"
  src="https://showpass.com/static/dist/sdk.js"
></script>
<script>
  window.showpass.tickets.calendarWidget(
    123,
    { "theme-primary": "#416b24" },
    "showpass-embedded-calendar-container"
  );
</script>
```

**Important:** The basic examples above assume `showpass.tickets` is ready. For production code, see the "Robust Implementation Examples" below to handle SDK loading.

### Robust implementation examples (standard calendar)

To ensure your code works reliably even if the Showpass SDK is still loading, you need to check for its availability before making calls.

#### Pop-up mode (robust)

This example attaches an event listener to all buttons with the class `showpass-calendar-button`.

**HTML:**

```html
<button class="showpass-calendar-button" data-venue-id="123">
  View Standard Event Calendar
</button>
<button
  class="showpass-calendar-button"
  data-venue-id="456"
  data-tags="concerts,live-music"
>
  View Concert Calendar
</button>
```

**JavaScript:**

```html
<script>
  function handleShowpassCalendarClick(event) {
    const venueIdString = this.getAttribute("data-venue-id");
    if (!venueIdString) {
      console.error("Button is missing data-venue-id attribute.");
      return;
    }
    const venueId = parseInt(venueIdString, 10);
    const tags = this.getAttribute("data-tags"); // Optional tags

    const widgetParams = {
      "theme-primary": "#28a745",
    };
    if (tags) {
      widgetParams.tags = tags;
    }

    // Check if SDK is loaded before calling
    if (window.showpass && window.showpass.tickets) {
      window.showpass.tickets.calendarWidget(venueId, widgetParams);
      console.log(
        `Showpass SDK called for calendar pop-up (Venue ID: ${venueId}).`
      );
    } else {
      console.error("Showpass SDK not yet loaded");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const calendarButtons = document.querySelectorAll(
      ".showpass-calendar-button"
    );
    calendarButtons.forEach(function (button) {
      button.addEventListener("click", handleShowpassCalendarClick);
    });
  });
</script>
```

#### Embedded mode (robust)

**HTML:**

```html
<div id="embedded-standard-calendar-container"></div>
```

**JavaScript:**

```html
<script>
  function initializeEmbeddedStandardCalendar() {
    const venueIdToEmbed = 789;
    const embedContainerId = "embedded-standard-calendar-container";
    const widgetEmbedParams = {
      "theme-primary": "#dc3545",
      tags: "family,all-ages",
    };

    // Check if the container element exists
    if (!document.getElementById(embedContainerId)) {
      console.error(
        "Target container for embedded Showpass standard calendar not found:",
        embedContainerId
      );
      return;
    }

    // Check if SDK is loaded and call the function
    if (window.showpass && window.showpass.tickets) {
      window.showpass.tickets.calendarWidget(
        venueIdToEmbed,
        widgetEmbedParams,
        embedContainerId
      );
      console.log(
        `Showpass SDK called for embedded standard calendar (Venue ID: ${venueIdToEmbed}).`
      );
    } else {
      // SDK not ready yet - wait and try again
      setTimeout(initializeEmbeddedStandardCalendar, 100);
    }
  }

  document.addEventListener(
    "DOMContentLoaded",
    initializeEmbeddedStandardCalendar
  );
</script>
```

---

## Attraction calendar widget

This specialized version of the calendar widget is designed for attractions (e.g., timed entry, tours) and requires specific parameters within the `params` object. The `venueId` (Organization ID) is **still required** as the first argument to the `calendarWidget` function.

### Attraction calendar specific parameters (within the `params` object)

| Parameter Property                         | Type    | Status   | Description                                                                                                                                |
| ------------------------------------------ | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `params['is_attraction']`                  | Boolean | Required | Must be set to `true` to enable attraction mode.                                                                                           |
| `params['event_id']`                       | String  | Required | The **slug** of the main attraction event on Showpass.                                                                                     |
| `params['ticket-type-selection-required']` | Boolean | Optional | If `true`, forces ticket type selection _before_ proceeding to the calendar view. Default might be `false`.                                |
| `params['prompt-for-quantity']`            | Boolean | Optional | If `true`, forces quantity selector _before_ proceeding to calendar view. (Note: Verify current implementation status for this parameter). |

### Example: Attraction calendar (pop-up, robust)

This example demonstrates calling the Attraction Calendar as a pop-up, triggered by buttons with a specific class.

**HTML:**

```html
<button
  class="showpass-attraction-calendar-button"
  data-venue-id="YOUR_VENUE_ID_1"
  data-event-slug="your-attraction-slug-1"
>
  Book Attraction 1 Tickets
</button>
<button
  class="showpass-attraction-calendar-button"
  data-venue-id="YOUR_VENUE_ID_2"
  data-event-slug="your-attraction-slug-2"
>
  Book Attraction 2 Tickets
</button>
```

_Replace placeholders with actual values._

**JavaScript:**

```html
<script>
  function handleAttractionCalendarClick(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const venueIdString = button.getAttribute("data-venue-id");
    const eventSlug = button.getAttribute("data-event-slug");

    if (!eventSlug || !venueIdString) {
      console.error(
        "Button is missing data-event-slug or data-venue-id attribute."
      );
      return;
    }
    const venueId = parseInt(venueIdString, 10);

    const attractionParams = {
      is_attraction: true,
      event_id: eventSlug,
      "ticket-type-selection-required": true, // Example: force ticket type selection first
      "theme-primary": "#00AEEF",
    };

    // Check if SDK is loaded before calling
    if (window.showpass && window.showpass.tickets) {
      window.showpass.tickets.calendarWidget(venueId, attractionParams);
      console.log(
        `Showpass SDK called for attraction calendar pop-up (Venue: ${venueId}, Event: ${eventSlug}).`
      );
    } else {
      console.error("Showpass SDK not yet loaded");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const attractionButtons = document.querySelectorAll(
      ".showpass-attraction-calendar-button"
    );
    attractionButtons.forEach(function (button) {
      button.addEventListener("click", handleAttractionCalendarClick);
    });
  });
</script>
```

### Example: Attraction calendar (embedded, robust)

**HTML:**

```html
<div id="embedded-attraction-calendar-container"></div>
```

**JavaScript:**

```html
<script>
  function initializeEmbeddedAttractionCalendar() {
    const venueIdToEmbed = 555; // <<< REPLACE with your Venue/Organization ID
    const attractionEventSlug = "my-attraction-event-slug"; // <<< REPLACE with your attraction's slug
    const embedContainerId = "embedded-attraction-calendar-container";

    const attractionEmbedParams = {
      is_attraction: true,
      event_id: attractionEventSlug,
      "prompt-for-quantity": false,
      "theme-primary": "#9b59b6", // Example purple
    };

    // Check if the container element exists
    if (!document.getElementById(embedContainerId)) {
      console.error(
        "Target container for embedded Showpass attraction calendar not found:",
        embedContainerId
      );
      return;
    }

    // Check if SDK is loaded and call the function
    if (window.showpass && window.showpass.tickets) {
      window.showpass.tickets.calendarWidget(
        venueIdToEmbed,
        attractionEmbedParams,
        embedContainerId
      );
      console.log(
        `Showpass SDK called for embedded attraction calendar (Venue: ${venueIdToEmbed}, Event: ${attractionEventSlug}).`
      );
    } else {
      // SDK not ready yet - wait and try again
      setTimeout(initializeEmbeddedAttractionCalendar, 100);
    }
  }

  document.addEventListener(
    "DOMContentLoaded",
    initializeEmbeddedAttractionCalendar
  );
</script>
```

**Key for embedded widgets:**

- The HTML `div` element must exist on the page when the Showpass SDK attempts to mount the widget.
- Ensure your script runs after the target HTML div is available in the DOM.

**Alternative: Using script onload callback**
If you're dynamically loading the SDK, you can use the onload callback approach:

```javascript
let script = document.createElement("script");
script.onload = function () {
  // SDK is now loaded - safe to call functions
  window.showpass.tickets.calendarWidget(venueId, params, containerId);
};
script.src = "https://showpass.com/static/dist/sdk.js";
document.head.appendChild(script);
```
