# Installing Facebook Pixel

This guide walks you through setting up Facebook Pixel (Meta Pixel) with your Showpass organization to track event performance and optimize your Facebook advertising campaigns.

## Prerequisites

Before you begin, make sure you have:

- Admin access to your Showpass organization
- A Facebook Business Account
- A Facebook Ads Manager account
- A Facebook Pixel created in Facebook Events Manager

## Step 1: Create Your Facebook Pixel

If you haven't already created a Facebook Pixel, follow these steps:

1. **Navigate to Facebook Events Manager**
   - Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
   - Select your Business Account from the dropdown

2. **Create a New Data Source**
   - Click **Connect Data Sources**
   - Select **Web** as your platform
   - Choose **Meta Pixel** and click **Connect**

3. **Configure Your Pixel**
   - Enter a name for your pixel (e.g., "Your Organization Name - Events")
   - Add your website URL
   - Click **Continue**

4. **Choose Installation Method**
   - Select **Install code manually** for Showpass integration
   - Copy your Pixel ID (you'll need this for Showpass setup)

## Step 2: Configure Facebook Pixel in Showpass

1. **Access Organization Settings**
   - Log in to your Showpass dashboard
   - Navigate to **Organization Settings**
   - Select the **Integrations** tab

2. **Find Facebook Pixel Section**
   - Scroll down to find the **Facebook Pixel** integration section
   - Click **Configure** or **Enable**

3. **Enter Your Pixel ID**
   - Paste your Facebook Pixel ID (from Step 1) into the **Pixel ID** field
   - The Pixel ID format looks like: `123456789012345`

4. **Configure Event Tracking**
   - Enable the events you want to track:
     - ✅ **Page Views** (recommended)
     - ✅ **View Content** (recommended)
     - ✅ **Add to Cart** (recommended)
     - ✅ **Initiate Checkout** (recommended)
     - ✅ **Purchase** (essential for conversion tracking)

5. **Save Configuration**
   - Click **Save Settings**
   - Your Facebook Pixel is now active on your Showpass events

## Step 3: Verify Your Installation

### Using Facebook Pixel Helper

1. **Install the Chrome Extension**
   - Download the [Facebook Pixel Helper](https://chrome.google.com/webstore/detail/facebook-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension

2. **Test on Your Event Page**
   - Visit one of your Showpass event pages
   - Click the Pixel Helper extension icon
   - You should see your Pixel ID listed with a green checkmark

### Using Facebook Events Manager

1. **Check Test Events**
   - Go to Facebook Events Manager
   - Select your pixel
   - Click on the **Test Events** tab
   - Browse your event pages and verify events are being received

2. **Monitor Real-Time Activity**
   - In Events Manager, go to **Overview**
   - You should see recent activity and events being tracked
   - Green indicators show active event tracking

## Step 4: Set Up Conversion Tracking

### Configure Purchase Events

1. **In Facebook Ads Manager**
   - Go to **Ads Manager** → **Measure & Report** → **Conversions**
   - Click **Create** to add a new conversion

2. **Set Up Conversion Action**
   - Choose **Website** as the conversion location
   - Select **Purchase** as the event type
   - Set up conversion attribution windows as needed

### Optimize for Conversions

- Set your ad campaigns to optimize for **Purchase** events
- Use the conversion data to create lookalike audiences
- Build retargeting campaigns for users who didn't complete purchases

## Troubleshooting Common Issues

### Pixel Not Firing

**Symptoms**: Pixel Helper shows no activity
**Solutions**:
- Double-check your Pixel ID is entered correctly in Showpass
- Ensure you've saved the configuration
- Clear your browser cache and try again
- Wait up to 20 minutes for changes to take effect

### Events Not Tracking

**Symptoms**: Page views work but purchase events don't fire
**Solutions**:
- Verify all event types are enabled in Showpass settings
- Complete a test purchase to trigger the purchase event
- Check that you're testing with the same browser where Pixel Helper is installed

### Multiple Pixels Detected

**Symptoms**: Pixel Helper shows multiple pixels or warnings
**Solutions**:
- Remove any duplicate Facebook pixel code from your website
- Ensure only the Showpass integration is active
- Contact Showpass support if you need help identifying duplicate pixels

## Advanced Configuration

### Custom Conversions

Create custom conversions based on specific event behaviors:

1. **In Events Manager**
   - Go to **Custom Conversions**
   - Click **Create Custom Conversion**

2. **Set Conversion Rules**
   - Choose your data source (your pixel)
   - Set rules based on URL patterns or events
   - Example: Track conversions for specific event categories

### Audience Building

Use your pixel data to build custom audiences:

1. **Create Custom Audiences**
   - Go to **Ads Manager** → **Audiences**
   - Select **Custom Audience** → **Website**

2. **Define Audience Parameters**
   - People who visited event pages but didn't purchase
   - People who purchased tickets in the last 30 days
   - People who viewed specific event categories

## Data and Privacy Considerations

### GDPR and CCPA Compliance

- Facebook Pixel respects user consent preferences
- Data is processed according to Facebook's privacy policies
- Users can opt out through browser settings or privacy controls

### Data Retention

- Facebook retains pixel data according to their data retention policies
- Conversion data is typically available for up to 28 days for attribution
- Historical aggregate data is available for reporting

## Next Steps

With Facebook Pixel successfully installed, consider:

- [Setting up Facebook Conversions API](/facebook/04-installing-facebook-conversions-api) for enhanced data quality
- Creating retargeting campaigns for event attendees
- Building lookalike audiences based on your best customers
- Experimenting with different ad formats and targeting options

## Support

If you need assistance with Facebook Pixel setup:

- Contact Showpass support through your dashboard
- Refer to [Facebook's Business Help Center](https://www.facebook.com/business/help/)
- Check the Facebook Pixel Helper for specific error messages 