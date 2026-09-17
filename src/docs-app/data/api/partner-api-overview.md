# Partner API: Overview

The Partner API connects your application's customers to Showpass. Use it when you build your own website or mobile app and use Showpass for event discovery, checkout, tickets, and order management.
In supported checkout and order management flows, customers can complete their purchase or access their order without a separate Showpass login. This does not create a full Showpass account session.
It complements the [Public Discovery API](/api/public-api-introduction), the [Ticket Purchase Widget](/sdk/ticket-purchase-widget), and [Showpass webhooks](/webhooks/webhooks-introduction).

The Partner API is available for Showpass Partners. If you'd like to learn more or become a partner, please contact us.

## What the integration does

| Your application | Showpass |
| --- | --- |
| Owns the customer record and stable customer ID. | Links that ID to a Showpass customer. |
| Displays events returned by the Discovery API. | Owns event inventory and availability. |
| Opens the Showpass purchase widget. | Runs ticket selection, checkout, and payment. |
| Receives and reconciles order webhooks. | Owns orders, tickets, refunds, and transfers. |
| Requests an order-management link. | Gives the customer scoped access to the Showpass order page. |

## How a purchase is connected

1. Your backend [syncs the customer](/api/partner-api-users) using the stable ID from your system as `partner_external_user_id`.
2. Your application [discovers Showpass events by organization](/api/public-api-event-list-by-organization) and keeps the selected event `slug`.
3. Immediately before checkout, your backend [creates a customer attribution token](/api/partner-api-customer-attribution-token).
4. Your frontend passes the event slug and token to the [Ticket Purchase Widget](/sdk/ticket-purchase-widget).
5. Showpass validates the token and records the partner customer on the basket and completed order.
6. [Webhook payloads identify the partner customer](/api/partner-api-webhooks), so your system can reconcile order activity.
7. When the customer needs their tickets or receipt, your backend [creates a manage-order link](/api/partner-api-order-manage-link).

## Identity and authentication are separate

`partner_external_user_id` is your stable identifier for a customer. A `customer_attribution_token` carries that server-owned relationship into a Showpass checkout. The token provides purchase attribution only: it does not sign a customer in, prove their identity in the browser, or create a full Showpass session.

## Base URL and access

```text
https://www.showpass.com/api/v1/partner/
```

Showpass provides a Partner credential and enables the required capabilities during partner onboarding. Contact your Showpass representative for the complete credential:

```text
sp_partner_<credential_uuid>.<random_secret>
```

Store this complete value in your backend's secret manager, for example as `PARTNER_CREDENTIAL`. Your signing client splits it at the first period: the part before the period is the key ID, and the part after it is the secret used for HMAC signing. Send only the key ID in `X-Showpass-Partner-Key-Id`; never send the secret or complete credential in a request header or body. The complete value is not an `Authorization: Token` or bearer token.

## HMAC authentication

Every Partner API request is server-to-server and includes these headers:

| Header | Description |
| --- | --- |
| `X-Showpass-Partner-Key-Id` | Partner credential key ID. |
| `X-Showpass-Partner-Timestamp` | Unix timestamp in seconds. |
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

The first line, `v1`, identifies the HMAC signing protocol, independently of the API URL version. A future URL version would not automatically change this marker or the signing algorithm.

Sign the uppercase HTTP method, exact path and query string, and body bytes sent to Showpass. Include the trailing slash. For an empty body, hash the empty byte string. If you change the path or JSON body, calculate a new signature over the changed request.

```python
import hashlib
import hmac
import os
import time
import uuid

credential = os.environ["PARTNER_CREDENTIAL"].strip()
partner_key_id, separator, partner_secret = credential.partition(".")
if not separator or not partner_key_id or not partner_secret:
    raise ValueError("Invalid Partner credential: expected key_id.secret")

body = '{"partner_external_user_id":"customer-42"}'
timestamp = str(int(time.time()))
nonce = str(uuid.uuid4())
path_and_query = "/api/v1/partner/customer-attribution-token/"
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

A Partner integration must have explicit Showpass organization assignments. It can be assigned multiple organizations; an assignment may also include child organizations when Showpass enables that option.

Customer sync requires a `venue_id` on every request. The response echoes that organization ID. Checkout validates the basket's payment organization, and manage-order access validates the order's organization against the integration's current assignments.

## Endpoint catalog

| Method | Endpoint | Use it to |
| --- | --- | --- |
| `POST` | [`/api/v1/partner/users/`](/api/partner-api-users) | Connect a customer in your system to Showpass. |
| `POST` | [`/api/v1/partner/customer-attribution-token/`](/api/partner-api-customer-attribution-token) | Carry that customer relationship into checkout. |
| `POST` | [`/api/v1/partner/orders/manage-link/`](/api/partner-api-order-manage-link) | Send the customer to a specific Showpass order. |

## Errors and retries

| Status | Meaning | Next action |
| --- | --- | --- |
| `400` | Missing or invalid request data. | Correct the reported field before retrying. |
| `403` | Authentication failed, a capability is disabled, or organization scope is denied. | Check signing, credentials, onboarding capabilities, and organization assignments. |
| `409` | A customer or order is missing, inactive, conflicting, or otherwise unavailable for the operation. | Resolve the endpoint-specific conflict before retrying. |
| `429` | Too many requests from the client IP. | Wait for `Retry-After` before sending another request. |

Validation errors include `detail`, `field`, and `error_list`. For example, a customer sync request that supplies all other required fields but omits `venue_id` returns `400`:

```json
{
  "detail": "Venue Id: This field is required.",
  "field": "venue_id",
  "error_list": ["Venue Id: This field is required."]
}
```

Authentication and domain errors can instead return only `detail`. The attribution-token endpoint also supplies a string `error_code` for its documented capability and identity errors.
