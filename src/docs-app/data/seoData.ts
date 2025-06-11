export interface SEOData {
  title: string;
  description: string;
  keywords: string;
}

export const seoDataMap: Record<string, SEOData> = {
  // Homepage
  "/": {
    title: "Showpass Developer Documentation - API, SDK & Integration Guide",
    description: "Complete developer documentation for Showpass API, JavaScript SDK, WordPress Plugin, Webhooks, and Google Tag Manager integration. Build seamless event ticketing solutions.",
    keywords: "showpass api, event ticketing api, javascript sdk, wordpress plugin, webhooks, google tag manager, developer documentation, event management"
  },

  // API Reference
  "/api/01-public-api-introduction": {
    title: "Showpass Public API Introduction - Developer Documentation",
    description: "Learn how to use the Showpass Public API to access event data programmatically. Get started with authentication, endpoints, and best practices.",
    keywords: "showpass public api, rest api, event data api, api documentation, api authentication, event management api"
  },
  "/api/02-public-api-event-list-by-organization": {
    title: "Get Event List by Organization - Showpass API",
    description: "Retrieve all events for a specific organization using the Showpass Public API. Learn about filtering, pagination, and response formats.",
    keywords: "showpass api events, organization events, event list api, api filtering, event data retrieval"
  },
  "/api/03-public-api-query-specific-event": {
    title: "Query Specific Event Details - Showpass API",
    description: "Get detailed information about a specific event using the Showpass Public API. Access event metadata, pricing, and availability.",
    keywords: "showpass event details, specific event api, event information, event metadata api, ticket pricing api"
  },

  // JavaScript SDK
  "/sdk/01-sdk-getting-started": {
    title: "Showpass JavaScript SDK - Getting Started Guide",
    description: "Get started with the Showpass JavaScript SDK. Learn installation, configuration, and basic implementation for event ticketing widgets.",
    keywords: "showpass javascript sdk, js sdk, widget integration, ticket widgets, event widgets, sdk installation"
  },
  "/sdk/02-ticket-purchase-widget": {
    title: "Ticket Purchase Widget - Showpass JavaScript SDK",
    description: "Implement the Showpass ticket purchase widget on your website. Customize appearance, handle events, and manage the checkout flow.",
    keywords: "ticket purchase widget, showpass widget, ticket sales widget, event ticketing, widget customization"
  },
  "/sdk/03-product-purchase-widget": {
    title: "Product Purchase Widget - Showpass JavaScript SDK",
    description: "Add product purchase functionality to your site with the Showpass product widget. Sell merchandise, concessions, and event products.",
    keywords: "product purchase widget, merchandise sales, event products, showpass products, product widget"
  },
  "/sdk/04-membership-purchase-widget": {
    title: "Membership Purchase Widget - Showpass JavaScript SDK",
    description: "Integrate membership sales with the Showpass membership widget. Handle recurring payments and membership tiers.",
    keywords: "membership widget, membership sales, recurring payments, membership tiers, showpass memberships"
  },
  "/sdk/05-event-calendar-widget": {
    title: "Event Calendar Widget - Showpass JavaScript SDK",
    description: "Display events in a beautiful calendar format using the Showpass calendar widget. Customize views and handle date navigation.",
    keywords: "event calendar widget, calendar view, event display, date picker, calendar integration"
  },
  "/sdk/06-checkout-widget": {
    title: "Checkout Widget - Showpass JavaScript SDK",
    description: "Implement the Showpass checkout widget for seamless payment processing. Handle cart management and checkout flows.",
    keywords: "checkout widget, payment processing, cart management, checkout flow, payment widget"
  },
  "/sdk/07-cart-quantity-listener": {
    title: "Cart Quantity Listener - Showpass JavaScript SDK",
    description: "Monitor cart changes and quantities with the Showpass cart listener. Build dynamic cart displays and notifications.",
    keywords: "cart listener, cart quantity, cart monitoring, dynamic cart, cart events"
  },

  // WordPress Plugin
  "/wordpress/01-getting-started-install-and-configure": {
    title: "Showpass WordPress Plugin - Installation & Configuration",
    description: "Install and configure the Showpass WordPress plugin. Connect your WordPress site to Showpass for seamless event integration.",
    keywords: "showpass wordpress plugin, wordpress installation, plugin configuration, wordpress events, wordpress ticketing"
  },
  "/wordpress/02-adding-single-button-embed-widget": {
    title: "Add Single Button or Widget - Showpass WordPress Plugin",
    description: "Learn how to add individual Showpass buttons and widgets to your WordPress posts and pages using shortcodes and blocks.",
    keywords: "wordpress widget, showpass button, wordpress shortcode, widget embed, wordpress blocks"
  },
  "/wordpress/03-adding-event-list": {
    title: "Add Event List - Showpass WordPress Plugin",
    description: "Display a list of events on your WordPress site using the Showpass plugin. Customize layouts and filtering options.",
    keywords: "wordpress event list, event display, wordpress events, event listing, event grid"
  },
  "/wordpress/04-adding-event-detail-page": {
    title: "Add Event Detail Page - Showpass WordPress Plugin",
    description: "Create detailed event pages in WordPress with the Showpass plugin. Display event information, pricing, and purchase options.",
    keywords: "wordpress event page, event details, event information page, wordpress event display"
  },
  "/wordpress/05-adding-calendar-widget": {
    title: "Add Calendar Widget - Showpass WordPress Plugin",
    description: "Integrate an event calendar into your WordPress site using the Showpass calendar widget. Customize appearance and functionality.",
    keywords: "wordpress calendar, event calendar, calendar widget, wordpress calendar plugin"
  },
  "/wordpress/06-adding-product-list": {
    title: "Add Product List - Showpass WordPress Plugin",
    description: "Display and sell products through your WordPress site using the Showpass product list functionality.",
    keywords: "wordpress products, product list, merchandise sales, wordpress ecommerce, product display"
  },
  "/wordpress/07-adding-membership-list": {
    title: "Add Membership List - Showpass WordPress Plugin",
    description: "Offer memberships through your WordPress site with the Showpass membership list feature. Handle recurring payments and member benefits.",
    keywords: "wordpress memberships, membership sales, recurring payments, membership site, wordpress membership plugin"
  },
  "/wordpress/08-adding-checkout-cart-button": {
    title: "Add Checkout Cart Button - Showpass WordPress Plugin",
    description: "Implement checkout and cart functionality in WordPress with Showpass. Create seamless shopping experiences for your visitors.",
    keywords: "wordpress checkout, cart button, wordpress cart, checkout integration, wordpress payments"
  },
  "/wordpress/09-advanced-dynamic-cart-counter-jquery": {
    title: "Dynamic Cart Counter with jQuery - Showpass WordPress Plugin",
    description: "Build dynamic cart counters and notifications using jQuery with the Showpass WordPress plugin. Enhance user experience with real-time updates.",
    keywords: "dynamic cart counter, jquery cart, cart notifications, real-time cart, wordpress jquery"
  },
  "/wordpress/10-widgets-and-affiliate-tracking-links": {
    title: "Widgets & Affiliate Tracking - Showpass WordPress Plugin",
    description: "Implement affiliate tracking and advanced widget features with the Showpass WordPress plugin. Track referrals and commissions.",
    keywords: "affiliate tracking, referral tracking, wordpress affiliate, widget tracking, commission tracking"
  },
  "/wordpress/11-creating-custom-templates": {
    title: "Creating Custom Templates - Showpass WordPress Plugin",
    description: "Create custom templates for Showpass events and widgets in WordPress. Customize the appearance to match your theme.",
    keywords: "wordpress custom templates, theme customization, template override, wordpress theming, custom event templates"
  },
  "/wordpress/12-automatically-opening-popup-widgets": {
    title: "Auto-Opening Popup Widgets - Showpass WordPress Plugin",
    description: "Configure automatic popup widgets for enhanced user engagement. Set triggers and timing for optimal conversion rates.",
    keywords: "popup widgets, auto popup, widget triggers, conversion optimization, popup timing"
  },
  "/wordpress/13-tips-and-troubleshooting": {
    title: "Tips & Troubleshooting - Showpass WordPress Plugin",
    description: "Common issues, solutions, and best practices for the Showpass WordPress plugin. Troubleshoot problems and optimize performance.",
    keywords: "wordpress troubleshooting, plugin issues, wordpress support, plugin optimization, common problems"
  },

  // Webhooks
  "/webhooks/01-webhooks-introduction": {
    title: "Showpass Webhooks Introduction - Real-time Event Notifications",
    description: "Learn about Showpass webhooks for real-time event notifications. Understand webhook concepts, use cases, and implementation strategies.",
    keywords: "showpass webhooks, real-time notifications, webhook integration, event notifications, api webhooks"
  },
  "/webhooks/02-webhooks-setup-and-management": {
    title: "Webhook Setup & Management - Showpass Developer Guide",
    description: "Set up and manage Showpass webhooks. Configure endpoints, manage subscriptions, and handle webhook lifecycle management.",
    keywords: "webhook setup, webhook management, webhook configuration, endpoint management, webhook subscriptions"
  },
  "/webhooks/03-webhooks-security": {
    title: "Webhook Security - Showpass Developer Documentation",
    description: "Secure your Showpass webhook implementations. Learn about signature verification, HTTPS requirements, and security best practices.",
    keywords: "webhook security, signature verification, webhook authentication, secure webhooks, webhook best practices"
  },
  "/webhooks/04-webhooks-event-types": {
    title: "Webhook Event Types - Showpass Developer Guide",
    description: "Complete reference of Showpass webhook event types. Understand different events, payloads, and when they're triggered.",
    keywords: "webhook events, event types, webhook payloads, webhook triggers, webhook reference"
  },
  "/webhooks/05-webhooks-payload-invoice-object": {
    title: "Webhook Payload Invoice Object - Showpass Documentation",
    description: "Detailed documentation of the invoice object in Showpass webhook payloads. Understand data structure and field definitions.",
    keywords: "webhook payload, invoice object, webhook data structure, payload reference, invoice data"
  },
  "/webhooks/06-webhooks-logging-and-troubleshooting": {
    title: "Webhook Logging & Troubleshooting - Showpass Developer Guide",
    description: "Debug and troubleshoot Showpass webhooks. Learn about logging, error handling, and common webhook issues.",
    keywords: "webhook logging, webhook troubleshooting, webhook debugging, webhook errors, webhook monitoring"
  },

  // Google Tag Manager
  "/google-tag-manager/01-introduction-to-showpass-gtm-integration": {
    title: "Showpass Google Tag Manager Integration - Introduction",
    description: "Introduction to Showpass Google Tag Manager integration. Learn how to track events, conversions, and user behavior with GTM.",
    keywords: "google tag manager, gtm integration, showpass gtm, event tracking, conversion tracking, gtm setup"
  },
  "/google-tag-manager/02-initial-setup-ga4-and-gtm-basics": {
    title: "GA4 & GTM Setup Basics - Showpass Integration Guide",
    description: "Set up Google Analytics 4 and Google Tag Manager for Showpass tracking. Learn the fundamentals of GTM configuration.",
    keywords: "ga4 setup, google tag manager setup, gtm basics, google analytics 4, tracking setup, gtm configuration"
  },
  "/google-tag-manager/03-standard-ecommerce-tracking-with-ga4-via-gtm": {
    title: "Standard Ecommerce Tracking - Showpass GA4 via GTM",
    description: "Implement standard ecommerce tracking for Showpass events using Google Analytics 4 through Google Tag Manager.",
    keywords: "ecommerce tracking, ga4 ecommerce, gtm ecommerce, event tracking, purchase tracking, conversion tracking"
  },
  "/google-tag-manager/04-cross-domain-tracking-considerations": {
    title: "Cross-Domain Tracking - Showpass GTM Implementation",
    description: "Handle cross-domain tracking challenges when integrating Showpass with Google Tag Manager. Maintain user sessions across domains.",
    keywords: "cross-domain tracking, domain tracking, gtm cross-domain, session tracking, multi-domain tracking"
  },
  "/google-tag-manager/05-working-with-custom-html-and-javascript-in-gtm-for-showpass": {
    title: "Custom HTML & JavaScript in GTM - Showpass Integration",
    description: "Implement custom HTML and JavaScript tags in Google Tag Manager for advanced Showpass tracking and functionality.",
    keywords: "gtm custom html, gtm javascript, custom tags, advanced gtm, gtm scripting, custom tracking"
  },
  "/google-tag-manager/06-tracking-custom-conversions-marketing-pixels": {
    title: "Custom Conversions & Marketing Pixels - Showpass GTM",
    description: "Track custom conversions and implement marketing pixels for Showpass events using Google Tag Manager.",
    keywords: "custom conversions, marketing pixels, conversion tracking, pixel tracking, gtm conversions, marketing tracking"
  },
  "/google-tag-manager/07-showpass-data-layer-details": {
    title: "Showpass Data Layer Details - GTM Implementation Guide",
    description: "Comprehensive guide to the Showpass data layer structure for Google Tag Manager implementations. Understand data flow and variables.",
    keywords: "data layer, gtm data layer, showpass data, gtm variables, data structure, event data"
  },
  "/google-tag-manager/08-advanced-iframe-purchase-tracking-via-postmessage": {
    title: "Advanced iFrame Purchase Tracking - Showpass GTM PostMessage",
    description: "Implement advanced purchase tracking for Showpass iFrame widgets using PostMessage API and Google Tag Manager.",
    keywords: "iframe tracking, postmessage tracking, advanced tracking, widget tracking, iframe gtm, postmessage api"
  },
  "/google-tag-manager/09-advanced-tracking-widget-and-direct-purchases": {
    title: "Advanced Tracking: Widget vs Direct Purchases - Showpass GTM",
    description: "Differentiate between widget purchases and direct Showpass.com purchases in your Google Tag Manager tracking implementation.",
    keywords: "widget tracking, direct purchase tracking, purchase differentiation, advanced gtm tracking, purchase source tracking"
  },
  "/google-tag-manager/10-example-google-ads-conversion-tracking-setup": {
    title: "Google Ads Conversion Tracking Setup - Showpass GTM Example",
    description: "Step-by-step example of setting up Google Ads conversion tracking for Showpass events using Google Tag Manager.",
    keywords: "google ads tracking, conversion tracking, ads conversion setup, gtm google ads, ads tracking setup, conversion optimization"
  },

  // Widget Playground
  "/widget-playground": {
    title: "Showpass Widget Playground - Test & Preview Widgets",
    description: "Interactive playground to test and preview Showpass widgets. Experiment with different configurations and see live examples.",
    keywords: "widget playground, widget testing, widget preview, interactive demo, widget examples, showpass widgets"
  },

  // Facebook Integration
  "/facebook/01-introduction-to-facebook-pixel": {
    title: "About Facebook Pixel - Showpass Integration Guide",
    description: "Learn about Facebook Pixel integration with Showpass. Track event performance, optimize ad campaigns, and build targeted audiences for better ROI.",
    keywords: "facebook pixel, meta pixel, showpass facebook integration, facebook tracking, event advertising, conversion tracking, facebook ads"
  },
  "/facebook/02-installing-facebook-pixel": {
    title: "Installing Facebook Pixel - Showpass Setup Guide",
    description: "Step-by-step guide to install Facebook Pixel with Showpass. Configure event tracking, verify installation, and optimize for conversions.",
    keywords: "facebook pixel installation, meta pixel setup, pixel configuration, facebook tracking setup, event pixel, showpass facebook"
  },
  "/facebook/03-about-facebook-conversions-api": {
    title: "About Facebook Conversions API - Enhanced Tracking Guide",
    description: "Understand Facebook Conversions API benefits for Showpass events. Improve data quality, enhance attribution, and future-proof your tracking.",
    keywords: "facebook conversions api, server-side tracking, facebook capi, enhanced tracking, attribution improvement, data quality"
  },
  "/facebook/04-installing-facebook-conversions-api": {
    title: "Installing Facebook Conversions API - Showpass Integration",
    description: "Complete guide to setting up Facebook Conversions API with Showpass. Configure server-side tracking for improved ad performance and attribution.",
    keywords: "conversions api setup, facebook capi installation, server-side tracking setup, facebook api integration, enhanced conversions"
  }
}; 