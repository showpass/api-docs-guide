# 12. Ready To Use Importable Containers

For your convenience, we provide ready-to-use GTM container JSON files.
You can download them directly from this page and import them into your Google Tag Manager container.

These templates include all required tags, triggers, and variables needed for tracking your Showpass events via GTM, and only require a few updates before publishing.

Includes:
* Google Analitycs (GA4)
* Google Ads (AW)
* Snapchat
* Spotify
* TikTok

---

## First Scenario: Point your ads directly to Showpass URL or Redirecting From Your Website to Showpass.com

Examples:
- When users click on your ads, they directly go to your event page on **showpass.com** (eg., https://showpass.com/your-event-slug)
- A **“Buy Tickets”** button on your website links directly to an event page on **showpass.com** (eg., https://showpass.com/your-event-slug)

In this scenario:

* You only need **one GTM container** (your website's container)
* You only need to import **one JSON file**

---

### 1. Create a GTM Container

If you don’t already have a GTM container:

1. Go to **tagmanager.google.com**
2. Click **Create Account**
3. Enter:
   * **Account Name:** your business name
   * **Container Name:** your website domain
4. Choose **Web**
5. Click **Create**

Copy and install the GTM snippet into the `<head>` and `<body>` of your website.

---

### 2. Download the JSON File

Download the container template:

* [**Showpass-Default.json**](../public/assets/Showpass-Default.json)

This template includes everything needed for direct or redirect-based tracking.

---

### 3. Import the Container

1. In GTM, go to **Admin → Import Container**
2. Upload **Showpass-Default.json**
3. Choose:
   * **Workspace:** Default Workspace (recommended)
   * **Import Option:** *Merge*
4. Review the summary
5. Click **Confirm**

---

### 4. Update Variables

After import:

1. Go to **Variables**
2. Update any variables filled with `xxxxxxx`
   Examples:
   * TikTok Pixel ID
   * Spotify Pixel ID
   * GA4 ID

Replace them with your own values.

---

### 5. Unpause the Tags

All tracking tags come **paused by default**.

1. Go to **Tags**
2. Click each tag you want to activate
3. Switch **Paused → Unpause**
4. Save

Finally, click **Submit → Publish** to push changes live.

---

---

## Second Scenario: Using the Embedded Showpass Widget (iFrame)

Example:
You embed the Showpass widget directly into your website using an `<iframe>`.

In this scenario:

* You need **two GTM containers**
* One for your **parent website**
* One for the **Showpass widget (child iframe)**
* You need to import **two JSON files**

The parent container captures user interactions on your site,
and the child container captures interactions inside the Showpass iframe and send to the parent container.

---

### 1. Create Two GTM Containers

If you do not already have separate containers:

1. Create a **Parent container**

   * Container Name: your website domain
   * Choose **Web**

2. Create a **Child container**

   * Container Name: "Showpass Widget iFrame"
   * Choose **Web**

Install each snippet in the correct environment:

* Parent container → your website
* Child container → the page serving the Showpass iframe content

---

### 2. Download JSON Files

Download both templates:

1. [**Showpass-Widget-Child.json**](../public/assets/Showpass-Widget-Child.json)
2. [**Showpass-Widget-Parent.json**](../public/assets/Showpass-Widget-Parent.json)

The child template handles event forwarding from the iframe.
The parent template handles cross-domain tracking and event merging.

---

### 3. Import Each JSON File

For the **parent container**:

1. Go to **Admin → Import Container**
2. Upload **Showpass-Widget-Parent.json**
3. Select **Merge** and confirm

For the **child container**:

1. Go to **Admin → Import Container**
2. Upload **Showpass-Widget-Child.json**
3. Select **Merge** and confirm

---

### 4. Update Variables in the Parent Container

In the **Parent container**, open **Variables**:

* Replace placeholders (`XXXXX`) with your IDs:

  * TikTok Pixel ID
  * Spotify Pixel ID
  * GA4 ID

The Child container usually requires **no updates**.

---

### 5. Unpause Tags in the Parent Container

All tags are paused by default to prevent accidental firing.

To activate:

1. Open **Tags** in the Parent container
2. Unpause each tag you want live
3. Save
4. **Submit → Publish**

The child container tags typically remain active as imported.

