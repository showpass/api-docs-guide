# Basic Integration Example

## Overview

This example demonstrates the essential pattern for combining the Showpass Public API with the SDK to display events and enable ticket purchases. It shows how these two components work together to create a complete ticketing integration.

The basic integration workflow:

1. **Fetch events** from the Public API
2. **Display event data** (name, date, image, description)
3. **Use event slug** to initialize purchase widgets via SDK

---

## Minimal HTML Example

Here's a complete, minimal page that demonstrates the integration:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Events</title>
    
    <!-- Include Showpass SDK -->
    <script src="https://showpass.com/static/dist/sdk.js" defer></script>
  </head>
  <body>
    <h1>Upcoming Events</h1>
    <div id="events-container"></div>

    <script>
      // Fetch events from Public API (no SDK needed)
      async function fetchEvents(venueId) {
        try {
          const response = await fetch(
            `https://www.showpass.com/api/public/discovery/?venue__in=${venueId}&is_featured=true`
          );
          const data = await response.json();
          return data.results || [];
        } catch (error) {
          console.error("Error fetching events:", error);
          return [];
        }
      }

      // Display events on the page
      function displayEvents(events) {
        const container = document.getElementById("events-container");

        events.forEach((event) => {
          const eventDiv = document.createElement("div");
          eventDiv.innerHTML = `
            <h3>${event.name}</h3>
            <img src="${event.image_banner}" alt="${event.name}" style="max-width: 300px;" />
            <p><strong>Date:</strong> ${new Date(event.starts_on).toLocaleDateString()}</p>
            <button onclick="openTicketWidget('${event.slug}')">
              Buy Tickets
            </button>
          `;
          container.appendChild(eventDiv);
        });
      }

      // Open ticket purchase widget (SDK required)
      function openTicketWidget(eventSlug) {
        if (window.showpass && window.showpass.tickets) {
          window.showpass.tickets.eventPurchaseWidget(eventSlug, {
            "theme-primary": "#007bff",
          });
        } else {
          alert("Ticket widget not available. Please refresh the page.");
        }
      }

      // Load and display events when page loads
      document.addEventListener("DOMContentLoaded", async () => {
        const venueId = 12345; // Replace with your venue ID
        const events = await fetchEvents(venueId);
        displayEvents(events);
      });
    </script>
  </body>
</html>
```

---

## Key Integration Points

### 1. Essential API Fields

When fetching from the Public API, these fields are most important:

| Field | Purpose |
| --- | --- |
| **name** | Event title for display |
| **slug** | **Required** for SDK widget initialization |
| **starts_on** | Event start time (UTC timestamp) |
| **timezone** | For accurate local time display |
| **description_without_html** | Clean description text |
| **image_banner** or **image** | Event imagery |

---

### 2. SDK Integration Pattern

Always check SDK availability before calling widget functions:

```javascript
// Safe SDK widget call pattern
if (window.showpass && window.showpass.tickets) {
  window.showpass.tickets.eventPurchaseWidget(slug, params);
} else {
  // Handle SDK unavailable scenario
  console.error("Showpass SDK not loaded");
}
```

---

### 3. Date Handling

Convert UTC timestamps to local timezone for accurate display:

```javascript
// Convert UTC to local timezone
const date = new Date(event.starts_on);
const localTime = date.toLocaleString("en-US", {
  timeZone: event.timezone,
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});
```

---

### 4. Error Handling Best Practices

```javascript
// API error handling
async function fetchEvents(venueId) {
  try {
    const response = await fetch(`https://www.showpass.com/api/public/discovery/?venue__in=${venueId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching events:", error);
    return []; // Return empty array as fallback
  }
}

// SDK availability check
function openTicketWidget(eventSlug) {
  if (!window.showpass || !window.showpass.tickets) {
    console.error("SDK not available");
    alert("Ticket system is loading. Please try again in a moment.");
    return;
  }
  
  if (!eventSlug) {
    console.error("Event slug is required");
    return;
  }
  
  window.showpass.tickets.eventPurchaseWidget(eventSlug, {
    "theme-primary": "#007bff",
  });
}
```

---

## Enhanced Example with Better Styling

Here's an improved version with better structure and styling:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Events - My Venue</title>
    <script src="https://showpass.com/static/dist/sdk.js" defer></script>
    <style>
      body {
        font-family: Arial, sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }
      .events-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 20px;
      }
      .event-card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .event-card img {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-radius: 4px;
      }
      .event-card h3 {
        margin: 10px 0;
      }
      .event-card button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        width: 100%;
        margin-top: 10px;
      }
      .event-card button:hover {
        background-color: #0056b3;
      }
      .loading {
        text-align: center;
        padding: 40px;
        color: #666;
      }
    </style>
  </head>
  <body>
    <h1>Upcoming Events</h1>
    <div id="events-container" class="events-grid">
      <div class="loading">Loading events...</div>
    </div>

    <script>
      const CONFIG = {
        venueId: 12345, // Replace with your venue ID
        themeColor: "#007bff",
      };

      async function fetchEvents(venueId) {
        try {
          const response = await fetch(
            `https://www.showpass.com/api/public/discovery/?venue__in=${venueId}&is_featured=true`
          );
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          return data.results || [];
        } catch (error) {
          console.error("Error fetching events:", error);
          return [];
        }
      }

      function formatEventDate(isoDate, timezone) {
        const date = new Date(isoDate);
        return date.toLocaleString("en-US", {
          timeZone: timezone,
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }

      function displayEvents(events) {
        const container = document.getElementById("events-container");
        container.innerHTML = ""; // Clear loading message

        if (events.length === 0) {
          container.innerHTML = '<div class="loading">No events available</div>';
          return;
        }

        events.forEach((event) => {
          const eventCard = document.createElement("div");
          eventCard.className = "event-card";
          
          const formattedDate = formatEventDate(event.starts_on, event.timezone);
          const description = event.description_without_html || "No description available";
          
          eventCard.innerHTML = `
            <img src="${event.image_banner || event.image}" alt="${event.name}" />
            <h3>${event.name}</h3>
            <p><strong>${formattedDate}</strong></p>
            <p>${description.substring(0, 100)}...</p>
            <button onclick="openTicketWidget('${event.slug}')">
              Buy Tickets
            </button>
          `;
          
          container.appendChild(eventCard);
        });
      }

      function openTicketWidget(eventSlug) {
        if (!window.showpass || !window.showpass.tickets) {
          alert("Ticket system is loading. Please try again in a moment.");
          return;
        }
        
        window.showpass.tickets.eventPurchaseWidget(eventSlug, {
          "theme-primary": CONFIG.themeColor,
        });
      }

      // Initialize on page load
      document.addEventListener("DOMContentLoaded", async () => {
        const events = await fetchEvents(CONFIG.venueId);
        displayEvents(events);
      });
    </script>
  </body>
</html>
```

---

## Summary

This integration pattern demonstrates the fundamental relationship between the Public API and SDK:

**Key Takeaways:**

- **Public API** provides event data (no authentication needed)
- **Event slug** is the critical link between API and SDK
- **SDK** handles all purchase interactions
- **Always verify** SDK is loaded before calling widget functions
- **Error handling** is essential for production environments
- **Date formatting** should account for timezones
- **Fallback UI** improves user experience when issues occur

This simplified example provides a solid foundation that you can adapt and expand for your specific needs.
