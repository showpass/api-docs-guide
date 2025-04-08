
# Query a Specific Event

## Endpoint
```
https://www.showpass.com/api/public/events/slug/
```

## Parameters

<!-- PARAMETER_TABLE_START -->
| Parameter | Type | Status | Description |
|-----------|------|--------|-------------|
| slug | String | Required | The unique slug of the event on Showpass<br>showpass.com/this-is-the-slug/ |
<!-- PARAMETER_TABLE_END -->

## Example Request
```
https://www.showpass.com/api/public/events/sample-event-name/
```

## API Response
The response will be a JSON object containing all public details about the requested event.

### Example Response
```json
{
  "id": 123,
  "name": "Sample Event Name",
  "slug": "sample-event-name",
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
  "tags": ["featured", "new-years"],
  "tickets": [
    {
      "id": 456,
      "name": "General Admission",
      "price": "25.00",
      "service_fee": "2.50",
      "quantity_remaining": 100
    }
  ]
}
```

Simply copy and paste the completed URL into your browser to view the response.

Download the JSON View extension for Chrome for in-browser formatting for readability.
