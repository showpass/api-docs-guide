# Partner API overview

Use the Partner API when your application owns the customer experience and Showpass provides event discovery, checkout, tickets, and order management.

The Partner API connects a customer in your system to their Showpass purchase. It complements the [Public Discovery API](/api/public-api-introduction), the [Ticket Purchase Widget](/sdk/ticket-purchase-widget), and [Showpass webhooks](/webhooks/webhooks-introduction).

## What the integration does

| Your application | Showpass |
| --- | --- |
| Owns the customer record and stable customer ID. | Links that ID to a Showpass customer. |
| Displays events returned by the Discovery API. | Owns event inventory and availability. |
| Opens the Showpass purchase widget. | Runs ticket selection, checkout, and payment. |
| Receives and reconciles order webhooks. | Owns orders, tickets, refunds, and transfers. |
| Requests an order-management link. | Gives the customer scoped access to the Showpass order page. |

## How a purchase is connected

1. Your backend [syncs the customer](/api/partner-api-users) using the stable ID from your system as `partner_user_id`.
2. Your application [discovers Showpass events by organization](/api/public-api-event-list-by-organization) and keeps the selected event `slug`.
3. Immediately before checkout, your backend [creates a customer attribution token](/api/partner-api-customer-attribution-token).
4. Your frontend passes the event slug and token to the [Ticket Purchase Widget](/sdk/ticket-purchase-widget).
5. Showpass validates the token and records the partner customer on the basket and completed order.
6. [Webhook payloads identify the partner customer](/api/partner-api-webhooks), so your system can reconcile order activity.
7. When the customer needs their tickets or receipt, your backend [creates a manage-order link](/api/partner-api-order-manage-link).

See [Build a partner ticketing flow](/api/partner-api-integration-flow) for the complete sequence and implementation examples.

## Identity and authentication are separate

`partner_user_id` is your stable identifier for a customer. A `customer_attribution_token` carries that server-owned relationship into a Showpass checkout. The token provides purchase attribution only: it does not sign a customer in, prove their identity in the browser, or create a full Showpass session.

Partner credentials authenticate your backend. Never send the partner secret, `partner_user_id`, bearer tokens, or refresh tokens to the purchase widget.

## Base URL and access

```text
https://www.showpass.com/api/partner/
```

Showpass provides Partner API credentials and enables the required capabilities during partner onboarding. Contact your Showpass representative for a Key ID and Secret.

## HMAC authentication

Every Partner API request is server-to-server and includes these headers:

| Header | Description |
| --- | --- |
| `X-Showpass-Partner-Key-Id` | Partner credential key ID. |
| `X-Showpass-Partner-Timestamp` | Unix timestamp in seconds. Requests outside the five-minute acceptance window are rejected. |
| `X-Showpass-Partner-Nonce` | A unique value for this request. A nonce cannot be reused. |
| `X-Showpass-Partner-Signature` | `sha256=` followed by the HMAC-SHA256 digest. |

Calculate the signature with the partner secret over this newline-separated canonical value:

```text
v1
TIMESTAMP
NONCE
HTTP_METHOD
PATH_AND_QUERY
SHA256_OF_RAW_REQUEST_BODY
```

Sign the exact method, path and query string, and body bytes sent to Showpass. For an empty body, hash the empty byte string.

```python
import hashlib
import hmac
import time
import uuid

partner_secret = "your-partner-secret"
body = '{"partner_user_id":"customer-42"}'
timestamp = str(int(time.time()))
nonce = str(uuid.uuid4())
path_and_query = "/api/partner/customer-attribution-token/"
body_hash = hashlib.sha256(body.encode()).hexdigest()

canonical = "\n".join([
    "v1",
    timestamp,
    nonce,
    "POST",
    path_and_query,
    body_hash,
])
signature = "sha256=" + hmac.new(
    partner_secret.encode(),
    canonical.encode(),
    hashlib.sha256,
).hexdigest()
```

Missing or invalid authentication returns `403`. Generate a new timestamp, nonce, and signature for every request.

## Organization scope

A Partner integration can be restricted to one Showpass organization. When a credential has this restriction, a request cannot operate outside it. The Partner API currently represents this scope with the `venue_id` request and response field.

Partner customer IDs are trimmed, normalized to lowercase, and unique within a Partner integration.

## Endpoint catalog

| Method | Endpoint | Use it to |
| --- | --- | --- |
| `POST` | [`/api/partner/users/`](/api/partner-api-users) | Connect a customer in your system to Showpass. |
| `POST` | [`/api/partner/customer-attribution-token/`](/api/partner-api-customer-attribution-token) | Carry that customer relationship into checkout. |
| `POST` | [`/api/partner/orders/manage-link/`](/api/partner-api-order-manage-link) | Send the customer to a specific Showpass order. |
