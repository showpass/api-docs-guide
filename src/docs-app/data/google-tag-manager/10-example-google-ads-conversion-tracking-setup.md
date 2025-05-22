# 10. Example: Google Ads conversion tracking setup with GTM

This section provides a step-by-step example of how to set up Google Ads conversion tracking and remarketing using Google Tag Manager (GTM) for Showpass events. This assumes you have already configured GTM to receive ecommerce data from Showpass (as outlined in previous sections, especially Section 3 and Section 6).

## Prerequisites

- A Google Ads account.
- Conversion actions set up in your Google Ads account (you'll need Conversion ID and Conversion Label).
- Your GTM container is correctly receiving ecommerce data from Showpass (e.g., `purchase` events with `value`, `transaction_id`, `currency`, `items`).

## Step 1: Create necessary Data Layer variables (if not already done)

Ensure you have GTM variables to capture the required data for Google Ads conversion tracking. Refer to **Section 6, Step 1** for detailed instructions on creating Data Layer Variables. You will typically need:

- **`DLV - ecommerce.value`**:
  - Data Layer Variable Name: `ecommerce.value`
- **`DLV - ecommerce.transaction_id`**:
  - Data Layer Variable Name: `ecommerce.transaction_id`
- **`DLV - ecommerce.currency`**:
  - Data Layer Variable Name: `ecommerce.currency`
- **`DLV - ecommerce.items`**:
  - Data Layer Variable Name: `ecommerce.items` (for product-level sales data)

_(Use your chosen GTM variable names, e.g., `{{DLV - ecommerce.value}}`)_

## Step 2: Add the conversion linker tag

The Conversion Linker tag is essential for ensuring accurate conversion measurement by setting first-party cookies.

1.  In your GTM container, go to **Tags** and click **New**.
2.  **Name the tag:** `Google Ads - Conversion Linker`.
3.  **Tag Configuration:**
    - Click **Choose a tag type to begin setup...**
    - Select **Conversion Linker**.
    - **Linking across domains:**
      - Check the box for **Enable linking across domains**.
      - In the "Domains to Link" field, add your website domain and `showpass.com`. For example: `yourdomain.com, showpass.com`.
4.  **Triggering:**
    - Click **Choose a trigger to make this tag fire...**
    - Select the **Initialization - All Pages** trigger (or a standard "All Pages" trigger).
5.  Click **Save**.

## Step 3: Add the Google Ads remarketing tag (optional but recommended)

This tag builds remarketing lists by tagging users who visit your site or interact with Showpass events.

1.  In GTM, go to **Tags** and click **New**.
2.  **Name the tag:** `Google Ads - Remarketing - All Pages`.
3.  **Tag Configuration:**
    - Click **Choose a tag type to begin setup...**
    - Select **Google Ads Remarketing**.
    - **Conversion ID:** Enter your Google Ads Conversion ID (this is the `AW-XXXXXXXXX` part, sometimes referred to as AW Tag ID).
    - _(Leave other fields like Conversion Label, Value, etc., blank for a basic remarketing tag that fires on all pages. Dynamic remarketing would require more setup.)_
4.  **Triggering:**
    - Click **Choose a trigger to make this tag fire...**
    - Select the **Initialization - All Pages** trigger (or a standard "All Pages" trigger).
5.  Click **Save**.

## Step 4: Add the Google Ads conversion tracking tag (for purchases)

This tag tracks actual purchases as conversions in Google Ads.

1.  In GTM, go to **Tags** and click **New**.
2.  **Name the tag:** `Google Ads - Conversion Tracking - Purchase`.
3.  **Tag Configuration:**
    - Click **Choose a tag type to begin setup...**
    - Select **Google Ads Conversion Tracking**.
    - **Conversion ID:** Enter your Google Ads Conversion ID (e.g., `AW-XXXXXXXXX`).
    - **Conversion Label:** Enter the specific Conversion Label for your purchase conversion action from Google Ads.
    - **Conversion Value:** Click the variable icon `+` and select your GTM variable for the transaction value (e.g., `{{DLV - ecommerce.value}}`).
    - **Transaction ID:** Click `+` and select your GTM variable for the transaction ID (e.g., `{{DLV - ecommerce.transaction_id}}`).
    - **Currency Code:** Click `+` and select your GTM variable for the currency (e.g., `{{DLV - ecommerce.currency}}`).
    - **Provide product-level sales data:**
      - Check this box if you want to send item details with the conversion.
      - **Data source:** Select **Data Layer**.
      - _(Ensure your `ecommerce.items` data is in a format Google Ads expects or use GTM's capabilities to reformat it if necessary.)_
4.  **Triggering:**
    - Click **Choose a trigger to make this tag fire...**
    - Click **New Trigger** (top right).
      - **Name the trigger:** `Custom Event - Purchase`.
      - **Trigger Configuration:** Choose **Custom Event**.
      - **Event Name:** `purchase` (This must exactly match the event name Showpass sends for a completed transaction).
      - Leave "Use regex matching" unchecked if it's an exact match.
      - **This trigger fires on:** All Custom Events.
      - Save the trigger.
    - Assign this newly created `Custom Event - Purchase` trigger to your Google Ads Conversion Tracking tag.
5.  Click **Save** for the tag.

**Note on GA4 and Google Ads:**
If you have already set up comprehensive GA4 ecommerce tracking (as per Section 3) and linked your GA4 property to your Google Ads account, GA4 ecommerce conversions can often be imported directly into Google Ads. This GTM setup for Google Ads provides direct conversion tracking, which can be beneficial for faster reporting or specific Google Ads features. You may choose one or both methods depending on your needs.

## Step 5: Publish and verify

1.  **Publish Your GTM Container:**
    - In GTM, click **Submit**.
    - Enter a version name (e.g., "Added Google Ads Tracking") and click **Publish**.
2.  **Verify Your Tags:**
    - Use **Google Tag Assistant** ([https://tagassistant.google.com/](https://tagassistant.google.com/)) by entering the URL of an event page on Showpass.com or a page on your site with the widget.
    - **Remarketing Tag:**
      - Perform actions like viewing an item, adding to cart, initiating checkout.
      - In Tag Assistant, you should see your `Google Ads - Remarketing - All Pages` tag firing on these pages/events.
    - **Conversion Tracking Tag (Purchase):**
      - Complete a test purchase.
      - In Tag Assistant, on the purchase confirmation step/event:
        - You should see your `Google Ads - Conversion Tracking - Purchase` tag fire.
        - Click on the fired tag. In the details, switch "Display variables as" to **Values** (usually in the top right of the tag details panel).
        - Confirm that your `Conversion Value`, `Transaction ID`, and `Currency Code` are being populated correctly with the dynamic data from the Data Layer.
          _(Image Placeholder: Screenshot of GTM Tag Assistant showing Google Ads tag firing with correct variable values.)_
    - Check Google Ads: After a few hours (sometimes up to 24), check your Google Ads account to see if conversions are being recorded.

This setup will enable you to track Showpass purchases as conversions in Google Ads and build remarketing audiences based on user interactions.
