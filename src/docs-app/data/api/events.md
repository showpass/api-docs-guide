
# Showpass Public API

## Event API Endpoint
```
https://www.showpass.com/api/public/discovery/
```

## Overview
The Showpass Public Event API allows you to fetch event data programmatically. You can use this API to display events on your website, build custom integrations, or create your own applications that interact with Showpass events.

## Authentication
The Public Event API is open and does not require authentication for basic event queries. However, your domain must be added to the allowlist in the Showpass Dashboard under your organization's settings.

## Response Format
All responses are returned in JSON format.

## Example Response
```json
{
  "count": 42,
  "next": "https://www.showpass.com/api/public/discovery/?page=2",
  "previous": null,
  "results": [
    {
      "id": 123,
      "name": "Example Event",
      "slug": "example-event",
      "venue": {
        "id": 45,
        "name": "Example Venue",
        "address": "123 Main Street"
      },
      "starts_on": "2023-12-31T20:00:00Z",
      "ends_on": "2024-01-01T02:00:00Z",
      "timezone": "America/Edmonton",
      "image": "https://www.showpass.com/media/images/example.jpg",
      "description": "This is an example event description",
      "status": "Published",
      "categories": ["Music", "Entertainment"],
      "tags": ["featured", "new-years"]
    }
  ]
}
```

For additional details and query parameters, please refer to the Event List and Query a Specific Event sections.
