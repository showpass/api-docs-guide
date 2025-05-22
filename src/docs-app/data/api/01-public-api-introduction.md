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

| Parameter        | Type     | Status   | Description                                                                                                                                                                                  |
| ---------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`              | String   | Optional | A search query string. Filters events by matching against event name, venue name, and tags.<br>Example: `&q=concert`                                                                         |
| `location`       | String   | Optional | Filters events by location name.<br>Example: `&location=Calgary`                                                                                                                             |
| `venue__in`      | Integer  | Optional | The ID of the organization whose events you want to fetch.                                                                                                                                   |
| `categories`     | String   | Optional | Include all events that have the specified categories. Comma-separated.<br>Example: `&categories="category_one,category_two"`                                                                |
| `tags`           | String   | Optional | Include all events that have any of the specified tags. Use `+` for spaces within a tag, comma-separated for multiple tags.<br>Example: `&tags="tag+one,another+tag"`                        |
| `tags_exact`     | String   | Optional | Include only events that have _all_ of the specified tags. Comma-separated.<br>Example: `&tags_exact="tag+one,must+have+this+too"`                                                           |
| `page_size`      | Integer  | Optional | Number of results to return per page. <br>Default: `20`.<br>Example: `&page_size=8`                                                                                                          |
| `page`           | Integer  | Optional | The specific page number to return.<br>Example: `&page=2`                                                                                                                                    |
| `id__in`         | String   | Optional | Return a list of specific events by their IDs. Comma-separated list of integers.<br>Example: `&id__in=1,2,3`                                                                                 |
| `starts_on__gte` | ISO date | Optional | Return events with a start time greater than or equal to (`gte`) the specified ISO date/time.<br>Format: `YYYY-MM-DDTHH:MM` or full ISO 8601.<br>Example: `&starts_on__gte=2023-06-23T19:30` |
| `ends_on__lt`    | ISO date | Optional | Return events with an end time less than (`lt`) the specified ISO date/time.<br>Format: `YYYY-MM-DDTHH:MM` or full ISO 8601.<br>Example: `&ends_on__lt=2023-06-23T19:30`                     |
| `ordering`       | String   | Optional | Specify the order the events are returned. Prefix with `-` for descending order.<br>Accepted values: `starts_on`, `id`, `name`.<br>Example: `&ordering="-name"` (desc by name)               |
| `show`           | String   | Optional | Return all events regardless of visibility settings (e.g., drafts). Use with caution.<br>Value: `all`.<br>Example: `&show=all`                                                               |
| `only_parents`   | Boolean  | Optional | If `true`, returns parent events of a recurring series and single (non-recurring) events. Recommended for recurring events.<br>Example: `&only_parents=true`                                 |
