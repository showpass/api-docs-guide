# Discounts

The Discounts API lets an authenticated organizer create and manage discount records for a venue. For most integrations, this means creating a code that customers enter during checkout, optionally scoped to specific events, ticket types, products, or memberships.

This page documents the single-discount CRUD endpoint. Bulk generation of many unique codes is handled by a separate bulk-order endpoint and is not covered here.

---

## Authentication

This endpoint requires authentication using a Showpass token:

```text
Authorization: Token YOUR_API_TOKEN
```

The token must belong to a user that can manage the venue. Create, retrieve, update, and delete operations require venue event-management permission.

---

## Endpoints

The base URL for all discount endpoints is:

```text
https://www.showpass.com/api/venue/{venue_id}/financials/discounts/
```

| Method   | Path               | Description                         |
| -------- | ------------------ | ----------------------------------- |
| `GET`    | `/discounts/`      | List discounts for the venue        |
| `POST`   | `/discounts/`      | Create a discount                   |
| `GET`    | `/discounts/{id}/` | Retrieve a single discount          |
| `PUT`    | `/discounts/{id}/` | Update a discount                   |
| `DELETE` | `/discounts/{id}/` | Deactivate a discount by soft delete |

### Path Parameters

| Parameter  | Type    | Status   | Description                                           |
| ---------- | ------- | -------- | ----------------------------------------------------- |
| `venue_id` | Integer | Required | The ID of the venue that owns the discount            |
| `id`       | Integer | Required | The discount ID for retrieve, update, and delete calls |

---

## Request Body (Create / Update)

| Parameter                    | Type          | Status   | Description                                                                 |
| ---------------------------- | ------------- | -------- | --------------------------------------------------------------------------- |
| `code`                       | String        | Optional | Customer-facing code. If omitted, Showpass generates one. Submitted codes are uppercased. |
| `description`                | String        | Optional | Human-readable description. Defaults to the code when omitted.              |
| `type`                       | Integer       | Optional | Discount type. Use `1` for a standard code-based discount.                  |
| `percentage`                 | Decimal       | Optional | Percent off, such as `"25.00"` for 25 percent off.                          |
| `amount`                     | Decimal       | Optional | Fixed amount off, such as `"10.00"`.                                        |
| `limit`                      | Integer/null  | Optional | Maximum total number of redemptions. `null` means no overall limit.         |
| `per_user_limit`             | Integer/null  | Optional | Maximum number of redemptions per customer. `null` means no per-user limit. |
| `basket_limit`               | Integer/null  | Optional | Maximum number of times the discount can apply within one basket.           |
| `per_event_limit`            | Integer/null  | Optional | Maximum number of redemptions per event.                                    |
| `is_public`                  | Boolean       | Optional | Whether the discount is active for normal redemption.                       |
| `starts_on`                  | DateTime/null | Optional | Start date/time for the discount.                                           |
| `ends_on`                    | DateTime/null | Optional | End date/time for the discount. Must be after `starts_on`.                  |
| `allowed_checkouts`          | Array         | Optional | Checkout surfaces where the code can be used. Defaults to box office and public checkout. |
| `apply_method`               | Integer       | Optional | How the discount is applied. See Apply Methods below.                       |
| `permission_type`            | String        | Optional | How item restrictions are interpreted. See Restricting Eligible Items below. |
| `event_discount_permissions` | Array         | Optional | Event, membership, or product restrictions.                                 |
| `minimum_quantity`           | Integer/null  | Optional | Quantity threshold for quantity-based discount behavior.                    |
| `maximum_quantity`           | Integer/null  | Optional | Maximum quantity threshold for quantity-based discount behavior.            |
| `reference`                  | String/null   | Optional | External reference value.                                                   |
| `discount_rules`             | Array         | Optional | Auto-discount rules. Only valid for auto-applied discounts.                 |

The `venue` field is set from `{venue_id}` in the URL. It is returned in responses, but it does not need to be included in create requests.

For a typical API-created discount code, send `type: 1`, choose either `percentage` or `amount`, set any redemption limits required by your integration, and include item restrictions when the code should only apply to specific inventory.

---

## Discount Types

For developer integrations that issue discount codes, use `type: 1`.

| Value | Name             | Recommended Use                                                          |
| ----- | ---------------- | ------------------------------------------------------------------------ |
| `1`   | Discount Code    | Standard customer-entered discount code. This is the primary documented workflow for this endpoint. |
| `8`   | Auto Discount    | Automatically applied discount. Requires `discount_rules` and venue eligibility. Use only when building an auto-discount integration. |

You may see other discount type values on existing records returned by the API. Those values represent specialized or system-managed Showpass workflows and are not documented as public create workflows here.

A discount's `type` cannot be changed after creation. Update requests that include a different `type` leave the existing type unchanged.

---

## Response Fields

| Field                        | Type          | Description                                      |
| ---------------------------- | ------------- | ------------------------------------------------ |
| `id`                         | Integer       | Unique discount ID                               |
| `venue`                      | Integer       | Venue that owns the discount                     |
| `code`                       | String        | Discount code                                    |
| `description`                | String        | Human-readable description                       |
| `percentage`                 | Decimal       | Percent off                                      |
| `amount`                     | Decimal       | Fixed amount off                                 |
| `limit`                      | Integer/null  | Overall redemption limit                         |
| `per_user_limit`             | Integer/null  | Per-customer redemption limit                    |
| `basket_limit`               | Integer/null  | Per-basket application limit                     |
| `per_event_limit`            | Integer/null  | Per-event redemption limit                       |
| `is_public`                  | Boolean       | Whether the discount is active for redemption    |
| `starts_on`                  | DateTime/null | Start date/time                                  |
| `ends_on`                    | DateTime/null | End date/time                                    |
| `type`                       | Integer       | Discount type                                    |
| `allowed_checkouts`          | Array         | Checkout surfaces where the code can be used     |
| `permission_type`            | String/null   | Item restriction mode                            |
| `apply_method`               | Integer       | Discount application method                      |
| `event_discount_permissions` | Array         | Nested event, membership, or product restrictions |
| `created_by`                 | Integer/null  | User who created the discount                    |
| `discount_rules`             | Array         | Auto-discount rules                              |
| `stats`                      | Object        | Usage statistics                                 |

---

## Apply Methods

| Value | Name                                | Description                                  |
| ----- | ----------------------------------- | -------------------------------------------- |
| `1`   | Apply to each item individually     | Applies the discount to each eligible item   |
| `2`   | Single application to entire basket | Applies the discount once to the basket      |

---

## Allowed Checkouts

| Value                     | Description                         |
| ------------------------- | ----------------------------------- |
| `disc_allowed_box_office` | Code can be used in Box Office      |
| `disc_allowed_public`     | Code can be used in public checkout |

If `allowed_checkouts` is omitted, the default is both box office and public checkout.

---

## Restricting Eligible Items

Use `permission_type` and `event_discount_permissions` to control which items a discount can apply to.

| `permission_type` Value            | Description                                      |
| ---------------------------------- | ------------------------------------------------ |
| `disc_level_venue`                 | Applies broadly to eligible items for the venue  |
| `disc_level_ticket_type`           | Applies only to the specified items              |
| `disc_level_excluded_ticket_type`  | Applies to eligible items except the specified items |
| `disc_level_all`                   | System-level broad applicability                 |

The default permission type is `disc_level_ticket_type`.

The most common restriction is an event with one or more ticket types:

```json
{
  "permission_type": "disc_level_ticket_type",
  "event_discount_permissions": [
    {
      "event": 12345,
      "tt_discount_permissions": [
        {
          "ticket_type": 67890
        },
        {
          "ticket_type": 67891
        }
      ]
    }
  ]
}
```

Each `event_discount_permissions` entry can target one of:

| Field              | Description         |
| ------------------ | ------------------- |
| `event`            | Event ID            |
| `membership_group` | Membership group ID |
| `product`          | Product ID          |

Each nested `tt_discount_permissions` entry can target one of:

| Field               | Description          |
| ------------------- | -------------------- |
| `ticket_type`       | Ticket type ID       |
| `membership_level`  | Membership level ID  |
| `product_attribute` | Product attribute ID |

Include explicit restrictions whenever a code should only apply to specific inventory.

---

## Auto Discounts

Auto discounts are not customer-entered codes. They are automatically applied when a basket meets configured requirements.

Create an auto discount with `type: 8` and a `discount_rules` array. Each rule defines a basket or item threshold and the discount that applies when that threshold is met.

| Field           | Type          | Description                                                        |
| --------------- | ------------- | ------------------------------------------------------------------ |
| `minimum_limit` | Decimal/null  | Lower bound for the rule                                           |
| `maximum_limit` | Decimal/null  | Upper bound for the rule                                           |
| `limit_type`    | Integer       | Threshold type: `1` item quantity, `2` total basket quantity, or `3` total purchase amount |
| `amount`        | Decimal       | Fixed amount off for the rule                                      |
| `percentage`    | Decimal       | Percent off for the rule                                           |
| `venue`         | Integer       | Venue ID for the rule                                              |

Rules must follow these constraints:

- Auto discounts require `discount_rules`.
- Non-auto discounts cannot include `discount_rules`.
- All rules in one auto discount must use the same `limit_type`.
- Rule ranges cannot overlap.
- Each rule must use either `amount` or `percentage`, not both.
- The venue must have auto discounts enabled and be on an eligible pricing tier.

---

## Filtering and Search

### Search

Use `search` to match discount `code` or `description`:

```text
GET /api/venue/{venue_id}/financials/discounts/?search=SKYLINE
```

### Filters

| Parameter                                  | Type    | Description                                      |
| ------------------------------------------ | ------- | ------------------------------------------------ |
| `id`                                       | Integer | Exact discount ID                                |
| `id__in`                                   | String  | Comma-separated discount IDs                     |
| `code`                                     | String  | Exact discount code                              |
| `code__in`                                 | String  | Comma-separated discount codes                   |
| `type`                                     | String  | Discount type. Alias for `type__in`.             |
| `type__in`                                 | String  | Comma-separated discount type IDs                |
| `is_public`                                | Boolean | Filter active/available discounts                |
| `events`                                   | String  | Comma-separated event IDs. Alias for `event_discount_permissions__event__in`. |
| `event_discount_permissions__event`        | Integer | Exact event ID                                   |
| `event_discount_permissions__event__in`    | String  | Comma-separated event IDs                        |
| `tt_discount_permissions__ticket_type`     | Integer | Exact ticket type ID                             |
| `tt_discount_permissions__ticket_type__in` | String  | Comma-separated ticket type IDs                  |
| `reference`                                | String  | Exact external reference                         |
| `reference__in`                            | String  | Comma-separated external references              |
| `possessor__email`                         | String  | Exact possessor email                            |
| `invoice__email`                           | String  | Exact invoice email                              |
| `bulk_order`                               | Integer | Exact bulk order ID                              |
| `bulk_order__isnull`                       | Boolean | Filter discounts with or without a bulk order    |

### Pagination

Results are paginated with a default page size of **20**. The response includes `count`, `next`, `previous`, and `results`.

### Ordering

Use `ordering` with `updated`, `created`, `id`, or `is_public`. Prefix the field with `-` for descending order.

```text
GET /api/venue/{venue_id}/financials/discounts/?ordering=-created
```

Default ordering is newest first by ID.

---

## Business Rules

- **Code normalization** — Submitted codes are uppercased. Generate URL-safe, checkout-safe code strings before sending them.
- **Uniqueness** — Codes are unique per venue, case-insensitively.
- **Dates** — `ends_on` must be after `starts_on` when both are provided.
- **Type changes** — `type` cannot be changed after creation.
- **Used discounts** — After a discount has been used, `code`, `amount`, and `percentage` cannot be changed.
- **Payment plans** — Payment plan ticket types cannot be discounted.
- **Delete behavior** — `DELETE` soft-deletes the discount, sets `is_public` to `false`, and removes the discount from normal list and detail responses.

---

## Error Responses

### 400 Bad Request

Returned for validation failures:

```javascript
// Duplicate code for the venue
{
  "detail": "A discount with this code already exists."
}

// Invalid active date range
{
  "ends_on": ["End date must occur after start date"]
}

// Auto-discount rule sent with a standard discount
{
  "detail": "Discount Rules: Only auto discount can have rules."
}
```

---

## Integration Patterns

### Event-Specific Promotion

Create a standard discount code with `type: 1`, a `percentage` or `amount`, optional date limits, and `event_discount_permissions` scoped to the intended event or ticket types.

The API examples panel shows a complete request for this pattern.

### Customer-Specific Code

When a specific customer should receive a unique code, create a standard discount code with `type: 1`, a unique `code`, and limits such as `limit: 1` and `per_user_limit: 1`.

### Fixed-Amount Credit or Make-Good

For a fixed dollar amount off a future purchase, create a standard discount code with `amount`, set `percentage` to `"0.00"`, and choose limits and item restrictions based on how the code should be redeemed.

### Retiring a Code

Set `is_public` to `false` with `PUT` if the code should stop being redeemable but remain retrievable by ID. Use `DELETE` when the code should be soft-deleted and removed from normal list and detail responses.
