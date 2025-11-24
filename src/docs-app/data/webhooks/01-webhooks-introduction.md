# Showpass Webhooks: Introduction

Showpass webhooks enable real-time notifications when events occur in your account, allowing you to automate workflows and integrate with external systems.

## What are webhooks?

Webhooks are HTTP callbacks that Showpass sends to your server when specific events happen. Like a new purchase, refund, or ticket transfer. Your application receives instant notifications and can respond automatically.

---

## Key concepts

### Endpoint

A publicly accessible URL on your server (or on a third-party service such as Zapier) where Showpass can send HTTP POST requests containing event data. You will listen for Showpass events at this endpoint.

**Example:** `https://yoursite.com/api/showpass-webhook`

---

### Event

Event is an action within Showpass that triggers a webhook notification. You can find the list of events in section 4.

---

### Payload

JSON data sent from Showpass containing event details. For invoice events, this includes the complete invoice object with customer info, items purchased, and transaction details.

---

### Secret key

A unique token provided when you create an endpoint. Use this to verify webhook authenticity by validating the `X-SHOWPASS-SIGNATURE` header.

> **Security:** Always verify signatures to ensure requests genuinely come from Showpass.

---

### Logs

Showpass maintains delivery logs showing success/failure status for each webhook attempt. Use these for monitoring and troubleshooting.

---

## Why use webhooks?

### Real-time automation
Get immediate notifications as events happen—no polling or manual checks required.

### Seamless integration
Connect Showpass with CRM systems, email platforms, accounting software, analytics tools, and custom applications.

### Workflow efficiency
Automate tasks like:
- Updating customer records in your CRM
- Sending custom receipts or confirmation emails
- Syncing sales data with accounting software
- Managing mailing lists based on purchases
- Triggering inventory updates

### Reduced overhead
Eliminate manual data entry and frequent API polling to check for changes.

---

## Getting started

Ready to set up webhooks? Continue to the next section on [Setup and Management](/webhooks/02-webhooks-setup-and-management) to configure your first endpoint.
