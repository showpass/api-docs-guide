# About Facebook Conversions API

Facebook Conversions API (formerly Server-Side API) is a tool that allows you to share web and offline events directly from your server to Facebook. It works alongside Facebook Pixel to improve ad performance measurement and help you reach more people.

## What is Facebook Conversions API?

Facebook Conversions API creates a direct connection between your marketing data (from Showpass) and Facebook's systems. Unlike the Facebook Pixel, which operates through the browser, Conversions API sends data server-to-server, providing more reliable data delivery and better attribution.

## Why Use Conversions API with Facebook Pixel?

### Enhanced Data Quality
- **Reduced Data Loss**: Server-side data isn't affected by browser restrictions, ad blockers, or connection issues
- **More Complete Attribution**: Capture events that pixel tracking might miss
- **Better Signal Quality**: Combine browser and server data for more accurate measurement

### Improved Ad Performance
- **Better Optimization**: More complete data helps Facebook's algorithm optimize your ad delivery
- **Enhanced Audience Building**: Create more accurate custom and lookalike audiences
- **Improved Attribution**: Better understanding of which ads drive ticket sales

### Future-Proofing
- **Privacy Compliance**: Works within evolving privacy frameworks (iOS 14.5+, browser changes)
- **Reduced Dependence on Cookies**: Server-side tracking is less affected by cookie restrictions
- **Platform Reliability**: Direct server connection provides consistent data delivery

## How Conversions API Works with Showpass

When someone interacts with your Showpass events, data flows through two paths:

### 1. Browser Path (Facebook Pixel)
- User visits your event page
- Pixel fires in their browser
- Data sent directly to Facebook from user's device

### 2. Server Path (Conversions API)
- User completes an action (e.g., purchases tickets)
- Showpass server sends event data to Facebook
- Data includes customer information and purchase details

### Event Deduplication
Facebook automatically deduplicates events received from both sources using:
- Event ID matching
- User identification parameters
- Timestamp correlation

## Events Tracked via Conversions API

Showpass can send these events through Conversions API:

| Event | Description | Data Included |
|-------|-------------|---------------|
| `Purchase` | Ticket purchase completed | Order value, currency, items purchased |
| `InitiateCheckout` | Checkout process started | Items in cart, total value |
| `AddToCart` | Tickets added to cart | Item details, quantity, value |
| `ViewContent` | Event page viewed | Event details, category |
| `Lead` | Contact form submitted | Lead information (if applicable) |

## Data Sent to Facebook

Conversions API can send rich data about your customers and their actions:

### Customer Information
- Email address (hashed)
- Phone number (hashed)
- Name (hashed)
- Location data (city, state, country)

### Event Data
- Purchase amount and currency
- Product/ticket details
- Event timestamp
- Custom event parameters

### Technical Data
- User agent string
- IP address
- Click ID (if available)

## Privacy and Data Protection

### Data Hashing
- Personal information is automatically hashed before transmission
- Facebook cannot reverse-engineer personal data from hashed values
- Maintains privacy while enabling effective ad targeting

### Compliance Features
- Supports GDPR and CCPA compliance
- Respects user consent preferences
- Allows data processing restrictions

### Data Processing Agreement
- Facebook processes data according to their data processing terms
- Data is used only for advertising optimization and measurement
- Retention policies align with Facebook's standard practices

## Benefits for Event Organizers

### Improved ROI Measurement
- More accurate attribution of ticket sales to Facebook ads
- Better understanding of customer lifetime value
- Enhanced cross-device tracking capabilities

### Enhanced Audience Creation
- Build more precise custom audiences
- Create better-performing lookalike audiences
- Improve retargeting accuracy

### Campaign Optimization
- Better automated bidding optimization
- More effective ad delivery optimization
- Improved budget allocation across campaigns

## Prerequisites

Before setting up Facebook Conversions API with Showpass:

- **Facebook Business Manager account** with admin access
- **Facebook Pixel already installed** and working
- **Admin access to your Showpass organization**
- **Domain verification** in Facebook Business Manager
- **Facebook Conversions API access token**

## Limitations and Considerations

### Data Processing Delays
- Server-side events may take longer to appear in Facebook reporting
- Real-time optimization may be less immediate than pixel-only setups

### Technical Requirements
- Requires server-side integration capabilities
- May need additional setup time compared to pixel-only implementation

### Cost Considerations
- Facebook Conversions API usage may count against API rate limits
- Enterprise-level usage may require business agreements with Facebook

## Next Steps

Ready to enhance your Facebook tracking with Conversions API?

1. **Verify Prerequisites**: Ensure you have all required accounts and access
2. **Install Conversions API**: Follow our [installation guide](/facebook/04-installing-facebook-conversions-api)
3. **Test Your Setup**: Verify events are being received correctly
4. **Monitor Performance**: Track improvements in ad performance and attribution

## Support and Resources

- **Showpass Support**: Contact through your dashboard for integration help
- **Facebook Business Help**: [Meta Business Help Center](https://www.facebook.com/business/help/)
- **API Documentation**: [Facebook Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)

Understanding Facebook Conversions API is the first step toward more effective advertising measurement. When combined with Facebook Pixel, it provides the most comprehensive tracking solution for your Showpass events. 