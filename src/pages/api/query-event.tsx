
import React from "react";
import ContentPage from "@/docs-app/ui/components/ContentPage";

const queryEventApiExamples = {
  endpoint: "https://www.showpass.com/api/public/events/slug/",
  method: "GET" as const,
  description: "Fetch details for a specific event by its slug",
  examples: {
    curl: `curl --request GET \\
  --url "https://www.showpass.com/api/public/events/sample-event-name/" \\
  --header "accept: application/json"`,
    python: `import requests

response = requests.get(
  "https://www.showpass.com/api/public/events/sample-event-name/",
  headers={"Accept": "application/json"}
)

print(response.json())`,
    node: `const fetch = require('node-fetch');

fetch('https://www.showpass.com/api/public/events/sample-event-name/', {
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
}`
  }
};

const QueryEventPage = () => {
  return (
    <ContentPage 
      contentPath="/api/query-event.md" 
      currentPath="/api/query-event" 
      apiExamples={queryEventApiExamples}
    />
  );
};

export default QueryEventPage;
