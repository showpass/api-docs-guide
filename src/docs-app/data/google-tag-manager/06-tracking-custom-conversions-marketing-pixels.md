# Tracking Custom Conversions (Marketing Pixels)

Google Tag Manager (GTM) allows you to implement various third-party tracking tags (often called "pixels") for services like TikTok, Twitter, Facebook, Google Ads, and others. This section explains the general process of setting up these tags to fire on specific Showpass ecommerce events, using the data Showpass provides to the Data Layer.

## General Workflow

The process for setting up most conversion or event tracking pixels involves these main steps in GTM:

1. **Creating GTM Variables:** To capture dynamic data (like value, currency, item details) sent by Showpass for ecommerce events
2. **Creating GTM Triggers:** To specify **when** your marketing tag should fire (e.g., on an `add_to_cart` event or a `purchase` event)
3. **Creating GTM Tags:** To configure your specific marketing pixel with the necessary IDs and map the GTM variables to the fields required by the pixel

---

## Example: Setting Up add_to_cart Event Tracking

Let's walk through setting up tracking for the `add_to_cart` event. Showpass sends `ecommerce.currency`, `ecommerce.value`, and `ecommerce.items` parameters for this event (see the Showpass Event List table at the end of this section).

### Step 1: Creating Data Layer Variables in GTM

You need to create GTM variables to read the values that Showpass pushes to the Data Layer for the `add_to_cart` event.

1. In your GTM container, go to the **Variables** tab
2. Under "User-Defined Variables," click **New** for each variable you need

**Variable 1: Currency**

- **Name:** `DLV - ecommerce.currency` (or a similar descriptive name)
- **Variable Type:** **Data Layer Variable**
- **Data Layer Variable Name:** `ecommerce.currency` (This must exactly match the key Showpass uses in the Data Layer)
- Leave "Data Layer Version" as Version 2
- Click **Save**

**Variable 2: Value**

- **Name:** `DLV - ecommerce.value`
- **Variable Type:** **Data Layer Variable**
- **Data Layer Variable Name:** `ecommerce.value`
- Click **Save**

**Variable 3: Items**

- **Name:** `DLV - ecommerce.items`
- **Variable Type:** **Data Layer Variable**
- **Data Layer Variable Name:** `ecommerce.items`
- Click **Save**

> **Note:** Repeat this process for any other parameters you need for different events (e.g., `ecommerce.transaction_id` for purchases).

---

### Step 2: Creating a Trigger for the add_to_cart Event

This trigger will tell GTM to fire your tag when Showpass signals an `add_to_cart` event.

1. In GTM, go to the **Triggers** tab and click **New**
2. **Name your trigger:** `Custom Event - add_to_cart` (or similar)
3. **Trigger Configuration:**
   - Click **Choose a trigger type to begin setup...**
   - Select **Custom Event**
   - **Event Name:** `add_to_cart` (This must exactly match the event name Showpass sends)
   - **This trigger fires on:** Select **All Custom Events** (or you can specify conditions if needed, but usually "All" is fine for an exact match event name)
4. Click **Save**

---

### Step 3: Creating the Marketing Tag

This is where you configure the actual pixel from your marketing platform (e.g., TikTok, Facebook, etc.). The specifics will vary greatly depending on the platform. Most platforms provide a base code snippet and instructions for tracking standard events.

1. In GTM, go to the **Tags** tab and click **New**
2. **Name your tag:** `TikTok Pixel - Add to Cart Event` (or similar, specific to the platform)
3. **Tag Configuration:**
   - Click **Choose a tag type to begin setup...**
   - **If a built-in GTM template exists** for your platform (e.g., "Facebook Pixel," "Google Ads Conversion Tracking"), select it
   - **If not, choose "Custom HTML."** You'll paste the code snippet provided by your marketing platform here
4. **Configure the Tag:**
   - **For built-in templates:** Fill in the required fields (e.g., Pixel ID, Event Type). You will often map the GTM variables you created in Step 1 to the event parameters in the tag configuration. For an "Add to Cart" event, you might map:
     - `value` → `{{DLV - ecommerce.value}}`
     - `currency` → `{{DLV - ecommerce.currency}}`
     - `contents` or `items` → `{{DLV - ecommerce.items}}`
     - `transaction_id` → `{{DLV - ecommerce.transaction_id}}`
   - **For Custom HTML:** Paste the base pixel code and modify it to include the GTM variables dynamically

**Example Custom HTML for a Generic Pixel:**

```html
<script nonce="{{nonce}}">
  // Base pixel initialization code (provided by your platform)
  // ...

  // Fire the add_to_cart event with dynamic data
  pixelTrack("AddToCart", {
    value: {{DLV - ecommerce.value}},
    currency: "{{DLV - ecommerce.currency}}",
    content_ids: {{DLV - ecommerce.items}}, // Adjust based on pixel requirements
  });
</script>
```

5. **Triggering:**
   - Click **Choose a trigger to make this tag fire...**
   - Select the trigger you created in Step 2 (e.g., `Custom Event - add_to_cart`)
6. Click **Save**

---

### Step 4: Publish and Test

1. **Publish your GTM container:**
   - Click **Submit** in GTM
   - Provide a version name (e.g., "Added TikTok Add to Cart Pixel")
   - Click **Publish**
2. **Test in Preview Mode:**
   - Enable GTM Preview mode
   - Navigate to a page with Showpass functionality
   - Perform an "add to cart" action
   - Verify in Tag Assistant that your custom marketing tag fired
   - Check the pixel's platform (e.g., TikTok Events Manager, Facebook Events Manager) to confirm the event was received

---

## Showpass Event Reference

Below is a reference table of common Showpass ecommerce events and the parameters they send to the Data Layer. Use this as a guide for setting up variables and triggers.

| Event Name           | Description                             | Key Parameters Sent                                                                    |
| -------------------- | --------------------------------------- | -------------------------------------------------------------------------------------- |
| **view_item**        | User views an event/product detail page | `ecommerce.currency`, `ecommerce.value`, `ecommerce.items`                             |
| **add_to_cart**      | User adds an item to the cart           | `ecommerce.currency`, `ecommerce.value`, `ecommerce.items`                             |
| **remove_from_cart** | User removes an item from the cart      | `ecommerce.currency`, `ecommerce.value`, `ecommerce.items`                             |
| **begin_checkout**   | User initiates the checkout process     | `ecommerce.currency`, `ecommerce.value`, `ecommerce.items`                             |
| **purchase**         | User completes a purchase               | `ecommerce.currency`, `ecommerce.value`, `ecommerce.transaction_id`, `ecommerce.items` |

> **Note:** For detailed information about the structure of these parameters, refer to **Section 7: Showpass Data Layer Details**.

---

## Summary

- Create Data Layer Variables in GTM to capture Showpass ecommerce data
- Create Custom Event Triggers for specific Showpass events
- Configure marketing pixel tags and map GTM variables to pixel parameters
- Always test thoroughly using GTM Preview mode and the platform's event verification tools
