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

Ensure the Showpass SDK is included on your page, preferably using the Asynchronous Loader (Option 1) described in the "SDK Getting Started" guide. This loader creates the `window.__shwps` command queue, which is the recommended way to call SDK functions.

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

| Parameter Property | Type   | Status   | Description                                                                                                       |
| ------------------ | ------ | -------- | ----------------------------------------------------------------------------------------------------------------- |
| `params['tags']`   | String | Optional | Comma-separated string of tags to filter events (e.g., `'festivals,community'`). Applicable to standard calendar. |

### Basic usage examples (standard calendar)

These examples show the simplest way to call the functions, assuming the Showpass SDK (`showpass.tickets`) is already loaded and available. For reliable execution, especially on initial page load, use the `window.__shwps` method shown in the "Robust Implementation Examples."

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
<div id="calendar-widget-here"></div>
<script>
  const venueIdForEmbed = 456;
  let embedParams = {
    "theme-primary": "#337ab7",
    tags: "featured,specialevent",
  };
  showpass.tickets.calendarWidget(
    venueIdForEmbed,
    embedParams,
    "calendar-widget-here"
  );
</script>
```

**Important:** The basic examples above assume `showpass.tickets` is ready. For production code, see the "Robust Implementation Examples" below to handle SDK loading.

### Robust implementation examples (standard calendar)

To ensure your code works reliably, it's best to use the `window.__shwps` command queue if you followed "Option 1" for SDK inclusion from the "Getting Started" guide.

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

    window.__shwps("tickets.calendarWidget", venueId, widgetParams);
    console.log(
      `Showpass SDK call queued for calendar pop-up (Venue ID: ${venueId}).`
    );
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

    if (document.getElementById(embedContainerId)) {
      window.__shwps(
        "tickets.calendarWidget",
        venueIdToEmbed,
        widgetEmbedParams,
        embedContainerId
      );
      console.log(
        `Showpass SDK call queued for embedded standard calendar (Venue ID: ${venueIdToEmbed}).`
      );
    } else {
      console.error(
        "Target container for embedded Showpass standard calendar not found:",
        embedContainerId
      );
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

    window.__shwps("tickets.calendarWidget", venueId, attractionParams);
    console.log(
      `Showpass SDK call queued for attraction calendar (Venue ID: ${venueId}, Event Slug: ${eventSlug}).`
    );
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
<div id="embedded-attraction-calendar"></div>
```

**JavaScript:**

```html
<script>
  function initializeEmbeddedAttractionCalendar() {
    const venueIdForAttraction = 123; // <<< REPLACE with your actual Venue ID
    const attractionEventSlug = "your-main-attraction-slug"; // <<< REPLACE THIS
    const embedContainerId = "embedded-attraction-calendar"; // <<< Must match your div ID

    const attractionEmbedParams = {
      is_attraction: true,
      event_id: attractionEventSlug,
      "ticket-type-selection-required": true,
      "theme-primary": "#333333",
    };

    if (document.getElementById(embedContainerId)) {
      window.__shwps(
        "tickets.calendarWidget",
        venueIdForAttraction,
        attractionEmbedParams,
        embedContainerId
      );
      console.log(
        `Showpass SDK call queued for embedded attraction calendar (Venue ID: ${venueIdForAttraction}, Event Slug: ${attractionEventSlug}).`
      );
    } else {
      console.error(
        "Target container for embedded Showpass attraction calendar not found:",
        embedContainerId
      );
    }
  }

  document.addEventListener(
    "DOMContentLoaded",
    initializeEmbeddedAttractionCalendar
  );
</script>
```

**Key notes for attraction calendar:**

- The `venueId` is always the first argument to `showpass.tickets.calendarWidget`.
- The `params` object must contain `is_attraction: true` and the attraction's `event_id` (which is the event slug).
- The behavior of `ticket-type-selection-required` and `prompt-for-quantity` will determine the initial steps the user sees.

**Choosing an implementation:**

- Use the **Basic Usage Examples** for a quick understanding or if your script execution is guaranteed to be after the SDK loads.
- Use the **Robust Implementation Examples** for production websites to ensure reliability and handle the asynchronous loading of the SDK, including the `window.__shwps` command queue fallback.
