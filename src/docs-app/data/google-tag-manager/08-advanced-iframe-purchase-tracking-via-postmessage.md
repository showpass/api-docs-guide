# Advanced & Preferred: iFrame Purchase Tracking via postMessage

Tracking conversions and user activity accurately within an iFrame (like the Showpass embedded purchase widget) is a significant challenge due to browser privacy measures that increasingly block third-party cookies and tracking mechanisms.

To overcome this, Showpass advocates for a more robust method: **iFrame tracking using the postMessage API**. This technique allows secure communication between the Showpass iFrame (child) and your website (parent page), enabling the iFrame to send event data directly to your GTM container on the parent page.

## Why Use postMessage for iFrame Tracking?

- **Accuracy:** Bypasses many issues related to third-party cookie restrictions, leading to more reliable data
- **Privacy-Focused:** Relies on direct communication rather than cross-domain cookie sharing for event data
- **Recommended:** Considered a best practice for iFrame tracking in modern web analytics

### Further Reading

For more context on iFrame tracking challenges and solutions:

- Jellyfish Training - How to Track iFrames with Google Tag Manager: [https://www.jellyfish.com/en-gb/training/blog/how-track-iframes-google-tag-manager](https://www.jellyfish.com/en-gb/training/blog/how-track-iframes-google-tag-manager)
- MeasureSchool - iFrame Tracking with Google Tag Manager: [https://measureschool.com/iframe-tracking/](https://measureschool.com/iframe-tracking/)

---

## Overview of the postMessage Setup with Showpass

This setup involves two Google Tag Manager containers:

1. **Child GTM Container (for the Showpass iFrame):**

   - Create a new **empty GTM Container ID**
   - This container is specifically for the Showpass widget environment
   - Its role is to capture ecommerce events within the iFrame and `postMessage` them to the parent window (your website)
   - Add this to your Organizer Info > Analytics section in the Showpass Dashboard

2. **Main/Parent GTM Container (on your website):**
   - This is your existing GTM container that manages tracking for your primary website
   - Its role is to listen for messages from the Showpass iFrame and then push that data into its own `dataLayer` to trigger your standard ecommerce tags (e.g., GA4, marketing pixels)

---

## A. Child GTM Container Setup (Showpass iFrame GTM)

You (or Showpass, with your input) will configure this GTM container provided by Showpass.

### Step A1: Create the "Post Message to Parent" Tag

This tag will send data from the iFrame's Data Layer to your parent website.

#### Set Up the nonce Variable in GTM

This variable will read a dynamic nonce value that Showpass makes available on the page.

1. In your GTM container, navigate to **Variables**
2. Under "User-Defined Variables," click **New**
3. **Name your variable:** `nonce` (lowercase is conventional)
4. **Variable Configuration:**
   - Click **Choose a variable type to begin setup...**
   - Select **DOM Element**
   - **Selection Method:** Choose **CSS Selector**
   - **Element Selector:** Enter `meta[name='csp-nonce']`
     > **Note:** This is a CSS selector that targets the meta tag Showpass uses to provide the nonce value.
   - **Attribute Name:** Enter `content`
     > **Note:** This is the content attribute on the meta tag that will hold the nonce string.
5. Click **Save**

#### Set Up the postMessage tag

1. In the **Child GTM container**, go to **Tags** and click **New**
2. **Name the tag:** `Custom HTML - Post Message Ecommerce Data to Parent`
3. **Tag Configuration:**
   - Choose tag type: **Custom HTML**
   - Paste the following script into the HTML field:

```html
<script nonce="{{nonce}}">
  // Assuming you've set up a 'nonce' variable as per Section 5
  (function () {
    try {
      // Check if running in an iFrame and if parent and postMessage are accessible
      if (typeof parent != "undefined" && parent != window) {
        if (typeof parent.postMessage != "undefined") {
          // !!! IMPORTANT: Update dataLayer_GTM_CHILD_ID below !!!
          // Replace 'GTM_CHILD_ID' with the actual ID of THIS Child GTM container
          var message = window.dataLayer_GTM_CHILD_ID;

          // Ensure message is an array and has content before sending
          if (Array.isArray(message) && message.length > 0) {
            // Deep clone the message to avoid issues with object references
            var clonedMessage = JSON.parse(JSON.stringify(message));
            parent.postMessage(clonedMessage, "*"); // Send to any parent origin for flexibility
          }
        }
      }
    } catch (err) {
      // console.error("Showpass Child GTM postMessage Error: ", err);
    }
  })();
</script>
```

- **Crucial:**
  - Ensure you have enabled the **Support document.write** checkbox (under Advanced Settings) if required
  - **Replace `GTM_CHILD_ID`** in the script with your actual Child GTM Container ID (e.g., `dataLayer_GTM_XXXXXX`). Note the underscore, not dash

4. **Triggering:**
   - Click **Choose a trigger to make this tag fire...**
   - Select **Custom Event**
   - **Event name:** Use regex matching to fire on all Showpass ecommerce events:
     ```text
     view_item|add_to_cart|remove_from_cart|begin_checkout|purchase|ecommerce_clear
     ```
   - Check **Use regex matching**
5. Click **Save**

---

### Step A2: Publish the Child GTM Container

1. In the Child GTM container, click **Submit**
2. Provide a version name (e.g., "Initial postMessage Setup")
3. Click **Publish**

---

### Step A3: Add Child GTM Container ID to Showpass

1. Log in to your Showpass Dashboard
2. Navigate to **Organizer Info > Analytics**
3. Add your **Child GTM Container ID** (e.g., `GTM-XXXXXXX`)
4. Save changes

Showpass will now load this Child GTM container within the iFrame, allowing it to capture events and send them to the parent page.

---

## B. Parent/Main GTM Container Setup (Your Website)

On your main website's GTM container, you need to set up a listener that receives the messages from the Showpass iFrame and pushes them to your main `dataLayer`.

### Step B1: Create the "postMessage Listener" Custom HTML Tag

This tag listens for messages from the Showpass iFrame and processes them.

1. In your **Main/Parent GTM container**, go to **Tags** and click **New**
2. **Name the tag:** `Custom HTML - Listen for Showpass iFrame postMessage`
3. **Tag Configuration:**
   - Choose tag type: **Custom HTML**
   - Paste the following script:

```html
<script nonce="{{nonce}}">
  // Assuming you've set up a 'nonce' variable as per Section 5
  (function () {
    try {
      var receiveMessage = function (event) {
        try {
          // Optional: Add origin check for security if Showpass iFrame origin is fixed and known
          // if (event.origin !== "https://widgets.showpass.com") return;

          if (
            event &&
            typeof event.data != "undefined" &&
            Array.isArray(event.data)
          ) {
            for (var i = 0; i < event.data.length; i++) {
              if (event.data[i] && typeof event.data[i].event != "undefined") {
                // Push specific, expected ecommerce events to the parent dataLayer
                // You can expand this list based on what you want to track from the iFrame
                if (
                  event.data[i].event == "view_item" ||
                  event.data[i].event == "add_to_cart" ||
                  event.data[i].event == "remove_from_cart" ||
                  event.data[i].event == "begin_checkout" ||
                  event.data[i].event == "purchase" ||
                  event.data[i].event == "ecommerce_clear"
                ) {
                  // Create a new object to avoid potential reference issues
                  var eventToPush = JSON.parse(JSON.stringify(event.data[i]));
                  dataLayer.push(eventToPush);
                }
              }
            }
          }
        } catch (err) {
          // console.error("Parent GTM postMessage Listener Error (inner): ", err);
        }
      };

      if (typeof window.addEventListener !== "undefined") {
        window.addEventListener("message", receiveMessage, false);
      } else if (typeof window.attachEvent !== "undefined") {
        // For older IE
        window.attachEvent("onmessage", receiveMessage);
      }
    } catch (err) {
      // console.error("Parent GTM postMessage Listener Error (outer): ", err);
    }
  })();
</script>
```

> **Security Note:** In production, you should verify `event.origin` to ensure messages are only accepted from trusted sources (e.g., `https://showpass.com` or your own domain).

4. **Triggering:**
   - Click **Choose a trigger to make this tag fire...**
   - Select **Window loded** trigger
   - This ensures the listener is set up as soon as the page loads
5. Click **Save**

---

### Step B2: Create a trigger for ecommerce events

1. In your GTM container, go to **Triggers** and click **New**
2. **Name your trigger:** A descriptive name like `Custom - Showpass Ecommerce Events` or `Ecommerce Triggers | All Events`
3. **Trigger Configuration:**
   - Click **Choose a trigger type to begin setup...**
   - Select **Custom Event**
   - **Event name:** Enter the following, using a pipe `|` to separate event names:
     ```text
     view_item|add_to_cart|remove_from_cart|begin_checkout|purchase|ecommerce_clear
     ```
     > **Note:** `ecommerce_clear` is a custom event that clears the ecommerce cache in the data layer
   - Check the box for **Use regex matching**. This allows the trigger to fire on any of the listed events
   - **This trigger fires on:** Select **All Custom Events**
4. Click **Save**
5. Update your existing tags to use this trigger.

For tracking specific single events like `add_to_cart` - please see [Tracking Custom Conversions](https://dev.showpass.com/google-tag-manager/06-tracking-custom-conversions-marketing-pixels)

---

### Step B3: Verify Your Main GTM Ecommerce Tags

Ensure that your main GTM ecommerce tags (e.g., GA4 Ecommerce Event tag, marketing pixel tags) are configured to fire on the events pushed to the `dataLayer` by the postMessage listener.

- Your existing triggers for events like `purchase`, `add_to_cart`, etc., should automatically catch these events once they're pushed to the parent's `dataLayer`
- No additional changes are typically needed if your main GTM setup is already configured to listen for these standard ecommerce events

---

### Step B4: Publish Your Main GTM Container

1. In your Main GTM container, click **Submit**
2. Provide a version name (e.g., "Added iFrame postMessage Listener")
3. Click **Publish**

---

## Testing the postMessage Setup

Test your setup using https://tagassistant.google.com/

1. **Enable GTM Preview Mode** on both your Main and Child GTM containers (if possible)
2. **Navigate to a page** on your website that contains the Showpass embedded widget
3. **Perform ecommerce actions** within the widget (e.g., add to cart, purchase)
4. **In the Main GTM Tag Assistant:**
   - Look for your ecommerce events (e.g., `add_to_cart`, `purchase`) appearing in the event timeline
   - Verify that your GA4 Ecommerce Event tag and other marketing tags fire as expected
5. **Check browser console:**
   - Look for any errors related to postMessage
   - You can add `console.log()` statements in your postMessage listener script to debug

---

## Summary

- **Child GTM Container:** Captures ecommerce events within the Showpass iFrame and sends them via `postMessage` to the parent page
- **Parent GTM Container:** Listens for `postMessage` events and pushes them to the main `dataLayer`, triggering standard ecommerce tags
- **Benefits:** More accurate tracking, bypasses third-party cookie restrictions, privacy-focused approach
- Always test thoroughly and verify `event.origin` in production for security
