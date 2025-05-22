# 9. Advanced: Differentiating Widget (iFrame) vs. Direct showpass.com Event Tracking

In some advanced scenarios, you might want to differentiate GTM tag firing behavior based on whether an event originates from within the embedded Showpass widget (iFrame on your site) or from a direct interaction on `showpass.com` (if your GTM container is also deployed there, or if Showpass sends server-side events that populate your website's GTM).

This allows for more granular control, such as:
*   Applying different attributions.
*   Sending slightly different data to certain marketing tags.
*   Preventing duplicate firing if events could be captured through both `postMessage` (from the iFrame) and direct Data Layer pushes (on `showpass.com` or via server events).

The key is to create a GTM variable that detects if the current context is an iFrame.

## Step 1: Create an "Is iFrame?" Custom JavaScript Variable

This variable will return `true` if the GTM container is currently operating within an iFrame, and `false` otherwise.

1.  In your **Main/Parent GTM container** (your website's GTM), go to **Variables**.
2.  Under "User-Defined Variables," click **New**.
3.  **Name your variable:** `Custom JS - Is iFrame` (or similar).
4.  **Variable Configuration:**
    *   Choose variable type: **Custom JavaScript**.
    *   Paste the following script:
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
5.  Click **Save**.

## Step 2: Update Your GTM Triggers

Now, use the `{{Custom JS - Is iFrame}}` variable as a condition in your relevant GTM triggers.

### Scenario A: Triggers for `postMessage` Data (from Showpass Widget)

These triggers should *only* fire when the event data originates from the iFrame via `postMessage`.

*   **If your `postMessage` listener tag (from Section 8B) pushes distinct events:** You might not need to modify the triggers for your actual ecommerce tags (like GA4 ecommerce) if those tags are already listening for the specific events pushed by your listener (e.g., `iframe_add_to_cart`).
*   **If your `postMessage` listener tag pushes standard event names (e.g., `add_to_cart`) that could also occur directly on your site or `showpass.com`:**
    You need to ensure the triggers for tags that should *only* process iFrame `postMessage` data have an added condition.

    1.  Edit the relevant trigger (e.g., the one that fires your GA4 ecommerce tag for events received via `postMessage`).
    2.  Under "This trigger fires on," add a condition:
        *   `{{Custom JS - Is iFrame}}` **equals** `true`

    *(This assumes your listener for postMessage events is on the parent page, and the data is pushed to the parent's dataLayer. The 'Is iFrame' variable on the parent page will be `false`. The 'Is iFrame' variable *inside* the child GTM container (if you were to set one up there) would be `true`. The logic here depends on where the final decision to fire a tag is made based on the source of the data.)*

**More common for `postMessage`:** The listener script in Section 8B already processes messages *assumed* to be from an iFrame. The differentiation is more critical for tags that might fire from *either* a `postMessage` (relayed to parent dataLayer) *or* a direct `showpass.com` dataLayer event (if your GTM is also on Showpass pages).

Let's refine: The `{{Custom JS - Is iFrame}}` variable, when evaluated in your **Main/Parent GTM container**, will tell you if *that container instance* is running inside an iFrame. This is not usually the case for your main site's GTM.

The primary use of `{{Custom JS - Is iFrame}}` (when defined in the **Child GTM Container**) would be for logic *within the Child GTM Container itself* before it even posts the message.

However, the original Showpass document implies using this variable in the **Main/Parent GTM container** to adjust triggers for ecommerce tracking: "Update post message triggers to only fire if the iFrame variable is true" and "Set up ecommerce tracking to trigger when there is no iframe detected." This suggests a scenario where your main GTM container might be deployed in both contexts or where events from showpass.com could also reach your main site's dataLayer.

**Revised Approach based on likely intent of the source document (for Main/Parent GTM):**

If you have distinct triggers for events coming via `postMessage` versus events occurring directly on `showpass.com` (and your GTM covers both):

*   **Triggers for events processed by your `postMessage` listener (Section 8B):**
    *   These events are pushed to your parent page's `dataLayer`. The `{{Custom JS - Is iFrame}}` variable (when run on the parent page) will be `false`. So, this variable isn't directly used to enable these triggers. The listener *itself* is the filter.
*   **Triggers for standard ecommerce events (e.g., GA4, as in Section 3) that should capture direct `showpass.com` interactions (if your GTM is also there):**
    1.  Edit your standard ecommerce trigger (e.g., `Custom - Showpass Ecommerce Events`).
    2.  Add a condition:
        *   `{{Custom JS - Is iFrame}}` **equals** `false`
        *   This ensures these tags *don't* fire if the GTM instance is somehow running in an iFrame context (less likely for your main tags unless your whole site can be iframed).

**The clearer differentiation using the `{{Custom JS - Is iFrame}}` variable is more likely intended for the GTM container that might be deployed by Showpass directly on `showpass.com` pages if that container is also *your* main GTM ID.**

If Showpass deploys **your main GTM ID** on `showpass.com` pages (not within an iFrame, but directly on their domain), then:

1.  Your **standard ecommerce triggers** (from Section 3, listening to `view_item`, `add_to_cart`, etc.) would need a condition:
    *   `{{Custom JS - Is iFrame}}` **equals** `false` (to capture direct `showpass.com` interactions).

2.  Your **`postMessage` listener tag** (Section 8B) fires on all pages of your site to capture widget events. The events it pushes to `dataLayer` would then fire your standard ecommerce tags. These standard ecommerce tags, if they also have the `{{Custom JS - Is iFrame}} equals false` condition, would correctly fire on your site (as your site is not an iFrame).

This prevents your standard ecommerce tags from trying to double-process events if an event somehow gets captured by both the `postMessage` route and a direct Showpass.com page view within the same GTM container.

### Example Trigger Setup (Conceptual for Main GTM Container)

*   **Trigger 1: `Custom - Showpass Ecommerce Events - Direct`**
    *   Event Name Regex: `view_item|add_to_cart|...|purchase`
    *   Condition: `{{Custom JS - Is iFrame}}` **equals** `false`
    *   *Use this for tags that should only track direct interactions on showpass.com (if your GTM is also on those pages).*

*   **Trigger 2: From `postMessage` Listener (No explicit "Is iFrame" check needed here)**
    *   Your `Custom HTML - Listener - Receive Showpass iFrame postMessage` tag (from Section 8B) pushes events like `add_to_cart`, `purchase` to the `dataLayer`.
    *   Your existing ecommerce tags (e.g., `GA4 - Ecommerce Event Tracking` using a trigger like `Custom - Showpass Ecommerce Events` from Section 3, *without* an iFrame check) will pick these up when triggered on your parent website. Your parent website itself is not an iFrame, so the `{{Custom JS - Is iFrame}}` would be false if you were to check it there.

The critical part is ensuring your `postMessage` listener pushes clean events to the `dataLayer`, and your ecommerce tags are set up to listen to those events. The "Is iFrame" variable is more for controlling tags that might run *directly on showpass.com itself* if your GTM container is also loaded there outside of the widget context.

## Testing

*   Use GTM Preview mode.
*   Test scenarios:
    *   Interacting with the embedded Showpass widget on your website.
    *   Interacting directly on `showpass.com` event pages (if your GTM container is also deployed there by Showpass).
*   Verify in Tag Assistant that the correct tags fire (or are blocked) based on the context (`Is iFrame` true/false) and the trigger conditions you've set.
*   Check that data appears as expected in GA4 and other marketing platforms, without duplication if that was a concern.

This advanced setup requires careful planning of your GTM trigger logic based on how and where your GTM container is deployed in relation to Showpass interactions.