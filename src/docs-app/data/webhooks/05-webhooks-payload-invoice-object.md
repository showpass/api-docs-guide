# Showpass Webhooks: Payload - Invoice object


When Showpass sends a webhook for invoice-related events (like `invoice.purchase`, `invoice.refund`, etc.), the payload delivered to your endpoint contains detailed information structured as an "Invoice" object. This section describes the format of this object.

---

## Sample webhook request (Invoice structure)

Here is an example of a request that Showpass sends as a webhook when delivering the invoice structure, typically for an `invoice.purchase` event.

**HTTP Method:** `POST`

**Target URL:** `https://yoursite.com/webhook/` (Your configured endpoint URL)

**Header (for security verification):** `X-SHOWPASS-SIGNATURE: "HMAC-SHA1_HASH"`

> **Note:** See section "3. Security" for details on verifying this signature.

**Request Body (JSON Payload):**

```json
{
  "id": "f1-1068-4af6-be8f-1222417da0f2",
  "data": {
    "currency": "CAD",
    "discounts": "0.00",
    "net_sales": "5.84",
    "total_tax": "0.25",
    "invoice_type": "sale",
    "payment_type": "credit",
    "service_fees": "0.59",
    "ticket_items": [
      {
        "id": 41349751,
        "event_id": "474708",
        "event_name": "Scanning",
        "product_id": null,
        "product_name": null,
        "event_ends_on": "2026-12-03T04:00:00Z",
        "ticket_status": "issued",
        "barcode_string": "5GHOEEHUG",
        "name_on_ticket": null,
        "ticket_type_id": "1657978",
        "email_on_ticket": null,
        "event_starts_on": "2026-12-02T04:00:00Z",
        "ticket_item_type": "ticket",
        "ticket_type_name": "A test ticket",
        "ticket_status_code": "2",
        "created_by_transfer": false,
        "last_name_on_ticket": null,
        "first_name_on_ticket": null,
        "product_attribute_id": null,
        "phone_number_on_ticket": null,
        "product_attribute_name": null
      }
    ],
    "customer_name": "No Name",
    "gross_revenue": "5.20",
    "invoice_items": [
      {
        "id": 21110231,
        "event_id": "474708",
        "quantity": 1,
        "discounts": "0.00",
        "net_sales": "5.84",
        "total_tax": "0.25",
        "event_name": "Scanning",
        "product_id": null,
        "product_name": null,
        "service_fees": "0.59",
        "gross_revenue": "5.20",
        "organizer_fees": "0.00",
        "ticket_type_id": "1657978",
        "ticket_type_name": "A test ticket",
        "event_facebook_id": null,
        "invoice_item_type": "ticket",
        "product_attribute_id": null,
        "account_credit_applied": "0.00",
        "product_attribute_name": null,
        "ticket_type_external_id": null
      }
    ],
    "customer_email": "example@showpass.com",
    "organizer_fees": "0.00",
    "transaction_id": "f1-1068-4af6-be8f-1222417da0f2",
    "invoice_type_id": "101",
    "other_payment_type": null,
    "subscribe_to_venue": false,
    "account_credit_type": null,
    "customer_phone_number": null,
    "account_credit_applied": "0.00",
    "showpass_organization_id": "5796"
  },
  "event_type": "invoice.purchase",
  "webhook_event_uuid": "09117c09-e1f8-4913-b2f5-52cc161cf5f7"
}
```

---

## Invoice object fields

The following table describes the fields typically found in the webhook payload when an invoice structure is sent. The exact fields present may vary slightly based on the event type and the specifics of the transaction.

| Path in JSON                                   | Description                                                                                                                                                                                                       |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                                           | The unique identifier for the webhook event itself. This corresponds to the webhook event record in Showpass and is useful for referencing in support or logs.                                                                   |
| `event_type`                                   | The type of event that triggered this webhook. <br>Choices: `['invoice.purchase', 'invoice.refund', 'invoice.void', 'invoice.transfer', 'invoice.transferred', 'webhook.test']`                                  |
| `webhook_event_uuid`                           | A unique UUID for this specific webhook event instance. You can use this as an idempotency key to prevent processing the same event multiple times.                                                               |
| `data`                                         | An object containing the core data for the event.                                                                                                                                                                 |
| `data.transaction_id`                          | Unique identifier for the transaction.                                                                                                                                                                            |
| `data.showpass_organization_id`                | Unique identifier for the Showpass organization associated with this transaction.                                                                                                                                 |
| `data.customer_name`                           | Name of the customer who made the purchase.                                                                                                                                                                       |
| `data.customer_email`                          | Email address of the customer.                                                                                                                                                                                    |
| `data.customer_phone_number`                   | Phone number of the customer, if available.                                                                                                                                                                       |
| `data.subscribe_to_venue`                      | Boolean indicating if the customer subscribed to marketing from the venue during checkout.                                                                                                                        |
| `data.payment_type`                            | Payment method used. <br>**Choices:** `['cash', 'credit', 'interac', 'complimentary', 'free', 'bundled', 'transferred', 'direct_deposit', 'other', 'payment_plan', 'user_credit', 'exchange_credit', 'afterpay']`     |
| `data.other_payment_type`                      | Type of "other" payment used, if applicable.                                                                                                                                                                      |
| `data.currency`                                | Currency code for the transaction (e.g., `CAD`, `USD`).                                                                                                                                                           |
| `data.discounts`                               | The total monetary amount of discounts applied to the entire invoice.                                                                                                                                             |
| `data.net_sales`                               | Total amount of the transaction after any discounts, refunds, or account credits.                                                                                                                                 |
| `data.service_fees`                            | Total amount of combined Showpass service fees and payment processing fees charged for the transaction.                                                                                                           |
| `data.account_credit_applied`                  | Total amount of account credit applied to the transaction, if applicable.                                                                                                                                         |
| `data.gross_revenue`                           | Total gross revenue on the transaction (typically `net_sales` - `service_fees` + `organizer_fees` + `total_tax`, but verify specific calculation based on your needs).                                            |
| `data.organizer_fees`                          | Total combined amount of fees charged by the organizer for the transaction.                                                                                                                                       |
| `data.total_tax`                               | Total combined amount of applicable taxes for the transaction.                                                                                                                                                    |
| `data.account_credit_type`                     | The type of account credit applied, if any.                                                                                                                                                                       |
| `data.invoice_type`                            | The type of invoice. <br>**Choices:** `['sale', 'refund']`                                                                                                                                                            |
| `data.invoice_type_id`                         | Unique identifier for the invoice type.                                                                                                                                                                           |
| `data.ticket_items`                            | An array of objects, each representing a ticket within the transaction. This is where you'll find details about individual tickets.                                                                               |
| `data.ticket_items[].event_id`                 | Unique identifier of the event the ticket is for.                                                                                                                                                                 |
| `data.ticket_items[].event_name`               | Name of the event.                                                                                                                                                                                                |
| `data.ticket_items[].event_starts_on`          | ISO 8601 formatted start date and time of the event (UTC).                                                                                                                                                        |
| `data.ticket_items[].event_ends_on`            | ISO 8601 formatted end date and time of the event (UTC).                                                                                                                                                          |
| `data.ticket_items[].first_name_on_ticket`     | First name of the ticket holder.                                                                                                                                                                                  |
| `data.ticket_items[].last_name_on_ticket`      | Last name of the ticket holder.                                                                                                                                                                                   |
| `data.ticket_items[].phone_number_on_ticket`   | Phone number of the ticket holder, if provided.                                                                                                                                                                   |
| `data.ticket_items[].email_on_ticket`          | Email address of the ticket holder.                                                                                                                                                                               |
| `data.ticket_items[].id`                       | Unique identifier for this specific ticket item within Showpass.                                                                                                                                                  |
| `data.ticket_items[].ticket_status`            | Human-readable status of the ticket. <br>**Choices:** `['pending', 'issued', 'voided', 'transferred']`                                                                                                                |
| `data.ticket_items[].barcode_string`           | Barcode or QR code string for the ticket, used for scanning and validation at the event.                                                                                                                          |
| `data.ticket_items[].name_on_ticket`           | Full name on the ticket (combination of first and last name).                                                                                                                                                     |
| `data.ticket_items[].ticket_type_id`           | Unique identifier for the ticket type.                                                                                                                                                                            |
| `data.ticket_items[].ticket_type_name`         | Name of the ticket type (e.g., "General Admission", "VIP").                                                                                                                                                       |
| `data.ticket_items[].ticket_item_type`         | Type of the ticket item. <br>**Choices:** `['ticket', 'membership', 'product']`                                                                                                                                       |
| `data.ticket_items[].ticket_status_code`       | Numeric status code for the ticket.                                                                                                                                                                               |
| `data.ticket_items[].created_by_transfer`      | Boolean indicating if this ticket was created as part of a transfer.                                                                                                                                              |
| `data.ticket_items[].product_name`             | Name of the product (if the ticket item is a product).                                                                                                                                                            |
| `data.ticket_items[].product_id`               | Unique identifier for the product (if applicable).                                                                                                                                                                |
| `data.ticket_items[].product_attribute_name`   | Name of the product attribute (e.g., size, color) if applicable.                                                                                                                                                  |
| `data.ticket_items[].product_attribute_id`     | Unique identifier for the product attribute (if applicable).                                                                                                                                                      |
| `data.invoice_items`                           | An array of objects, each representing a line item on the invoice. This provides a summary of each type of item purchased (e.g., each ticket type).                                                               |
| `data.invoice_items[].id`                      | Unique identifier for the invoice item.                                                                                                                                                                           |
| `data.invoice_items[].invoice_item_type`       | Type of the invoice item. <br>**Choices:** `['ticket', 'membership', 'product']`                                                                                                                                      |
| `data.invoice_items[].quantity`                | Quantity of this item purchased.                                                                                                                                                                                  |
| `data.invoice_items[].discounts`               | Discounts applied to this specific line item.                                                                                                                                                                     |
| `data.invoice_items[].net_sales`               | Net sales for this line item after discounts.                                                                                                                                                                     |
| `data.invoice_items[].service_fees`            | Service fees associated with this line item.                                                                                                                                                                      |
| `data.invoice_items[].account_credit_applied`  | Account credit applied to this line item.                                                                                                                                                                         |
| `data.invoice_items[].gross_revenue`           | Gross revenue for this line item.                                                                                                                                                                                 |
| `data.invoice_items[].organizer_fees`          | Organizer fees associated with this line item.                                                                                                                                                                    |
| `data.invoice_items[].total_tax`               | Tax applied to this line item.                                                                                                                                                                                    |
| `data.invoice_items[].event_id`                | Unique identifier for the event associated with this line item.                                                                                                                                                   |
| `data.invoice_items[].event_name`              | Name of the event.                                                                                                                                                                                                |
| `data.invoice_items[].event_facebook_id`       | Facebook event ID if the event is linked to Facebook.                                                                                                                                                             |
| `data.invoice_items[].ticket_type_id`          | Unique identifier for the ticket type.                                                                                                                                                                            |
| `data.invoice_items[].ticket_type_name`        | Name of the ticket type.                                                                                                                                                                                          |
| `data.invoice_items[].ticket_type_external_id` | External identifier for the ticket type (if applicable).                                                                                                                                                          |
| `data.invoice_items[].product_name`            | Name of the product (if the line item is a product).                                                                                                                                                              |
| `data.invoice_items[].product_id`              | Unique identifier for the product (if applicable).                                                                                                                                                                |
| `data.invoice_items[].product_attribute_id`    | Unique identifier for the product attribute (if applicable).                                                                                                                                                      |
| `data.invoice_items[].product_attribute_name`  | Name of the product attribute (if applicable).                                                                                                                                                                    |

---

## Using the payload

This structured payload allows you to:

- **Process orders:** Extract customer information, items purchased, and payment details
- **Update inventory:** Track ticket sales and product purchases
- **Send notifications:** Email confirmations, shipping updates, or custom alerts
- **Sync with external systems:** Update CRM records, accounting software, or analytics platforms
- **Handle refunds and transfers:** Track the complete lifecycle of tickets and orders

> **Important:** Always use the `webhook_event_uuid` as an idempotency key to prevent duplicate processing of the same event.
