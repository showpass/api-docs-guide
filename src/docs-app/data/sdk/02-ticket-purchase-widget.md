# Ticket Purchase Widget

## Overview

The Ticket Purchase Widget allows users to select ticket quantities for a specific event and proceed to checkout. It provides a seamless ticket selection experience and can be displayed as a pop-up dialog or embedded directly into your webpage.

---

## SDK Function Signature

```javascript
// Pop-up mode - displays as a modal dialog
showpass.tickets.eventPurchaseWidget(slug, params);

// Embedded mode - mounts into a container element
showpass.tickets.eventPurchaseWidget(slug, params, containerId);
```

---

## Prerequisites

- The Showpass SDK must be included on your page (see "SDK Getting Started" guide)
- Ensure the SDK is loaded before calling its functions
- You need the event's unique **slug** identifier

---

## Parameters

| Parameter | Type | Status | Description |
| --- | --- | --- | --- |
| **slug** | String | Required | The unique slug of the event (e.g., `my-event-slug` from `showpass.com/my-event-slug/`) |
| **params** | Object | Optional | Configuration object containing widget customization options |
| **params['theme-primary']** | String | Optional | Hex code for the main widget color (e.g., `'#dd3333'`) |
| **params['show-specific-tickets']** | String | Optional | Comma-separated list of ticket type IDs to display (e.g., `'1234,5678'`) |
| **params['keep-shopping']** | Boolean | Optional | If `true`, displays "Keep Shopping" instead of "Close" button |
| **params['tracking-id']** | String | Optional | Tracking link ID for affiliate tracking, password bypass, or hidden ticket access |
| **params['show-description']** | Boolean | Optional | Control event description visibility. Default: `true` |
| **params['lang']** | String | Optional | Language code for widget interface. Use `'fr'` for French (defaults to English) |
| **containerId** | String | Optional | **For Embedded Mode:** The ID of the HTML `<div>` element where the widget will mount |

---

## Basic Usage Examples

These examples assume the Showpass SDK is already loaded. For production-ready code that handles SDK loading, see "Robust Implementation Examples" below.

### Pop-up Mode (Basic)

```javascript
// Define widget configuration
let params = {
  "theme-primary": "#FF7F00",
  "keep-shopping": true,
};

// Open the ticket widget as a pop-up
showpass.tickets.eventPurchaseWidget("my-event-slug", params);
```

---

### Embedded Mode (Basic)

```html
<!-- Container element for the widget -->
<div id="event-widget-here"></div>

<script>
  // Configure and embed the widget
  let embedParams = { "theme-primary": "#337ab7" };
  showpass.tickets.eventPurchaseWidget(
    "another-event-slug",
    embedParams,
    "event-widget-here"
  );
</script>
```

> **Note:** These basic examples assume `showpass.tickets` is ready. For production environments, always use the robust implementation patterns below.

---

## Robust Implementation Examples

These examples include proper SDK availability checks to ensure reliable execution.

### Pop-up Mode (Robust)

This implementation attaches event listeners to buttons with the class `showpass-popup-button` and reads the event slug from a `data-event-slug` attribute.

**HTML:**

```html
<button class="showpass-popup-button" data-event-slug="my-first-event">
  Buy Tickets for Event 1
</button>
<button class="showpass-popup-button" data-event-slug="another-event">
  Buy Tickets for Event 2
</button>
```

**JavaScript:**

```javascript
function initializeEventWidgets() {
  const buttons = document.querySelectorAll(".showpass-popup-button");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const slug = button.getAttribute("data-event-slug");
      
      if (slug && window.showpass && window.showpass.tickets) {
        const params = {
          "theme-primary": "#007bff",
          "keep-shopping": true,
        };
        window.showpass.tickets.eventPurchaseWidget(slug, params);
      } else {
        console.error("Showpass SDK not available or slug is missing.");
      }
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeEventWidgets);
} else {
  initializeEventWidgets();
}
```

---

### Embedded Mode (Robust)

This implementation ensures the SDK is loaded before embedding the widget.

**HTML:**

```html
<div id="embedded-event-widget-container"></div>
```

**JavaScript:**

```javascript
function embedEventWidget() {
  const containerId = "embedded-event-widget-container";
  const eventSlug = "my-event-slug";

  if (window.showpass && window.showpass.tickets) {
    const params = {
      "theme-primary": "#28a745",
      "show-description": true,
    };
    window.showpass.tickets.eventPurchaseWidget(
      eventSlug,
      params,
      containerId
    );
  } else {
    console.error("Showpass SDK not available.");
    // Optionally, retry after a delay
    setTimeout(embedEventWidget, 500);
  }
}

// Execute when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", embedEventWidget);
} else {
  embedEventWidget();
}
```

---

### Alternative: Using Script Onload Callback

If you're dynamically loading the SDK, you can use the `onload` callback:

```javascript
let script = document.createElement("script");
script.onload = function () {
  // SDK is now loaded - safe to call widget functions
  const params = { "theme-primary": "#6c757d" };
  window.showpass.tickets.eventPurchaseWidget(
    "my-event-slug",
    params
  );
};
script.src = "https://showpass.com/static/dist/sdk.js";
document.head.appendChild(script);
```

---

## Key Takeaways

- **Slug is required:** Always obtain the correct event slug from the Showpass event URL
- **Check SDK availability:** Production code should always verify `window.showpass.tickets` exists before calling functions
- **Pop-up vs Embedded:** Use pop-up mode for quick interactions; use embedded mode for seamless page integration
- **Customize appearance:** Use `theme-primary` to match your brand colors
- **Handle loading:** Implement retry logic or use `DOMContentLoaded` to ensure SDK readiness
