import React from "react";
import ContentPage from "@/docs-app/ui/components/ContentPage";

const eventListApiExamples = {
  endpoint: "https://www.showpass.com/api/public/discovery/?venue__in=id",
  method: "GET" as const,
  description: "Fetch events for a specific organization",
  examples: {
    curl: `curl --request GET \\
  --url "https://www.showpass.com/api/public/discovery/?\\
venue__in=123&\\
page_size=10&\\
ordering=starts_on" \\
  --header "accept: application/json"`,
    python: `import requests

response = requests.get(
  "https://www.showpass.com/api/public/discovery/",
  params={
    "venue__in": "123",
    "page_size": "10",
    "ordering": "starts_on"
  },
  headers={"Accept": "application/json"}
)

print(response.json())`,
    node: `const fetch = require('node-fetch');

const params = new URLSearchParams({
  venue__in: '123',
  page_size: '10',
  ordering: 'starts_on'
});

fetch('https://www.showpass.com/api/public/discovery/?' + params.toString(), {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`
  },
  response: {
    contentType: "application/json",
    statusCode: 200,
    response: `{
  "count": 10,
  "next": "https://www.showpass.com/api/public/discovery/?venue__in=123&page=2",
  "previous": null,
  "results": [
    {
      "id": 123,
      "name": "Organization Example Event",
      "slug": "organization-example-event",
      "venue": {
        "id": 123,
        "name": "My Organization Venue",
        "address": "456 Event Street"
      },
      "starts_on": "2023-12-31T20:00:00Z",
      "ends_on": "2024-01-01T02:00:00Z",
      "timezone": "America/Edmonton",
      "image": "https://www.showpass.com/media/images/example.jpg",
      "description": "This is an example event for a specific organization",
      "status": "Published",
      "categories": ["Concert", "Live Music"],
      "tags": ["featured"]
    }
    // ... more results
  ]
}`
  }
};

const EventListPage = () => {
  return (
    <ContentPage 
      contentPath="/api/event-list.md" 
      currentPath="/api/event-list" 
      apiExamples={eventListApiExamples}
    />
  );
};

export default EventListPage;
