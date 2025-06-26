# Showpass public API

## Event API endpoint

The primary endpoint for discovering events is: `https://www.showpass.com/api/public/discovery/`

## Overview

The Showpass Public Event API allows you to fetch event data programmatically. You can use this API to display events on your website, build custom integrations, or create your own applications that interact with Showpass events.

## Authentication

The Public Event API is open and does not generally require authentication tokens for basic public event queries. However, for your requests to be successful, **your website's domain must be added to the allowlist** in the Showpass Dashboard. You can do this under your organization's settings, typically found on the "Integrations" tab of your venue edit page (`https://www.showpass.com/dashboard/venues/edit/`).

## Response format

All API responses are returned in **JSON** format.

## Parameters

You can refine your event list query using the following optional parameters:

| Parameter               | Type     | Status   | Description                                                                                                                                         |
| ----------------------- | -------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search_string`         | String   | Optional | A search query string. Filters events by matching against event name, venue name, and tags.<br>Example: `&search_string=concert`                    |
| `name__icontains`       | String   | Optional | Filter events by partial event name match (case-insensitive).<br>Example: `&name__icontains=music`                                                  |
| `point_location`        | String   | Optional | Filter events by geographic location (latitude,longitude format).<br>Example: `&point_location=51.0447,-114.0719`                                   |
| `venue__in`             | String   | Optional | Filter by venue IDs. Comma-separated list of integers.<br>Example: `&venue__in=123,456`                                                             |
| `venue`                 | Integer  | Optional | Filter by a single venue ID.<br>Example: `&venue=123`                                                                                               |
| `categories`            | String   | Optional | Include events with specified categories. Comma-separated array.<br>Example: `&categories=music,arts`                                               |
| `tags`                  | String   | Optional | Include events with any of the specified tags. Comma-separated array.<br>Example: `&tags=featured,popular`                                          |
| `is_featured`           | Boolean  | Optional | Filter for featured events only.<br>Example: `&is_featured=true`                                                                                    |
| `is_sponsored`          | Boolean  | Optional | Filter for sponsored events only.<br>Example: `&is_sponsored=true`                                                                                  |
| `is_protected_by_queue` | Boolean  | Optional | Filter events by queue protection status.<br>Example: `&is_protected_by_queue=false`                                                                |
| `showpass_gift_card`    | Boolean  | Optional | Filter for events that support Showpass gift cards.<br>Example: `&showpass_gift_card=true`                                                          |
| `voucher_code`          | String   | Optional | Filter events that accept a specific voucher code.<br>Example: `&voucher_code=DISCOUNT20`                                                           |
| `page_size`             | Integer  | Optional | Number of results to return per page. <br>Default: `20`.<br>Example: `&page_size=8`                                                                 |
| `page`                  | Integer  | Optional | The specific page number to return.<br>Example: `&page=2`                                                                                           |
| `id__in`                | String   | Optional | Return specific events by their IDs. Comma-separated list of integers.<br>Example: `&id__in=1,2,3`                                                  |
| `id`                    | Integer  | Optional | Return a single event by its ID.<br>Example: `&id=123`                                                                                              |
| `starts_on__gte`        | ISO date | Optional | Events starting after or on the specified date/time.<br>Format: `YYYY-MM-DDTHH:MM` or full ISO 8601.<br>Example: `&starts_on__gte=2023-06-23T19:30` |
| `starts_on__lte`        | ISO date | Optional | Events starting before or on the specified date/time.<br>Example: `&starts_on__lte=2023-06-23T19:30`                                                |
| `starts_on__gt`         | ISO date | Optional | Events starting after the specified date/time.<br>Example: `&starts_on__gt=2023-06-23T19:30`                                                        |
| `starts_on__lt`         | ISO date | Optional | Events starting before the specified date/time.<br>Example: `&starts_on__lt=2023-06-23T19:30`                                                       |
| `ends_on__gte`          | ISO date | Optional | Events ending after or on the specified date/time.<br>Example: `&ends_on__gte=2023-06-23T19:30`                                                     |
| `ends_on__lte`          | ISO date | Optional | Events ending before or on the specified date/time.<br>Example: `&ends_on__lte=2023-06-23T19:30`                                                    |
| `ends_on__gt`           | ISO date | Optional | Events ending after the specified date/time.<br>Example: `&ends_on__gt=2023-06-23T19:30`                                                            |
| `ends_on__lt`           | ISO date | Optional | Events ending before the specified date/time.<br>Example: `&ends_on__lt=2023-06-23T19:30`                                                           |

## Important Fields

While the API returns many fields, the following are the most impactful for building real integrations. Focus on these fields for your initial implementation:

### Essential Response Fields

When processing API responses, these fields from the `results` array are the most commonly needed:

| Field                      | Description             | Usage                                        |
| -------------------------- | ----------------------- | -------------------------------------------- |
| `slug`                     | Unique event identifier | **Required** to initiate widgets via the SDK |
| `name`                     | Event name              | Display the event title                      |
| `starts_on`                | Event start time (UTC)  | Show when the event begins                   |
| `ends_on`                  | Event end time (UTC)    | Show when the event ends                     |
| `timezone`                 | Event timezone          | Convert UTC times to local display           |
| `description_without_html` | Plain text description  | Event details and description text           |
| `frontend_details_url`     | Showpass event page URL | Link to full event details                   |
| `image`                    | Square event image      | Event thumbnail/card image                   |
| `image_banner`             | Banner event image      | Hero/header image                            |

### Key Filtering Parameters

These are the most commonly used filtering parameters for practical implementations:

| Parameter        | Example                            | Purpose                             |
| ---------------- | ---------------------------------- | ----------------------------------- |
| `search_string`  | `&search_string=Event%20Name`      | Filter by event name, venue, tags   |
| `tags`           | `&tags=featured`                   | Show only events with specific tags |
| `starts_on__gte` | `&starts_on__gte=2025-01-01T00:00` | Events starting after a date        |
| `ends_on__lt`    | `&ends_on__lt=2025-02-01T00:00`    | Events ending before a date         |
| `is_featured`    | `&is_featured=true`                | Show only featured events           |
| `venue__in`      | `&venue__in=123,456`               | Filter by specific venue IDs        |

> **Note:** The API contains many additional fields for displaying ticket prices, sold-out status, and other details. However, the fields above provide everything needed for a solid initial integration.
