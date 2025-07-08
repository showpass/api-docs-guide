# 4. Cross-domain tracking considerations

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

## B. Widget tracking (embedded iFrame)

Tracking user activity accurately within an iFrame (like the Showpass embedded purchase widget) presents challenges, especially with browser privacy features that restrict third-party cookies.

### Preferred method: iFrame tracking with `postMessage`

- For the most accurate tracking of widget conversions within GTM, Showpass **strongly recommends using the `postMessage` iFrame tracking method.**
- This technique allows the iFrame to communicate data directly to the parent page (your website), bypassing many common cross-domain and third-party cookie issues.
- **This method is detailed in Section 8: "Advanced & Preferred: iFrame Purchase Tracking via `postMessage`."**

### Alternative: Basic iFrame linker decoration (if not using `postMessage`)

If you are not using the `postMessage` method, and you rely on basic cross-domain linker parameters for the iFrame, some configurations are needed.

**Showpass WordPress Plugin:** If you are using the Showpass WordPress plugin, it automatically includes functionality to help decorate the iFrame for cross-domain linking.

**Custom SDK Implementation (Not using WordPress Plugin):** If you are using the Showpass SDK with a custom JavaScript implementation on your site, you would typically need to add custom code to decorate the iFrame SRC URL with linker parameters.

Include the following code on your website, in order to decorate Showpass iFrame URLS wiht the correct query parameters

```javascript
<script type="text/javascript">
/**
 * Utility for decorating Showpass iframes with tracking parameters
 * Combines cookie-based tracking (GA, Facebook) with query parameter passing
 * Automatically handles ALL Showpass iframes on the page without requiring explicit setup
 */

/**
 * Shared function to decorate iframe - handles both cookie-based tracking and query parameters
 * @param {HTMLIFrameElement} iFrame - The iframe element to decorate
 */
const decorateIframe = (iFrame) => {
    if (!iFrame || !iFrame.src) {
        console.warn("Invalid iframe provided to decorateIframe");
        return;
    }

    // Prevent multiple decorations
    if (iFrame.dataset.decorated) {
        return;
    }

    let url = new URL(iFrame.src);

    // 1. Handle cookie-based tracking (GA and Facebook)
    if (typeof document.cookie === "string" && document.cookie !== "") {
        // Parse cookies into an object
        let cookie = {};
        document.cookie.split(";").forEach(function (el) {
            const splitCookie = el.split("=");
            const key = splitCookie[0].trim();
            const value = splitCookie[1];
            cookie[key] = value;
        });

        // Parse the _ga cookie to extract client_id and session_id.
        // A _ga cookie typically looks like GA1.1.1194072907.1685136322
        const gaCookie = cookie["_ga"];
        if (gaCookie) {
            const client_id = gaCookie.substring(6); // Example: "1194072907.1685136322"
            const session_id = client_id.split(".")[1]; // ["1194072907", "1685136322"]

            if (!isNaN(Number(client_id)) && !isNaN(Number(session_id))) {
                url.searchParams.append("parent_client_id", client_id);
                url.searchParams.append("parent_session_id", session_id);
            }
        }

        // Add fbclid from _fbc cookie if present and properly formatted
        const fbcCookie = cookie["_fbc"];
        if (fbcCookie) {
            const parts = fbcCookie.split(".");
            // Expecting exactly 4 parts; use the last part as fbclid
            if (parts.length === 4) {
                url.searchParams.append("fbclid", parts[3]);
            }
        }
    }

    // 2. Pass the parent page's referrer to our iFrame
    const referrer = document.referrer || "";
    if (referrer) {
        url.searchParams.append("parent_document_referrer", referrer);
    }

    // 3. Add current page query parameters
    // This is REQUIRED for the checkout widget to work properly with Affirm redirects
    const currentUrl = new URL(window.location.href);
    const queryParams = currentUrl.searchParams;

    if (queryParams.toString()) {
        queryParams.forEach((value, key) => {
            // Check if parameter already exists in iframe src to avoid duplicates
            if (!url.searchParams.has(key)) {
                url.searchParams.append(key, value);
            }
        });
    }

    // Update iframe src and mark as decorated
    iFrame.src = url.toString();
    iFrame.dataset.decorated = "true";

    console.log("Decorated iframe with tracking parameters:", url.toString());
};

/**
 * Sets up observer to watch for ANY Showpass iframe anywhere in the document
 * Handles both popup widgets and embedded widgets
 */
const setupShowpassIframeObserver = () => {
    const documentObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the node itself is a Showpass iframe
                        if (
                            node.tagName === "IFRAME" &&
                            node.src &&
                            node.src.includes("showpass.com") &&
                            !node.dataset.decorated
                        ) {
                            setTimeout(() => {
                                decorateIframe(node);
                            }, 100);
                        }

                        // Look for any Showpass iframes within the added node
                        if (node.querySelectorAll) {
                            const iframes = node.querySelectorAll(
                                'iframe[src*="showpass.com"]'
                            );
                            iframes.forEach((iframe) => {
                                if (iframe.src && !iframe.dataset.decorated) {
                                    setTimeout(() => {
                                        decorateIframe(iframe);
                                    }, 100);
                                }
                            });
                        }
                    }
                });
            }

            // Also watch for src attribute changes on existing iframes
            if (
                mutation.type === "attributes" &&
                mutation.attributeName === "src"
            ) {
                const target = mutation.target;
                if (
                    target.tagName === "IFRAME" &&
                    target.src &&
                    target.src.includes("showpass.com") &&
                    !target.dataset.decorated
                ) {
                    setTimeout(() => {
                        decorateIframe(target);
                    }, 100);
                }
            }
        });
    });

    documentObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src"],
    });

    return documentObserver;
};

// Initialize the observer automatically
setupShowpassIframeObserver();
</script>
```

#### Updating Google Tag configuration for iFrame decoration parameters

If your iFrame URL is being decorated with `client_id`, `session_id`, etc. (either by the WordPress plugin or a custom solution), you can configure your Google Tag in GTM to read these values. This helps GA4 associate the iFrame activity with the parent page session.

**Target Tag:** Your main GA4 **Google Tag** (e.g., `GA4 - Configuration - All Pages`).

1.  Open the tag, and go to **Configuration Settings**.
2.  Under **Fields to Set**, add the following:

    - **Field Name:** `cookie_flags`

      - **Value:** `SameSite=None;Secure`

    - **Field Name:** `client_id`

      - **Value:** Click the variable icon `+`, choose **New Variable**.
        - Name it `Custom JS - URL Parameter - parent_client_id`.
        - Variable Type: **Custom JavaScript**.
        - Custom JavaScript code:
          ```javascript
          function() {
            try {
              var urlParams = new URLSearchParams(window.location.search);
              var client = urlParams.get('parent_client_id') || null;
              if (client) {
                return client;
              }
            } catch(e) {
              // console.error("Error reading parent_client_id: ", e);
              return null;
            }
          }
          ```
        - Save the variable.

    - **Field Name:** `session_id`

      - **Value:** Click `+`, choose **New Variable**.
        - Name it `Custom JS - URL Parameter - parent_session_id`.
        - Variable Type: **Custom JavaScript**.
        - Custom JavaScript code:
          ```javascript
          function() {
            try {
              var urlParams = new URLSearchParams(window.location.search);
              var session = urlParams.get('parent_session_id') || null;
              if (session) {
                return session;
              }
            } catch(e) {
              // console.error("Error reading parent_session_id: ", e);
              return null;
            }
          }
          ```
        - Save the variable.

    - **Field Name:** `page_referrer`
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
