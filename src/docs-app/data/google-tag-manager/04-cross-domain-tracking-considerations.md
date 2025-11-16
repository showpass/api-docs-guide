# Cross-Domain Tracking Considerations


Cross-domain tracking is essential when a user's journey spans across multiple domains (e.g., your website `yourdomain.com` and Showpass `showpass.com`) and you want to maintain a single, consistent session and user view in Google Analytics.

There are two primary scenarios where cross-domain tracking is relevant with Showpass:

1. **Redirecting from your website to showpass.com** (e.g., a "Buy Tickets" button links directly to an event page on Showpass)
2. **Using the embedded Showpass widget (iFrame) on your website**

---

## A. Redirecting to showpass.com

If your website directly links users to pages on `showpass.com`, you need to configure your Google Tag (used for GA4) in GTM to handle cross-domain tracking. This involves allowing the GA4 tag to "decorate" links with linker parameters (`_gl`).

### Setup Instructions

Google provides detailed instructions on how to configure cross-domain tracking for GA4. Please refer to their official help article:

- **Google Analytics Help - Set up cross-domain measurement [GA4]:** [https://support.google.com/analytics/answer/10071811](https://support.google.com/analytics/answer/10071811)

### Key Steps

Typically involve:

1. Navigating to your **Google Tag** (the one used for GA4 Configuration, e.g., `GA4 - Configuration - All Pages`) in GTM
2. Under **Configuration Settings > Configure domains**, add the domains involved (e.g., `yourdomain.com`, `showpass.com`)
3. Ensure your GA4 data stream settings in the GA4 UI are also configured for cross-domain tracking by adding the relevant domains

---

## B. Widget Tracking (Embedded iFrame)

Tracking user activity accurately within an iFrame (like the Showpass embedded purchase widget) presents challenges, especially with browser privacy features that restrict third-party cookies.

### Preferred Method: iFrame Tracking with postMessage

> **Recommended:** For the most accurate tracking of widget conversions within GTM, Showpass **strongly recommends using the `postMessage` iFrame tracking method**.

- This technique allows the iFrame to communicate data directly to the parent page (your website), bypassing many common cross-domain and third-party cookie issues
- **This method is detailed in Section 8: "Advanced & Preferred: iFrame Purchase Tracking via postMessage"**

### Alternative: Basic iFrame Linker Decoration (If Not Using postMessage)

If you are not using the `postMessage` method, and you rely on basic cross-domain linker parameters for the iFrame, some configurations are needed.

**Showpass WordPress Plugin:** If you are using the Showpass WordPress plugin, it automatically includes functionality to help decorate the iFrame for cross-domain linking.

**Custom SDK Implementation (Not using WordPress Plugin):** If you are using the Showpass SDK with a custom JavaScript implementation on your site, you would typically need to add custom code to decorate the iFrame SRC URL with linker parameters.

Include the following code on your website, in order to decorate Showpass iFrame URLs with the correct query parameters:

```javascript
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

        // Google Analytics linker parameter
        const glCookieNames = Object.keys(cookie).filter((name) =>
            name.startsWith("_gl")
        );
        if (glCookieNames.length > 0) {
            glCookieNames.forEach((cookieName) => {
                url.searchParams.set(cookieName, cookie[cookieName]);
            });
        }

        // Facebook Click ID (fbclid) parameter
        if (cookie["_fbc"]) {
            url.searchParams.set("_fbc", cookie["_fbc"]);
        }
        if (cookie["_fbp"]) {
            url.searchParams.set("_fbp", cookie["_fbp"]);
        }
    }

    // 2. Preserve existing URL parameters from the parent page
    const parentParams = new URLSearchParams(window.location.search);
    const paramsToPreserve = [
        "fbclid",
        "gclid",
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_term",
        "utm_content",
    ];

    paramsToPreserve.forEach((param) => {
        if (parentParams.has(param) && !url.searchParams.has(param)) {
            url.searchParams.set(param, parentParams.get(param));
        }
    });

    // Update iframe src with decorated URL
    iFrame.src = url.toString();
    iFrame.dataset.decorated = "true";
};

/**
 * Observer to watch for dynamically added iframes
 */
const observeIframes = () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === "IFRAME" && node.src.includes("showpass.com")) {
                    decorateIframe(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
};

// Initialize when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        // Decorate existing iframes
        document
            .querySelectorAll('iframe[src*="showpass.com"]')
            .forEach(decorateIframe);
        // Watch for future iframes
        observeIframes();
    });
} else {
    // DOM already loaded
    document
        .querySelectorAll('iframe[src*="showpass.com"]')
        .forEach(decorateIframe);
    observeIframes();
}
```

> **Note:** This code should be placed on your website's pages where the Showpass widget appears. It automatically finds and decorates all Showpass iFrames with tracking parameters.

---

## Summary

- **Direct Links to showpass.com:** Configure cross-domain tracking in your Google Tag settings within GTM
- **Embedded Widgets:** Use the `postMessage` method (Section 8) for most accurate tracking, or implement iFrame decoration code if using basic linker parameters
- Always test your implementation thoroughly using GTM Preview mode and GA4 Realtime reports
