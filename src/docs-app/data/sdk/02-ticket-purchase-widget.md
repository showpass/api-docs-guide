# Ticket purchase widget

## Overview

The Ticket Selection Widget allows users to select ticket quantities for a specific event and proceed to checkout. It can be opened as a pop-up dialog or embedded directly into a designated area on your webpage.

**SDK Function Signature:**

```javascript
// For pop-up mode
showpass.tickets.eventPurchaseWidget(slug, params);

// For embedded mode
showpass.tickets.eventPurchaseWidget(slug, params, containerId);
```

## Prerequisites

Ensure the Showpass SDK is included on your page, preferably using the Asynchronous Loader (Option 1) described in the "SDK Getting Started" guide. This loader creates the window.\_\_shwps command queue, which is the recommended way to call SDK functions.

## Parameters

| Parameter                         | Type    | Status   | Description                                                                                                                                              |
| --------------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `slug`                            | String  | Required | The unique slug of the event on Showpass (e.g., `this-is-the-slug` from `showpass.com/this-is-the-slug/`).                                               |
| `params`                          | Object  | Optional | An object containing additional configuration parameters for the widget.                                                                                 |
| `params['theme-primary']`         | String  | Optional | Hex code value for the main widget color (e.g., `'#dd3333'`).                                                                                            |
| `params['show-specific-tickets']` | String  | Optional | Only show specific ticket types in the widget. Accepts a comma-separated list of ticket type IDs (e.g., `'1234,5678'`).                                  |
| `params['keep-shopping']`         | Boolean | Optional | Displays "Keep Shopping" instead of "Close" on button verbiage (e.g., `false`).                                                                          |
| `params['tracking-id']`           | String  | Optional | Tracking link `tracking-id`, for affiliate tracking, bypassing passwords, displaying hidden ticket types, etc.                                           |
| `params['show-description']`      | Boolean | Optional | Displays or hides event description.<br>Default: `true`.<br>(Original deploy date: October 15th 2019)                                                    |
| `containerId`                     | String  | Optional | **For Embedded Mode Only.** The ID of the HTML `<div>` element where the widget should be mounted. If provided, the widget embeds instead of popping up. |

## Basic usage examples

These examples show the simplest way to call the functions, assuming the Showpass SDK (`showpass.tickets`) is already loaded and available. For reliable execution, especially on initial page load, use the `window.__shwps` method shown in the "Robust Implementation Examples."

### Pop-up mode (basic)

```javascript
let params = {
  "theme-primary": "#FF7F00",
  "keep-shopping": true,
};

showpass.tickets.eventPurchaseWidget("my-event-slug", params);
```

### Embedded mode (basic)

```html
<div id="event-widget-here"></div>
<script>
  let embedParams = { "theme-primary": "#337ab7" };
  showpass.tickets.eventPurchaseWidget(
    "another-event-slug",
    embedParams,
    "event-widget-here"
  );
</script>
```

**Important:** The basic examples above assume `showpass.tickets` is ready. For production code, see the "Robust Implementation Examples" below to handle SDK loading.

## Robust implementation examples

To ensure your code works reliably even if the Showpass SDK is still loading, it's best to check for its availability or use the `window.__shwps` command queue if you followed "Option 1" for SDK inclusion from the "Getting Started" guide.

### Pop-up mode (robust)

This example attaches an event listener to all buttons with the class `showpass-popup-button` and reads the event slug from a `data-event-slug` attribute.

**HTML:**

```html
<button class="showpass-popup-button" data-event-slug="your-event-slug-1">
  Buy Tickets for Event 1
</button>
<button class="showpass-popup-button" data-event-slug="your-event-slug-2">
  Buy Tickets for Event 2
</button>
```

**JavaScript:**

```html
<script>
  function handleShowpassPopupButtonClick(event) {
    const eventSlug = this.getAttribute("data-event-slug");
    if (!eventSlug) {
      console.error("Button is missing data-event-slug attribute.");
      return;
    }

    const widgetParams = {
      "theme-primary": "#28a745", // Example green
      "keep-shopping": false,
      "show-description": true,
    };

    // Use window.__shwps to queue the command
    window.__shwps("tickets.eventPurchaseWidget", eventSlug, widgetParams);
    console.log(`Showpass SDK call queued for pop-up (slug: ${eventSlug}).`);
  }

  // Wait for the DOM to be ready before attaching event listeners
  document.addEventListener("DOMContentLoaded", function () {
    const popupButtons = document.querySelectorAll(".showpass-popup-button");
    popupButtons.forEach(function (button) {
      button.addEventListener("click", handleShowpassPopupButtonClick);
    });
  });
</script>
```

### Embedded mode (robust)

This example attempts to embed the widget once the DOM is ready and includes a simple retry mechanism if the SDK isn't immediately available.

**HTML:**

```html
<!-- This div must exist in the DOM before the script below runs -->
<div id="embedded-event-widget-container">
  <!-- Optional: You can put a loading message here -->
</div>
```

**JavaScript:**

```html
<script>
  // Function to initialize the embedded widget
  function initializeEmbeddedEventWidget() {
    const eventSlugToEmbed = "your-other-event-slug"; // <<< REPLACE THIS
    const embedContainerId = "embedded-event-widget-container"; // <<< Must match your div ID
    const widgetEmbedParams = {
      "theme-primary": "#dc3545", // Example red
      "show-specific-tickets": "TICKET_TYPE_ID_1", // <<< REPLACE TICKET ID if used
    };

    // Check if the container element exists before queuing the command
    if (document.getElementById(embedContainerId)) {
      // Use window.__shwps to queue the command
      window.__shwps(
        "tickets.eventPurchaseWidget",
        eventSlugToEmbed,
        widgetEmbedParams,
        embedContainerId
      );
      console.log(
        `Showpass SDK call queued for embedding (slug: ${eventSlugToEmbed}).`
      );
    } else {
      console.error(
        "Target container for embedded Showpass widget not found:",
        embedContainerId
      );
    }
  }

  // Wait for the DOM to be fully loaded before trying to embed
  document.addEventListener("DOMContentLoaded", initializeEmbeddedEventWidget);
</script>
```

**Key for embedded widgets:**

- The HTML `div` element (e.g., `<div id="embedded-event-widget-container"></div>`) **must exist on the page** when the Showpass SDK attempts to mount the widget into it.
- It's best practice to ensure your script that calls `window.__shwps(...)` for an embedded widget runs _after_ its target HTML div is available in the DOM, for instance, by using a `DOMContentLoaded` event listener.

**Note on direct SDK calls (without `window.__shwps`):**
If you choose not to use the "Option 1" async loader from the Getting Started guide and instead use a direct `<script async/defer src="...">` tag, you would call `showpass.tickets.eventPurchaseWidget(...)` directly. In that scenario, you _must_ ensure your call is made only after the SDK has fully loaded, for example by checking `if (typeof showpass !== 'undefined' && typeof showpass.tickets !== 'undefined') { ... }` or using a `DOMContentLoaded` listener if using `defer`. The `window.__shwps` method handles this timing automatically when the loader snippet is used.
