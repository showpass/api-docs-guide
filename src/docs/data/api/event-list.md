
# Event List by Organization

## Endpoint
```
https://www.showpass.com/api/public/discovery/?venue__in=id
```

## Overview
Displays all upcoming public events for a specific organization.

Navigate to https://www.showpass.com/dashboard/venues/edit/ to find the organization ID in the top right corner.

Make sure you add your website's domain to the "Integrations" tab on the same page.

## Parameters

<!-- PARAMETER_TABLE_START -->
| Parameter | Type | Status | Description |
|-----------|------|--------|-------------|
| categories | String | Optional | Include all events that have the following categories<br>`&categories="category_one,category_two"` |
| tags | String | Optional | Include all events that have the following tags<br>`&tags="tag+one,tag+two"` |
| tags_exact | String | Optional | Include only events that have all of the tags<br>`&tags="tag+one,tag+two"` |
| page_size | Integer | Optional | Number of results to return [default: 20]<br>`&page_size=8` |
| page_number | Integer | Optional | The specific page number to return<br>`&page_number=8` |
| id__in | Integer | Optional | Return a list of specific events<br>`&id__in=1,2,3` |
| starts_on__gte | ISO date | Optional | Return a list of events with a start time after a specific date<br>`&starts_on__gte=2019-06-23T19:30` |
| ends_on__lt | ISO date | Optional | Return a list of events with the end time before a specific date<br>`&ends_on__lt=2019-06-23T19:30` |
| ordering | String | Optional | Specify the order the events are returned<br>starts_on: Order events by event start date<br>id: Order events by event ID<br>name: Order alphabetically by event name<br>`&ordering="-name"` (order descending by event name) |
| show | String | Optional | Return all events regardless of visibility settings<br>`&show=all` |
| only_parents | Boolean | Optional | Return parent events and single events - recommended use for recurring events<br>`&only_parents=true` |
<!-- PARAMETER_TABLE_END -->

## Example Request
```
https://www.showpass.com/api/public/discovery/?venue__in=123&page_size=10&ordering=starts_on&tags=featured
```

## API Response
Simply copy and paste the completed URL into your browser to view the response.

Download the JSON View extension for Chrome for in-browser formatting for readability.
