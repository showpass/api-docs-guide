# Showpass SDK Introduction

## Overview

The Showpass JavaScript SDK (Software Development Kit) enables seamless integration of Showpass's ticketing and product purchasing functionalities directly into your website. With the SDK, you can display purchase widgets as pop-up dialogs or embed them into your page layout for a fully integrated experience.

> **Important:** Your domain must have a valid SSL certificate (`https://`) installed for the SDK to function properly.

---

## Including the SDK

You have two primary methods for including the Showpass SDK on your website:

### Option 1: Direct Script Tag (Recommended)

Include the SDK using a standard `<script>` tag with either `async` or `defer` attribute to prevent blocking page rendering. Place this tag in the `<head>` section or before the closing `</body>` tag.

#### Using `async`

The script downloads in parallel with HTML parsing and executes immediately when available:

```html
<script
  type="text/javascript"
  src="https://showpass.com/static/dist/sdk.js"
  async
></script>
```

#### Using `defer` (Recommended)

The script downloads in parallel with HTML parsing but only executes after the HTML document is fully parsed, ensuring the DOM is ready:

```html
<script
  type="text/javascript"
  src="https://showpass.com/static/dist/sdk.js"
  defer
></script>
```

---

### Option 2: Dynamic Script Loading

You can programmatically load the SDK using JavaScript:

```javascript
(function (window, document) {
  let script = document.createElement("script");
  script.type = "text/javascript";
  script.async = true;
  script.src = "https://www.showpass.com/static/dist/sdk.js";
  let firstScript = document.getElementsByTagName("script")[0];
  firstScript.parentNode.insertBefore(script, firstScript);
})(window, document);
```

---

## SDK Function Structure

Once loaded, the SDK exposes its functions under the `showpass.tickets` namespace (e.g., `showpass.tickets.eventPurchaseWidget(...)`).

### Function Signature Pattern

Most SDK functions that display widgets follow this pattern:

```javascript
sdkFunction(requiredArg1, optionalParamsObject, optionalContainerIdForEmbedding)
```

### Widget Display Modes

**Pop-up Mode (Default):**
- Call a widget function without the `containerId` argument
- Widget displays as a modal dialog overlay
- Example: `eventPurchaseWidget(slug, params)`

**Embedded Mode:**
- Pass the ID of your target HTML `<div>` element as the `containerId` argument
- Widget embeds directly into the specified container
- Example: `eventPurchaseWidget(slug, params, 'myDivId')`

---

## Ensuring SDK Readiness

Since the SDK loads asynchronously, you must ensure it's available before calling its functions. Here are three recommended approaches:

### Method 1: Check for SDK Availability

```javascript
function callSDKWhenReady() {
  if (typeof window.showpass !== "undefined" && window.showpass.tickets) {
    // SDK is ready - make your calls
    window.showpass.tickets.eventPurchaseWidget("your-slug", {
      /* params */
    });
  } else {
    // SDK not ready yet - wait and try again
    setTimeout(callSDKWhenReady, 100);
  }
}

// Call when page is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", callSDKWhenReady);
} else {
  callSDKWhenReady();
}
```

---

### Method 2: Using DOMContentLoaded (When Using `defer`)

```javascript
document.addEventListener("DOMContentLoaded", function () {
  // SDK should be loaded by now due to defer
  if (window.showpass && window.showpass.tickets) {
    window.showpass.tickets.eventPurchaseWidget("your-slug", {
      /* params */
    });
  }
});
```

---

### Method 3: Script Onload Callback (For Dynamic Loading)

```javascript
let script = document.createElement("script");
script.onload = function () {
  // SDK is now loaded
  window.showpass.tickets.eventPurchaseWidget("your-slug", {
    /* params */
  });
};
script.src = "https://showpass.com/static/dist/sdk.js";
document.head.appendChild(script);
```

---

## Available SDK Functions

The Showpass SDK provides several specialized functions for different integration scenarios:

| Function | Purpose |
| --- | --- |
| **Ticket Purchase Widget** | Enable event ticket selection and purchase |
| **Product Purchase Widget** | Display marketplace product options and add to cart |
| **Memberships Purchase Widget** | Offer membership and season pass purchases |
| **Calendar Widget** | Show interactive calendar for event browsing and booking |
| **Checkout Widget** | Initiate final checkout and payment process |
| **Cart Quantity Listener** | Monitor real-time changes to shopping cart item count |

Refer to the specific documentation page for each function to learn about detailed parameters, examples, and best practices.

---

## Next Steps

Now that you understand the SDK basics, explore the individual widget documentation to learn how to:

- Integrate specific widgets for your use case
- Customize widget appearance and behavior
- Handle advanced scenarios like embedded widgets
- Implement cart tracking and checkout flows
