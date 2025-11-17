# Membership Purchase Widget

## Overview

The Membership Purchase Widget displays a specific membership offering (identified by its numerical `id`), allowing users to select and purchase memberships or season passes. It can be launched as a pop-up dialog or embedded directly into a webpage.

---

## SDK Function Signature

```javascript
// Pop-up mode - displays as a modal dialog
showpass.tickets.membershipPurchaseWidget(membershipId, params);

// Embedded mode - mounts into a container element
showpass.tickets.membershipPurchaseWidget(membershipId, params, containerId);
```

---

## Prerequisites

- The Showpass SDK must be included on your page (see "SDK Getting Started" guide)
- Ensure the SDK is loaded before calling its functions
- You need the membership's unique numerical **ID**

---

## Finding the Membership ID

> **Note:** Dashboard functionality for locating membership IDs may vary. Contact Showpass support if you need assistance finding your membership ID.

To locate your **membershipId**:

1. Log in to your **Showpass Dashboard**
2. Navigate to the memberships management section (e.g., **Marketplace > Memberships**)
3. Click to edit the desired membership
4. The Membership ID typically appears in the URL or on the membership management page

---

## Parameters

| Parameter | Type | Status | Description |
| --- | --- | --- | --- |
| **membershipId** | Integer | Required | The unique numerical ID of the membership |
| **params** | Object | Optional | Configuration object containing widget customization options |
| **params['theme-primary']** | String | Optional | Hex code for the main widget color (e.g., `'#dd3333'`) |
| **params['keep-shopping']** | Boolean | Optional | If `true`, displays "Keep Shopping" instead of "Close" butto. Default: `true`n |
| **params['show-description']** | Boolean | Optional | Control membership description visibility. Default: `true` |
| **params['lang']** | String | Optional | Language code for widget interface. Use `'fr'` for French (defaults to English) |
| **params['tracking-id']** | - | - | Currently not supported for membership widgets |
| **containerId** | String | Optional | **For Embedded Mode:** The ID of the HTML `<div>` element where the widget will mount |

---

## Basic Usage Examples

These examples assume the Showpass SDK is already loaded. For production-ready code that handles SDK loading, see "Robust Implementation Examples" below.

### Pop-up Mode (Basic)

```javascript
// Define widget configuration
let params = {
  "theme-primary": "#6f42c1", // Purple theme
  "keep-shopping": true,
};

// Open the membership widget as a pop-up
// Assuming 789 is your membership's ID
showpass.tickets.membershipPurchaseWidget(789, params);
```

---

### Embedded Mode (Basic)

```html
<!-- Container element for the widget -->
<div id="membership-widget-here"></div>

<script>
  // Configure and embed the widget
  let embedParams = { "theme-primary": "#17a2b8" }; // Teal theme
  
  // Assuming 101 is your membership's ID
  showpass.tickets.membershipPurchaseWidget(
    101,
    embedParams,
    "membership-widget-here"
  );
</script>
```

> **Note:** These basic examples assume `showpass.tickets` is ready. For production environments, always use the robust implementation patterns below.

---

## Robust Implementation Examples

These examples include proper SDK availability checks to ensure reliable execution.

### Pop-up Mode (Robust)

This implementation attaches event listeners to buttons with the class `showpass-membership-button` and reads the membership ID from a `data-membership-id` attribute.

**HTML:**

```html
<button class="showpass-membership-button" data-membership-id="789">
  Buy Membership 1
</button>
<button class="showpass-membership-button" data-membership-id="101">
  Buy Membership 2
</button>
```

**JavaScript:**

```javascript
function initializeMembershipWidgets() {
  const buttons = document.querySelectorAll(".showpass-membership-button");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      const membershipId = parseInt(button.getAttribute("data-membership-id"), 10);
      
      if (membershipId && window.showpass && window.showpass.tickets) {
        const params = {
          "theme-primary": "#e83e8c",
          "keep-shopping": true,
        };
        window.showpass.tickets.membershipPurchaseWidget(membershipId, params);
      } else {
        console.error("Showpass SDK not available or membership ID is missing.");
      }
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeMembershipWidgets);
} else {
  initializeMembershipWidgets();
}
```

---

### Embedded Mode (Robust)

This implementation ensures the SDK is loaded before embedding the widget.

**HTML:**

```html
<div id="embedded-membership-widget-container"></div>
```

**JavaScript:**

```javascript
function embedMembershipWidget() {
  const containerId = "embedded-membership-widget-container";
  const membershipId = 789; // Your membership ID

  if (window.showpass && window.showpass.tickets) {
    const params = {
      "theme-primary": "#20c997",
      "show-description": true,
    };
    window.showpass.tickets.membershipPurchaseWidget(
      membershipId,
      params,
      containerId
    );
  } else {
    console.error("Showpass SDK not available.");
    // Optionally, retry after a delay
    setTimeout(embedMembershipWidget, 500);
  }
}

// Execute when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", embedMembershipWidget);
} else {
  embedMembershipWidget();
}
```

---

### Alternative: Using Script Onload Callback

If you're dynamically loading the SDK, you can use the `onload` callback:

```javascript
let script = document.createElement("script");
script.onload = function () {
  // SDK is now loaded - safe to call widget functions
  const params = {
    "theme-primary": "#fd7e14",
    "tracking-id": "affiliate-123",
  };
  window.showpass.tickets.membershipPurchaseWidget(456, params);
};
script.src = "https://showpass.com/static/dist/sdk.js";
document.head.appendChild(script);
```

---

## Key Takeaways

- **Membership ID is required:** Always use the correct numerical membership ID from your dashboard
- **Check SDK availability:** Production code should always verify `window.showpass.tickets` exists before calling functions
- **Pop-up vs Embedded:** Use pop-up mode for quick interactions; use embedded mode for seamless page integration
- **Tracking support:** Use `tracking-id` parameter for affiliate tracking and specialized link behaviors
- **Customize appearance:** Use `theme-primary` to match your brand colors
- **Handle loading:** Implement retry logic or use `DOMContentLoaded` to ensure SDK readiness
