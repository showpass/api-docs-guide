
import React from "react";
import ContentPage from "@/docs-app/ui/components/ContentPage";

const eventApiExamples = {
  endpoint: "https://www.showpass.com/api/public/discovery/",
  method: "GET" as const,
  description: "Fetch a list of available events from the Showpass platform",
  examples: {
    curl: `curl --request GET \\
  --url "https://www.showpass.com/api/public/discovery/" \\
  --header "accept: application/json"`,
    python: `import requests

response = requests.get(
  "https://www.showpass.com/api/public/discovery/",
  headers={"Accept": "application/json"}
)

print(response.json())`,
    node: `const fetch = require('node-fetch');

fetch('https://www.showpass.com/api/public/discovery/', {
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
    },
    // ... more results
  ]
}`
  }
};

const PublicEventAPI = () => {
  return (
    <ContentPage 
      contentPath="/api/events.md" 
      currentPath="/api/events" 
      apiExamples={eventApiExamples}
    />
  );
};

export default PublicEventAPI;
