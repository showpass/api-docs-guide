# Basic Integration Example - Putting It All Together

This example shows the essential pattern for combining the Showpass Public API with the SDK to display events and enable ticket purchases.

## Overview

The basic integration involves:

1. **Fetch events** from the Public API
2. **Display event data** (name, date, image, description)
3. **Use event `slug`** to initialize purchase widgets via SDK

## Minimal HTML Example

Here's a minimal complete page that puts it all together:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>My Events</title>
    <!-- Include Showpass SDK -->
    <script src="https://showpass.com/static/dist/sdk.js" defer></script>
  </head>
  <body>
    <div id="events-container"></div>

    <script>
      // Fetch events from API (no SDK needed)
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

      // Display events in the page
      function displayEvents(events) {
        const container = document.getElementById("events-container");

        events.forEach((event) => {
          const eventDiv = document.createElement("div");
          eventDiv.innerHTML = `
                <h3>${event.name}</h3>
                <img src="${event.image_banner}" alt="${event.name}" />
                <p>${event.starts_on}</p>
                <button onclick="openTicketWidget('${event.slug}')">
                    Buy Tickets
                </button>
            `;
          container.appendChild(eventDiv);
        });
      }

      // Open ticket purchase widget (SDK required here)
      function openTicketWidget(eventSlug) {
        if (window.showpass && window.showpass.tickets) {
          window.showpass.tickets.eventPurchaseWidget(eventSlug, {
            "theme-primary": "#your-color",
          });
        } else {
          alert("Ticket widget not available");
        }
      }

      // Load events when page loads
      document.addEventListener("DOMContentLoaded", async () => {
        const venueId = 12345; // Your venue ID
        const events = await fetchEvents(venueId);
        displayEvents(events);
      });
    </script>
  </body>
</html>
```

## Key Integration Points

### 1. Essential API Fields

- `name` - Event title
- `slug` - **Required** for SDK widget
- `starts_on` - UTC timestamp
- `timezone` - For local time display
- `description_without_html` - Clean description text
- `image_banner` or `image` - Event images

### 2. SDK Integration Pattern

```javascript
// Always check SDK availability
if (window.showpass && window.showpass.tickets) {
  window.showpass.tickets.eventPurchaseWidget(slug, params);
}
```

### 3. Date Handling

```javascript
// Convert UTC to local timezone
const date = new Date(event.starts_on);
const localTime = date.toLocaleString("en-US", {
  timeZone: event.timezone,
  // ... formatting options
});
```

### 4. Error Handling

- Check API response status
- Provide fallbacks for missing data
- Handle SDK loading gracefully
- Give user feedback for errors

This simplified example shows the core pattern without extra complexity, making it easy to understand and adapt for your specific needs.
