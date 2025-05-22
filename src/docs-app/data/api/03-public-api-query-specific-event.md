# Query a specific event by slug

To retrieve details for a single, specific public event using its unique slug, use the following endpoint:

## Endpoint

`https://www.showpass.com/api/public/events/EVENT_SLUG/`

Replace `EVENT_SLUG` with the actual slug of the event.

_Note: This endpoint `/api/public/events/{slug}/` is specifically for fetching a single event by its slug and is different from the `/api/public/discovery/` endpoint used for searching and listing multiple events._

## Parameters

| Parameter | Type   | Status   | Description                                                                                                                                                                                                         |
| --------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `slug`    | String | Required | The unique slug identifying the event. This is typically found in the event's URL on Showpass (e.g., for `showpass.com/this-is-the-slug/`, the slug is `this-is-the-slug`). This parameter is part of the URL path. |
