# 10. Example: Google Ads Conversion Tracking Setup with GTM


This section provides a step-by-step example of how to set up Google Ads conversion tracking and remarketing using Google Tag Manager (GTM) for Showpass events. This assumes you have already configured GTM to receive ecommerce data from Showpass (as outlined in previous sections, especially Section 3 and Section 6).

## Prerequisites

- A Google Ads account
- Conversion actions set up in your Google Ads account (you'll need Conversion ID and Conversion Label)
- Your GTM container is correctly receiving ecommerce data from Showpass (e.g., `purchase` events with `value`, `transaction_id`, `currency`, `items`)

---

## Step 1: Create Necessary Data Layer Variables (If Not Already Done)

Ensure you have GTM variables to capture the required data for Google Ads conversion tracking. Refer to **Section 6, Step 1** for detailed instructions on creating Data Layer Variables. You will typically need:

- **DLV - ecommerce.value**
  - Data Layer Variable Name: `ecommerce.value`
- **DLV - ecommerce.transaction_id**
  - Data Layer Variable Name: `ecommerce.transaction_id`
- **DLV - ecommerce.currency**
  - Data Layer Variable Name: `ecommerce.currency`
- **DLV - ecommerce.items**
  - Data Layer Variable Name: `ecommerce.items` (for product-level sales data)

---

## Step 2: Add the Conversion Linker Tag

The Conversion Linker tag is essential for ensuring accurate conversion measurement by setting first-party cookies.

1. In your GTM container, go to **Tags** and click **New**
2. **Name the tag:** `Google Ads - Conversion Linker`
3. **Tag Configuration:**
   - Click **Choose a tag type to begin setup...**
   - Select **Conversion Linker**
   - **Linking across domains:**
     - Check the box for **Enable linking across domains**
     - In the "Domains to Link" field, add your website domain and `showpass.com`. For example: `yourdomain.com, showpass.com`
4. **Triggering:**
   - Click **Choose a trigger to make this tag fire...**
   - Select the **Initialization - All Pages** trigger (or a standard "All Pages" trigger)
5. Click **Save**

---

## Step 3: Add the Google Ads Remarketing Tag (Optional but Recommended)

This tag builds remarketing lists by tagging users who visit your site or interact with Showpass events.

1. In GTM, go to **Tags** and click **New**
2. **Name the tag:** `Google Ads - Remarketing - All Pages`
3. **Tag Configuration:**
   - Click **Choose a tag type to begin setup...**
   - Select **Google Ads Remarketing**
   - **Conversion ID:** Enter your Google Ads Conversion ID (this is the `AW-XXXXXXXXX` part, sometimes referred to as AW Tag ID)
   - Leave other fields like Conversion Label, Value, etc., blank for a basic remarketing tag that fires on all pages
4. **Triggering:**
   - Click **Choose a trigger to make this tag fire...**
   - Select the **Initialization - All Pages** trigger (or a standard "All Pages" trigger)
5. Click **Save**

---

## Step 4: Add the Google Ads Conversion Tracking Tag (For Purchases)

This tag tracks actual purchases as conversions in Google Ads.

1. In GTM, go to **Tags** and click **New**
2. **Name the tag:** `Google Ads - Conversion Tracking - Purchase`
3. **Tag Configuration:**
   - Click **Choose a tag type to begin setup...**
   - Select **Google Ads Conversion Tracking**
   - **Conversion ID:** Enter your Google Ads Conversion ID (e.g., `AW-XXXXXXXXX`)
   - **Conversion Label:** Enter the specific Conversion Label for your purchase conversion action from Google Ads
   - **Conversion Value:** Click the variable icon `+` and select your GTM variable for the transaction value (e.g., `{{DLV - ecommerce.value}}`)
   - **Transaction ID:** Click `+` and select your GTM variable for the transaction ID (e.g., `{{DLV - ecommerce.transaction_id}}`)
   - **Currency Code:** Click `+` and select your GTM variable for the currency (e.g., `{{DLV - ecommerce.currency}}`)
   - **Provide product-level sales data:**
     - Check this box if you want to send item details with the conversion
     - Click `+` next to the **Items** field and select `{{DLV - ecommerce.items}}`
4. **Triggering:**
   - Click **Choose a trigger to make this tag fire...**
   - Create or select a **Custom Event** trigger for the `purchase` event:
     - **Trigger Type:** Custom Event
     - **Event name:** `purchase`
     - **This trigger fires on:** All Custom Events
5. Click **Save**

---

## Step 5: Publish Your GTM Container

1. In GTM, click **Submit**
2. Enter a **Version Name** (e.g., "Added Google Ads Conversion Tracking")
3. Click **Publish**

---

## Step 6: Test Your Setup

1. **Enable GTM Preview Mode** in your GTM container
2. Navigate to a page where you can complete a test purchase through Showpass
3. Complete a test transaction
4. **Verify in Tag Assistant:**
   - Look for the `purchase` event in the timeline
   - Confirm that your **Google Ads - Conversion Tracking - Purchase** tag fired
   - Check that the correct values (conversion value, transaction ID, currency) were passed
5. **Verify in Google Ads:**
   - Log in to your Google Ads account
   - Navigate to **Tools & Settings > Measurement > Conversions**
   - Find your conversion action
   - It may take a few hours for test conversions to appear, but you should see them under "Recent conversions"

---

## Additional Tracking: Add to Cart or Other Events

You can set up additional conversion actions in Google Ads for other events like `add_to_cart` or `begin_checkout` using the same process:

1. Create a new conversion action in Google Ads for the specific event
2. Note the Conversion ID and Label
3. In GTM, create a new **Google Ads Conversion Tracking** tag
4. Configure it similar to the purchase tag, but with the appropriate Conversion Label
5. Set the trigger to fire on the specific event (e.g., `add_to_cart`)

---

## Summary

- **Conversion Linker Tag:** Essential for accurate conversion tracking across domains
- **Remarketing Tag:** Builds audience lists for retargeting campaigns
- **Conversion Tracking Tag:** Tracks specific conversion actions (e.g., purchases) with dynamic values from the Data Layer
- Always map GTM variables to the conversion tag fields for dynamic data
- Test thoroughly using GTM Preview mode and verify conversions in your Google Ads account
