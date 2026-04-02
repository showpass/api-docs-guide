# Tracking Links

Tracking links allow organizers to create shareable URLs that attribute ticket sales to specific employees, venues, or affiliates. Each link generates a unique short URL (e.g., `https://showpass.com/l/abc12345`) that redirects to your event page while recording views, unique visitors, and conversion data.

---

## Authentication

This endpoint requires authentication using a Showpass token:

```
Authorization: Token YOUR_API_TOKEN
```

---

## Endpoints

The base URL for all tracking link endpoints is:

```text
https://www.showpass.com/api/venue/{venue_id}/analytics/tracking/links/
```

| Method   | Path                 | Description                     |
| -------- | -------------------- | ------------------------------- |
| `GET`    | `/links/`            | List all tracking links         |
| `POST`   | `/links/`            | Create a new tracking link      |
| `GET`    | `/links/{id}/`       | Retrieve a single tracking link |
| `PUT`    | `/links/{id}/`       | Update a tracking link          |
| `DELETE` | `/links/{id}/`       | Delete a tracking link          |
| `GET`    | `/links/me/`         | List my tracking links          |

### Path Parameters

| Parameter  | Type    | Status   | Description                                    |
| ---------- | ------- | -------- | ---------------------------------------------- |
| `venue_id` | Integer | Required | The ID of your venue                           |
| `id`       | Integer | Required | The tracking link ID (detail, update, or delete) |

---

## Tracking Link Types

| Value | Name           | Description                                                    |
| ----- | -------------- | -------------------------------------------------------------- |
| `1`   | Employee       | Links shared by staff members for sales attribution            |
| `2`   | Venue          | Links created at the venue / organization level                |
| `3`   | Affiliate      | Links for external partners and promoters                      |
| `4`   | Quick Purchase | Pre-configured checkout links with items already in the basket |

> **Note:** The API only returns user-generated link types (Employee, Venue, Affiliate, Quick Purchase). System-generated links such as Abandoned Basket, Held Basket, and Membership Renewal are excluded from results.

---

## Request Body (Create / Update)

| Parameter                  | Type    | Status   | Description                                                                                               |
| -------------------------- | ------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `venue`                    | Integer | Required | The venue ID (auto-set from session on create)                                                            |
| `event`                    | Integer | Optional | The event ID to link to. Null for venue-level links                                                       |
| `referred_by`              | Integer | Optional | The user ID of the person sharing this link                                                               |
| `description`              | String  | Optional | A human-readable label (max 512 characters)                                                               |
| `via`                      | Integer | Required | The tracking link type — see Tracking Link Types above                                                    |
| `ticket_types`             | Array   | Optional | List of ticket type IDs to restrict the link to. Must belong to the specified venue                       |
| `hide_public_ticket_types` | Boolean | Optional | If true, hides public ticket types and shows only those in `ticket_types`                                 |
| `extra`                    | Array   | Optional | Additional configuration. **Required** when `via=4` (Quick Purchase) — see Quick Purchase Links below     |

---

## Response Fields

| Field                      | Type    | Description                                                       |
| -------------------------- | ------- | ----------------------------------------------------------------- |
| `id`                       | Integer | Unique identifier                                                 |
| `owner_venue`              | Integer | The venue that owns the link (set automatically)                  |
| `venue`                    | Integer | The venue the link is associated with                             |
| `referred_by`              | Integer | User ID of the referrer (null if unset)                           |
| `description`              | String  | Human-readable label                                              |
| `long_url`                 | String  | Full destination URL the short link redirects to                  |
| `short_url`                | String  | Generated short URL (e.g., `https://showpass.com/l/abc12345`)     |
| `tiny_url`                 | String  | Alternative compact URL format                                    |
| `event`                    | Integer | Linked event ID (null for venue-level links)                      |
| `views`                    | Integer | Total click count                                                 |
| `visitors`                 | Integer | Unique visitor count                                              |
| `stats`                    | Object  | Aggregated conversion statistics (baskets, revenue, etc.)         |
| `via`                      | Integer | Tracking link type identifier                                     |
| `ticket_types`             | Array   | Restricted ticket type IDs (null if unrestricted)                 |
| `hide_public_ticket_types` | Boolean | Whether public ticket types are hidden                            |
| `extra`                    | Array   | Configuration data (used by Quick Purchase links)                 |

---

## Filtering and Search

### Search

Use the `search` query parameter to match against `description`, `referred_by__username`, or `slug`:

```text
GET /api/venue/{venue_id}/analytics/tracking/links/?search=john
```

### Filters

| Parameter             | Type     | Description                                                                              |
| --------------------- | -------- | ---------------------------------------------------------------------------------------- |
| `via`                 | Integer  | Link type: `1` (Employee), `2` (Venue), `3` (Affiliate), `4` (Quick Purchase)           |
| `event`               | Integer  | Exact event ID                                                                           |
| `event__in`           | String   | Multiple event IDs, comma-separated                                                      |
| `event__ends_on__gte` | DateTime | Events ending on or after this date                                                      |
| `event__ends_on__lte` | DateTime | Events ending on or before this date                                                     |

### Pagination

Results are paginated with a default page size of **20**. The response includes `count`, `next`, `previous`, and `results`.

```text
GET /api/venue/{venue_id}/analytics/tracking/links/?page=2
```

---

## Quick Purchase Links

Quick Purchase links (`via=4`) pre-configure a basket with specific items and quantities. When a user clicks the link they go directly to checkout with items already in their cart.

The `extra` field is **required** for this type and must be an array of objects:

| Field               | Type    | Status   | Description                                                         |
| ------------------- | ------- | -------- | ------------------------------------------------------------------- |
| `ticket_type`       | Integer | Optional | Ticket type ID (provide either this or `product_attribute`)         |
| `product_attribute` | Integer | Optional | Product attribute ID                                                |
| `quantity`          | Integer | Required | Number of items to add to the basket                                |

All items in the `extra` array must belong to the same venue.

---

## My Links

Returns only tracking links where `referred_by` matches the authenticated user:

```text
GET /api/venue/{venue_id}/analytics/tracking/links/me/
```

Returns the same paginated response as the list endpoint, filtered to the current user.

---

## Business Rules

- **Updates** — Only Quick Purchase links (`via=4`) can be updated. All other types return `405 Method Not Allowed`.
- **Deletes** — A link can only be deleted if it has no completed purchases. If any referred basket has been completed, the delete returns `405`.
- **Venue scoping** — Results include links where the current venue is either the **selling venue** (`venue`) or the **owning venue** (`owner_venue`), so both organizers and seller organizations can see shared links.

---

## Error Responses

### 405 Method Not Allowed

Returned when updating a non-Quick Purchase link or deleting a link with completed purchases:

```javascript
{
  "detail": "Method \"PUT\" not allowed."
}
```

### 400 Bad Request

Returned for validation failures:

```javascript
// Ticket type doesn't belong to the venue
{
  "ticket_types": "3001 does not exist"
}

// Quick Purchase link missing basket data
{
  "extra": "Quick purchase tracking links requires basket data defined in the extra field."
}
```
