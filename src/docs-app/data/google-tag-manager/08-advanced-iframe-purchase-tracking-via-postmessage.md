# 8. Advanced & preferred: iFrame purchase tracking via `postMessage`

Tracking conversions and user activity accurately within an iFrame (like the Showpass embedded purchase widget) is a significant challenge due to browser privacy measures that increasingly block third-party cookies and tracking mechanisms.

To overcome this, Showpass advocates for a more robust method: **iFrame tracking using the `postMessage` API.** This technique allows secure communication between the Showpass iFrame (child) and your website (parent page), enabling the iFrame to send event data directly to your GTM container on the parent page.

## Why use `postMessage` for iFrame tracking?

- **Accuracy:** Bypasses many issues related to third-party cookie restrictions, leading to more reliable data.
- **Privacy-Focused:** Relies on direct communication rather than cross-domain cookie sharing for event data.
- **Recommended:** Considered a best practice for iFrame tracking in modern web analytics.

### Further reading:

For more context on iFrame tracking challenges and solutions:

- Jellyfish Training - How to Track iFrames with Google Tag Manager: [https://www.jellyfish.com/en-gb/training/blog/how-track-iframes-google-tag-manager](https://www.jellyfish.com/en-gb/training/blog/how-track-iframes-google-tag-manager)
- MeasureSchool - iFrame Tracking with Google Tag Manager: [https://measureschool.com/iframe-tracking/](https://measureschool.com/iframe-tracking/)

## Overview of the `postMessage` setup with Showpass

This setup involves two Google Tag Manager containers:

1.  **Child GTM Container (for the Showpass iFrame):**

    - Create a new **new, empty GTM Container ID**
    - This container is specifically for the Showpass widget environment.
    - Its role is to capture ecommerce events within the iFrame and `postMessage` them to the parent window (your website).
    - Add this to your Organizer Info > Analytics section in the Showpass Dashboard

2.  **Main/Parent GTM Container (on your website):**
    - This is your existing GTM container that manages tracking for your primary website.
    - Its role is to listen for messages from the Showpass iFrame and then push that data into its own `dataLayer` to trigger your standard ecommerce tags (e.g., GA4, marketing pixels).

---

## A. Child GTM container setup (Showpass iFrame GTM)

You (or Showpass, with your input) will configure this GTM container provided by Showpass.

### Step A1: Create the "Post Message to Parent" tag

This tag will send data from the iFrame's Data Layer to your parent website.

1.  In the **Child GTM container**, go to **Tags** and click **New**.
2.  **Name the tag:** `Custom HTML - Post Message Ecommerce Data to Parent`.
3.  **Tag Configuration:**

    - Choose tag type: **Custom HTML**.
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

    - **Crucial:** In the line `var message = window.dataLayer_GTM_CHILD_ID;`, replace `GTM_CHILD_ID` with the actual GTM Container ID of **this Child GTM container** (e.g., if the child GTM ID is `GTM-ABCDEF1`, the line becomes `var message = window.dataLayer_GTM_ABCDEF1;`).

4.  **Triggering:** Assign the trigger created in the next step (Step A2).

### Step A2: Create the "Child Ecommerce Events" trigger

This trigger will fire the `postMessage` tag whenever an ecommerce event occurs within the iFrame.

1.  In the **Child GTM container**, go to **Triggers** and click **New**.
2.  **Name the trigger:** `Custom - Child Ecommerce Events | All Showpass Events`.
3.  **Trigger Configuration:**
    - Choose trigger type: **Custom Event**.
    - **Event name (Regex):**
      ```
      view_item|add_to_cart|remove_from_cart|begin_checkout|purchase|ecommerce_clear
      ```
      - `ecommerce_clear`: this is a custom event that clears the ecommerce cache in the data layer
    - Check the box **Use regex matching**.
    - **This trigger fires on:** All Custom Events.
4.  Click **Save**.
5.  Go back to the tag created in Step A1 and assign this trigger to it. Save the tag.
6.  **Publish the Child GTM Container.**

---

## B. Main/parent GTM container setup (your website GTM)

Now, configure your main website's GTM container to listen for these messages.

### Step B1: Create the "Listen for Showpass iFrame Messages" tag

This tag will listen for messages from the iFrame and push the relevant data into your main website's Data Layer.

1.  In your **Main/Parent GTM container**, go to **Tags** and click **New**.
2.  **Name the tag:** `Custom HTML - Listener - Receive Showpass iFrame postMessage` (or similar).
3.  **Tag Configuration:**

    - Choose tag type: **Custom HTML**.
    - Paste the following script into the HTML field:

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
                    if (
                      event.data[i] &&
                      typeof event.data[i].event != "undefined"
                    ) {
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
                        var eventToPush = JSON.parse(
                          JSON.stringify(event.data[i])
                        );
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

4.  **Triggering:**
    - Click **Choose a trigger to make this tag fire...**
    - Select the **Initialization - All Pages** trigger (or a standard All Pages trigger if Initialization isn't available/preferred for this type of listener). The listener needs to be active on any page where the Showpass widget might appear.
5.  Click **Save**.

### Step B2: Ensure ecommerce tags in main container

- Your **Main/Parent GTM container** should already have your standard ecommerce tags set up (as detailed in **Section 3: Standard Ecommerce Tracking with GA4** and **Section 6: Tracking Custom Conversions**).
- These existing tags will now be triggered by the `dataLayer.push()` calls made by the "Listen for Showpass iFrame Messages" tag when it receives data from the iFrame. No new ecommerce _event_ tags (like GA4 ecommerce) are needed specifically for `postMessage` _if your existing ones are correctly listening to Data Layer events_.

### Step B3: Publish your main/parent GTM container.

## Step C: Testing the `postMessage` integration

1.  Use **GTM Preview mode** for _both_ your Child GTM container and your Main/Parent GTM container simultaneously if possible (using multiple browser profiles or connecting Tag Assistant to each GTM ID).
2.  Navigate to a page on your website where the Showpass widget is embedded.
3.  Perform ecommerce actions within the widget (e.g., view an item, add to cart, purchase).
4.  **In the Child GTM Preview (connected to the iFrame's GTM ID, if testable directly):**
    - Verify that the `Custom HTML - Post Message Ecommerce Data to Parent` tag fires on ecommerce events.
5.  **In the Main/Parent GTM Preview (connected to your website's GTM ID):**
    - Look for `message` events in the timeline or monitor the Data Layer tab after performing actions in the iFrame.
    - Verify that your standard ecommerce tags (e.g., `GA4 - Ecommerce Event Tracking`) are firing based on the data pushed by the `Custom HTML - Listener - Receive Showpass iFrame postMessage` tag.
    - Check data in GA4 Realtime reports.

This `postMessage` setup is more complex but offers the most reliable way to track conversions from the embedded Showpass widget in the face of evolving browser privacy standards.
