# Experience list by organization

## Overview

To fetch experiences for your organization, use the [Discovery API](./01-public-api-introduction.md) with the `venue` parameter to filter by organization ID.

## Endpoint

**Single organization:**
```
https://www.showpass.com/api/public/discovery/?venue=ORGANIZATION_ID
```

**Multiple organizations:**
```
https://www.showpass.com/api/public/discovery/?venue__in=ORGANIZATION_ID1,ORGANIZATION_ID2
```

Replace `ORGANIZATION_ID` with your numerical organization ID.

## Finding Your Organization ID

1. Log in to your Showpass account
2. Navigate to [https://www.showpass.com/dashboard/venues/edit/](https://www.showpass.com/dashboard/venues/edit/)
3. Your Organization ID is displayed in the top right corner

## Quick Examples

**Single organization:**
```
https://www.showpass.com/api/public/discovery/?venue=123
```

**Multiple organizations:**
```
https://www.showpass.com/api/public/discovery/?venue__in=123,456,789
```

**Upcoming events only:**
```
https://www.showpass.com/api/public/discovery/?venue=123&starts_on__gte=2025-01-01T00:00
```

**Homepage widget (next 5 featured events):**
```
https://www.showpass.com/api/public/discovery/?venue=123&is_featured=true&starts_on__gte=2025-01-01T00:00&ordering=starts_on&page_size=5
```

## Available Parameters

The `venue` parameter can be combined with any parameter from the Discovery API, including:

- **Date filters**: `starts_on__gte`, `starts_on__lte`, `ends_on__gte`, `ends_on__lt`
- **Search**: `search_string`
- **Categories & tags**: `categories`, `tags`
- **Filtering**: `is_featured`, `is_sponsored`, `showpass_gift_card`
- **Pagination**: `page_size`, `page`
- **Ordering**: `ordering`


## Important Notes

- **Domain whitelisting required**: Add your domain in the "Integrations" tab of your venue edit page
- **Parent experiences only by default**: Add `only_parents=false` to include recurring event instances
- **Default pagination**: 20 results per page

