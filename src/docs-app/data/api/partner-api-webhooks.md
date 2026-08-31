# Match orders to your customers

Showpass webhooks report purchases and post-purchase changes. For an attributed checkout, the payload can include the stable customer ID from your system:

```json
{
  "event_type": "invoice.purchase",
  "data": {
    "partner_slug": "your-partner",
    "partner_user_id": "customer-42"
  }
}
```

Use `partner_user_id` to find the customer in your system. Use the webhook’s Showpass transaction identifier to find or create the corresponding order record.

The Partner fields extend the existing event-specific `data` object. They do not replace the normal invoice, customer, ticket, or transaction fields documented for that webhook.

## Supported order activity

Partner attribution can be included on these existing events:

| Event | Use it to |
| --- | --- |
| `invoice.purchase` | Record a completed purchase. |
| `invoice.refund` | Reconcile a refund. |
| `invoice.void` | Mark a transaction as voided. |
| `invoice.transfer` | Record the recipient-side order and tickets created by a transfer. |
| `invoice.transferred` | Update the original purchaser’s order and tickets after a transfer. |

Choose the events required by your product. Most integrations begin with `invoice.purchase` and add refund, void, and transfer events when they display post-purchase order state.

## Delivery and verification

Partner attribution does not create a separate webhook or receiver. Configure the normal Showpass webhook events and URL, then verify every delivery using the documented `X-SHOWPASS-SIGNATURE` header before processing it.

See [Webhook setup and management](/webhooks/webhooks-setup-and-management), [webhook security](/webhooks/webhooks-security), and the [invoice payload reference](/webhooks/webhooks-payload-invoice-object).

Process deliveries idempotently using the webhook event identifier or the equivalent event-specific identifier. Expect retries and events that arrive after the initial purchase.

## When Partner fields are absent

Showpass includes Partner fields only when it can resolve one clear Partner customer for the order. If no attribution exists—or the match is ambiguous—the normal webhook is still delivered without `partner_slug` and `partner_user_id`.

Treat missing Partner fields as an unattributed Showpass order. Do not infer the Partner customer from buyer email alone.
