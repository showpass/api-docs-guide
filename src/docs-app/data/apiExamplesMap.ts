
import { ApiExamplesData } from "@/docs-app/data/types.ts";

/**
 * Centralized map of API examples data for use in documentation pages
 * Keys are the route paths (e.g., '/api/events')
 */
const apiExamplesMap: Record<string, ApiExamplesData> = {
  // Event API examples
  "/api/events": {
    endpoint: "https://www.showpass.com/api/public/events/{slug}/",
    method: "GET",
    description: "Retrieve detailed information about a specific event",
    examples: {
      curl: `curl -X GET "https://www.showpass.com/api/public/events/example-event-slug/" \\
-H "Content-Type: application/json"`,
      python: `import requests

response = requests.get(
    "https://www.showpass.com/api/public/events/example-event-slug/",
    headers={"Content-Type": "application/json"}
)

data = response.json()
print(data)`,
      node: `const axios = require('axios');

axios.get('https://www.showpass.com/api/public/events/example-event-slug/', {
  headers: { 'Content-Type': 'application/json' }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error);
});`
    },
    response: {
      status: 200,
      body: {
        "id": 12345,
        "slug": "example-event-slug",
        "name": "Example Event",
        "description": "This is an example event",
        "start_date": "2023-12-01T19:00:00Z",
        "end_date": "2023-12-01T22:00:00Z",
        "venue": {
          "id": 678,
          "name": "Example Venue",
          "address": "123 Example St"
        }
      },
      fields: [
        {
          name: "id",
          type: "integer",
          description: "Unique identifier for the event"
        },
        {
          name: "slug",
          type: "string",
          description: "URL-friendly identifier"
        },
        {
          name: "name",
          type: "string",
          description: "Name of the event"
        }
      ]
    }
  },
  
  // Event List API examples
  "/api/event-list": {
    endpoint: "https://www.showpass.com/api/public/discovery/",
    method: "GET",
    description: "List events with optional filters",
    examples: {
      curl: `curl -X GET "https://www.showpass.com/api/public/discovery/?start_date__gte=2023-12-01&venue__in=123" \\
-H "Content-Type: application/json"`,
      python: `import requests

params = {
    "start_date__gte": "2023-12-01",
    "venue__in": "123"
}

response = requests.get(
    "https://www.showpass.com/api/public/discovery/",
    headers={"Content-Type": "application/json"},
    params=params
)

data = response.json()
print(data)`,
      node: `const axios = require('axios');

axios.get('https://www.showpass.com/api/public/discovery/', {
  headers: { 'Content-Type': 'application/json' },
  params: {
    start_date__gte: '2023-12-01',
    venue__in: '123'
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error);
});`
    },
    response: {
      status: 200,
      body: {
        "count": 2,
        "next": null,
        "previous": null,
        "results": [
          {
            "id": 12345,
            "slug": "example-event-1",
            "name": "Example Event 1",
            "start_date": "2023-12-01T19:00:00Z"
          },
          {
            "id": 12346,
            "slug": "example-event-2",
            "name": "Example Event 2",
            "start_date": "2023-12-15T20:00:00Z"
          }
        ]
      }
    }
  },
  
  // Query Event API examples
  "/api/query-event": {
    endpoint: "https://www.showpass.com/api/public/events/search/",
    method: "GET",
    description: "Search for events using various criteria",
    examples: {
      curl: `curl -X GET "https://www.showpass.com/api/public/events/search/?q=concert&location=Calgary" \\
-H "Content-Type: application/json"`,
      python: `import requests

params = {
    "q": "concert",
    "location": "Calgary"
}

response = requests.get(
    "https://www.showpass.com/api/public/events/search/",
    headers={"Content-Type": "application/json"},
    params=params
)

data = response.json()
print(data)`,
      node: `const axios = require('axios');

axios.get('https://www.showpass.com/api/public/events/search/', {
  headers: { 'Content-Type': 'application/json' },
  params: {
    q: 'concert',
    location: 'Calgary'
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error);
});`
    },
    response: {
      status: 200,
      body: {
        "count": 2,
        "next": null,
        "previous": null,
        "results": [
          {
            "id": 12345,
            "slug": "rock-concert",
            "name": "Rock Concert",
            "location": "Calgary, AB"
          },
          {
            "id": 12346,
            "slug": "jazz-concert",
            "name": "Jazz Concert",
            "location": "Calgary, AB"
          }
        ]
      }
    }
  }
};

export default apiExamplesMap;
