# Installing Facebook Conversions API

This guide provides step-by-step instructions for setting up Facebook Conversions API with your Showpass organization. Conversions API works alongside Facebook Pixel to provide enhanced tracking and improved ad performance.

## Prerequisites

Before you begin, ensure you have:

- **Facebook Pixel already installed** and working with Showpass
- **Facebook Business Manager account** with admin access
- **Admin access to your Showpass organization**
- **Domain verified** in Facebook Business Manager
- **Developer access** to your Facebook Business Manager account

---

## Step 1: Verify Your Domain

Domain verification is required for Conversions API to work properly.

### Navigate to Business Settings

1. Go to [Facebook Business Manager](https://business.facebook.com)

### Access Brand Safety

1. In the left sidebar, click **Brand Safety**
2. Select **Domains**

### Add and Verify Your Domain

1. If your event domain isn't listed, click **Add**
2. Enter your domain (e.g., `yourdomain.showpass.com`)
3. Choose a verification method:
   - **DNS Verification** (recommended)
   - **HTML File Upload**
   - **Meta Tag Verification**

### Complete Verification

1. Follow the instructions for your chosen method
2. Wait for verification (usually takes a few minutes)
3. Confirmed domains show a green checkmark

### Assign Showpass as a Partner

1. Once the domain is verified, click **Assign Partner**
2. Enter in `1769782139975843`
3. Enable **Link to domain**
4. Click **Assign**

### Send Showpass your Business ID

- Send your Facebook Business ID to `clients@showpass.com` so we can add you as a Partner to our showpass.com Verified Domain
- [How to find your Facebook Business ID](https://www.facebook.com/business/help/1181250022022158?id=180505742745347)

---

## Step 2: Generate Conversions API Access Token

### Access Facebook Events Manager

1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Select your Business Account
3. Choose the pixel you want to use with Conversions API

### Navigate to Settings

1. Click on your pixel name
2. Go to the **Settings** tab
3. Scroll down to the **Conversions API** section

### Generate Access Token

1. Click **Generate Access Token**
2. Copy the generated token immediately
3. Store it securely (you won't be able to see it again)

> **Important:** Keep your access token secure and never share it publicly. This token provides access to your Facebook advertising data.

---

## Step 3: Configure Conversions API in Showpass

### Access Organization Settings

1. Log in to your Showpass dashboard
2. Navigate to **Organization Settings**
3. Select the **Analytics** tab
4. Scroll down to **Facebook Conversions API**

### Enter Configuration Details

- **Access Token:** Paste the token from Step 2
- **Pixel ID:** Your Facebook Pixel ID (should already be configured from pixel setup)

### Configure Event Settings

- **Purchase Events:** ✅ Enable (essential for conversion tracking)
- **Checkout Events:** ✅ Enable (recommended)
- **Add to Cart Events:** ✅ Enable (recommended)
- **View Content Events:** ✅ Enable (optional but useful)

### Data Sharing Settings

- **Customer Information:** Enable to send hashed customer data
- **Purchase Data:** Enable to send transaction details
- **Event Deduplication:** ✅ Enable (prevents duplicate events)

### Save Configuration

1. Click **Save Settings**
2. Your Conversions API integration is now active

---

## Step 4: Test Your Integration

### Use Test Events in Facebook

1. **Trigger Test Events**
   - Visit your event pages
   - Add items to cart
   - Complete a test purchase

2. **Verify in Facebook**
   - Check Facebook Events Manager in the **Overview** tab
   - You should see events appear within 1-2 minutes
   - Check Facebook Events Manager in the **Diagnostics** tab
   - Facebook's diagnostics should not raise any concerns or issues with the configuration

### Check Event Quality

1. **In Events Manager**
   - Review the **Event Match Quality** score
   - Aim for a score of **Good** or **Great**
   - Low scores indicate missing customer data parameters

2. **Improve Match Quality**
   - Ensure customer email is being sent (hashed)
   - Include phone numbers when available
   - Add location data (city, state, country)

---

## Step 5: Monitor and Optimize

### Regular Monitoring

- **Event Coverage:** Ensure all purchase events are being tracked
- **Data Quality:** Monitor for any data transmission errors
- **Match Quality:** Maintain high event match quality scores
- **Deduplication:** Verify events aren't being counted twice

### Performance Optimization

1. **Update Ad Campaigns**
   - Set campaigns to optimize for Conversions API events
   - Use the enhanced data for better audience targeting
   - Create lookalike audiences based on server-side purchase data

2. **Custom Audience Creation**
   - Build audiences using server-side event data
   - Create retargeting campaigns for incomplete purchases
   - Develop VIP audiences based on purchase behavior

---

## Troubleshooting Common Issues

### Access Token Issues

**Symptoms:** Events not being received in Facebook

**Solutions:**

- Regenerate your access token in Events Manager
- Ensure the token has proper permissions
- Verify the token is correctly entered in Showpass

### Domain Verification Problems

**Symptoms:** Setup blocked or events rejected

**Solutions:**

- Complete domain verification in Business Manager
- Ensure DNS records are properly configured
- Wait up to 24 hours for DNS propagation

### Low Event Match Quality

**Symptoms:** Match quality score is "Poor" or "Fair"

**Solutions:**

- Enable customer information sharing in Showpass settings
- Verify customer email addresses are being captured
- Include additional customer parameters (phone, location)

---

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

---

## Next Steps

With Facebook Conversions API successfully configured:

1. **Monitor Performance:** Track improvements in ad performance metrics
2. **Optimize Campaigns:** Use enhanced data for better targeting
3. **Build Audiences:** Create custom audiences with server-side data
4. **Scale Advertising:** Expand campaigns with improved attribution confidence

---

## Support

If you need assistance:

- **Showpass Support:** Contact through your dashboard
- **Facebook Business Help:** [Meta Business Help Center](https://www.facebook.com/business/help/)
- **Technical Issues:** Check Facebook Events Manager diagnostics
- **Integration Problems:** Review configuration settings in both platforms

Successfully implementing Facebook Conversions API provides more reliable data for your advertising campaigns and helps you better understand your customers' journey from ad click to ticket purchase.
