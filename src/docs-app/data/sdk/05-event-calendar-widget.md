# Calendar Widget

## Overview

The Calendar Widget displays an interactive calendar of events for a specific venue (organization) or provides a specialized view for attractions with recurring time slots. Users can browse events, select dates and quantities, then proceed to checkout. The widget can be displayed as a pop-up dialog or embedded directly into your page.

---

## SDK Function Signature

```javascript
// Pop-up mode - displays as a modal dialog (Standard or Attraction)
showpass.tickets.calendarWidget(venueId, params);

// Embedded mode - mounts into a container element (Standard or Attraction)
showpass.tickets.calendarWidget(venueId, params, containerId);
```

---

## Prerequisites

- The Showpass SDK must be included on your page (see "SDK Getting Started" guide)
- Ensure the SDK is loaded before calling its functions
- You need your **Organization ID** (venueId)
- For Attraction Calendars, you also need the event **slug**

---

## Finding the Organization ID

To locate your **venueId** (Organization ID):

1. Log in to your **Showpass Dashboard**
2. Navigate to your venue settings page (typically at `https://www.showpass.com/dashboard/venues/edit/`)
3. The Organization ID is displayed in the **top right corner** of this page

For **Attraction Calendars**, you'll also need the event **slug** for the main attraction event, which is passed in the **params** object.

---

## Common Parameters

These parameters apply to both Standard and Attraction Calendar modes:

| Parameter | Type | Status | Description |
| --- | --- | --- | --- |
| **venueId** | Integer | Required | Your organization/venue ID from the Showpass Dashboard |
| **params** | Object | Optional | Configuration object containing widget customization options |
| **params['theme-primary']** | String | Optional | Hex code for the main widget color (e.g., `'#dd3333'`) |
| **params['lang']** | String | Optional | Language code for widget interface. Use `'fr'` for French (defaults to English) |
| **containerId** | String | Optional | **For Embedded Mode:** The ID of the HTML `<div>` element where the widget will mount |

---

## Standard Calendar Widget

The Standard Calendar displays a general calendar of events for your venue, with optional filtering by tags.

### Standard Calendar Specific Parameters

| Parameter | Type | Status | Description |
| --- | --- | --- | --- |
| **params['tags']** | String | Optional | Comma-separated string of tags to filter events (e.g., `'featured,comedy'`) |

### Basic Usage Examples (Standard Calendar)

These examples assume the Showpass SDK is already loaded. For production-ready code, see "Robust Implementation Examples" below.

#### Pop-up Mode (Basic)

```javascript
const myVenueId = 123;
let params = {
  "theme-primary": "#FF7F00",
  tags: "workshops",
};

// Open calendar widget as a pop-up
showpass.tickets.calendarWidget(myVenueId, params);
```

---

#### Embedded Mode (Basic)

```html
<!-- Container element for the calendar widget -->
<div id="showpass-embedded-calendar-container"></div>

<script
  type="text/javascript"
  src="https://showpass.com/static/dist/sdk.js"
></script>
<script>
  // Embed the calendar widget
  window.showpass.tickets.calendarWidget(
    123,
    { "theme-primary": "#416b24" },
    "showpass-embedded-calendar-container"
  );
</script>
```

> **Note:** These basic examples assume `showpass.tickets` is ready. For production environments, always use the robust implementation patterns below.

---

### Robust Implementation Examples (Standard Calendar)

These examples include proper SDK availability checks to ensure reliable execution.

#### Pop-up Mode (Robust)

This implementation attaches event listeners to buttons with the class `showpass-calendar-button`.

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

```javascript
function initializeCalendarWidgets() {
  const buttons = document.querySelectorAll(".showpass-calendar-button");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const venueId = parseInt(button.getAttribute("data-venue-id"), 10);
      const tags = button.getAttribute("data-tags") || "";
      
      if (venueId && window.showpass && window.showpass.tickets) {
        const params = {
          "theme-primary": "#007bff",
        };
        if (tags) {
          params.tags = tags;
        }
        window.showpass.tickets.calendarWidget(venueId, params);
      } else {
        console.error("Showpass SDK not available or venue ID is missing.");
      }
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCalendarWidgets);
} else {
  initializeCalendarWidgets();
}
```

---

#### Embedded Mode (Robust)

**HTML:**

```html
<div id="embedded-calendar-container"></div>
```

**JavaScript:**

```javascript
function embedCalendarWidget() {
  const containerId = "embedded-calendar-container";
  const venueId = 123; // Your venue ID

  if (window.showpass && window.showpass.tickets) {
    const params = {
      "theme-primary": "#28a745",
      tags: "featured",
    };
    window.showpass.tickets.calendarWidget(
      venueId,
      params,
      containerId
    );
  } else {
    console.error("Showpass SDK not available.");
    // Optionally, retry after a delay
    setTimeout(embedCalendarWidget, 500);
  }
}

// Execute when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", embedCalendarWidget);
} else {
  embedCalendarWidget();
}
```

---

## Attraction Calendar Widget

The Attraction Calendar is a specialized widget for recurring attractions with time slots. It requires the `is_attraction` parameter and an event slug.

### Attraction Calendar Specific Parameters

| Parameter | Type | Status | Description |
| --- | --- | --- | --- |
| **params['is_attraction']** | Boolean | Required | Must be `true` to enable Attraction Calendar mode |
| **params['event_id']** | String | Required | The event slug of the main attraction event |
| **params['ticket-type-selection-required']** | Boolean | Optional | If `true`, users must select a ticket type before choosing a date |
| **params['prompt-for-quantity']** | Boolean | Optional | If `true`, prompts users to select quantity before adding to cart |

### Basic Usage Examples (Attraction Calendar)

#### Embedded Mode (Basic)

```html
<!-- Container element for the attraction calendar -->
<div id="attraction-calendar-container"></div>

<script>
  // Embed the attraction calendar widget
  window.showpass.tickets.calendarWidget(
    123, // Your venue ID
    {
      "theme-primary": "#dc3545",
      is_attraction: true,
      event_id: "my-attraction-slug",
      "ticket-type-selection-required": true,
    },
    "attraction-calendar-container"
  );
</script>
```

---

### Robust Implementation Examples (Attraction Calendar)

#### Embedded Mode (Robust)

**HTML:**

```html
<div id="embedded-attraction-calendar"></div>
```

**JavaScript:**

```javascript
function embedAttractionCalendar() {
  const containerId = "embedded-attraction-calendar";
  const venueId = 123; // Your venue ID
  const attractionSlug = "my-attraction-slug"; // Your attraction event slug

  if (window.showpass && window.showpass.tickets) {
    const params = {
      "theme-primary": "#6c757d",
      is_attraction: true,
      event_id: attractionSlug,
      "ticket-type-selection-required": true,
      "prompt-for-quantity": false,
    };
    window.showpass.tickets.calendarWidget(
      venueId,
      params,
      containerId
    );
  } else {
    console.error("Showpass SDK not available.");
    // Optionally, retry after a delay
    setTimeout(embedAttractionCalendar, 500);
  }
}

// Execute when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", embedAttractionCalendar);
} else {
  embedAttractionCalendar();
}
```

---

## Key Takeaways

- **Two calendar modes:** Standard Calendar for general events, Attraction Calendar for recurring time-slot attractions
- **Venue ID required:** Both modes require your organization/venue ID
- **Attraction requirements:** Attraction mode requires `is_attraction: true` and `event_id` (slug)
- **Tag filtering:** Standard Calendar supports event filtering by tags
- **Check SDK availability:** Production code should always verify `window.showpass.tickets` exists
- **Embedded recommended:** Calendar widgets work best in embedded mode for full calendar display
- **Handle loading:** Implement retry logic or use `DOMContentLoaded` to ensure SDK readiness
