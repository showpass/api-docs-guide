# Showpass webhooks: Payload - Invoice object

When Showpass sends a webhook for invoice-related events (like `invoice.purchase`, `invoice.refund`, etc.), the payload delivered to your endpoint contains detailed information structured as an "Invoice" object. This section describes the format of this object.

## Sample webhook request (Invoice structure)

Here is an example of a request that Showpass sends as a webhook when delivering the invoice structure, typically for an `invoice.purchase` event.

- **HTTP Method:** `POST`
- **Target URL:** `https://yoursite.com/webhook/` (Your configured endpoint URL)
- **Header (for security verification):** `X-SHOWPASS-SIGNATURE: "HMAC-SHA1_HASH"` (See "Webhook Security" for details on verifying this signature)
- **Request Body (JSON Payload):**

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

## Invoice object fields

The following table describes the fields typically found in the webhook payload when an invoice structure is sent. The exact fields present may vary slightly based on the event type and the specifics of the transaction.

| Path in JSON                                   | Description                                                                                                                                                                                                       |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                                           | The ID used for verifying the `X-SHOWPASS-SIGNATURE` header. For invoice events, this is usually the same as `data.transaction_id`.                                                                               |
| `event_type`                                   | The type of the event that triggered the webhook. <br>Choices: `['invoice.purchase', 'invoice.refund', 'invoice.void', 'invoice.transfer', 'invoice.transferred', 'webhook.test']`                                |
| `webhook_event_uuid`                           | A unique UUID for this specific webhook event instance. You can use this as an idempotency key to prevent processing the same event multiple times.                                                               |
| `data`                                         | An object containing the core data for the event.                                                                                                                                                                 |
| `data.transaction_id`                          | Unique identifier for the transaction.                                                                                                                                                                            |
| `data.showpass_organization_id`                | Unique identifier for the Showpass organization associated with this transaction.                                                                                                                                 |
| `data.customer_name`                           | Name of the customer who made the purchase.                                                                                                                                                                       |
| `data.customer_email`                          | Email address of the customer.                                                                                                                                                                                    |
| `data.customer_phone_number`                   | Phone number of the customer, if available.                                                                                                                                                                       |
| `data.subscribe_to_venue`                      | Boolean indicating if the customer subscribed to marketing from the venue during checkout.                                                                                                                        |
| `data.payment_type`                            | Payment method used. <br>Choices: `['cash', 'credit', 'interac', 'complimentary', 'free', 'bundled', 'transferred', 'direct_deposit', 'other', 'payment_plan', 'user_credit', 'exchange_credit', 'afterpay']`     |
| `data.other_payment_type`                      | Type of "other" payment used, if applicable.                                                                                                                                                                      |
| `data.currency`                                | Currency code for the transaction (e.g., `CAD`, `USD`).                                                                                                                                                           |
| `data.discounts`                               | The total monetary amount of discounts applied to the entire invoice.                                                                                                                                             |
| `data.net_sales`                               | Total amount of the transaction after any discounts, refunds, or account credits.                                                                                                                                 |
| `data.service_fees`                            | Total amount of combined Showpass service fees and payment processing fees charged for the transaction.                                                                                                           |
| `data.account_credit_applied`                  | Total amount of account credit applied to the transaction, if applicable.                                                                                                                                         |
| `data.gross_revenue`                           | Total gross revenue on the transaction (typically `net_sales` - `service_fees` + `organizer_fees` + `total_tax`, but verify specific calculation based on your needs).                                            |
| `data.organizer_fees`                          | Total combined amount of fees charged by the organizer for the transaction.                                                                                                                                       |
| `data.total_tax`                               | Total combined amount of tax included in the transaction.                                                                                                                                                         |
| `data.account_credit_type`                     | The type of account credit applied to the invoice. <br>Choices: `['venue_credit', 'user_credit', 'referral_credit', 'exchange_credit']`                                                                           |
| `data.invoice_type`                            | The type of the invoice generated. <br>Choices: `['sale', 'refund', 'transfer', 'void']`                                                                                                                          |
| `data.invoice_type_id`                         | Unique identifier for this specific invoice. (Note: The sample has `invoice_type_id`, this might be the main invoice ID distinct from `transaction_id` in some contexts).                                         |
| `data.ticket_items`                            | An array of objects, where each object contains information about an individual ticket generated as part of this invoice.                                                                                         |
| `data.ticket_items[].event_id`                 | Unique identifier for the event associated with the ticket.                                                                                                                                                       |
| `data.ticket_items[].event_name`               | Name of the event.                                                                                                                                                                                                |
| `data.ticket_items[].event_starts_on`          | ISO 8601 date and time the event starts (UTC).                                                                                                                                                                    |
| `data.ticket_items[].event_ends_on`            | ISO 8601 date and time the event ends (UTC).                                                                                                                                                                      |
| `data.ticket_items[].first_name_on_ticket`     | First name of the attendee on the ticket.                                                                                                                                                                         |
| `data.ticket_items[].last_name_on_ticket`      | Last name of the attendee on the ticket.                                                                                                                                                                          |
| `data.ticket_items[].phone_number_on_ticket`   | Phone number on the ticket, if collected.                                                                                                                                                                         |
| `data.ticket_items[].email_on_ticket`          | Email address on the ticket.                                                                                                                                                                                      |
| `data.ticket_items[].id`                       | Unique identifier for this specific ticket instance.                                                                                                                                                              |
| `data.ticket_items[].ticket_status`            | Current status of the ticket. <br>Choices: `['pending', 'issued', 'resold', 'scanned', 'refund_in_progress', 'refunded', 'voided', 'transferred', 'expired', 'suspected_fraud', 'on_hold', 'selection_required']` |
| `data.ticket_items[].ticket_status_code`       | Numerical status code of the ticket.                                                                                                                                                                              |
| `data.ticket_items[].barcode_string`           | The barcode string for the ticket.                                                                                                                                                                                |
| `data.ticket_items[].name_on_ticket`           | Full name of the attendee on the ticket.                                                                                                                                                                          |
| `data.ticket_items[].ticket_type_id`           | Unique identifier for the type of ticket (e.g., "General Admission", "VIP").                                                                                                                                      |
| `data.ticket_items[].ticket_type_name`         | Name of the ticket type.                                                                                                                                                                                          |
| `data.ticket_items[].ticket_item_type`         | Type of item this ticket represents (e.g., `ticket`, `addon`).                                                                                                                                                    |
| `data.ticket_items[].created_by_transfer`      | Boolean indicating if this ticket was created as a result of a transfer.                                                                                                                                          |
| `data.ticket_items[].product_name`             | Name of the product associated with this ticket item (if it's a product or an add-on that's ticketed).                                                                                                            |
| `data.ticket_items[].product_id`               | Unique ID of the product, if applicable.                                                                                                                                                                          |
| `data.ticket_items[].product_attribute_name`   | Name of the product attribute (e.g., size, color), if applicable.                                                                                                                                                 |
| `data.ticket_items[].product_attribute_id`     | Unique ID of the product attribute, if applicable.                                                                                                                                                                |
| `data.invoice_items`                           | An array of objects, where each object provides a summary of line items on the invoice (e.g., one line item for 2 GA tickets, another for 1 VIP ticket).                                                          |
| `data.invoice_items[].id`                      | Unique identifier for this specific invoice line item.                                                                                                                                                            |
| `data.invoice_items[].invoice_item_type`       | Type of the invoice item. <br>Choices: `['product', 'ticket', 'membership', 'refund', 'transfer', ...]` (see sample for more choices)                                                                             |
| `data.invoice_items[].quantity`                | The quantity of this specific item on the invoice (e.g., 2 for two GA tickets).                                                                                                                                   |
| `data.invoice_items[].discounts`               | Total discounts applied to this specific line item.                                                                                                                                                               |
| `data.invoice_items[].net_sales`               | Net sales amount for this line item (after discounts).                                                                                                                                                            |
| `data.invoice_items[].service_fees`            | Service and processing fees for this line item.                                                                                                                                                                   |
| `data.invoice_items[].account_credit_applied`  | Account credit applied to this line item.                                                                                                                                                                         |
| `data.invoice_items[].gross_revenue`           | Gross revenue for this line item.                                                                                                                                                                                 |
| `data.invoice_items[].organizer_fees`          | Organizer fees for this line item.                                                                                                                                                                                |
| `data.invoice_items[].total_tax`               | Total tax for this line item.                                                                                                                                                                                     |
| `data.invoice_items[].event_id`                | Event ID associated with this line item (if applicable).                                                                                                                                                          |
| `data.invoice_items[].event_name`              | Event name for this line item (if applicable).                                                                                                                                                                    |
| `data.invoice_items[].event_facebook_id`       | Facebook Event ID, if applicable.                                                                                                                                                                                 |
| `data.invoice_items[].ticket_type_id`          | Ticket type ID for this line item (if it's for tickets).                                                                                                                                                          |
| `data.invoice_items[].ticket_type_name`        | Ticket type name.                                                                                                                                                                                                 |
| `data.invoice_items[].ticket_type_external_id` | External ID for the ticket type, if used.                                                                                                                                                                         |
| `data.invoice_items[].product_name`            | Product name for this line item (if it's for a product).                                                                                                                                                          |
| `data.invoice_items[].product_id`              | Product ID.                                                                                                                                                                                                       |
| `data.invoice_items[].product_attribute_id`    | Product attribute ID.                                                                                                                                                                                             |
| `data.invoice_items[].product_attribute_name`  | Product attribute name.                                                                                                                                                                                           |

Understanding this payload structure is essential for correctly processing the data sent by Showpass webhooks and integrating it into your systems. Always refer to the `event_type` to understand the context of the payload.
