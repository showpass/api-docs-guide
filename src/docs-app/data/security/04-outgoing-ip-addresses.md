# Outgoing IP Addresses

If your systems require IP allowlisting for incoming connections from Showpass, use the addresses listed below. These IPs are used for all outbound API requests, webhooks, and third-party integrations initiated by our platform.

---

## Current IP Addresses

```text
34.83.8.110
34.168.12.250
35.230.81.80
35.230.119.67
```

---

## Who Needs This?

You'll need to allowlist these IPs if you:

- Use **Authorize.net** as your payment gateway
- Have firewall rules restricting incoming API requests
- Integrate with third-party systems that require IP allowlisting
- Need to verify the source of requests from Showpass

---

## Authorize.net Users

> **Important:** If you use Authorize.net with fraud detection enabled, you **must** add these IPs to avoid transaction issues.

### Configuration Steps

1. Log into your Authorize.net account
2. Navigate to **Account** → **Fraud Detection Suite** → **Transaction IP Velocity Filter**
3. Add all four IPs to the **IP Address Exclusion** section
4. Save your changes

### Why This Matters

Without IP allowlisting, legitimate transactions processed through Box Office or high-volume sales may be flagged as suspicious and placed under review, requiring manual approval.

---

## Best Practices

When configuring your allowlist:

| Step | Action |
|------|--------|
| ✅ | Add all four IP addresses to ensure uninterrupted service |
| ✅ | Use CIDR notation if required (e.g., `34.83.8.110/32`) |
| ✅ | Allow traffic on port `443` for HTTPS connections |
| ✅ | Test the connection after configuration |
| ✅ | Document the configuration for your team |

---

## Need Help?

**Email:** [support@showpass.com](mailto:support@showpass.com)  
**Response time:** Critical issues within 24 hours
