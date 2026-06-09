# Showpass Discovery API

## Overview

Returns public Showpass experiences for calendars, search pages, featured lists, and event cards. Each result includes a `slug` for linking to the experience or fetching its details.

---

## Endpoint

```text
https://www.showpass.com/api/public/discovery/
```

---

## Authentication

No API token is required. Browser requests must come from a domain allowlisted in Showpass.

**Dashboard settings URL:**
```text
https://www.showpass.com/dashboard/venues/edit/
```

---

## Response format

All API responses are returned in **JSON** format.

---

## Key Filtering Parameters

Start with these filters for most listings:

| Parameter                           | Example                                    | Purpose                                  |
| ----------------------------------- | ------------------------------------------ | ---------------------------------------- |
| `search_string`                     | `&search_string=concert`                   | Filter by experience name, venue, tags   |
| `point_location`                    | `&point_location=51.0276233,-114.087835,15` | Filter by latitude, longitude, and radius in km |
| `tags`                              | `&tags=featured`                           | Show only experiences with specific tags |
| `starts_on__gte`                    | `&starts_on__gte=2025-01-01T00:00:00`      | Experiences starting after a date        |
| `ends_on__lt`                       | `&ends_on__lt=2025-02-01T00:00:00`         | Experiences ending before a date         |
| `is_featured`                       | `&is_featured=true`                        | Show only featured experiences           |
| `venue__in`                         | `&venue__in=123,456`                       | Filter by specific venue IDs             |

---

## Response Fields

These fields from the `results` array are the most commonly used:

| Field                      | Description                  | Usage                                        |
| -------------------------- | ---------------------------- | -------------------------------------------- |
| `slug`                     | Unique experience identifier | Link to, fetch, or route to the experience   |
| `name`                     | Experience name              | Display the experience title                 |
| `starts_on`                | Experience start time (UTC)  | Show when the experience begins              |
| `ends_on`                  | Experience end time (UTC)   | Show when the experience ends                |
| `timezone`                 | Experience timezone          | Convert UTC times to local display           |
| `description_without_html` | Plain text description       | Experience details and description text      |
| `frontend_details_url`     | Showpass experience page URL | Link to full experience details              |
| `image`                    | Square experience image      | Experience thumbnail/card image              |
| `image_banner`             | Banner experience image      | Hero/header image                            |

---

## All Parameters

You can refine your experience list query using the following optional parameters:

| Parameter         | Type     | Status   | Description                                                                                                                                                                                                                                                                                                                           |
| ----------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search_string`   | String   | Optional | A search query string. Filters experiences by matching against experience name, venue name, and tags.<br>Example: `&search_string=concert`                                                                                                                                                                                            |
| `name__icontains` | String   | Optional | Filter experiences by partial experience name match (case-insensitive).<br>Example: `&name__icontains=music`                                                                                                                                                                                                                          |
| `point_location`  | String   | Optional | Filter experiences by geographic location using `latitude,longitude,radius_km` format.<br>Example: `&point_location=51.0276233,-114.087835,15`                                                                                                                                                                                                                |
| `venue__in`       | String   | Optional | Filter by venue IDs. Comma-separated list of integers.<br>Example: `&venue__in=123,456`                                                                                                                                                                                                                                               |
| `venue`           | Integer  | Optional | Filter by a single venue ID.<br>Example: `&venue=123`                                                                                                                                                                                                                                                                                 |
| `categories`      | String   | Optional | Include experiences with specified categories. Comma-separated array.<br>Example: `&categories=music,arts`                                                                                                                                                                                                                            |
| `tags`            | String   | Optional | Include experiences with any of the specified tags. Comma-separated array.<br>Example: `&tags=featured,popular`                                                                                                                                                                                                                       |
| `voucher_code`    | String   | Optional | Filter experiences that accept a specific voucher code.<br>Example: `&voucher_code=DISCOUNT20`                                                                                                                                                                                                                                        |
| `is_featured`     | Boolean  | Optional | Filter experiences by featured status. When set to `true`, only featured experiences are returned.<br>Example: `&is_featured=true`                                                                                                                                                                                                   |
| `is_sponsored`    | Boolean  | Optional | Filter experiences by sponsored status. When set to `true`, returns only currently active sponsored experiences.<br>Example: `&is_sponsored=true`                                                                                                                                                                                     |
| `is_protected_by_queue` | Boolean | Optional | Filter experiences that require Showpass queue protection. When set to `true`, returns only queue-protected experiences.<br>Example: `&is_protected_by_queue=true`                                                                                                                                                           |
| `showpass_gift_card` | Boolean | Optional | Filter experiences that accept Showpass gift cards as payment. When set to `true`, returns only experiences that support gift card payments.<br>Example: `&showpass_gift_card=true`                                                                                                                                            |
| `only_parents`    | String   | Optional | Controls whether child experiences (recurring instances) are included. Set to `false` to include both parent and child experiences.<br>Example: `&only_parents=false`                                                                                                                                                                 |
| `page_size`       | Integer  | Optional | Number of results to return per page. <br>Default: `20`.<br>Example: `&page_size=8`                                                                                                                                                                                                                                                   |
| `page`            | Integer  | Optional | The specific page number to return.<br>Example: `&page=2`                                                                                                                                                                                                                                                                             |
| `id__in`          | String   | Optional | Return specific experiences by their IDs. Comma-separated list of integers.<br>Example: `&id__in=1,2,3`                                                                                                                                                                                                                               |
| `id`              | Integer  | Optional | Return a single experience by its ID.<br>Example: `&id=123`                                                                                                                                                                                                                                                                           |
| `starts_on__gte`  | ISO date | Optional | Experiences starting after or on the specified date/time.<br>Format: `YYYY-MM-DDTHH:MM:SS` or `YYYY-MM-DDTHH:MM:SS.sssZ`.<br>Example: `&starts_on__gte=2023-06-23T19:30:00`                                                                                                                                                                              |
| `starts_on__lte`  | ISO date | Optional | Experiences starting before or on the specified date/time.<br>Example: `&starts_on__lte=2023-06-23T19:30:00`                                                                                                                                                                                                                             |
| `starts_on__gt`   | ISO date | Optional | Experiences starting after the specified date/time.<br>Example: `&starts_on__gt=2023-06-23T19:30:00`                                                                                                                                                                                                                                     |
| `starts_on__lt`   | ISO date | Optional | Experiences starting before the specified date/time.<br>Example: `&starts_on__lt=2023-06-23T19:30:00`                                                                                                                                                                                                                                    |
| `ends_on__gte`    | ISO date | Optional | Experiences ending after or on the specified date/time.<br>Example: `&ends_on__gte=2023-06-23T19:30:00`                                                                                                                                                                                                                                  |
| `ends_on__lte`    | ISO date | Optional | Experiences ending before or on the specified date/time.<br>Example: `&ends_on__lte=2023-06-23T19:30:00`                                                                                                                                                                                                                                 |
| `ends_on__gt`     | ISO date | Optional | Experiences ending after the specified date/time.<br>Example: `&ends_on__gt=2023-06-23T19:30:00`                                                                                                                                                                                                                                         |
| `ends_on__lt`     | ISO date | Optional | Experiences ending before the specified date/time.<br>Example: `&ends_on__lt=2023-06-23T19:30:00`                                                                                                                                                                                                                                        |
| `ordering`        | String   | Optional | Specify the order the experiences are returned. Prefix with `-` for descending order.<br>Available fields: `is_sponsored`, `ranking_factor`, `starts_on`, `ends_on`, `id`, `name`.<br>Default: `-is_sponsored,-ranking_factor,starts_on`<br>Examples: `&ordering=starts_on`, `&ordering=-name`, `&ordering=-ranking_factor,starts_on` |
