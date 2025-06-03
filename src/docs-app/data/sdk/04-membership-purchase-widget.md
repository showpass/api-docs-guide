# Membership purchase widget

## Overview

The Membership Purchase Widget opens a display for a specific membership (identified by its numerical `id`), allowing users to select and purchase memberships. It can be launched as a pop-up dialog or embedded directly into a page element.

**SDK Function Signature:**

```javascript
// For pop-up mode
showpass.tickets.membershipPurchaseWidget(membershipId, params);

// For embedded mode
showpass.tickets.membershipPurchaseWidget(membershipId, params, containerId);
```

## Prerequisites

Ensure the Showpass SDK is included on your page as described in the "SDK Getting Started" guide. You'll need to ensure the SDK is loaded before calling its functions.

## Finding the membership ID

To find the `membershipId`: `TODO FIX THIS, currently no way to find membership ID in dashboard`

1.  Log in to your Showpass Dashboard.
2.  Navigate to the section where your memberships are managed (e.g., Marketplace > Memberships or similar).
3.  Edit the desired membership.
4.  The Membership ID will typically be visible in the URL of the edit page or listed on the membership management page.

## Parameters

_(Assuming parameters are similar to Product/Event widgets. Adjust if specific membership parameters are different.)_

| Parameter                    | Type    | Status   | Description                                                                                        |
| ---------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------- |
| `membershipId`               | Integer | Required | The unique numerical ID of the membership.                                                         |
| `params`                     | Object  | Optional | An object containing additional configuration parameters for the widget.                           |
| `params['theme-primary']`    | String  | Optional | Hex code value for the main widget color (e.g., `'#dd3333'`).                                      |
| `params['keep-shopping']`    | Boolean | Optional | Displays "Keep Shopping" instead of "Close" on button verbiage (e.g., `false`).                    |
| `params['show-description']` | Boolean | Optional | Displays or hides the membership description.<br>Default: `true`.                                  |
| `params['tracking-id']`      | String  | Optional | Tracking link `tracking-id`, for affiliate tracking or other specialized link behaviors.           |
| `containerId`                | String  | Optional | **For Embedded Mode Only.** The ID of the HTML `<div>` element where the widget should be mounted. |

## Basic usage examples

These examples show the simplest way to call the functions, assuming the Showpass SDK (`showpass.tickets`) is already loaded and available. For reliable execution, especially on initial page load, see the "Robust Implementation Examples" below.

### Pop-up mode (basic)

```javascript
let params = {
  "theme-primary": "#6f42c1", // Example purple
  "keep-shopping": true,
};
// Assuming 789 is your membership's ID
showpass.tickets.membershipPurchaseWidget(789, params);
```

### Embedded mode (basic)

```html
<div id="membership-widget-here"></div>
<script>
  let embedParams = { "theme-primary": "#17a2b8" }; // Example teal
  // Assuming 101 is your membership's ID
  showpass.tickets.membershipPurchaseWidget(
    101,
    embedParams,
    "membership-widget-here"
  );
</script>
```

**Important:** The basic examples above assume `showpass.tickets` is ready. For production code, see the "Robust Implementation Examples" below to handle SDK loading.

## Robust implementation examples

To ensure your code works reliably even if the Showpass SDK is still loading, you need to check for its availability before making calls.

### Pop-up mode (robust)

This example attaches an event listener to all buttons with the class `showpass-membership-button` and reads the membership ID from a `data-membership-id` attribute.

**HTML:**

```html
<button class="showpass-membership-button" data-membership-id="789">
  View Membership Options
</button>
<button class="showpass-membership-button" data-membership-id="101">
  Join Now
</button>
```

_Replace `789` and `101` with actual membership IDs._

**JavaScript:**

```html
<script>
  function handleShowpassMembershipClick(event) {
    const membershipIdString = this.getAttribute("data-membership-id");
    if (!membershipIdString) {
      console.error("Button is missing data-membership-id attribute.");
      return; // Exit if no membership ID
    }
    const membershipId = parseInt(membershipIdString, 10);

    const widgetParams = {
      "theme-primary": "#fd7e14", // Example orange
      "keep-shopping": true,
      "show-description": true,
    };

    // Check if SDK is loaded before calling
    if (window.showpass && window.showpass.tickets) {
      window.showpass.tickets.membershipPurchaseWidget(
        membershipId,
        widgetParams
      );
      console.log(
        `Showpass SDK called for membership pop-up (ID: ${membershipId}).`
      );
    } else {
      console.error("Showpass SDK not yet loaded");
    }
  }

  // Wait for the DOM to be ready before attaching event listeners
  document.addEventListener("DOMContentLoaded", function () {
    const membershipButtons = document.querySelectorAll(
      ".showpass-membership-button"
    );
    membershipButtons.forEach(function (button) {
      button.addEventListener("click", handleShowpassMembershipClick);
    });
  });
</script>
```

### Embedded mode (robust)

This example attempts to embed the membership widget once the DOM is ready.

**HTML:**

```html
<!-- This div must exist in the DOM before the script below runs -->
<div id="embedded-membership-widget-container"></div>
```

**JavaScript:**

```html
<script>
  // Function to initialize the embedded widget
  function initializeEmbeddedMembershipWidget() {
    const membershipIdToEmbed = 202; // <<< REPLACE THIS with your actual Membership ID
    const embedContainerId = "embedded-membership-widget-container"; // <<< Must match your div ID
    const widgetEmbedParams = {
      "theme-primary": "#e83e8c", // Example pink
      // Add other specific membership params if needed
    };

    // Check if the container element exists
    if (!document.getElementById(embedContainerId)) {
      console.error(
        "Target container for embedded Showpass membership widget not found:",
        embedContainerId
      );
      return;
    }

    // Check if SDK is loaded and call the function
    if (window.showpass && window.showpass.tickets) {
      window.showpass.tickets.membershipPurchaseWidget(
        membershipIdToEmbed,
        widgetEmbedParams,
        embedContainerId
      );
      console.log(
        `Showpass SDK called for membership embedding (ID: ${membershipIdToEmbed}).`
      );
    } else {
      // SDK not ready yet - wait and try again
      setTimeout(initializeEmbeddedMembershipWidget, 100);
    }
  }

  // Wait for the DOM to be fully loaded before trying to embed
  document.addEventListener(
    "DOMContentLoaded",
    initializeEmbeddedMembershipWidget
  );
</script>
```

**Key for embedded widgets:**

- The HTML `div` element (e.g., `<div id="embedded-membership-widget-container"></div>`) **must exist on the page** when the Showpass SDK attempts to mount the widget into it.
- It's best practice to ensure your script that calls the SDK functions runs _after_ its target HTML div is available in the DOM, for instance, by using a `DOMContentLoaded` event listener.

**Alternative: Using script onload callback**
If you're dynamically loading the SDK, you can use the onload callback approach:

```javascript
let script = document.createElement("script");
script.onload = function () {
  // SDK is now loaded - safe to call functions
  window.showpass.tickets.membershipPurchaseWidget(membershipId, params);
};
script.src = "https://showpass.com/static/dist/sdk.js";
document.head.appendChild(script);
```
