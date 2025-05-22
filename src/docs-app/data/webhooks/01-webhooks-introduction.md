# Showpass webhooks: Introduction

## Overview

Showpass provides webhook functionality to help organizers automate their workflows and connect Showpass with other systems in real time. Webhooks allow external applications to receive notifications when specific events occur within the Showpass platform, such as when a new order is placed, a ticket is transferred, or a refund is processed.

By setting up a webhook to be triggered by a specific event, your systems can be notified immediately and perform automated actions based on the data received from Showpass. This guide explains how to use Showpass webhooks and integrate them with your applications.

## Key terminology

- **Endpoint:** A publicly accessible URL on your server or third-party service (e.g., Zapier, Slack) to which Showpass will send HTTP POST requests containing event data.
- **Event:** An action or occurrence that takes place within the Showpass application, such as a user making a purchase (`invoice.purchase`), transferring a ticket (`invoice.transfer`), or a transaction being refunded (`invoice.refund`) or voided (`invoice.void`).
- **Payload:** The data sent from Showpass to your endpoint when an event occurs. This data is typically in JSON format and contains details about the event (e.g., for an `invoice.purchase` event, the payload would be an `Invoice` object).
- **Logs:** Showpass maintains logs of webhook events sent to your configured endpoints, including their success or failure status. This is useful for monitoring and troubleshooting.
- **Secret Key:** A unique token provided by Showpass when you set up an endpoint. This key is used to generate a signature for each webhook request, allowing you to verify that the request legitimately originated from Showpass.

## Why use webhooks?

- **Real-time Notifications:** Get immediate updates as events happen in Showpass.
- **Automation:** Trigger workflows in your own systems (e.g., update a CRM, send custom email notifications, sync with accounting software, manage mailing lists).
- **Integration:** Connect Showpass data with other third-party applications and services.
- **Efficiency:** Reduce the need for manual data entry or frequent API polling to check for changes.

The following sections will guide you through setting up, securing, and utilizing Showpass webhooks.
