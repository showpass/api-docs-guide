# Initial Setup: GA4 and GTM Basics

This section guides you through the foundational steps of setting up a Google Tag Manager (GTM) container and a Google Analytics 4 (GA4) property, then linking them for basic page view tracking. This is the first step before implementing more advanced ecommerce tracking.

## Prerequisites

- You have a Google account.
- You have access to [Google Tag Manager](https://tagmanager.google.com/) and [Google Analytics](https://analytics.google.com/).

## Step 1: Create a New GTM Container (If you don't have one)

1.  Go to [Google Tag Manager](https://tagmanager.google.com/).
2.  Click **Create Account**.
    - **Account Name:** Enter a name for your account (e.g., your company name).
    - **Country:** Select your country.
3.  Under **Container Setup**:
    - **Container name:** Enter a descriptive name (e.g., `YourWebsite.com - Showpass`).
    - **Target platform:** Select **Web**.
4.  Click **Create**.
5.  Agree to the GTM Terms of Service.
6.  You will be presented with GTM installation code snippets. You won't need to install these directly on your Showpass pages, as Showpass will use your GTM Container ID. Make a note of your **GTM Container ID** (e.g., `GTM-XXXXXXX`).

## Step 2: Create a New GA4 Property (If you don't have one)

1.  Go to [Google Analytics](https://analytics.google.com/).
2.  If you have an existing account, select it. If not, create a new Google Analytics account.
3.  Navigate to the **Admin** section (usually a gear icon in the bottom left).
4.  In the "Property" column, click **Create Property**.
5.  Enter a **Property name** (e.g., `YourWebsite GA4`).
6.  Set your **Reporting time zone** and **Currency**.
7.  Click **Next**. Provide your business information (optional).
8.  Click **Create**.
9.  For "Choose a platform," select **Web**.
10. Set up your **data stream**:
    - **Website URL:** Enter your main website URL (even if you're primarily tracking Showpass).
    - **Stream name:** Give it a name (e.g., `Main Website Stream`).
11. Click **Create stream**.
12. A "Web stream details" page will appear. Make a note of your **MEASUREMENT ID** (e.g., `G-XXXXXXXXXX`). This is your GA4 Property ID.

## Step 3: Create the GA4 Configuration Tag in GTM

This tag will send basic page view data and initialize GA4 on pages where GTM is loaded.

1.  In your GTM container, go to **Tags** and click **New**.
2.  **Name your tag:** A descriptive name like `GA4 - Configuration - All Pages` or `Initialization`.
3.  **Tag Configuration:**
    - Click **Choose a tag type to begin setup...**
    - Select **Google Tag**.
    - **Tag ID:** Enter your **GA4 Measurement ID** (e.g., `G-XXXXXXXXXX`) obtained in Step 2.
    - No further configuration is needed in "Configuration Settings" or "Shared Event Settings" for basic setup.
4.  **Triggering:**
    - Click **Choose a trigger to make this tag fire...**
    - Select the **Initialization - All Pages** trigger. This trigger ensures the Google Tag fires before other tags and on every page.
5.  Click **Save**.

## Step 4: Add Your GTM Container ID to Showpass

- As mentioned in the Introduction, this step is currently in BETA and requires Showpass assistance.
- You will need to provide your **GTM Container ID** (e.g., `GTM-XXXXXXX` from Step 1) to your Showpass account manager or support contact.
- They will add this ID to your organization's settings in the Showpass platform. This enables Showpass to load your GTM container on its pages and widgets.

## Step 5: Publish Your GTM Container

1.  In GTM, click the **Submit** button in the top right corner.
2.  Enter a **Version Name** (e.g., "Initial GA4 Setup") and an optional **Version Description**.
3.  Click **Publish**.

Once these steps are completed, your GTM container will be linked to your Showpass setup, and the GA4 Configuration tag will start sending page view data to your GA4 property from pages where the GTM container is loaded by Showpass.

Next, you will set up specific ecommerce tracking.
