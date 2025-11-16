# Showpass webhooks: Event types


Showpass webhooks notify your application about various events that occur within the platform. When configuring a webhook endpoint in the Showpass dashboard, you will select the specific event(s) for which you want to receive notifications at that endpoint.

---

## Available webhook events

Below is a list of the events for which Showpass currently provides webhook support. Understanding these events is crucial for building targeted integrations.

| Event Name            | Description                                                                                                                                                                                                                            | Typically Triggers On                                        |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `invoice.purchase`    | Triggered when a new order is successfully created and paid for. This is a common event for initiating fulfillment, sending custom receipts, or updating CRM records.                                                                  | Successful completion of a new purchase.                     |
| `invoice.refund`      | Triggered when a transaction (or part of it) is successfully refunded. Use this to update order statuses, adjust inventory (if applicable), or notify accounting systems.                                                              | Successful processing of a refund.                           |
| `invoice.void`        | Triggered when a previously completed transaction is voided. This might occur for various reasons, such as correcting an error or handling a chargeback.                                                                               | Successful voiding of a transaction.                         |
| `invoice.transfer`    | Triggered when a ticket transfer has been completed, and **new invoices and tickets have been generated for the recipient**. This event typically contains the details of the _new_ items for the recipient.                           | Completion of a ticket transfer (recipient's side).          |
| `invoice.transferred` | Triggered when a ticket transfer has been completed. This event updates the **original invoice and ticket items**, often marking the original tickets as voided or transferred. Use this to manage the status of the original tickets. | Completion of a ticket transfer (original purchaser's side). |
| `webhook.test`        | A special event that can be triggered manually from the Showpass dashboard to test your webhook endpoint's connectivity and processing capabilities. It usually sends a sample payload.                                                | Manually sent from Showpass webhook settings.                |

---

## Subscribing to events

When you set up or edit a webhook endpoint in the Showpass dashboard (as described in "Setup and Management"), you will be able to select one or more of these event types. Your endpoint will then only receive notifications for the events it is subscribed to.

---

## Choosing the right events

Consider what actions in Showpass are relevant to your integration:

- **For sales and order management:** `invoice.purchase`, `invoice.refund`, and `invoice.void` are fundamental
- **For tracking ticket lifecycle:** `invoice.transfer` and `invoice.transferred` become important if you need to track the full lifecycle of tickets, especially with resale or transfer features
- **For testing:** Always subscribe your endpoint to `webhook.test` during development and for ongoing health checks

> **Note:** The data payload sent with each event (particularly for invoice-related events) will typically be an "Invoice" object, detailed in the next section. The `event_type` field within the payload will indicate which specific event triggered the webhook.
