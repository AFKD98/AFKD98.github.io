# Website Analytics Setup Guide

This guide will help you set up visitor tracking for your website using Google Analytics 4 (GA4).

## What's Been Added

1. **Google Analytics 4 Tracking Code** - Added to all main pages
2. **Custom Analytics Dashboard** - Available at `/analytics.html`
3. **Enhanced Tracking Script** - Tracks clicks, scroll depth, time on page, and more
4. **Privacy-Compliant Tracking** - Respects user privacy while providing insights

## Setup Steps

### Step 1: Create Google Analytics Account

1. Go to [Google Analytics](https://analytics.google.com)
2. Click "Start measuring"
3. Create a new account for your website
4. Add your website as a new property
5. Choose "Web" as the platform
6. Enter your website URL: `https://afkd98.github.io`

### Step 2: Get Your Measurement ID

1. After creating the property, you'll get a Measurement ID
2. It will look like `G-XXXXXXXXXX` (where X represents letters/numbers)
3. Copy this ID - you'll need it for the next step

### Step 3: Update Your Website

1. **Replace the placeholder ID** in these files:
   - `index.html`
   - `404.html`
   - `analytics.html`
   - `assets/js/analytics.js`

2. **Find this line in each file:**
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   ```

3. **Replace `G-XXXXXXXXXX` with your actual Measurement ID**

4. **Also update this line:**
   ```javascript
   gtag('config', 'G-XXXXXXXXXX');
   ```

### Step 4: Deploy Your Website

1. Upload the updated files to your website
2. Wait 24-48 hours for data to start appearing in Google Analytics

## What You'll Track

### Basic Metrics
- **Page Views** - How many times each page is viewed
- **Unique Visitors** - How many different people visit your site
- **Bounce Rate** - Percentage of visitors who leave after viewing one page
- **Session Duration** - How long visitors stay on your site

### Enhanced Tracking
- **Click Tracking** - Which links visitors click most
- **Scroll Depth** - How far down pages visitors scroll
- **Time on Page** - How long visitors spend on each page
- **Download Tracking** - When visitors download files (PDFs, etc.)
- **External Link Clicks** - When visitors click links to other sites
- **Form Submissions** - When visitors submit forms

### Traffic Sources
- **Direct Traffic** - Visitors who type your URL directly
- **Search Engines** - Visitors from Google, Bing, etc.
- **Social Media** - Visitors from Twitter, LinkedIn, etc.
- **Referrals** - Visitors from other websites

## Viewing Your Data

### Option 1: Google Analytics Dashboard
1. Go to [Google Analytics](https://analytics.google.com)
2. Select your property
3. View real-time and historical data

### Option 2: Custom Dashboard
1. Visit `https://afkd98.github.io/analytics.html`
2. View a simplified dashboard with key metrics
3. Note: This shows sample data until you set up real GA4

## Privacy Considerations

### What We Track
- Page views and navigation
- Basic visitor information (country, device type)
- User interactions (clicks, scrolls)
- **We do NOT track:**
  - Personal information (names, emails)
  - IP addresses (anonymized by Google)
  - Sensitive browsing data

### GDPR Compliance
- Google Analytics is GDPR compliant
- Users can opt out via browser settings
- No cookies are set without consent

## Customization Options

### Modify Tracking Events
Edit `assets/js/analytics.js` to:
- Add custom event tracking
- Track specific elements
- Modify tracking thresholds

### Add Custom Metrics
Use the `AnalyticsTracker` object:
```javascript
// Track custom events
AnalyticsTracker.trackCustomEvent('button_click', 'Engagement', 'Download CV', 1);

// Get visitor info
const visitorInfo = AnalyticsTracker.getVisitorInfo();
```

## Troubleshooting

### No Data Appearing
1. Check that you replaced `G-XXXXXXXXXX` with your real Measurement ID
2. Wait 24-48 hours for data to appear
3. Check browser console for errors
4. Verify the tracking code is on all pages

### Console Errors
- If you see "Google Analytics not loaded" - check your Measurement ID
- If you see "gtag is not defined" - the GA script didn't load properly

### Testing
1. Open browser developer tools
2. Go to the Network tab
3. Refresh your page
4. Look for requests to `googletagmanager.com`
5. If you see them, tracking is working

## Advanced Features

### Real-time Monitoring
- Google Analytics shows real-time visitors
- See who's on your site right now
- Monitor page views as they happen

### Custom Reports
- Create custom dashboards in GA4
- Set up automated reports
- Export data for analysis

### Goal Tracking
- Set up conversion goals
- Track specific user actions
- Measure success metrics

## Support

If you need help:
1. Check the [Google Analytics Help Center](https://support.google.com/analytics)
2. Review the setup steps above
3. Test with browser developer tools
4. Wait 24-48 hours for initial data

## Files Modified

- `index.html` - Added GA4 tracking code
- `404.html` - Added GA4 tracking code
- `analytics.html` - New analytics dashboard page
- `assets/js/analytics.js` - New enhanced tracking script
- `ANALYTICS_SETUP.md` - This setup guide

Your website now has comprehensive visitor tracking that will help you understand who's visiting and how they're interacting with your site! 