# Query a specific experience by slug

## Endpoint

To retrieve detailed information for a single public experience using its unique slug:

```text
https://www.showpass.com/api/public/events/{SLUG}/
```

Replace `{SLUG}` with the actual slug of the experience or the event `{ID}`.

---

## Overview

This endpoint returns comprehensive details about a specific experience, including:
- Full experience information (name, description, dates, location)
- Venue details
- Ticket types and pricing
- Availability and inventory
- Custom fields and requirements
- Related events

This is the primary endpoint for displaying experience detail pages and initializing the Showpass purchase widget.


---

## Finding the Experience Slug

The slug is the URL-friendly identifier for an experience. You can find it in several ways:

1. **From the Showpass URL**: For example; `https://www.showpass.com/summer-concert-2025/`, the slug is `summer-concert-2025`
2. **From Discovery API**: The `slug` field in the Discovery API response
3. **From the Dashboard**: In your event management dashboard

---

## Basic Example

```text
https://www.showpass.com/api/public/events/summer-concert-2025/
```

This returns complete details for the experience with slug `summer-concert-2025`.

---

## Parameters

### Path Parameter

| Parameter | Type   | Status   | Description                                                                                     |
| --------- | ------ | -------- | ----------------------------------------------------------------------------------------------- |
| `slug`    | String | Required | The unique slug identifying the experience (part of the URL path) |

---

## Use Cases

### 1. Display Experience Detail Page

Fetch full experience details to display on your website:

```text
https://www.showpass.com/api/public/events/my-experience-slug/
```

Use the response to show:
- Experience name, dates, and description
- Venue information and location
- Available ticket types and prices
- Images and media

### 2. Check Availability

Check if an experience is sold out or has limited inventory:

```text
https://www.showpass.com/api/public/events/my-experience-slug/
```

Check the `sold_out` field and `ticket_types[].inventory_left` in the response.

---

## Error Responses

### 404 Not Found

Returned when the slug doesn't exist:

```javascript
{
  "detail": "Not found."
}
```

**Common causes:**
- Incorrect slug
- Experience has been deleted
- Typo in the URL

## Comparison with Discovery API

| Feature | Detail Endpoint (`/events/{slug}/`) | Discovery Endpoint (`/discovery/`) |
|---------|--------------------------------------|-------------------------------------|
| **Purpose** | Get full details for one experience | Search/list multiple experiences |
| **Returns** | Single experience object | Paginated list of experiences |
| **Data Detail** | Complete details including ticket types | Summary information only |
| **Use Case** | Experience detail pages, widget init | Listings, calendars, search |
| **Performance** | Fast (single lookup) | Slower (search/filter) |
