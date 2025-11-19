# Google Tag Manager: FAQ and Troubleshooting Guide

This guide covers common issues regarding Google Tag Manager (GTM) integrations with Showpass, including advanced iframe setups, standard ecommerce tracking, third-party pixel configuration, and resolving console errors.

## Frequently Asked Questions (FAQ)

### 1. What are the capabilities of the Showpass GTM integration?

The Showpass GTM integration allows you to inject your own GTM container into the purchase flow. This enables you to:

- Trigger tags for standard GA4 pagviews and ecommerce events (`add_to_cart`, `begin_checkout`, `purchase`).
- Install third-party tracking pixels (e.g., Spotify, TikTok, Pinterest) that are not natively supported by Showpass.
- Pass revenue, currency, and item data using the Data Layer.

### 2. Should I use the Native Showpass Facebook/Meta integration OR GTM?

**Do not use both.**

- **Recommendation:** Use the **Showpass Native Integration** for Facebook/Meta. Our native integration includes the Conversions API (CAPI) on the backend, which is complex to set up manually in GTM.
- **Warning:** If you enter a Pixel ID in the Showpass dashboard _and_ add a Facebook Pixel tag in GTM, you will double-count conversions and inflate your data.
- **Best Practice:** Use Showpass Native settings for Facebook, and use GTM for all other third-party scripts (GA4, Google Ads, Spotify, TikTok, etc.).

### 3. Can I track conversions for 3rd party platforms?

Yes. You can setup custom tags in GTM.

- **Event Mapping:** Some platforms allow you to use predefined event types or create your own. You can configure tags for specific actions like `AddToCart` or `BeginCheckout` by creating triggers for those specific Showpass events and passing the vendor-specific variable

### 4. I'm using the Showpass SDK and widgets, what implementation should I use?

We reccomend using the [iFrame Purchase Tracking via postMessage](https://dev.showpass.com/google-tag-manager/08-advanced-iframe-purchase-tracking-via-postmessage)

This ensures higher accuracy, as it relies on the parent domain sending data to marketing pixels.

---

## Troubleshooting Common Issues

### Issue 1: Syntax Error in Variable Names (Hyphens vs. Underscores)

**Symptom:** You are writing custom JavaScript to reference the GTM Data Layer or Container ID (often in Child/Parent iframe setups), and the script is breaking or returning `undefined`.

**Cause:** In JavaScript, a hyphen (`-`) is treated as a subtraction operator. If you reference your Container ID directly in a variable name (e.g., `window.dataLayer_GTM-SP1234567`), the browser tries to subtract `SP1234567` from `window.dataLayer_GTM`.

**Solution:** When referencing GTM Container IDs in JavaScript variables, replace the hyphen with an underscore.

- **Incorrect:** `var message = window.dataLayer_GTM-SP1234567;`
- **Correct:** `var message = window.dataLayer_GTM_SP1234567;`

### Issue 2: "Refused to execute inline script" (Console Error)

**Symptom:** Your tags are not firing, and the browser console shows: _Refused to execute inline script because it violates the following Content Security Policy directive..._

**Cause:** Showpass uses strict security protocols (CSP) that block unauthorized inline scripts.

**Solution:** You must configure a **Nonce** variable in GTM.

1.  **Create a Variable:**
    - **Type:** DOM Element | **Selection Method:** CSS Selector
    - **Element Selector:** `meta[name='csp-nonce']`
    - **Attribute Name:** `content` | **Variable Name:** `nonce`
2.  **Update Custom HTML Tags:**
    - Add the attribute to your script tags: `<script nonce="{{nonce}}">`
    - **[See full documentation on implementing the Nonce here]**

### Issue 3: Iframe/Widget Tracking (Parent Container not receiving events)

**Symptom:** You are using "Advanced Iframe Purchase Tracking." You see the `message` event in the Parent container, but specific events (`add_to_cart`, `purchase`) don't fire.

**Cause:** The Parent container hears the generic "message" but doesn't know that "message" equals a "purchase" trigger.

**Solution:**

1.  In the **Parent** GTM Container, ensure the "Post Message Listener" tag is active.
2.  **Create a Custom Event Trigger:**
    - **Event Name:** Must match exactly (e.g., `purchase`).
    - **Trigger Type:** Custom Event.
3.  Attach this trigger to your GA4/Ads tag in the Parent container.

### Issue 4: Conversions are recording, but Revenue is $0

**Symptom:** You see the conversion count, but the value (ROAS) is $0.

**Cause:** The tag is firing but not pulling transaction details from the Data Layer.

**Solution:** Map Data Layer Variables (DLV) in GTM.

1.  **Create Variables:**
    - `DLV - ecommerce.value` (maps to `ecommerce.value`)
    - `DLV - ecommerce.currency` (maps to `ecommerce.currency`)
2.  **Assign to Tag:** Open your Conversion Tag and set the Value field to `{{DLV - ecommerce.value}}`.

### Issue 5: Tags are not firing (General Checklist)

1.  **Is the Container Published?** Changes are not live until you hit "Submit" and "Publish."
2.  **Check Event Names:** Ensure triggers match GA4 standard event names exactly (e.g., `purchase`, not `Ticket Purchase` or `ticket_sold`).
3.  **Test with Tools:** Always use [**Google Tag Assistant**](https://tagassistant.google.com/) to verify if tags are firing.
