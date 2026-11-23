# Organization Membership Reads

Use these endpoints to reconcile an organization's current issued memberships without signing in as each patron. This contract requires the corresponding backend release; a local reference build does not establish deployment.

## Access requirements

Create an employee linked API key with `memberships:read` in **Integrations → API → API keys**. The employee must currently have **Manage Memberships** (`manage_memberships`) or **All Access** for the organization. Send the secret from your server using `Authorization: Token <developer-api-key>`.

Scopes and current employee permission are both required. Revocation, expiry, employee removal and permission reductions affect subsequent requests. Ticket scanning and order history scopes do not grant member access.

See the [API key guide](/api/private-api-overview), [interactive member reference](/api/private-api-memberships-reference) and [OpenAPI 3.1 download](/openapi/organization-memberships.openapi.json). The focused contract is version `1.0.0`.

## List and retrieve members

```http
GET /api/venue/{venueId}/memberships/members/
GET /api/venue/{venueId}/memberships/members/{memberId}/
Authorization: Token <developer-api-key>
```

The organization must match the key. Only members whose customer, level and optional group belong to that organization are returned. Foreign or inaccessible member IDs return `404` on detail reads. An authenticated patron's `/api/user/` memberships remain a separate API.

Both routes support exact `id`, `membership_group`, `membership_level`, `venue_user` and `status` filters. IDs are positive whole numbers. Status uses the member status values in the generated schema, such as `ms_active` and `ms_disabled`. Unknown or repeated parameters return `400`. Barcode search, invoice filters, custom ordering and relationship expansions are unsupported.

```http
GET /api/venue/42/memberships/members/?membership_group=101&status=ms_active&page_size=20&page=1
```

Lists are ordered by ascending member ID. `page_size` defaults to 100 and accepts 1 through 100. `page` accepts 1 through 1000. Follow the returned pagination links within those limits. This API does not promise a consistent snapshot across pages, an update cursor or complete synchronization beyond the page cap.

Synthetic list response:

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "next_page_number": null,
  "previous_page_number": null,
  "page_number": 1,
  "num_pages": 1,
  "next_list": [],
  "previous_list": [],
  "results": [
    {
      "id": 701,
      "venue": 42,
      "venue_user": 901,
      "membership_group": 101,
      "membership_group_name": "Community",
      "membership_level": 201,
      "membership_level_name": "Gold",
      "status": "ms_active",
      "quantity": 1,
      "last_status_change": null,
      "expiry_date": "2027-01-01T00:00:00Z"
    }
  ]
}
```

Synthetic detail response for `/api/venue/42/memberships/members/701/`:

```json
{
  "id": 701,
  "venue": 42,
  "venue_user": 901,
  "membership_group": 101,
  "membership_group_name": "Community",
  "membership_level": 201,
  "membership_level_name": "Gold",
  "status": "ms_active",
  "quantity": 1,
  "last_status_change": null,
  "expiry_date": "2027-01-01T00:00:00Z"
}
```

## Field meanings and privacy

| Field | Type and meaning |
| --- | --- |
| `id` | Integer issued member ID |
| `venue` | Integer organization ID |
| `venue_user` | Integer customer ID within the organization |
| `membership_group` | Integer current group ID, or null |
| `membership_group_name` | String current group name, or null when no group is associated |
| `membership_level` | Integer current level ID; required |
| `membership_level_name` | String current level name; required |
| `status` | String current member status from the generated enum |
| `quantity` | Integer membership quantity |
| `last_status_change` | Date and time string, or null |
| `expiry_date` | Date and time string, or null |

Names reflect the member's **current** group and level, including later renames. They do not establish names or level configuration at the source purchase or webhook event. A missing group returns both `membership_group: null` and `membership_group_name: null`; the required level is still returned. Webhook name snapshots are separate from these reads.

The response omits personal contact fields, global user IDs, scan credentials, employee details and expanded purchase or benefit records. Creation, renewal, transfer, cancellation, scanning, exports and other writes are outside this read contract.

## Errors and request limits

| Status | Meaning |
| --- | --- |
| `400` | Invalid, unsupported or repeated filters; invalid or oversized pagination |
| `401` | Invalid, revoked or expired key; removed employee access, disabled account or no effective permissions |
| `403` | Missing scope, insufficient current permission, wrong organization or unsupported operation |
| `404` | Member absent, filtered or inaccessible; page unavailable |
| `429` | Request budget exhausted; honor `Retry-After` |
| `503` | Shared request limiter unavailable; retry later |

Shared limits are 60 requests per key and 300 per organization per minute. These reads do not change membership state or submit asynchronous jobs.
