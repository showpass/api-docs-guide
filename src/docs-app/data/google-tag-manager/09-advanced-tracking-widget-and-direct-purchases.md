# Advanced: Differentiating Widget (iFrame) vs. Direct Showpass.com Event Tracking


In some advanced scenarios, you might want to differentiate GTM tag firing behavior based on whether an event originates from within the embedded Showpass widget (iFrame on your site) or from a direct interaction on `showpass.com` (if your GTM container is also deployed there, or if Showpass sends server-side events that populate your website's GTM).

This allows for more granular control, such as:

- Applying different attributions
- Sending slightly different data to certain marketing tags
- Preventing duplicate firing if events could be captured through both `postMessage` (from the iFrame) and direct Data Layer pushes (on `showpass.com` or via server events)

The key is to create a GTM variable that detects if the current context is an iFrame.

---

## Step 1: Create an "Is iFrame?" Custom JavaScript Variable

This variable will return `true` if the GTM container is currently operating within an iFrame, and `false` otherwise.

1. In your **Main/Parent GTM container** (your website's GTM), go to **Variables**
2. Under "User-Defined Variables," click **New**
3. **Name your variable:** `Custom JS - Is iFrame` (or similar)
4. **Variable Configuration:**
   - Choose variable type: **Custom JavaScript**
   - Paste the following script:

```javascript
function() {
  try {
    // window.self refers to the current window.
    // window.top refers to the topmost window in the window hierarchy.
    // If they are not the same, the current window is in an iFrame.
    return window.top !== window.self;
  } catch (e) {
    // Catch potential errors if window.top is inaccessible due to cross-origin restrictions,
    // though less common for this specific check.
    return false;
  }
}
```

5. Click **Save**

---

## Step 2: Update Your GTM Triggers

Now, use the `{{Custom JS - Is iFrame}}` variable as a condition in your relevant GTM triggers.

### Scenario A: Triggers for postMessage Data (from Showpass Widget)

These triggers should **only** fire when the event data originates from the iFrame via `postMessage`.

- **If your postMessage listener tag** (from Section 8B) pushes distinct events: You might not need to modify the triggers for your actual ecommerce tags (like GA4 ecommerce) if those tags are already listening for the specific events pushed by your listener (e.g., `iframe_add_to_cart`)
- **If your postMessage listener tag pushes standard event names** (e.g., `add_to_cart`) that could also occur directly on your site or `showpass.com`:
  You need to ensure the triggers for tags that should **only** process iFrame `postMessage` data have an added condition

1. Edit the relevant trigger (e.g., the one that fires your GA4 ecommerce tag for events received via `postMessage`)
2. Under "This trigger fires on," add a condition:
   - `{{Custom JS - Is iFrame}}` **equals** `false`

> **Note:** This assumes your listener for postMessage events is on the parent page, and the data is pushed to the parent's dataLayer. The 'Is iFrame' variable on the parent page will be `false`. The logic here depends on where the final decision to fire a tag is made based on the source of the data.

### Scenario B: Triggers for Direct Showpass.com Events

If you want tags to fire **only** when events occur directly on `showpass.com` (not from the widget via `postMessage`):

1. Edit the relevant trigger
2. Under "This trigger fires on," add a condition:
   - `{{Page Hostname}}` **equals** `showpass.com` (or contains `showpass.com`)
   - **OR** add a custom Data Layer variable that indicates the source

Alternatively, you can add a custom flag to the Data Layer when pushing events from different sources to make differentiation easier.

---

## Step 3: Alternative Approach - Add Source Identifier to Data Layer

A more explicit approach is to modify how events are pushed to the Data Layer to include a **source** identifier.

### In the Parent postMessage Listener Script

Modify the postMessage listener tag (from Section 8B1) to add a source flag:

```html
<script>
  (function () {
    if (window.showpassPostMessageListenerAdded) {
      return;
    }
    window.showpassPostMessageListenerAdded = true;

    window.addEventListener(
      "message",
      function (event) {
        try {
          var data = event.data;

          if (Array.isArray(data) && data.length > 0) {
            data.forEach(function (item) {
              if (item && typeof item === "object" && item.event) {
                // Add a source identifier
                item.event_source = "iframe_widget";

                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push(item);
              }
            });
          }
        } catch (err) {
          console.error("Showpass postMessage Listener Error:", err);
        }
      },
      false
    );
  })();
</script>
```

### Create a GTM Variable for Event Source

1. In GTM, go to **Variables** and click **New**
2. **Name:** `DLV - event_source`
3. **Variable Type:** **Data Layer Variable**
4. **Data Layer Variable Name:** `event_source`
5. Click **Save**

### Use in Triggers

Now you can add conditions to your triggers:

- **For widget events only:** `{{DLV - event_source}}` **equals** `iframe_widget`
- **For direct events only:** `{{DLV - event_source}}` **does not equal** `iframe_widget` (or is undefined)

---

## Summary

- Use the **"Is iFrame?" Custom JavaScript variable** to detect if GTM is running inside an iFrame
- Add conditions to your triggers based on this variable to differentiate tag firing behavior
- **Alternative approach:** Add an **event_source** identifier to the Data Layer for more explicit control
- This is useful for preventing duplicate events and applying different tracking logic based on the event source
- Always test thoroughly using GTM Preview mode to ensure tags fire as expected in both scenarios
