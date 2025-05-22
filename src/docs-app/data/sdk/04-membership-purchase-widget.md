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

Ensure the Showpass SDK is included on your page and has fully loaded before these functions are called. See the "SDK Getting Started" guide. The SDK loads asynchronously.

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

These examples show the simplest way to call the functions, assuming the Showpass SDK (`showpass.tickets`) is already loaded and available.

### Pop-up mode (basic)

```javascript
// Basic parameters
let params = {
  "theme-primary": "#6f42c1", // Example purple
  "keep-shopping": true,
};

// Assuming 789 is your membership's ID
showpass.tickets.membershipPurchaseWidget(789, params);
```

### Embedded mode (basic)

```html
<!-- 1. Your HTML container -->
<div id="membership-widget-here"></div>

<script>
  // 2. JavaScript to embed
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

To ensure your code works reliably even if the Showpass SDK is still loading, it's best to check for its availability or use the `window.__shwps` command queue if you followed "Option 1" for SDK inclusion from the "Getting Started" guide.

### Pop-up mode (robust)

This example uses a button click to open the widget and reads the membership ID from a `data-membership-id` attribute on the button.

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
      alert("Could not determine the membership. Please try again.");
      return;
    }
    const membershipId = parseInt(membershipIdString, 10); // Ensure it's an integer

    const widgetParams = {
      "theme-primary": "#fd7e14", // Example orange
      "keep-shopping": true,
      "show-description": true,
    };

    if (
      typeof showpass !== "undefined" &&
      typeof showpass.tickets !== "undefined"
    ) {
      showpass.tickets.membershipPurchaseWidget(membershipId, widgetParams);
    }
    // Fallback to command queue if you used the async loader (Option 1 from Getting Started)
    else if (typeof window.__shwps !== "undefined") {
      window.__shwps(
        "tickets.membershipPurchaseWidget",
        membershipId,
        widgetParams
      );
      console.log(
        `Showpass SDK call queued via __shwps for membership pop-up (ID: ${membershipId}).`
      );
    } else {
      console.error("Showpass SDK is not available.");
      alert(
        "Membership system is currently unavailable. Please try again shortly."
      );
    }
  }

  // Attach event listener to all buttons with the class 'showpass-membership-button'
  const membershipButtons = document.querySelectorAll(
    ".showpass-membership-button"
  );
  membershipButtons.forEach((button) => {
    button.addEventListener("click", handleShowpassMembershipClick);
  });
</script>
```

### Embedded mode (robust)

This example attempts to embed the membership widget once the DOM is ready and includes a simple retry mechanism if the SDK isn't immediately available.

**HTML:**

```html
<!-- 1. Your HTML container -->
<div id="embedded-membership-widget-container"></div>
```

**JavaScript:**

```html
<script>
  function initializeEmbeddedMembershipWidget() {
    const membershipIdToEmbed = 202; // <<< REPLACE THIS with your actual Membership ID
    const containerId = "embedded-membership-widget-container"; // <<< Must match your div ID
    const widgetParams = {
      "theme-primary": "#e83e8c", // Example pink
      // Add other specific membership params if needed
    };

    if (document.getElementById(containerId)) {
      if (
        typeof showpass !== "undefined" &&
        typeof showpass.tickets !== "undefined"
      ) {
        showpass.tickets.membershipPurchaseWidget(
          membershipIdToEmbed,
          widgetParams,
          containerId
        );
      }
      // Fallback to command queue if you used the async loader (Option 1 from Getting Started)
      else if (typeof window.__shwps !== "undefined") {
        window.__shwps(
          "tickets.membershipPurchaseWidget",
          membershipIdToEmbed,
          widgetParams,
          containerId
        );
        console.log(
          `Showpass SDK call queued via __shwps for membership embedding (ID: ${membershipIdToEmbed}).`
        );
      } else {
        console.warn(
          "Showpass SDK not ready for membership embedding, will retry..."
        );
        setTimeout(initializeEmbeddedMembershipWidget, 500);
      }
    } else {
      console.error(
        "Target container for embedded Showpass membership widget not found:",
        containerId
      );
    }
  }

  // Wait for the DOM to be fully loaded before trying to embed
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeEmbeddedMembershipWidget
    );
  } else {
    // DOM is already loaded
    initializeEmbeddedMembershipWidget();
  }
</script>
```

**Choosing an Implementation:**

- Use the **Basic Usage Examples** for a quick understanding or if your script execution is guaranteed to be after the SDK loads.
- Use the **Robust Implementation Examples** for production websites to ensure reliability and handle the asynchronous loading of the SDK. These examples demonstrate checking for `showpass.tickets` and provide a fallback to the `window.__shwps` command queue if you used the recommended asynchronous loader from the "Getting Started" guide.
