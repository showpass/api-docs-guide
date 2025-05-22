# 6. Tracking custom conversions (e.g., marketing pixels)

Google Tag Manager (GTM) allows you to implement various third-party tracking tags (often called "pixels") for services like TikTok, Twitter, Facebook, Google Ads, and others. This section explains the general process of setting up these tags to fire on specific Showpass ecommerce events, using the data Showpass provides to the Data Layer.

## General workflow

The process for setting up most conversion or event tracking pixels involves these main steps in GTM:

1.  **Creating GTM Variables:** To capture dynamic data (like value, currency, item details) sent by Showpass for ecommerce events.
2.  **Creating GTM Triggers:** To specify _when_ your marketing tag should fire (e.g., on an `add_to_cart` event or a `purchase` event).
3.  **Creating GTM Tags:** To configure your specific marketing pixel with the necessary IDs and map the GTM variables to the fields required by the pixel.

## Example: Setting up `add_to_cart` event tracking for a generic pixel

Let's walk through setting up tracking for the `add_to_cart` event. Showpass sends `ecommerce.currency`, `ecommerce.value`, and `ecommerce.items` parameters for this event (see the Showpass Event List table at the end of this section).

### Step 1: Creating Data Layer variables in GTM

You need to create GTM variables to read the values that Showpass pushes to the Data Layer for the `add_to_cart` event.

1.  In your GTM container, go to the **Variables** tab.
2.  Under "User-Defined Variables," click **New** for each variable you need.

    - **Variable 1: Currency**

      - **Name:** `DLV - ecommerce.currency` (or a similar descriptive name)
      - **Variable Type:** **Data Layer Variable**
      - **Data Layer Variable Name:** `ecommerce.currency` (This must exactly match the key Showpass uses in the Data Layer)
      - Leave "Data Layer Version" as Version 2.
      - Click **Save**.

    - **Variable 2: Value**

      - **Name:** `DLV - ecommerce.value`
      - **Variable Type:** **Data Layer Variable**
      - **Data Layer Variable Name:** `ecommerce.value`
      - Click **Save**.

    - **Variable 3: Items**
      - **Name:** `DLV - ecommerce.items`
      - **Variable Type:** **Data Layer Variable**
      - **Data Layer Variable Name:** `ecommerce.items`
      - Click **Save**.

    _Repeat this process for any other parameters you need for different events (e.g., `ecommerce.transaction_id` for purchases)._

### Step 2: Creating a trigger for the `add_to_cart` event

This trigger will tell GTM to fire your tag when Showpass signals an `add_to_cart` event.

1.  In GTM, go to the **Triggers** tab and click **New**.
2.  **Name your trigger:** `Custom Event - add_to_cart` (or similar).
3.  **Trigger Configuration:**
    - Click **Choose a trigger type to begin setup...**
    - Select **Custom Event**.
    - **Event Name:** `add_to_cart` (This must exactly match the event name Showpass sends).
    - **This trigger fires on:** Select **All Custom Events** (or you can specify conditions if needed, but usually "All" is fine for an exact match event name).
4.  Click **Save**.

### Step 3: Creating the marketing tag

This is where you configure the actual pixel from your marketing platform (e.g., TikTok, Facebook, etc.). The specifics will vary greatly depending on the platform. Most platforms provide a base code snippet and instructions for tracking standard events.

1.  In GTM, go to the **Tags** tab and click **New**.
2.  **Name your tag:** `TikTok Pixel - Add to Cart Event` (or similar, specific to the platform).
3.  **Tag Configuration:**
    - Click **Choose a tag type to begin setup...**
    - **If a built-in GTM template exists** for your platform (e.g., "Facebook Pixel," "Google Ads Conversion Tracking"), select it.
    - **If not, choose "Custom HTML."** You'll paste the code snippet provided by your marketing platform here.
4.  **Configure the Tag:**
    - **For built-in templates:** Fill in the required fields (e.g., Pixel ID, Event Type). You will often map the GTM variables you created in Step 1 to the event parameters in the tag configuration. For an "Add to Cart" event, you might map:
      - `value` -> `{{DLV - ecommerce.value}}`
      - `currency` -> `{{DLV - ecommerce.currency}}`
      - `content_ids` or `items` -> `{{DLV - ecommerce.items}}` (The pixel may require specific formatting for item data).
    - **For Custom HTML tags:** Modify the JavaScript snippet provided by the marketing platform. Where the snippet expects dynamic values (like `value`, `currency`), you'll insert your GTM Data Layer Variables (e.g., `{{DLV - ecommerce.value}}`).
      - Remember to add `nonce="{{nonce}}"` to any `<script>` tags within your Custom HTML (See Section 5).
5.  **Triggering:**
    - Click **Choose a trigger to make this tag fire...**
    - Select the trigger you created in Step 2 (e.g., `Custom Event - add_to_cart`).
6.  Click **Save**.

### Final steps

1.  **Publish your GTM container.**
2.  **Test thoroughly** using GTM Preview mode and the debugging tools provided by your marketing platform to ensure the tag fires correctly and the dynamic data is passed as expected.

## Showpass event list & Data Layer parameters

Showpass sends the following events and parameters to the Data Layer, which you can use to create variables and triggers in GTM.

| Event Name         | Parameters Sent to Data Layer (prefixed with `ecommerce.` where applicable)                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `view_page`        | (No specific ecommerce parameters, general page context)                                                                                                            |
| `view_item`        | `ecommerce.currency`<br>`ecommerce.value`<br>`ecommerce.items`                                                                                                      |
| `add_to_cart`      | `ecommerce.currency`<br>`ecommerce.value`<br>`ecommerce.items`                                                                                                      |
| `remove_from_cart` | `event_category` (and potentially item details, verify in Data Layer)                                                                                               |
| `begin_checkout`   | `ecommerce.currency`<br>`ecommerce.value`<br>`ecommerce.coupon`<br>`ecommerce.items`                                                                                |
| `purchase`         | `ecommerce.transaction_id`<br>`ecommerce.affiliation`<br>`ecommerce.currency`<br>`ecommerce.tax`<br>`ecommerce.shipping`<br>`ecommerce.coupon`<br>`ecommerce.items` |

_Always verify the exact Data Layer structure and parameter names using GTM's Preview mode when an event occurs, as slight variations or additional parameters might be present._
