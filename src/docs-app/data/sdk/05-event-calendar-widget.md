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

Ensure the Showpass SDK is included on your page and has fully loaded before these functions are called. See the "SDK Getting Started" guide. The SDK loads asynchronously.

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

To ensure your code works reliably, especially handling the asynchronous loading of the SDK.

#### Pop-up mode (robust)

```html
<button id="openCalendarBtn" data-venue-id="123">
  View Standard Event Calendar
</button>
<script>
  document
    .getElementById("openCalendarBtn")
    .addEventListener("click", function () {
      const venueIdString = this.getAttribute("data-venue-id");
      if (!venueIdString) {
        console.error("Button is missing data-venue-id attribute.");
        return;
      }
      const venueId = parseInt(venueIdString, 10);
      const widgetParams = {
        "theme-primary": "#28a745",
        tags: "concerts,live-music",
      };

      if (
        typeof showpass !== "undefined" &&
        typeof showpass.tickets !== "undefined"
      ) {
        showpass.tickets.calendarWidget(venueId, widgetParams);
      } else if (typeof window.__shwps !== "undefined") {
        window.__shwps("tickets.calendarWidget", venueId, widgetParams);
      } else {
        console.error("Showpass SDK is not available.");
      }
    });
</script>
```

#### Embedded mode (robust)

```html
<div id="embedded-standard-calendar-container"></div>
<script>
  function initializeEmbeddedStandardCalendar() {
    const venueIdToEmbed = 789;
    const containerId = "embedded-standard-calendar-container";
    const widgetParams = {
      "theme-primary": "#dc3545",
      tags: "family,all-ages",
    };

    if (document.getElementById(containerId)) {
      if (
        typeof showpass !== "undefined" &&
        typeof showpass.tickets !== "undefined"
      ) {
        showpass.tickets.calendarWidget(
          venueIdToEmbed,
          widgetParams,
          containerId
        );
      } else if (typeof window.__shwps !== "undefined") {
        window.__shwps(
          "tickets.calendarWidget",
          venueIdToEmbed,
          widgetParams,
          containerId
        );
      } else {
        setTimeout(initializeEmbeddedStandardCalendar, 500);
      }
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeEmbeddedStandardCalendar
    );
  } else {
    initializeEmbeddedStandardCalendar();
  }
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

This example demonstrates calling the Attraction Calendar as a pop-up, triggered by a button click.

**HTML:**

```html
<button
  class="showpass-attraction-calendar-button"
  data-venue-id="YOUR_VENUE_ID"
  data-event-slug="your-attraction-event-slug"
>
  Book Attraction Tickets
</button>
```

_Replace `YOUR_VENUE_ID` and `your-attraction-event-slug` with actual values._

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
      alert("Could not determine the attraction or venue. Please try again.");
      return;
    }

    const venueId = parseInt(venueIdString, 10);

    const attractionParams = {
      is_attraction: true,
      event_id: eventSlug, // The slug for the attraction event
      "ticket-type-selection-required": true,
      "theme-primary": "#00AEEF",
      // 'prompt-for-quantity': false, // Include if/when implemented
    };

    if (
      typeof showpass !== "undefined" &&
      typeof showpass.tickets !== "undefined"
    ) {
      showpass.tickets.calendarWidget(venueId, attractionParams);
    } else if (typeof window.__shwps !== "undefined") {
      window.__shwps("tickets.calendarWidget", venueId, attractionParams);
      console.log(
        `Showpass SDK call queued via __shwps for attraction calendar (Venue ID: ${venueId}, Event Slug: ${eventSlug}).`
      );
    } else {
      console.error("Showpass SDK is not available.");
      alert(
        "Calendar system is currently unavailable. Please try again shortly."
      );
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const attractionButtons = document.querySelectorAll(
      ".showpass-attraction-calendar-button"
    );
    attractionButtons.forEach((button) => {
      button.addEventListener("click", handleAttractionCalendarClick);
    });
  });
</script>
```

### Example: Attraction calendar (embedded, robust)

To embed the attraction calendar:

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
    const containerId = "embedded-attraction-calendar"; // <<< Must match your div ID

    const attractionEmbedParams = {
      is_attraction: true,
      event_id: attractionEventSlug,
      "ticket-type-selection-required": true,
      "theme-primary": "#333333",
    };

    if (document.getElementById(containerId)) {
      if (
        typeof showpass !== "undefined" &&
        typeof showpass.tickets !== "undefined"
      ) {
        showpass.tickets.calendarWidget(
          venueIdForAttraction,
          attractionEmbedParams,
          containerId
        );
      } else if (typeof window.__shwps !== "undefined") {
        window.__shwps(
          "tickets.calendarWidget",
          venueIdForAttraction,
          attractionEmbedParams,
          containerId
        );
        console.log(
          `Showpass SDK call queued via __shwps for embedded attraction calendar (Venue ID: ${venueIdForAttraction}, Event Slug: ${attractionEventSlug}).`
        );
      } else {
        console.warn(
          "Showpass SDK not ready for embedded attraction calendar, will retry..."
        );
        setTimeout(initializeEmbeddedAttractionCalendar, 500);
      }
    } else {
      console.error(
        "Target container for embedded Showpass attraction calendar not found:",
        containerId
      );
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeEmbeddedAttractionCalendar
    );
  } else {
    initializeEmbeddedAttractionCalendar();
  }
</script>
```

**Key Notes for Attraction Calendar:**

- The `venueId` is always the first argument to `showpass.tickets.calendarWidget`.
- The `params` object must contain `is_attraction: true` and the attraction's `event_id` (which is the event slug).
- The behavior of `ticket-type-selection-required` and `prompt-for-quantity` will determine the initial steps the user sees.

**Choosing an Implementation:**

- Use the **Basic Usage Examples** for a quick understanding or if your script execution is guaranteed to be after the SDK loads.
- Use the **Robust Implementation Examples** for production websites to ensure reliability and handle the asynchronous loading of the SDK, including the `window.__shwps` command queue fallback.
