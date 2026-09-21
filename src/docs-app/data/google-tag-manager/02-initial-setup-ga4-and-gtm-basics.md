# 2. Initial Setup: GA4 and GTM Basics


This section guides you through setting up a Google Tag Manager (GTM) container and connecting it to Showpass. Google Analytics 4 (GA4) is optional. Complete Steps 2 and 3 only if you want to send data to GA4; otherwise, continue from Step 1 to Step 4 and configure the analytics or marketing tags you need.

## Prerequisites

- You have a Google account
- You have access to [Google Tag Manager](https://tagmanager.google.com/)
- If you plan to use GA4, you also have access to [Google Analytics](https://analytics.google.com/)

---

## Step 1: Create a New GTM Container (If You Don't Have One)

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Click **Create Account**
   - **Account Name:** Enter a name for your account (e.g., your company name)
   - **Country:** Select your country
3. Under **Container Setup**:
   - **Container name:** Enter a descriptive name (e.g., `YourWebsite.com - Showpass`)
   - **Target platform:** Select **Web**
4. Click **Create**
5. Agree to the GTM Terms of Service
6. You will be presented with GTM installation code snippets. You won't need to install these directly on your Showpass pages, as Showpass will use your GTM Container ID. Make a note of your **GTM Container ID** (e.g., `GTM-XXXXXXX`)

---

## Step 2: Create a New GA4 Property (If You Don't Have One)

This step is optional and applies only if you plan to use GA4.

1. Go to [Google Analytics](https://analytics.google.com/)
2. If you have an existing account, select it. If not, create a new Google Analytics account
3. Navigate to the **Admin** section (usually a gear icon in the bottom left)
4. In the "Property" column, click **Create Property**
5. Enter a **Property name** (e.g., `YourWebsite GA4`)
6. Set your **Reporting time zone** and **Currency**
7. Click **Next**. Provide your business information (optional)
8. Click **Create**
9. For "Choose a platform," select **Web**
10. Set up your **data stream**:
    - **Website URL:** Enter your main website URL (even if you're primarily tracking Showpass)
    - **Stream name:** Give it a name (e.g., `Main Website Stream`)
11. Click **Create stream**
12. A "Web stream details" page will appear. Make a note of your **MEASUREMENT ID** (e.g., `G-XXXXXXXXXX`). This is your GA4 Property ID

---

## Step 3: Create the GA4 Configuration Tag in GTM

This optional tag sends basic page view data and initializes GA4 on pages where GTM is loaded. Skip this step if you are not using GA4.

1. In your GTM container, go to **Tags** and click **New**
2. **Name your tag:** A descriptive name like `GA4 - Configuration - All Pages` or `Initialization`
3. **Tag Configuration:**
   - Click **Choose a tag type to begin setup...**
   - Select **Google Tag**
   - **Tag ID:** Enter your **GA4 Measurement ID** (e.g., `G-XXXXXXXXXX`) obtained in Step 2
   - No further configuration is needed in "Configuration Settings" or "Shared Event Settings" for basic setup
4. **Triggering:**
   - Click **Choose a trigger to make this tag fire...**
   - Select the **Initialization - All Pages** trigger. This trigger ensures the Google Tag fires before other tags and on every page
5. Click **Save**

---

## Step 4: Add Your GTM Container ID to Showpass

- Go to your [Organization Info](https://www.showpass.com/dashboard/venues/edit/) and click on "Analytics" section 
- Copy your **GTM Container ID** (e.g., `GTM-XXXXXXX` from Step 1) to "Google Tag Manager" field
- Click on "Save Changes". This enables Showpass to load your GTM container on your events landings and widgets

---

## Step 5: Publish Your GTM Container

1. In GTM, click the **Submit** button in the top right corner
2. Enter a **Version Name** (e.g., "Initial GTM Setup") and an optional **Version Description**
3. Click **Publish**

Once these steps are completed, your GTM container will be linked to your Showpass setup. The tags you configure determine where tracking data is sent. If you completed the optional GA4 setup, the GA4 Configuration tag will send page view data to your GA4 property from pages where Showpass loads the container.

Next, you will set up specific ecommerce tracking.
