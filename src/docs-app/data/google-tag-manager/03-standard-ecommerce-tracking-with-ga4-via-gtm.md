# 3. Standard ecommerce tracking with GA4 via GTM

After setting up the basic GA4 Configuration Tag, the next step is to configure Google Tag Manager (GTM) to capture and send detailed ecommerce events from Showpass to your Google Analytics 4 (GA4) property.

## Purpose

This setup allows you to track user interactions with your products and events, such as viewing items, adding to cart, initiating checkout, and completing purchases. This data is crucial for understanding your sales funnel and customer behavior.

Showpass sends ecommerce data to the Data Layer. This GTM configuration will listen for these Data Layer events and forward them to GA4.

## Step 1: Create an ecommerce events trigger

This trigger will fire your GA4 ecommerce tag whenever one of the specified Showpass ecommerce events occurs.

1.  In your GTM container, go to **Triggers** and click **New**.
2.  **Name your trigger:** A descriptive name like `Custom - Showpass Ecommerce Events` or `Ecommerce Triggers | All Events`.
3.  **Trigger Configuration:**
    - Click **Choose a trigger type to begin setup...**
    - Select **Custom Event**.
    - **Event name:** Enter the following, using a pipe `|` to separate event names:
      ```
      view_item|add_to_cart|remove_from_cart|begin_checkout|purchase
      ```
    - Check the box for **Use regex matching**. This allows the trigger to fire on any of the listed events.
    - **This trigger fires on:** Select **All Custom Events**.
4.  Click **Save**.

## Step 2: Create the GA4 ecommerce event tag

This tag will send the ecommerce data to GA4.

1.  In your GTM container, go to **Tags** and click **New**.
2.  **Name your tag:** A descriptive name like `GA4 - Ecommerce Event Tracking` or `Ecommerce Tracking`.
3.  **Tag Configuration:**
    - Click **Choose a tag type to begin setup...**
    - Select **Google Analytics: GA4 Event**.
    - **Measurement ID:** Enter your **GA4 Measurement ID** (e.g., `G-XXXXXXXXXX`). This should be the same ID used in your GA4 Configuration Tag.
      - _Tip: You can create a Constant Variable in GTM for your Measurement ID to reuse it easily and avoid typos. For example, create a variable named `{{GA4 Measurement ID}}` and use that here._
    - **Event Name:** Click the variable icon (the lego block with a plus) next to the field and select **`{{Event}}`**. This is a built-in GTM variable that automatically captures the name of the event from the Data Layer (e.g., `view_item`, `add_to_cart`).
    - Click on **More Settings**.
    - Under the **Ecommerce** section:
      - Check the box **Send Ecommerce data**.
      - **Data source:** Ensure it is set to **Data Layer**.
4.  **Triggering:**
    - Click **Choose a trigger to make this tag fire...**
    - Select the trigger you created in Step 1 (e.g., `Custom - Showpass Ecommerce Events`).
5.  Click **Save**.

## Step 3: Publish your GTM container

1.  In GTM, click the **Submit** button in the top right corner.
2.  Enter a **Version Name** (e.g., "Added GA4 Ecommerce Tracking") and an optional **Version Description**.
3.  Click **Publish**.

## Step 4: Test your ecommerce tracking

It's crucial to test your setup to ensure data is flowing correctly.

1.  **Enable GTM Preview Mode:** In your GTM container, click **Preview** in the top right.
    - Enter the URL of a page where Showpass events occur (e.g., an event page on Showpass.com if your GTM is live there, or a page on your website with an embedded Showpass widget).
    - Click **Connect**. A new browser window or tab will open with your page, and the Tag Assistant debug panel will connect at the bottom or in a separate window.
2.  **Perform Ecommerce Actions:** On your website or Showpass page:
    - View an event/product (`view_item`).
    - Add an item to the cart (`add_to_cart`).
    - Initiate checkout (`begin_checkout`).
    - Complete a test purchase (`purchase`).
3.  **Observe Tag Assistant:**
    - In the Tag Assistant debug panel, look for your custom event names (e.g., `add_to_cart`) appearing in the event timeline on the left.
    - When you click on one of these events, check the **Tags** tab. Your `GA4 - Ecommerce Event Tracking` tag should show as "Fired."
    - Click on the tag to see more details. Check the "Data Layer" tab in Tag Assistant to see the ecommerce information Showpass is pushing.
4.  **Check GA4 Realtime Reports:**
    - In your GA4 property, navigate to **Reports > Realtime**.
    - Look for event counts corresponding to your actions (e.g., `add_to_cart`, `purchase`). Ecommerce parameters may take a little longer to populate fully in detailed reports but events should appear.

This setup provides robust ecommerce tracking within GA4. The next sections will cover more advanced scenarios like cross-domain tracking and integrating other marketing tags.
