# Showpass SDK introduction

## Overview

Showpass provides a JavaScript SDK (Software Development Kit) that makes it easy to integrate Showpass's ticketing and product purchasing functionalities directly into your website. You can use it to open purchase widgets as pop-up dialogs or embed them seamlessly into your page layout.

**Please note:** Your domain must have a valid SSL certificate (`https://`) installed for the SDK to work properly.

## Including the Showpass SDK on your page

You have two primary options for including the Showpass SDK:

### Option 1: Direct script tag with `async` or `defer` (recommended)

Include the SDK with a standard `<script>` tag using either the `async` or `defer` attribute to prevent blocking your page's rendering. Place this tag in the `<head>` of your HTML or before your closing `</body>` tag.

**Using `async`:**
The script will be downloaded in parallel with the browser parsing the HTML page and executed as soon as it's available.

```html
<script
  type="text/javascript"
  src="https://showpass.com/static/dist/sdk.js"
  async
></script>
```

**Using `defer` (recommended):**
The script will be downloaded in parallel with HTML parsing but only executed after the HTML document has been fully parsed. This ensures the DOM is ready when the SDK loads.

```html
<script
  type="text/javascript"
  src="https://showpass.com/static/dist/sdk.js"
  defer
></script>
```

### Option 2: Dynamic script loading

You can dynamically load the SDK script using JavaScript:

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

## Calling SDK functions

Once the SDK has loaded, its functions are available under the `showpass.tickets` namespace (e.g., `showpass.tickets.eventPurchaseWidget(...)`).

**Function Signature Pattern:**
Many SDK functions that display widgets follow a pattern where an optional third parameter can be provided to embed the widget. For example:
`sdkFunction(requiredArg1, optionalParamsObject, optionalContainerIdForEmbedding)`

**Widget Behavior (Pop-up vs. Embedded):**

- By default, if you call a widget function like `eventPurchaseWidget(slug, params)` without the third `containerId` argument, it will display the widget as a **pop-up modal dialog**.
- To **embed** a widget, you pass the ID of your target HTML `<div>` element as the `containerId` argument (e.g., `eventPurchaseWidget(slug, params, 'myDivId')`).

**Ensuring SDK Readiness:**
Since the SDK loads asynchronously, you need to ensure it's loaded before calling its functions:

**Method 1: Check for SDK availability**

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

**Method 2: Using DOMContentLoaded (when using `defer`)**

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

**Method 3: Script onload callback (for dynamic loading)**

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

## Available SDK functions

The Showpass SDK provides several functions to integrate different Showpass widgets and features:

1.  **Ticket purchase widget:** For event ticket purchases.
2.  **Product purchase widget:** For marketplace product purchases.
3.  **Memberhips purchase widget:** For membership and season pass purchases.
4.  **Calendar widget:** A calendar for event purcahses.
5.  **Checkout Widget:** To initiate the final checkout process.
6.  **Cart quantity listener:** To listen for changes in cart item count.

Refer to the specific documentation page for each function for detailed parameters and examples.
