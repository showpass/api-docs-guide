# Showpass webhooks

## Introduction

To make it easier for organizers to integrate Showpass with other systems and automate their workflows, Showpass provides webhook functionality. Webhooks allow external systems to be notified when certain events occur in Showpass, such as when a new order is placed or when a ticket transfer occurs.

## Webhook events

By setting up a webhook to be triggered by a specific event, external systems can be notified in real-time and perform automated actions based on the event data. Below is a list of the events for which Showpass provides webhook support:

| Event Name            | Description                                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `invoice.purchase`    | Triggered when a new order is created                                                                                                                                 |
| `invoice.refund`      | Triggered when a transaction is refunded                                                                                                                              |
| `invoice.void`        | Triggered when a transaction is voided                                                                                                                                |
| `invoice.transfer`    | Triggered when a transfer has been completed and new invoices and tickets have been generated                                                                         |
| `invoice.transferred` | Triggered when a transfer has been completed and updates the original invoice and ticket items. Should be used to void original tickets when a transfer is completed. |

## Webhook objects

The Showpass Webhook Objects section describes the format of the webhook objects that will be sent when specific events are triggered. For example, when the "invoice.purchase" event is triggered, Showpass will send an "invoice" object containing information about the purchase.

## Invoice object

The invoice object contains detailed information about a purchase, refund, or other transaction-related event.

## Sample request

Here is an example of a request that we send as a webhook when we're sending the invoice structure:

- Http Method: `'POST'`
- URL: `'$https://yoursite.com/webhook/'`
- Header: `'X-SHOWPASS-SIGNATURE: "HMAC-SHA1(id, $YOUR_WEBHOOK_TOKEN)"'`

**Request Body:**

```json
{
  "id": "fd-3bc3-463c-8f41-a92971330c06",
  "event_type": "invoice.purchase",
  "webhook_event_uuid": "06d5dc13-2eea-48ad-9f40-2a5bfc9e4c2c",
  "data": {
    "transaction_id": "b3-3eb2-405b-b640-39ec45d04fda",
    "showpass_organization_id": "20",
    "customer_name": "Test User #0",
    "customer_email": "test.user0@test.com",
    "customer_phone_number": null,
    "subscribe_to_venue": true,

    "payment_type": "Credit",
    "other_payment_type": null,
    "currency": "CAD",
    "discounts": 0,
    "net_sales": 107,
    "service_fees": 0,
    "account_credit_applied": 0,
    "gross_revenue": 100,
    "organizer_fees": 0,
    "total_tax": 0,
    "account_credit_type": null,

    "invoice_type": "Sale",
    "invoice_type_id": "101",

    "ticket_items": [
      {
        "event_id": "7",
        "event_name": "Event #0",
        "event_starts_on": "2023-02-18T08:00:00Z",
        "event_ends_on": "2023-02-18T12:00:00Z",

        "first_name_on_ticket": "Test",
        "last_name_on_ticket": "User #0",
        "phone_number_on_ticket": null,
        "email_on_ticket": "test.user0@test.com",

        "id": 7,
        "ticket_status": "Issued",
        "barcode_string": "J6S5UA9OQ",
        "name_on_ticket": "Test User #0",
        "ticket_type_id": "7",
        "ticket_type_name": "Ticket Type #0",
        "ticket_item_type": "ticket",
        "ticket_status_code": "2",
        "created_by_transfer": false,

        "product_name": null,
        "product_id": null,
        "product_attribute_name": null,
        "product_attribute_id": null
      }
    ],
    "invoice_items": [
      {
        "id": 16,
        "invoice_item_type": "Ticket",
        "quantity": 1,
        "discounts": 0,
        "net_sales": 107,
        "service_fees": 0,
        "account_credit_applied": 0,
        "gross_revenue": 100,
        "organizer_fees": 0,
        "total_tax": 0,

        "event_id": "10",
        "event_name": "Event #0",
        "event_facebook_id": null,

        "ticket_type_id": "10",
        "ticket_type_name": "Ticket Type #0",
        "ticket_type_external_id": null,

        "product_name": null,
        "product_id": null,
        "product_attribute_id": null,
        "product_attribute_name": null
      }
    ]
  }
}
```

## Fields reference

When we send the invoice structure as a webhook, we provide a set of fields with their corresponding values to convey information about the invoice. Here's a breakdown of the key fields and what information they represent:

| Field                 | Description                                                                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `event_type`          | The type of the event that triggered the webhook.<br>Choices = ['invoice.purchase', 'invoice.refund', 'invoice.void', 'invoice.transfer', 'invoice.transferred'] |
| `webhook_event_uuid`  | The UUID of the webhook event, you can use it as idempotency ID.                                                                                                 |
| `id`                  | The ID for verifying header, in this case it's same as data.transaction_id                                                                                       |
| `data.transaction_id` | Unique identifier for the transaction                                                                                                                            |
| `data.customer_name`  | Name of the customer who made the purchase                                                                                                                       |
| `data.payment_type`   | Payment method used for the transaction                                                                                                                          |
