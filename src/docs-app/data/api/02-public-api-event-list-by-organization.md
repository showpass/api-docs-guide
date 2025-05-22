# Event list by organization

## Endpoint

To fetch a list of public events for a specific organization, use the `/discovery/` endpoint with the `venue__in` parameter:

`https://www.showpass.com/api/public/discovery/?venue__in=ORGANIZATION_ID`

Replace `ORGANIZATION_ID` with the numerical ID of the Showpass organization.

## Overview

This endpoint displays all upcoming (and potentially past, depending on other parameters) public events for a specified organization.

**Finding Your Organization ID:**

1.  Log in to your Showpass account and navigate to [https://www.showpass.com/dashboard/venues/edit/](https://www.showpass.com/dashboard/venues/edit/).
2.  The Organization ID is typically displayed in the top right corner of this page.

**Domain Whitelisting:**
Remember to add your website's domain to the **"Integrations"** tab on the same venue edit page to ensure your API requests are not blocked.
