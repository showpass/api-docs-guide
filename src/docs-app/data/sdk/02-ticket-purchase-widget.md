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

Ensure the Showpass SDK is included on your page and has loaded before these functions are called. See the "SDK Getting Started" guide. The SDK loads asynchronously.

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

These examples show the simplest way to call the functions, assuming the Showpass SDK (`showpass.tickets`) is already loaded and available.

### Pop-up mode (basic)

```javascript
// Basic parameters
let params = {
  "theme-primary": "#FF7F00", // Example orange
  "keep-shopping": true,
};

// Assuming 'my-event-slug' is your event's slug
showpass.tickets.eventPurchaseWidget("my-event-slug", params);
```

### Embedded mode (basic)

```html
<!-- 1. Your HTML container -->
<div id="event-widget-here"></div>

<script>
  // 2. JavaScript to embed
  let embedParams = { "theme-primary": "#337ab7" }; // Example blue
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

This example uses a button click to open the widget and checks if the SDK is loaded.

```html
<button id="buyTicketsBtn" data-event-slug="your-event-slug">
  Buy Tickets
</button>
<!-- Add more buttons with different slugs if needed -->
<!-- <button class="showpass-popup-button" data-event-slug="another-event-slug">Tickets for Another Event</button> -->

<script>
  // Function to handle the click event for any button intended to open a Showpass widget
  function handleShowpassButtonClick(event) {
    // 'this' refers to the button that was clicked
    const eventSlug = this.getAttribute("data-event-slug");

    if (!eventSlug) {
      console.error("Button is missing data-event-slug attribute.");
      alert("Could not determine the event. Please try again.");
      return;
    }

    const widgetParams = {
      "theme-primary": "#28a745", // Example green
      "keep-shopping": false,
      "show-description": true,
      // Add other default parameters if needed
    };

    if (
      typeof showpass !== "undefined" &&
      typeof showpass.tickets !== "undefined"
    ) {
      showpass.tickets.eventPurchaseWidget(eventSlug, widgetParams);
    }
    // Fallback to command queue if you used the async loader (Option 1 from Getting Started)
    else if (typeof window.__shwps !== "undefined") {
      window.__shwps("tickets.eventPurchaseWidget", eventSlug, widgetParams);
      console.log(
        `Showpass SDK call queued via __shwps for pop-up (slug: ${eventSlug}).`
      );
    } else {
      console.error("Showpass SDK is not available.");
      alert(
        "Ticketing system is currently unavailable. Please try again shortly."
      );
    }
  }

  // Attach the event listener to the button with the ID
  const buyButton = document.getElementById("buyTicketsBtn");
  if (buyButton) {
    buyButton.addEventListener("click", handleShowpassButtonClick);
  }

  // Optional: Attach to multiple buttons using a class
  // const allShowpassButtons = document.querySelectorAll('.showpass-popup-button');
  // allShowpassButtons.forEach(button => {
  //   button.addEventListener('click', handleShowpassButtonClick);
  // });
</script>
```

### Embedded mode (robust)

This example attempts to embed the widget once the DOM is ready and includes a simple retry mechanism if the SDK isn't immediately available.

```html
<!-- 1. Your HTML container -->
<div id="embedded-event-widget-container">
  <!-- Optional: Loading... -->
</div>

<script>
  function initializeEmbeddedEventWidget() {
    const eventSlug = "your-other-event-slug"; // <<< REPLACE THIS
    const containerId = "embedded-event-widget-container"; // <<< Must match your div ID
    const widgetParams = {
      "theme-primary": "#dc3545", // Example red
      "show-specific-tickets": "TICKET_TYPE_ID_1,TICKET_TYPE_ID_2", // <<< REPLACE TICKET IDs
    };

    if (document.getElementById(containerId)) {
      if (
        typeof showpass !== "undefined" &&
        typeof showpass.tickets !== "undefined"
      ) {
        showpass.tickets.eventPurchaseWidget(
          eventSlug,
          widgetParams,
          containerId
        );
      }
      // Fallback to command queue if you used the async loader (Option 1 from Getting Started)
      else if (typeof window.__shwps !== "undefined") {
        window.__shwps(
          "tickets.eventPurchaseWidget",
          eventSlug,
          widgetParams,
          containerId
        );
        console.log("Showpass SDK call queued via __shwps for embedding.");
      } else {
        console.warn("Showpass SDK not ready for embedding, will retry...");
        // Simple retry - for more complex scenarios, consider a more robust loader/ready check
        setTimeout(initializeEmbeddedEventWidget, 500);
      }
    } else {
      console.error(
        "Target container for embedded Showpass widget not found:",
        containerId
      );
    }
  }

  // Wait for the DOM to be fully loaded before trying to embed
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeEmbeddedEventWidget
    );
  } else {
    // DOM is already loaded
    initializeEmbeddedEventWidget();
  }
</script>
```

**Choosing an Implementation:**

- Use the **Basic Usage Examples** for a quick understanding or if your script execution is guaranteed to be after the SDK loads.
- Use the **Robust Implementation Examples** for production websites to ensure reliability and handle the asynchronous loading of the SDK. The robust examples demonstrate checking for `showpass.tickets` and provide a fallback to the `window.__shwps` command queue if you used the recommended asynchronous loader from the "Getting Started" guide.
