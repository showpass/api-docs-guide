# Showpass SDK introduction

## Overview

Showpass provides a JavaScript SDK (Software Development Kit) that makes it easy to integrate Showpass's ticketing and product purchasing functionalities directly into your website. You can use it to open purchase widgets as pop-up dialogs or embed them seamlessly into your page layout.

**Please note:** Your domain must have a valid SSL certificate (`https://`) installed for the SDK to work properly.

## Including the Showpass SDK on your page

You have two primary options for including the Showpass SDK:

### Option 1: Asynchronous loader (recommended)

This method is generally recommended as it loads the SDK script asynchronously without blocking your page's rendering, and it provides a command queue to handle SDK calls made before the script is fully loaded. Paste this snippet into your site's JavaScript, or within `<script>` tags in your HTML (ideally before your closing `</body>` tag or in the `<head>`).

```javascript
(function (window, document, src) {
  let config = window.__shwps; // Check if the loader has already run
  if (typeof config === "undefined") {
    config = function () {
      // Create a function to queue arguments
      config.c(arguments);
    };
    config.q = []; // Initialize the command queue
    config.c = function (args) {
      // Function to add commands to the queue
      config.q.push(args);
    };
    window.__shwps = config; // Make the queued function globally available as __shwps

    // Create and insert the script tag to load the actual SDK
    let s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = src;
    let x = document.getElementsByTagName("script")[0]; // Get the first script tag on the page
    x.parentNode.insertBefore(s, x); // Insert the SDK script before it
  }
})(window, document, "https://www.showpass.com/static/dist/sdk.js");
```

**Benefits of Option 1:**

- **Non-blocking:** Your page continues to load while the SDK fetches in the background.
- **Command Queue:** You can call SDK functions immediately using `window.__shwps(...)` (see "Calling SDK Functions" below). These calls will be queued and executed once the SDK is fully loaded, preventing "function not defined" errors.

### Option 2: Direct script tag (with `async` or `defer`)

You can include the SDK with a standard `<script>` tag. To prevent this tag from blocking your page's rendering while it downloads, it is crucial to use either the `async` or `defer` attribute. Place this tag in the `<head>` of your HTML or before your closing `</body>` tag.

**Using `async`:**
The script will be downloaded in parallel with the browser parsing the HTML page. It will then be executed as soon as it's available (which might be before the HTML parsing is complete). There's no guarantee of execution order if you have multiple `async` scripts.

```html
<script
  type="text/javascript"
  src="https://showpass.com/static/dist/sdk.js"
  async
></script>
```

**Using `defer`:**
The script will be downloaded in parallel with HTML parsing. However, it will only be executed _after_ the HTML document has been fully parsed, and before the `DOMContentLoaded` event fires. `defer` scripts also execute in the order they appear in the document. For many third-party SDKs, `defer` is often a good general recommendation if not using a loader pattern like Option 1.

```html
<script
  type="text/javascript"
  src="https://showpass.com/static/dist/sdk.js"
  defer
></script>
```

**Important Considerations for Option 2:**
Even when using `async` or `defer`, your custom JavaScript code that calls SDK functions (e.g., `showpass.tickets.eventPurchaseWidget(...)`) must still ensure the SDK has actually loaded and executed _before_ these calls are made. This typically means:

- Placing your custom script calls in a script tag that appears _after_ the SDK script tag.
- Wrapping your SDK calls in an event listener that waits for the SDK to be ready (e.g., `DOMContentLoaded` if using `defer`, or a custom event if the SDK provides one).
- Explicitly checking for the SDK's global object availability (e.g., `if (window.showpass && window.showpass.tickets) { ... }`) before making calls.
  This is in contrast to Option 1, where the `window.__shwps` command queue handles these timing issues for you.

## Calling SDK functions

Once the SDK is included and has loaded, its functions are available under the `showpass.tickets` namespace (e.g., `showpass.tickets.eventPurchaseWidget(...)`).

**Function Signature Pattern:**
Many SDK functions that display widgets follow a pattern where an optional third parameter can be provided to embed the widget. For example:
`sdkFunction(requiredArg1, optionalParamsObject, optionalContainerIdForEmbedding)`

**Widget Behavior (Pop-up vs. Embedded):**

- By default, if you call a widget function like `eventPurchaseWidget(slug, params)` without the third `containerId` argument, it will display the widget as a **pop-up modal dialog**.
- To **embed** a widget, you pass the ID of your target HTML `<div>` element as the `containerId` argument (e.g., `eventPurchaseWidget(slug, params, 'myDivId')`).

**Ensuring SDK Readiness & Robust Calls:**
Because the SDK (especially with Option 1 or `async` in Option 2) loads asynchronously, it's important to call its functions robustly:

1.  **Using the Command Queue (Recommended with Option 1):** If you used the asynchronous loader (Option 1), the safest way to make initial calls is via the `window.__shwps` object. This ensures your commands are queued.

    ```javascript
    // For a pop-up
    window.__shwps("tickets.eventPurchaseWidget", "your-slug", {
      /* params */
    });
    // For an embedded widget
    window.__shwps(
      "tickets.eventPurchaseWidget",
      "your-slug",
      {
        /* params */
      },
      "yourContainerDivId"
    );
    ```

    Once the SDK fully loads, `window.__shwps` is typically replaced by or delegates to the actual `window.showpass` object, and the queued commands are processed.

2.  **Checking for SDK Availability (Necessary for Option 2, good practice otherwise):** Before directly calling `showpass.tickets.<functionName>()`, you can check if it's loaded:
    ```javascript
    if (
      typeof showpass !== "undefined" &&
      typeof showpass.tickets !== "undefined"
    ) {
      // For a pop-up
      showpass.tickets.eventPurchaseWidget("your-slug", {
        /* params */
      });
      // For an embedded widget
      // showpass.tickets.eventPurchaseWidget('your-slug', { /* params */ }, 'yourContainerDivId');
    } else {
      console.warn("Showpass SDK not yet available.");
      // If using Option 1, you could use __shwps here as a fallback.
      // If using Option 2, you might need a retry mechanism (e.g., setTimeout)
      // or ensure this check runs after an appropriate event (like DOMContentLoaded).
    }
    ```

The individual documentation for each SDK widget function will provide "Basic Usage" examples (which assume the SDK is ready for simplicity) and "Robust Implementation Examples" that demonstrate how to handle SDK loading and make calls reliably, often incorporating these checks or the command queue pattern.

## Available SDK functions

The Showpass SDK provides several functions to integrate different Showpass widgets and features:

1.  **Ticket Selection Widget:** For event ticket purchases.
2.  **Product Selection Widget:** For marketplace product purchases.
3.  **Shopping Cart Widget:** To display and manage cart contents.
4.  **Check Out Widget:** To initiate the final checkout process.
5.  **Login Widget:** To prompt user login.
6.  **Cart Quantity Counter:** To listen for changes in cart item count.
7.  **Calendar Widget:** A pop-up calendar for event selection.
8.  **Embedded Calendar Widget:** Mounts a calendar directly onto a page element.

Refer to the specific documentation page for each function for detailed parameters and examples.
