# Passwords

Passwords are an access-control layer for event and ticket type inventory. They let your system create unique Showpass codes and send them to the customers who should receive access. Common use cases include controlled presales, approved complimentary access, private allocations, and eligibility-based ticket claims. Codes can stay reusable or be capped to a fixed ticket quantity for one-ticket or limited-ticket claims.

---

## Authentication

This endpoint requires authentication using a Showpass token:

```text
Authorization: Token YOUR_API_TOKEN
```

---

## Endpoints

The base URL for all password endpoints is:

```text
https://www.showpass.com/api/venue/{venue_id}/passwords/
```

| Method   | Path                | Description                         |
| -------- | ------------------- | ----------------------------------- |
| `GET`    | `/passwords/`       | List passwords for the venue        |
| `POST`   | `/passwords/`       | Create a password                   |
| `GET`    | `/passwords/{id}/`  | Retrieve a single password          |
| `PUT`    | `/passwords/{id}/`  | Update a password                   |
| `DELETE` | `/passwords/{id}/`  | Delete or deactivate a password binding |

### Path Parameters

| Parameter  | Type    | Status   | Description                                           |
| ---------- | ------- | -------- | ----------------------------------------------------- |
| `venue_id` | Integer | Required | The ID of the venue that owns the password            |
| `id`       | Integer | Required | The password ID for retrieve, update, and delete calls |

---

## Password Scopes

Each password record is created for one of three scopes.

| Scope | Use When | Key Fields |
| ----- | -------- | ---------- |
| Ticket type password | A code should unlock one configured ticket type without gating the whole event | `ticket_type` |
| Event password | A code should unlock the whole event | `event_id` |
| Event password with selected ticket types | A code should unlock selected ticket types within an event | `event_id`, `ticket_type_ids` |

> **Choosing a scope:** Use `ticket_type` when the code unlocks one configured ticket type. Use `event_id` with `ticket_type_ids` when the code should reveal a selected group of ticket types under the event.

---

## Request Body (Create / Update)

| Parameter         | Type          | Status   | Description |
| ----------------- | ------------- | -------- | ----------- |
| `password`        | String        | Required | Recipient-facing access code. When `is_regex_match` is true, this value is the regex pattern. Maximum 256 characters. |
| `ticket_type`     | Integer       | Conditional | Ticket type ID for a direct ticket type password. Provide either `ticket_type` or `event_id`, not both. |
| `event_id`        | Integer       | Conditional | Event ID for an event-scoped password. This is accepted on create/update but is not returned in the response. |
| `ticket_type_ids` | Array         | Optional | Event-scoped only. Restricts the event password to selected ticket type IDs. |
| `is_active`       | Boolean       | Optional | Whether the password can grant access. Defaults to true when omitted. |
| `start_time`      | DateTime/null | Required for active access | Start date/time for access. Set this to now or a past time when the password should work immediately. |
| `end_time`        | DateTime/null | Optional | End date/time for access. `null` means no scheduled end time. |
| `max_item_purchase_limit` | Integer/null | Optional | Maximum ticket quantity that can be claimed with this password. Set to `1` for a one-ticket code. `null` or omitted means reusable. Valid values are `1` through `10000`. |
| `is_regex_match`  | Boolean       | Optional | If true, `password` is treated as a case-insensitive regex pattern instead of an exact code. Defaults to false. |

---

## Create a Ticket Type Password

Use this when your integration generates a code for a specific protected ticket type.

```json
{
  "password": "APPROVED-ACCESS-2026",
  "ticket_type": 3002,
  "is_active": true,
  "start_time": "2026-07-02T18:00:00Z",
  "end_time": "2026-07-09T18:00:00Z",
  "max_item_purchase_limit": 1,
  "is_regex_match": false
}
```

---

## Create an Event Password

Use this when a code should unlock the event generally.

```json
{
  "password": "PRESALE-2026",
  "event_id": 98765,
  "is_active": true,
  "start_time": "2026-07-02T18:00:00Z",
  "end_time": null,
  "is_regex_match": false
}
```

---

## Create an Event Password for Selected Ticket Types

Use this when a code should unlock selected ticket types within an event.

```json
{
  "password": "SELECTED-ACCESS-2026",
  "event_id": 98765,
  "ticket_type_ids": [3002, 3003],
  "is_active": true,
  "start_time": "2026-07-02T18:00:00Z",
  "end_time": "2026-07-09T18:00:00Z"
}
```

---

## Response Fields

| Field                | Type          | Description |
| -------------------- | ------------- | ----------- |
| `id`                 | Integer       | Unique password ID |
| `password`           | String        | Stored access code or regex pattern |
| `ticket_type_ids`    | Array         | Event-scoped ticket type restrictions. Empty when unrestricted or for direct ticket type passwords. |
| `start_time`         | DateTime/null | Start date/time for access |
| `end_time`           | DateTime/null | End date/time for access |
| `is_active`          | Boolean       | Whether the password is active |
| `ticket_type`        | Integer/null  | Direct ticket type ID, when this is a ticket type password |
| `venue`              | Integer       | Venue ID |
| `password_use_count` | Integer       | Internal event attachment count. This is not a redemption count or purchase-limit field. |
| `max_item_purchase_limit` | Integer/null | Maximum ticket quantity that can be claimed with this password. `null` means reusable. |
| `is_regex_match`     | Boolean       | Whether the password is matched as a regex pattern |

> **Note:** `event_id` links the password to an event during create or update, including recurring child event bindings when applicable. It is not returned by this endpoint. Event-scoped password records return `ticket_type: null`; selected ticket type restrictions, when used, are returned in `ticket_type_ids`.

---

## Listing and Pagination

List responses are scoped to the venue in the URL.

```text
GET /api/venue/{venue_id}/passwords/
```

This endpoint uses optional pagination. If `page_size` is omitted, the response is an array. If `page_size` is provided, the response includes pagination metadata such as `count`, `next`, `previous`, and `results`.

```text
GET /api/venue/{venue_id}/passwords/?page_size=20&page=2
```

---

## Delete Behavior

For a direct ticket type password, delete the password by ID:

```text
DELETE /api/venue/{venue_id}/passwords/{id}/
```

For an event-scoped password, include the event ID so Showpass removes the correct event binding:

```text
DELETE /api/venue/{venue_id}/passwords/{id}/?event_id=98765
```

Deleting an event-scoped password removes its event binding and refreshes event password-protection status. Deleting a direct ticket type password deactivates the password relation for that ticket type and refreshes ticket type password-protection status.

---

## Business Rules

- **Caller-generated codes** — The API creates password records from values you provide. It does not generate random password strings.
- **One scope per password** — Send either `ticket_type` or `event_id`, not both.
- **Start time controls activation** — Set `start_time` to now or a past time when the code should work immediately. A missing or future `start_time` can be saved, but the code will not grant access until the active window has started.
- **End time is optional** — Set `end_time` when the code should expire automatically. Leave it `null` for no scheduled end time.
- **Active flag still applies** — `is_active: false` prevents access even when the current time is inside the start/end window.
- **Limited-use codes** — When `max_item_purchase_limit` is omitted or `null`, the password is reusable. Set `max_item_purchase_limit: 1` for a one-ticket code, or a larger integer for a limited-use code. The limit counts ticket quantity, not password-entry attempts or event-page unlocks.
- **Matching is case-insensitive** — Exact password matching is case-insensitive. Regex matching is also case-insensitive when `is_regex_match` is true.
- **Regex patterns match from the start** — Regex passwords use start-of-string matching. Include `.*` at the beginning when the entered value can contain the pattern later in the string.
- **Invalid regex patterns are skipped** — When `is_regex_match` is true and the stored pattern is invalid, the password does not match. Other valid password records can still grant access.
- **Recurring events propagate bindings** — Event-scoped passwords created on a recurring parent also create password bindings for child events. When `ticket_type_ids` are provided, child ticket type IDs may be added to the stored password record.
- **Single-record CRUD** — This endpoint creates one password record per request.

---

## Error Responses

### 400 Bad Request

Returned for validation failures:

```javascript
// A password cannot be both event-scoped and ticket-type-scoped
{
  "detail": "Cannot have event and ticket type on same password"
}
```

Also returned when `max_item_purchase_limit` is below `1` or above `10000`.

### 403 Forbidden

Returned when the authenticated user does not have permission to manage event configuration for the venue.

```javascript
{
  "detail": "You do not have permission to perform this action."
}
```

---

## Integration Patterns

### External Access Codes

Use this when another system owns the access request and delivery flow.

Create or identify the protected ticket type that the code should unlock, generate the code in your system, then create one password record with `ticket_type`. Store the returned password `id` with the request, and send the code through your normal customer communication flow.

### Customer-Specific Access Codes

Use this when each customer should receive a unique code.

Generate one unique `password` value per customer and create one password record per code for the same `ticket_type` or `event_id`. For large lists, create records in a controlled loop or coordinate with Showpass for bulk import support.

Set `max_item_purchase_limit` when each code should have its own claim limit. Use `max_item_purchase_limit: 1` when the approved customer should be able to claim one ticket total with that code. Leave it `null` when the code should remain reusable.

### Scheduled Access Window

Use this when a code should only work during a defined access window. For multiple access groups or phases, create separate password records with their own `start_time` and `end_time`.

Set `start_time` to the opening time and `end_time` to the closing time. Use `end_time: null` when the code should remain valid until it is manually retired, and set `is_active` to `false` with `PUT` if access should end before the scheduled close.

### Usage Review

Use the `Password Used Summary` CSV in Showpass Reports to review password entry counts and ticket quantities after codes are used. Use itemized sales exports with the `Password Used` column when reconciliation needs order-level detail.

### Regex Access Pattern

Use this only when a family of entered values should match one pattern, such as a controlled credential format.

Set `is_regex_match` to `true` and store the regex pattern in `password`; there is no separate regex field. Avoid broad patterns that could unlock access unintentionally.

Example request body:

```json
{
  "password": ".*\\.edu.*",
  "event_id": 98765,
  "is_active": true,
  "start_time": "2026-07-02T18:00:00Z",
  "end_time": null,
  "is_regex_match": true
}
```

This pattern matches any entered value that contains `.edu`, such as `student@university.edu`. Regex matching is case-insensitive.

### Retiring a Code

Set `is_active` to `false` with `PUT` when the password record should remain available by ID. Use `DELETE` when the event or ticket type binding should be removed.
