# GitHub Pages Analytics Setup

This guide will help you deploy your website with enhanced analytics on GitHub Pages.

## 🚀 **What You Need to Do**

### **1. No Analytics Key Required!**

The system I created is **completely self-contained** and doesn't require any external API keys or services. It works entirely with:
- **localStorage** (stores data in visitor's browser)
- **Google Analytics** (optional, for additional tracking)
- **Webhook services** (optional, for data collection)

### **2. For GitHub Pages Deployment**

Since GitHub Pages only serves static files (no Node.js server), I've created a **static analytics system** that works perfectly:

#### **What's Included:**
- ✅ **Static Analytics Script** (`assets/js/static-analytics.js`)
- ✅ **Enhanced Tracking** (IP, device info, mouse movements, etc.)
- ✅ **localStorage Storage** (data stored in visitor's browser)
- ✅ **Google Analytics Integration** (optional)
- ✅ **Webhook Support** (optional, for data collection)

## 📋 **Setup Steps**

### **Step 1: Deploy to GitHub Pages**

1. **Push all files to your GitHub repository**
2. **Enable GitHub Pages** in your repository settings
3. **Your site will be available at:** `https://yourusername.github.io/repository-name`

### **Step 2: Optional - Set Up Data Collection**

#### **Option A: Google Analytics (Recommended)**
1. Go to [Google Analytics](https://analytics.google.com)
2. Create a new property for your website
3. Get your Measurement ID (G-XXXXXXXXXX)
4. Replace `G-XXXXXXXXXX` in these files:
   - `index.html`
   - `404.html`
   - `analytics.html`
   - `enhanced-analytics.html`
   - `assets/js/static-analytics.js`

#### **Option B: Webhook for Data Collection**
1. Go to [webhook.site](https://webhook.site)
2. Create a new webhook URL
3. Copy the unique URL (e.g., `https://webhook.site/abc123-def456`)
4. Replace the webhook URL in `assets/js/static-analytics.js`:
   ```javascript
   WEBHOOK_URL: 'https://webhook.site/your-unique-id', // Replace with your webhook URL
   ```

### **Step 3: View Your Data**

#### **Option A: Google Analytics Dashboard**
- Visit [analytics.google.com](https://analytics.google.com)
- Select your property
- View real-time and historical data

#### **Option B: Webhook Data**
- Visit your webhook URL at [webhook.site](https://webhook.site)
- View incoming data in real-time
- Export data as needed

#### **Option C: Browser Developer Tools**
- Open browser developer tools
- Go to Application/Storage tab
- View localStorage data under your domain

## 🔧 **What Gets Tracked**

### **Basic Information**
- **IP Addresses** (via webhook or GA)
- **User Agents** (browser and device info)
- **Referrers** (where visitors came from)
- **Session IDs** (unique session tracking)
- **Timestamps** (exact visit times)

### **Device Information**
- **Screen Resolution** (monitor/TV sizes)
- **Color Depth** (display capabilities)
- **Device Memory** (available RAM)
- **Hardware Concurrency** (CPU cores)
- **Battery Status** (device battery level)
- **Network Connection** (connection type and speed)
- **Timezone** (visitor's timezone)
- **Language** (browser language settings)

### **User Behavior**
- **Mouse Movements** (cursor tracking)
- **Click Coordinates** (exact click positions)
- **Scroll Depth** (how far users scroll)
- **Time on Page** (duration of visits)
- **Keyboard Events** (keystrokes and shortcuts)
- **Form Interactions** (form submissions and field data)

### **Advanced Tracking**
- **Device Fingerprinting** (unique device identification)
- **Geolocation** (precise location when permitted)
- **Social Media Clicks** (social platform interactions)
- **Ad Blocker Detection** (identifies ad blockers)
- **Download Tracking** (file downloads)
- **External Link Clicks** (outbound link tracking)

## 📊 **Data Storage**

### **localStorage (Automatic)**
- Data is stored in visitor's browser
- Persists across sessions
- No external dependencies
- Privacy-compliant

### **Google Analytics (Optional)**
- Standard GA4 tracking
- Real-time data
- Historical analysis
- Custom reports

### **Webhook (Optional)**
- Real-time data collection
- JSON format
- Easy to process
- No storage limits

## 🚀 **Deployment Checklist**

### **Files to Deploy:**
- ✅ `index.html` (updated with static analytics)
- ✅ `404.html` (updated with static analytics)
- ✅ `assets/js/static-analytics.js` (new static analytics script)
- ✅ `analytics.html` (basic analytics dashboard)
- ✅ `enhanced-analytics.html` (enhanced dashboard)
- ✅ `ANALYTICS_SETUP.md` (setup guide)
- ✅ `GITHUB_PAGES_SETUP.md` (this guide)

### **Optional Files:**
- `analytics-server.js` (Node.js server - not needed for GitHub Pages)
- `package.json` (Node.js dependencies - not needed for GitHub Pages)

## 🔍 **Testing Your Setup**

### **1. Check if Analytics is Working**
1. Open your website
2. Open browser developer tools (F12)
3. Go to Console tab
4. You should see: "Static Analytics loaded successfully"

### **2. Check Data Collection**
1. Open browser developer tools
2. Go to Application/Storage tab
3. Look for localStorage under your domain
4. You should see `analytics_data` with visitor information

### **3. Check Google Analytics (if set up)**
1. Visit [analytics.google.com](https://analytics.google.com)
2. Go to Real-time reports
3. Visit your website
4. You should see yourself as a real-time visitor

### **4. Check Webhook (if set up)**
1. Visit your webhook URL
2. Visit your website
3. You should see incoming data

## 🛠️ **Troubleshooting**

### **Analytics Not Loading**
- Check browser console for errors
- Verify `static-analytics.js` is in the correct location
- Ensure the script tag is present in HTML files

### **No Data in Google Analytics**
- Verify your Measurement ID is correct
- Wait 24-48 hours for data to appear
- Check if ad blockers are interfering

### **No Data in Webhook**
- Verify webhook URL is correct
- Check if webhook service is working
- Ensure no CORS issues

### **localStorage Not Working**
- Check if browser supports localStorage
- Verify no privacy settings are blocking it
- Check browser console for errors

## 📈 **Advanced Features**

### **Custom Tracking**
```javascript
// Track custom events
AnalyticsTracker.trackCustomEvent('button_click', 'Engagement', 'Download CV', 1);

// Get visitor data
const visitorData = AnalyticsTracker.getVisitorData();

// Save data manually
AnalyticsTracker.saveToLocalStorage();
```

### **Data Export**
- **Google Analytics**: Export from GA dashboard
- **Webhook**: Download from webhook service
- **localStorage**: Access via browser developer tools

## 🎯 **Next Steps**

1. **Deploy your website** to GitHub Pages
2. **Set up Google Analytics** (optional but recommended)
3. **Set up webhook** (optional, for data collection)
4. **Test the tracking** using the methods above
5. **Monitor your data** and visitor behavior

## 📞 **Support**

If you need help:
1. Check browser console for errors
2. Verify all files are deployed correctly
3. Test with different browsers
4. Check GitHub Pages settings

Your website now has comprehensive visitor tracking that works perfectly on GitHub Pages! 🚀 