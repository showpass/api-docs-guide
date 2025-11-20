# Showpass Discovery API

The primary endpoint for discovering experiences is: `https://www.showpass.com/api/public/discovery/`

## Overview

The Showpass Public Experience API allows you to fetch experience data programmatically. You can use this API to display experience on your website, build custom integrations, or create your own applications that interact with Showpass experiences.

## Authentication

The Discovery API is open and does not generally require authentication tokens for basic discovery queries. However, for your requests to be successful, **your website's domain must be added to the allowlist** in the Showpass Dashboard. You can do this under your organization's settings, typically found on the "Integrations" tab of your venue edit page (`https://www.showpass.com/dashboard/venues/edit/`).

## Response format

All API responses are returned in **JSON** format.

## Parameters

You can refine your experience list query using the following optional parameters:

| Parameter         | Type     | Status   | Description                                                                                                                                                                                                                                                                                                                           |
| ----------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `search_string`   | String   | Optional | A search query string. Filters experiences by matching against experience name, venue name, and tags.<br>Example: `&search_string=concert`                                                                                                                                                                                            |
| `name__icontains` | String   | Optional | Filter experiences by partial experience name match (case-insensitive).<br>Example: `&name__icontains=music`                                                                                                                                                                                                                          |
| `point_location`  | String   | Optional | Filter experiences by geographic location (latitude,longitude format).<br>Example: `&point_location=51.0447,-114.0719`                                                                                                                                                                                                                |
| `location__point_location` | String | Optional | Alias for `point_location`. Filter by geographic coordinates.<br>Example: `&location__point_location=51.0447,-114.0719`                                                                                                                                                                                                  |
| `ordered__location__point_location` | String | Optional | Order results by distance from a geographic point (latitude,longitude format).<br>Example: `&ordered__location__point_location=51.0447,-114.0719`                                                                                                                                                                       |
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
| `starts_on__gte`  | ISO date | Optional | Experiences starting after or on the specified date/time.<br>Format: `YYYY-MM-DDTHH:MM` or full ISO 8601.<br>Example: `&starts_on__gte=2023-06-23T19:30`                                                                                                                                                                              |
| `starts_on__lte`  | ISO date | Optional | Experiences starting before or on the specified date/time.<br>Example: `&starts_on__lte=2023-06-23T19:30`                                                                                                                                                                                                                             |
| `starts_on__gt`   | ISO date | Optional | Experiences starting after the specified date/time.<br>Example: `&starts_on__gt=2023-06-23T19:30`                                                                                                                                                                                                                                     |
| `starts_on__lt`   | ISO date | Optional | Experiences starting before the specified date/time.<br>Example: `&starts_on__lt=2023-06-23T19:30`                                                                                                                                                                                                                                    |
| `ends_on__gte`    | ISO date | Optional | Experiences ending after or on the specified date/time.<br>Example: `&ends_on__gte=2023-06-23T19:30`                                                                                                                                                                                                                                  |
| `ends_on__lte`    | ISO date | Optional | Experiences ending before or on the specified date/time.<br>Example: `&ends_on__lte=2023-06-23T19:30`                                                                                                                                                                                                                                 |
| `ends_on__gt`     | ISO date | Optional | Experiences ending after the specified date/time.<br>Example: `&ends_on__gt=2023-06-23T19:30`                                                                                                                                                                                                                                         |
| `ends_on__lt`     | ISO date | Optional | Experiences ending before the specified date/time.<br>Example: `&ends_on__lt=2023-06-23T19:30`                                                                                                                                                                                                                                        |
| `ordering`        | String   | Optional | Specify the order the experiences are returned. Prefix with `-` for descending order.<br>Available fields: `is_sponsored`, `ranking_factor`, `starts_on`, `ends_on`, `id`, `name`.<br>Default: `-is_sponsored,-ranking_factor,starts_on`<br>Examples: `&ordering=starts_on`, `&ordering=-name`, `&ordering=-ranking_factor,starts_on` |

## Important Fields

While the API returns many fields, the following are the most impactful for building real integrations. Focus on these fields for your initial implementation:

### Essential Response Fields

When processing API responses, these fields from the `results` array are the most commonly needed:

| Field                      | Description                  | Usage                                        |
| -------------------------- | ---------------------------- | -------------------------------------------- |
| `slug`                     | Unique experience identifier | **Required** to initiate widgets via the SDK |
| `name`                     | Experience name              | Display the experience title                 |
| `starts_on`                | Experience start time (UTC)  | Show when the experience begins              |
| `ends_on`                  | Experience end time (UTC)   | Show when the experience ends                |
| `timezone`                 | Experience timezone          | Convert UTC times to local display           |
| `description_without_html` | Plain text description       | experience details and description text      |
| `frontend_details_url`     | Showpass experience page URL | Link to full experience details              |
| `image`                    | Square experience image      | experience thumbnail/card image              |
| `image_banner`             | Banner experience image      | Hero/header image                            |

### Key Filtering Parameters

These are the most commonly used filtering parameters for practical implementations:

| Parameter                           | Example                                    | Purpose                                  |
| ----------------------------------- | ------------------------------------------ | ---------------------------------------- |
| `search_string`                     | `&search_string=experience%20Name`         | Filter by experience name, venue, tags   |
| `tags`                              | `&tags=featured`                           | Show only experiences with specific tags |
| `starts_on__gte`                    | `&starts_on__gte=2025-01-01T00:00`         | Experiences starting after a date        |
| `ends_on__lt`                       | `&ends_on__lt=2025-02-01T00:00`            | Experiences ending before a date         |
| `is_featured`                       | `&is_featured=true`                        | Show only featured experiences           |
| `venue__in`                         | `&venue__in=123,456`                       | Filter by specific venue IDs             |

> **Note:** The API contains many additional fields for displaying ticket prices, sold-out status, and other details. However, the fields above provide everything needed for a solid initial integration.
