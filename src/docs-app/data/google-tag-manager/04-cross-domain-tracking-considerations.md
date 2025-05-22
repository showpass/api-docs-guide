# Cross-Domain Tracking Considerations

Cross-domain tracking is essential when a user's journey spans across multiple domains (e.g., your website `yourdomain.com` and Showpass `showpass.com`) and you want to maintain a single, consistent session and user view in Google Analytics.

There are two primary scenarios where cross-domain tracking is relevant with Showpass:

1.  **Redirecting from your website to `showpass.com`** (e.g., a "Buy Tickets" button links directly to an event page on Showpass).
2.  **Using the embedded Showpass widget (iFrame) on your website.**

## A. Redirecting to `showpass.com`

If your website directly links users to pages on `showpass.com`, you need to configure your Google Tag (used for GA4) in GTM to handle cross-domain tracking. This involves allowing the GA4 tag to "decorate" links with linker parameters (`_gl`).

**Setup Instructions:**

Google provides detailed instructions on how to configure cross-domain tracking for GA4. Please refer to their official help article:

- **Google Analytics Help - Set up cross-domain measurement [GA4]:** [https://support.google.com/analytics/answer/10071811](https://support.google.com/analytics/answer/10071811)

**Key steps typically involve:**

1.  Navigating to your **Google Tag** (the one used for GA4 Configuration, e.g., `GA4 - Configuration - All Pages`) in GTM.
2.  Under **Configuration Settings > Configure domains**, add the domains involved (e.g., `yourdomain.com`, `showpass.com`).
3.  Ensure your GA4 data stream settings in the GA4 UI are also configured for cross-domain tracking by adding the relevant domains.

## B. Widget Tracking (Embedded iFrame)

Tracking user activity accurately within an iFrame (like the Showpass embedded purchase widget) presents challenges, especially with browser privacy features that restrict third-party cookies.

### Preferred Method: iFrame Tracking with `postMessage`

- For the most accurate tracking of widget conversions within GTM, Showpass **strongly recommends using the `postMessage` iFrame tracking method.**
- This technique allows the iFrame to communicate data directly to the parent page (your website), bypassing many common cross-domain and third-party cookie issues.
- **This method is detailed in Section 8: "Advanced & Preferred: iFrame Purchase Tracking via `postMessage`."**

### Alternative: Basic iFrame Linker Decoration (If not using `postMessage`)

If you are not using the `postMessage` method, and you rely on basic cross-domain linker parameters for the iFrame, some configurations are needed.

- **Showpass WordPress Plugin:** If you are using the Showpass WordPress plugin, it automatically includes functionality to help decorate the iFrame for cross-domain linking.
- **Custom SDK Implementation (Not using WordPress Plugin):** If you are using the Showpass SDK with a custom JavaScript implementation on your site, you would typically need to add custom code to decorate the iFrame SRC URL with linker parameters. _The Showpass documentation you provided implies that specific code for this is needed but does not include the snippet itself; however, it details the GTM variables to capture these parameters if they are present in the iFrame URL._

#### Updating Google Tag Configuration for iFrame Decoration Parameters

If your iFrame URL is being decorated with `client_id`, `session_id`, etc. (either by the WordPress plugin or a custom solution), you can configure your Google Tag in GTM to read these values. This helps GA4 associate the iFrame activity with the parent page session.

**Target Tag:** Your main GA4 **Google Tag** (e.g., `GA4 - Configuration - All Pages`).

1.  Open the tag, and go to **Configuration Settings**.
2.  Under **Fields to Set**, add the following:

    - **Field Name:** `cookie_flags`

      - **Value:** `SameSite=None;Secure`

    - **Field Name:** `client_id`

      - **Value:** Click the variable icon `+`, choose **New Variable**.
        - Name it `Custom JS - URL Parameter - client_id`.
        - Variable Type: **Custom JavaScript**.
        - Custom JavaScript code:
          ```javascript
          function() {
            try {
              var urlParams = new URLSearchParams(window.location.search);
              var client = urlParams.get('client_id') || null;
              if (client) {
                return client;
              }
            } catch(e) {
              // console.error("Error reading client_id: ", e);
              return null;
            }
          }
          ```
        - Save the variable.

    - **Field Name:** `session_id`

      - **Value:** Click `+`, choose **New Variable**.
        - Name it `Custom JS - URL Parameter - session_id`.
        - Variable Type: **Custom JavaScript**.
        - Custom JavaScript code:
          ```javascript
          function() {
            try {
              var urlParams = new URLSearchParams(window.location.search);
              var session = urlParams.get('session_id') || null;
              if (session) {
                return session;
              }
            } catch(e) {
              // console.error("Error reading session_id: ", e);
              return null;
            }
          }
          ```
        - Save the variable.

    - **Field Name:** `parent_client_id`

      - **Value:** Click `+`, choose **New Variable**.
        - Name it `Custom JS - URL Parameter - parent_client_id`.
        - Variable Type: **Custom JavaScript**.
        - Custom JavaScript code:
          ```javascript
          // Note: The original document had 'session = urlParams.get(parent_client_id)'
          // Assuming it meant to get 'parent_client_id' parameter
          function() {
            try {
              var urlParams = new URLSearchParams(window.location.search);
              var parentClientId = urlParams.get('parent_client_id') || null;
              if (parentClientId) {
                return parentClientId;
              }
            } catch(e) {
              // console.error("Error reading parent_client_id: ", e);
              return null;
            }
          }
          ```
        - Save the variable.

    - **Field Name:** `parent_session_id`

      - **Value:** Click `+`, choose **New Variable**.
        - Name it `Custom JS - URL Parameter - parent_session_id`.
        - Variable Type: **Custom JavaScript**.
        - Custom JavaScript code:
          ```javascript
          // Note: The original document had 'session = urlParams.get(parent_session_id)'
          // Assuming it meant to get 'parent_session_id' parameter
          function() {
            try {
              var urlParams = new URLSearchParams(window.location.search);
              var parentSessionId = urlParams.get('parent_session_id') || null;
              if (parentSessionId) {
                return parentSessionId;
              }
            } catch(e) {
              // console.error("Error reading parent_session_id: ", e);
              return null;
            }
          }
          ```
        - Save the variable.

    - **Field Name:** `parent_document_referrer`
      - **Value:** Click `+`, choose **New Variable**.
        - Name it `Custom JS - URL Parameter - parent_document_referrer`.
        - Variable Type: **Custom JavaScript**.
        - Custom JavaScript code:
          ```javascript
          // Note: The original document had 'session = urlParams.get(parent_document_referrer)'
          // Assuming it meant to get 'parent_document_referrer' parameter
          function() {
            try {
              var urlParams = new URLSearchParams(window.location.search);
              var parentDocReferrer = urlParams.get('parent_document_referrer') || null;
              if (parentDocReferrer) {
                return parentDocReferrer;
              }
            } catch(e) {
              // console.error("Error reading parent_document_referrer: ", e);
              return null;
            }
          }
          ```
        - Save the variable.

3.  Save your Google Tag.
4.  Publish your GTM container.

_(The GTM interface might display these fields under "Configuration Settings" or similar, depending on the GTM version. The key is to set these parameters for your Google Tag.)_

_(Image Placeholder: The original document mentioned "It should look similar to this" - a screenshot of the GTM Google Tag configuration with these fields set would be beneficial here.)_

### Verification

- **Redirects:** Refer to Google's guide on verifying cross-domain measurement.
- **Widget (with iFrame decoration):** If you have implemented the iFrame decorator parameters, open the page with the Showpass widget. Use your browser's "Inspect Element" tool to find the iFrame element. Examine the `src` attribute of the iFrame. You should see `client_id`, `session_id`, `parent_client_id`, `parent_session_id`, and `parent_document_referrer` as query parameters within the iFrame's URL if the decoration is working.

**Reminder:** For the most reliable widget tracking, please refer to **Section 8** for the `postMessage` method.
