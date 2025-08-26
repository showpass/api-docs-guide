# Showpass Private Organizer API

The Showpass Private Organizer API provides authenticated access to various functionality for event organizers, with a focus on ticket management and verification.

## Overview

This private API allows organizers to perform various operations related to event management. Unlike the public API, this API requires authentication with a Showpass token and provides access to sensitive data and operations that are specific to event organizers.

The API is continuously evolving to provide more capabilities to event organizers, with the current focus being on ticket management, verification, and scanning operations.

## Authentication

The Private Organizer API requires authentication using a Showpass token:

```
Authorization: Token YOUR_API_TOKEN
```

You must include this token in the header of all requests to the private API endpoints. Contact Showpass support to obtain your organization's API token.

## Available Endpoints

The Private Organizer API provides a growing set of endpoints for event organizers to manage their events and tickets. Currently, the API includes endpoints for ticket verification and scanning operations, with more functionality planned for future releases.

The API is designed to be extensible, allowing for new features and capabilities to be added over time to meet the evolving needs of event organizers.

## Getting Started

To get started with the Private Organizer API:

1. Obtain an API token from Showpass support
2. Review the available endpoints documentation to understand the capabilities
3. Implement the API endpoints that meet your specific needs

Currently, the API documentation includes details on ticket verification and scanning operations, with more endpoints to be documented as they become available.

The following sections provide detailed documentation for the available endpoints.