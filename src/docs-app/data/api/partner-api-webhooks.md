# Partner attribution in webhooks

Partner attribution adds two optional fields to an existing Showpass webhook:

```json
{
  "partner_slug": "partner-name",
  "partner_user_id": "customer-42"
}
```

This helps your partner application match a purchase, refund, void, or transfer
to the customer in its own system.

Partner attribution can be included on these existing webhook events:

- `invoice.purchase`: a completed purchase.
- `invoice.refund`: a refund.
- `invoice.void`: a voided transaction.
- `invoice.transfer`: the recipient-side invoice and ticket records created by
  a ticket transfer.
- `invoice.transferred`: the original purchaser’s invoice and ticket records
  updated by a ticket transfer.

## Important

This is not a new webhook or a new webhook URL. You use the same webhook setup,
events, signatures, and delivery process described in the [Webhooks
introduction](/webhooks/webhooks-introduction).

For supported Partner integrations, Showpass adds the fields when it finds one
clear partner customer match. If there is no match or more than one possible
match, Showpass sends the normal webhook payload without these fields. The
webhook is still delivered.

For the supported event list and signature verification, see [webhook event
types](/webhooks/webhooks-event-types) and [webhook
security](/webhooks/webhooks-security).
