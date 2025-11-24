# 9. Advanced: Differentiating Widget (iFrame) vs. Direct Showpass.com Event Tracking

In some advanced scenarios, you might want to differentiate GTM tag firing behavior based on whether an event originates from within the embedded Showpass widget (iFrame on your site) or from a direct interaction on `showpass.com` (if your GTM container is also deployed there, or if Showpass sends server-side events that populate your website's GTM).

This allows for more granular control, such as:

- Applying different attributions
- Sending slightly different data to certain marketing tags
- Preventing duplicate firing if events could be captured through both `postMessage` (from the iFrame) and direct Data Layer pushes (on `showpass.com` or via server events)

The key is to create a GTM variable that detects if the current context is an iFrame.

---

## Step 1: Create an "Is iFrame?" Custom JavaScript Variable

This variable will return `true` if the GTM container is currently operating within an iFrame, and `false` otherwise.

1. In your **Parent GTM container** (your website's GTM), go to **Variables**
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

Rename your existing Custom ecommerce trigger for processing direct purchases **Showpass - Ecommerce events - direct purchase**

**Event name**

```
view_item|add_to_cart|remove_from_cart|begin_checkout|purchase|ecommerce_clear
```

Check off use regex matching

**This trigger fires on** select **Some custom events**

Fire this trigger when an Event occurs and all of these conditions are true

`{{Custom JS - Is iFrame}}` equals **false**

Attach this trigger to your GA4 ecommerce tag in the Child GTM Container

Create a new trigger for widget purchases named **Showpass - Ecommerce events - widget purchase** with the same ecommerce events

**This trigger fires on** select **Some custom events**

Fire this trigger when an Event occurs and all of these conditions are true

`{{Custom JS - Is iFrame}}` equals **true**

Attach this trigger to the **`Custom HTML - Post Message Ecommerce Data to Parent`** tag

---

## Summary

- Use the **"Is iFrame?" Custom JavaScript variable** to detect if GTM is running inside an iFrame
- Add conditions to your triggers based on this variable to differentiate tag firing behavior
- **Alternative approach:** Add an **event_source** identifier to the Data Layer for more explicit control
- This is useful for preventing duplicate events and applying different tracking logic based on the event source
- Always test thoroughly using GTM Preview mode to ensure tags fire as expected in both scenarios
