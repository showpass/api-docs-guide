# 1. Introduction to Showpass Google Tag Manager (GTM) Integration



Welcome to the Showpass Google Tag Manager (GTM) integration guide. This documentation will help you understand how to leverage GTM to track user activity, implement Google Analytics 4 (GA4), and integrate other marketing tags for events and purchases managed through Showpass.

## Purpose of GTM Integration

Integrating Showpass with Google Tag Manager allows you to:

- Track detailed ecommerce events (like `view_item`, `add_to_cart`, `purchase`)
- Send this data to Google Analytics 4 (GA4) for comprehensive reporting
- Implement various third-party marketing and analytics tags (e.g., Facebook Pixel, TikTok Pixel, Google Ads) without modifying your website code directly
- Gain deeper insights into customer behavior and conversion funnels

## Crucial Note on GA4 Data Duplication

> **Important:** To avoid sending duplicate data to your Google Analytics 4 property:
> 
> - **Do NOT** add the same GA4 Property ID (Measurement ID) in both your Showpass organization settings AND within your GTM container setup.
> - If you are using GTM to manage your GA4 tracking (recommended approach), ensure that GA4 tracking is configured **only** through GTM. Remove any direct GA4 Measurement ID from your Showpass organization settings if you plan to deploy GA4 via GTM.

## Required Skill Level

**Advanced Knowledge:** Effective use of Google Tag Manager requires advanced knowledge and practical experience with GTM concepts, tags, triggers, and variables.

**Showpass Disclaimer:** Showpass is not responsible for GTM containers that are incorrectly set up or for any tracking issues that may arise from misconfiguration. Users are responsible for the correct implementation and testing of their GTM setup.

## Ready to Use JSON

If you want to skip the step-by-step documentation and simply download our ready-to-use JSON file to import into your GTM, please go to [section 12](/google-tag-manager/12-json-ready-to-use-importable-containers).

## Recommended GTM Learning Resources

If you are not familiar with Google Tag Manager or wish to refresh your knowledge, we highly recommend these introductory resources from Google:

- **Tag Manager Help - Overview:** [https://support.google.com/tagmanager/answer/6102821?hl=en](https://support.google.com/tagmanager/answer/6102821?hl=en)
- **Google Analytics YouTube Channel - Google Tag Manager Basics:** [https://www.youtube.com/watch?v=tQDdv_WqCgg](https://www.youtube.com/watch?v=tQDdv_WqCgg)

Proceed with the following sections to set up your GTM integration with Showpass.
