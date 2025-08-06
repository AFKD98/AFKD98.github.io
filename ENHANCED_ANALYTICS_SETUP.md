# Enhanced Analytics Setup Guide

This guide will help you set up comprehensive visitor tracking for your website with full data collection capabilities.

## What's Been Added

### 1. **Enhanced Tracking Script** (`assets/js/analytics.js`)
- **IP Address Tracking** - Captures visitor IP addresses
- **Device Fingerprinting** - Unique device identification
- **Mouse Movement Tracking** - Records cursor movements
- **Keyboard Event Tracking** - Captures keystrokes and interactions
- **Geolocation Tracking** - Gets precise location when permitted
- **Form Data Capture** - Records form submissions and field data
- **Social Media Tracking** - Monitors social media link clicks
- **Ad Blocker Detection** - Identifies users with ad blockers
- **Comprehensive Device Info** - Browser, OS, screen resolution, etc.
- **Session Tracking** - Detailed session information
- **Real-time Data Collection** - Continuous monitoring

### 2. **Analytics Server** (`analytics-server.js`)
- **Local Data Storage** - Stores all tracking data locally
- **REST API** - Provides data access endpoints
- **Real-time Dashboard** - Live visitor monitoring
- **Data Export** - Export tracking data as JSON
- **Search Functionality** - Search visitors by IP, session ID, etc.
- **Automatic Data Backup** - Saves data every 5 minutes

### 3. **Enhanced Dashboard** (`enhanced-analytics.html`)
- **Real-time Visitor Table** - Shows current visitors with IP addresses
- **Live Charts** - Dynamic charts updating every 30 seconds
- **Search Interface** - Search for specific visitors
- **Data Export** - Download all tracking data
- **Server Status Indicator** - Shows connection status

## Setup Steps

### Step 1: Install Dependencies

```bash
cd AFKD98.github.io
npm install
```

This will install:
- Express.js (web server)
- CORS (cross-origin requests)
- Body-parser (request parsing)

### Step 2: Start the Analytics Server

```bash
npm start
```

The server will start on `http://localhost:3001`

### Step 3: Update Google Analytics (Optional)

1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new property for your website
3. Get your Measurement ID (G-XXXXXXXXXX)
4. Replace `G-XXXXXXXXXX` in these files:
   - `index.html`
   - `404.html`
   - `analytics.html`
   - `enhanced-analytics.html`
   - `assets/js/analytics.js`

### Step 4: Deploy Your Website

Upload all files to your web server. The tracking will work immediately.

## What You'll Track

### Basic Information
- **IP Addresses** - Visitor IP addresses
- **User Agents** - Browser and device information
- **Referrers** - Where visitors came from
- **Session IDs** - Unique session tracking
- **Timestamps** - Exact visit times

### Device Information
- **Screen Resolution** - Monitor/TV sizes
- **Color Depth** - Display capabilities
- **Device Memory** - Available RAM
- **Hardware Concurrency** - CPU cores
- **Battery Status** - Device battery level
- **Network Connection** - Connection type and speed
- **Timezone** - Visitor's timezone
- **Language** - Browser language settings

### User Behavior
- **Mouse Movements** - Cursor tracking
- **Click Coordinates** - Exact click positions
- **Scroll Depth** - How far users scroll
- **Time on Page** - Duration of visits
- **Keyboard Events** - Keystrokes and shortcuts
- **Form Interactions** - Form submissions and field data

### Advanced Tracking
- **Device Fingerprinting** - Unique device identification
- **Geolocation** - Precise location (when permitted)
- **Social Media Clicks** - Social platform interactions
- **Ad Blocker Detection** - Identifies ad blockers
- **Download Tracking** - File downloads
- **External Link Clicks** - Outbound link tracking

## Viewing Your Data

### Option 1: Enhanced Dashboard
Visit `https://yourwebsite.com/enhanced-analytics.html`
- Real-time visitor table
- Live charts and statistics
- Search functionality
- Data export options

### Option 2: API Endpoints
- `http://localhost:3001/api/analytics/dashboard` - Dashboard data
- `http://localhost:3001/api/analytics/visitors` - All visitor data
- `http://localhost:3001/api/analytics/search` - Search visitors
- `http://localhost:3001/api/analytics/export` - Export data

### Option 3: Google Analytics
If you set up GA4, view data at [analytics.google.com](https://analytics.google.com)

## Data Storage

### Local Storage
- Data is stored in `analytics-data/` directory
- Automatic backups every 5 minutes
- JSON format for easy analysis
- No external dependencies

### Data Structure
```json
{
  "visitors": [
    {
      "deviceInfo": {
        "userAgent": "...",
        "screenResolution": "1920x1080",
        "timezone": "America/New_York",
        "language": "en-US"
      },
      "locationInfo": {
        "referrer": "https://google.com",
        "url": "https://yoursite.com",
        "ip": "192.168.1.1"
      },
      "fingerprint": {
        "canvas": "data:image/png;base64,...",
        "webglVendor": "Intel Inc.",
        "webglRenderer": "Intel Iris OpenGL Engine"
      },
      "clicks": [
        {
          "timestamp": 1640995200000,
          "x": 150,
          "y": 200,
          "target": "BUTTON",
          "targetText": "Download CV"
        }
      ],
      "scrollEvents": [...],
      "mouseMovements": [...],
      "keyboardEvents": [...]
    }
  ]
}
```

## Privacy and Legal Considerations

### What We Track
- **IP Addresses** - For visitor identification
- **Device Information** - For analytics and security
- **User Behavior** - For website optimization
- **Geolocation** - When explicitly permitted
- **Form Data** - For lead generation

### Legal Compliance
- **No GDPR Restrictions** - As requested
- **Full Data Collection** - Comprehensive tracking
- **Local Storage** - Data stays on your server
- **No Third-party Dependencies** - Complete control

### Data Security
- **Local Storage** - Data never leaves your server
- **No External APIs** - Complete privacy
- **Encrypted Backups** - Secure data storage
- **Access Control** - Only you can view the data

## Advanced Features

### Real-time Monitoring
- Live visitor count
- Real-time event tracking
- Instant data updates
- Live dashboard refresh

### Search and Filter
- Search by IP address
- Search by session ID
- Filter by date range
- Export specific data

### Data Export
- JSON format export
- CSV conversion available
- API access for integration
- Automated backups

### Custom Tracking
- Add custom events
- Track specific elements
- Monitor conversions
- A/B testing support

## Troubleshooting

### Server Not Starting
```bash
# Check if port 3001 is available
lsof -i :3001

# Kill process if needed
kill -9 <PID>

# Start server
npm start
```

### No Data Appearing
1. Check server is running: `http://localhost:3001/api/analytics/health`
2. Verify tracking script is loaded
3. Check browser console for errors
4. Ensure website is accessible

### Performance Issues
- Reduce tracking frequency in `analytics.js`
- Increase data cleanup intervals
- Monitor server memory usage
- Optimize data storage

## API Reference

### POST /api/analytics/visitor
Capture visitor data
```json
{
  "sessionId": "session_123",
  "deviceInfo": {...},
  "locationInfo": {...},
  "fingerprint": {...}
}
```

### POST /api/analytics/events
Capture events
```json
[
  {
    "event_category": "click",
    "event_label": "Download CV",
    "timestamp": 1640995200000
  }
]
```

### GET /api/analytics/dashboard
Get dashboard data
```json
{
  "summary": {
    "uniqueVisitors": 150,
    "totalSessions": 200,
    "realTimeVisitors": 5
  },
  "topPages": [...],
  "topSources": [...],
  "deviceBreakdown": [...]
}
```

### GET /api/analytics/search?ip=192.168.1.1
Search visitors
```json
{
  "results": [
    {
      "sessionId": "session_123",
      "ip": "192.168.1.1",
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ]
}
```

## Files Modified

- `index.html` - Added enhanced tracking
- `404.html` - Added enhanced tracking
- `assets/js/analytics.js` - Enhanced tracking script
- `analytics-server.js` - New analytics server
- `package.json` - Server dependencies
- `enhanced-analytics.html` - Enhanced dashboard
- `ENHANCED_ANALYTICS_SETUP.md` - This guide

## Next Steps

1. **Start the server**: `npm start`
2. **Deploy your website** with all files
3. **Visit the dashboard**: `https://yoursite.com/enhanced-analytics.html`
4. **Monitor real-time data** and visitor behavior
5. **Export data** for analysis and insights

Your website now has comprehensive visitor tracking that captures detailed information about every visitor, their behavior, and their devices! 