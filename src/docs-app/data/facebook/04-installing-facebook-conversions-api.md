# Installing Facebook Conversions API

This guide provides step-by-step instructions for setting up Facebook Conversions API with your Showpass organization. Conversions API works alongside Facebook Pixel to provide enhanced tracking and improved ad performance.

## Prerequisites

Before you begin, ensure you have:

- **Facebook Pixel already installed** and working with Showpass
- **Facebook Business Manager account** with admin access
- **Admin access to your Showpass organization**
- **Domain verified** in Facebook Business Manager
- **Developer access** to your Facebook Business Manager account

## Step 1: Verify Your Domain

Domain verification is required for Conversions API to work properly.

1. **Navigate to Business Settings**

   - Go to [Facebook Business Manager](https://business.facebook.com)
   - Click **Business Settings** in the top right

2. **Access Brand Safety**

   - In the left sidebar, click **Brand Safety**
   - Select **Domains**

3. **Add and Verify Your Domain**

   - If your event domain isn't listed, click **Add**
   - Enter your domain (e.g., `yourdomain.showpass.com`)
   - Choose a verification method:
     - **DNS Verification** (recommended)
     - **HTML File Upload**
     - **Meta Tag Verification**

4. **Complete Verification**

   - Follow the instructions for your chosen method
   - Wait for verification (usually takes a few minutes)
   - Confirmed domains show a green checkmark

5. **Send Showpass your Business ID**
   - Send your Facebook Business ID to clients@showpass.com so we can add you as a Partner to our showpass.com Verified Domain
   - [How to find your Facebook Business ID](https://www.facebook.com/business/help/1181250022022158?id=180505742745347)

## Step 2: Generate Conversions API Access Token

1. **Access Facebook Events Manager**

   - Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
   - Select your Business Account
   - Choose the pixel you want to use with Conversions API

2. **Navigate to Settings**

   - Click on your pixel name
   - Go to the **Settings** tab
   - Scroll down to the **Conversions API** section

3. **Generate Access Token**
   - Click **Generate Access Token**
   - Copy the generated token immediately
   - Store it securely (you won't be able to see it again)

> **Important**: Keep your access token secure and never share it publicly. This token provides access to your Facebook advertising data.

## Step 3: Configure Conversions API in Showpass

1. **Access Organization Settings**

   - Log in to your Showpass dashboard
   - Navigate to **Organization Settings**
   - Select the **Analytics** tab
   - Scroll down to **Facebook Conversions API**

2. **Enter Configuration Details**

   - **Access Token**: Paste the token from Step 2
   - **Pixel ID**: Your Facebook Pixel ID (should already be configured from pixel setup)
   - **Test Event Code**: Leave blank for now (we'll add this during testing)

3. **Configure Event Settings**

   - **Purchase Events**: ✅ Enable (essential for conversion tracking)
   - **Checkout Events**: ✅ Enable (recommended)
   - **Add to Cart Events**: ✅ Enable (recommended)
   - **View Content Events**: ✅ Enable (optional but useful)

4. **Data Sharing Settings**

   - **Customer Information**: Enable to send hashed customer data
   - **Purchase Data**: Enable to send transaction details
   - **Event Deduplication**: ✅ Enable (prevents duplicate events)

5. **Save Configuration**
   - Click **Save Settings**
   - Your Conversions API integration is now active

## Step 4: Monitor and Optimize

### Regular Monitoring

- **Event Coverage**: Ensure all purchase events are being tracked
- **Data Quality**: Monitor for any data transmission errors
- **Attribution**: Compare pixel-only vs. pixel + Conversions API performance

### Performance Optimization

1. **Update Ad Campaigns**

   - Set campaigns to optimize for Conversions API events
   - Use the enhanced data for better audience targeting
   - Create lookalike audiences based on server-side purchase data

2. **Custom Audience Creation**
   - Build audiences using server-side event data
   - Create retargeting campaigns for incomplete purchases
   - Develop VIP audiences based on purchase behavior

## Troubleshooting Common Issues

### Access Token Issues

**Symptoms**: Events not being received in Facebook
**Solutions**:

- Regenerate your access token in Events Manager
- Ensure the token has proper permissions
- Verify the token is correctly entered in Showpass

### Domain Verification Problems

**Symptoms**: Setup blocked or events rejected
**Solutions**:

- Complete domain verification in Business Manager
- Ensure DNS records are properly configured
- Wait up to 24 hours for DNS propagation

## Performance Expectations

### Initial Setup Period

- Allow 24-48 hours for full integration activation
- Event data may take 1-2 hours to appear in reporting
- Attribution improvements may take 7-14 days to stabilize

### Expected Improvements

- **5-15% improvement** in attribution accuracy
- **Better ad delivery optimization** within 7 days
- **Enhanced audience quality** for retargeting campaigns
- **Reduced data loss** from browser restrictions

## Next Steps

With Facebook Conversions API successfully configured:

1. **Monitor Performance**: Track improvements in ad performance metrics
2. **Optimize Campaigns**: Use enhanced data for better targeting
3. **Build Audiences**: Create custom audiences with server-side data
4. **Scale Advertising**: Expand campaigns with improved attribution confidence

## Support

If you need assistance:

- **Showpass Support**: Contact through your dashboard
- **Facebook Business Help**: [Meta Business Help Center](https://www.facebook.com/business/help/)
- **Technical Issues**: Check Facebook Events Manager diagnostics
- **Integration Problems**: Review configuration settings in both platforms

Successfully implementing Facebook Conversions API provides more reliable data for your advertising campaigns and helps you better understand your customers' journey from ad click to ticket purchase.
