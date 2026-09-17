# Partner API: Match orders to your customers

Showpass webhooks report purchases and post-purchase changes. For an attributed checkout, the payload can include the stable customer ID from your system. This abbreviated purchase example shows the fields needed for correlation:

```json
{
  "id": "d9-1234-4abc-8def-123456789abc",
  "event_type": "invoice.purchase",
  "webhook_event_uuid": "09117c09-e1f8-4913-b2f5-52cc161cf5f7",
  "data": {
    "showpass_organization_id": 456,
    "transaction_id": "d9-1234-4abc-8def-123456789abc",
    "partner_slug": "your-partner",
    "partner_external_user_id": "customer-42"
  }
}
```

Check that `data.partner_slug` identifies your integration before looking up `data.partner_external_user_id`. Customer IDs are scoped to a Partner integration and venue. Use `data.showpass_organization_id` together with the Partner slug and external ID to resolve the venue customer mapping. Use `data.transaction_id` to correlate the event's transaction and `webhook_event_uuid` to deduplicate deliveries.

For invoice events, the top-level `id` identifies the invoice transaction and is used for signature verification. It is not the unique webhook event ID. Different events can refer to the same transaction.

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

## Attribution on transfers

On both `invoice.transfer` and `invoice.transferred`, the Partner fields come from the original sale's attribution, including when a transfer follows an earlier transfer. They identify the original attributed customer, not necessarily the recipient of the transferred tickets. Do not assign the recipient's order to that customer based on these fields alone.

Use the event-specific invoice and ticket data to process the transfer. Partner fields are omitted for distributor transfers and transfers across organizations. The standard transfer webhook can still be delivered.

## Delivery and verification

Partner attribution does not create a separate webhook or receiver. Configure the normal Showpass webhook events and URL, then verify every delivery using the documented `X-SHOWPASS-SIGNATURE` header before processing it.

See [Webhook setup and management](/webhooks/webhooks-setup-and-management), [webhook security](/webhooks/webhooks-security), and the [invoice payload reference](/webhooks/webhooks-payload-invoice-object).

Persist `webhook_event_uuid` with your processing result so a retry does not apply the same event twice. Do not deduplicate solely by `id` or `data.transaction_id`, since that can discard distinct events for one transaction. The request payload and event UUID are persisted when the event is created and reused on retries; attribution is not recalculated for each delivery. Do not expect retrying an event to add previously missing Partner fields.

Expect retries and events that arrive after the initial purchase. The webhook signing secret and HMAC-SHA1 scheme are separate from the Partner API credentials and HMAC-SHA256 request-signing scheme.

## When Partner fields are absent

Showpass includes Partner fields only when enrichment is enabled and it can safely resolve one clear attribution for the event. Fields can be absent because no attribution exists, the match is ambiguous, enrichment is disabled, a lookup fails, or a transfer is excluded. The standard webhook continues without the Partner fields when enrichment is unavailable.

Missing Partner fields mean this delivery does not provide Partner attribution. Preserve any previously established association; their absence does not prove the order was never attributed. Do not infer the Partner customer from buyer email alone.
