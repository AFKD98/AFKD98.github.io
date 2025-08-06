// Enhanced Analytics Server
// Captures and stores detailed visitor tracking data

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Data storage
const analyticsData = {
    visitors: new Map(),
    sessions: new Map(),
    events: [],
    deviceFingerprints: new Map()
};

// Create data directory if it doesn't exist
async function ensureDataDirectory() {
    const dataDir = path.join(__dirname, 'analytics-data');
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
    return dataDir;
}

// Save data to file
async function saveData() {
    const dataDir = await ensureDataDirectory();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    const dataToSave = {
        timestamp: new Date().toISOString(),
        visitors: Array.from(analyticsData.visitors.values()),
        sessions: Array.from(analyticsData.sessions.values()),
        events: analyticsData.events.slice(-1000), // Keep last 1000 events
        deviceFingerprints: Array.from(analyticsData.deviceFingerprints.values())
    };
    
    const filename = `analytics-${timestamp}.json`;
    await fs.writeFile(path.join(dataDir, filename), JSON.stringify(dataToSave, null, 2));
    
    console.log(`Analytics data saved to ${filename}`);
}

// Save data every 5 minutes
setInterval(saveData, 5 * 60 * 1000);

// API Routes

// Capture visitor data
app.post('/api/analytics/visitor', async (req, res) => {
    try {
        const visitorData = req.body;
        const { sessionId, deviceInfo, locationInfo, fingerprint } = visitorData;
        
        // Store visitor information
        if (sessionId) {
            analyticsData.sessions.set(sessionId, {
                ...visitorData,
                timestamp: new Date().toISOString(),
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.headers['user-agent'],
                referer: req.headers.referer
            });
        }
        
        // Store device fingerprint
        if (fingerprint) {
            const fingerprintHash = JSON.stringify(fingerprint);
            analyticsData.deviceFingerprints.set(fingerprintHash, {
                fingerprint,
                timestamp: new Date().toISOString(),
                ip: req.ip || req.connection.remoteAddress
            });
        }
        
        // Store device info
        if (deviceInfo) {
            const deviceHash = JSON.stringify(deviceInfo);
            analyticsData.visitors.set(deviceHash, {
                deviceInfo,
                locationInfo,
                timestamp: new Date().toISOString(),
                ip: req.ip || req.connection.remoteAddress
            });
        }
        
        res.json({ success: true, message: 'Visitor data captured' });
    } catch (error) {
        console.error('Error capturing visitor data:', error);
        res.status(500).json({ error: 'Failed to capture visitor data' });
    }
});

// Capture events
app.post('/api/analytics/events', async (req, res) => {
    try {
        const events = Array.isArray(req.body) ? req.body : [req.body];
        
        events.forEach(event => {
            analyticsData.events.push({
                ...event,
                timestamp: new Date().toISOString(),
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.headers['user-agent']
            });
        });
        
        res.json({ success: true, message: 'Events captured' });
    } catch (error) {
        console.error('Error capturing events:', error);
        res.status(500).json({ error: 'Failed to capture events' });
    }
});

// Get analytics dashboard data
app.get('/api/analytics/dashboard', async (req, res) => {
    try {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        // Filter recent data
        const recentSessions = Array.from(analyticsData.sessions.values())
            .filter(session => new Date(session.timestamp) > oneDayAgo);
        
        const recentEvents = analyticsData.events
            .filter(event => new Date(event.timestamp) > oneDayAgo);
        
        // Calculate metrics
        const uniqueVisitors = analyticsData.visitors.size;
        const totalSessions = analyticsData.sessions.size;
        const recentSessionsCount = recentSessions.length;
        const totalEvents = analyticsData.events.length;
        const recentEventsCount = recentEvents.length;
        
        // Get top pages
        const pageViews = recentEvents
            .filter(event => event.event_category === 'page_view')
            .reduce((acc, event) => {
                const page = event.page_path || 'unknown';
                acc[page] = (acc[page] || 0) + 1;
                return acc;
            }, {});
        
        const topPages = Object.entries(pageViews)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([page, count]) => ({ page, count }));
        
        // Get traffic sources
        const trafficSources = recentSessions.reduce((acc, session) => {
            const source = session.referer ? 
                new URL(session.referer).hostname : 'Direct';
            acc[source] = (acc[source] || 0) + 1;
            return acc;
        }, {});
        
        const topSources = Object.entries(trafficSources)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([source, count]) => ({ source, count }));
        
        // Get device types
        const deviceTypes = Array.from(analyticsData.visitors.values()).reduce((acc, visitor) => {
            const userAgent = visitor.deviceInfo?.userAgent || '';
            let deviceType = 'Desktop';
            
            if (/mobile/i.test(userAgent)) deviceType = 'Mobile';
            else if (/tablet/i.test(userAgent)) deviceType = 'Tablet';
            
            acc[deviceType] = (acc[deviceType] || 0) + 1;
            return acc;
        }, {});
        
        const deviceBreakdown = Object.entries(deviceTypes)
            .map(([device, count]) => ({ device, count }));
        
        // Get real-time visitors (sessions in last 5 minutes)
        const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
        const realTimeVisitors = recentSessions
            .filter(session => new Date(session.timestamp) > fiveMinutesAgo).length;
        
        res.json({
            summary: {
                uniqueVisitors,
                totalSessions,
                recentSessions: recentSessionsCount,
                totalEvents,
                recentEvents: recentEventsCount,
                realTimeVisitors
            },
            topPages,
            topSources,
            deviceBreakdown,
            recentSessions: recentSessions.slice(-50), // Last 50 sessions
            recentEvents: recentEvents.slice(-100) // Last 100 events
        });
    } catch (error) {
        console.error('Error getting dashboard data:', error);
        res.status(500).json({ error: 'Failed to get dashboard data' });
    }
});

// Get detailed visitor data
app.get('/api/analytics/visitors', async (req, res) => {
    try {
        const visitors = Array.from(analyticsData.visitors.values());
        const sessions = Array.from(analyticsData.sessions.values());
        const fingerprints = Array.from(analyticsData.deviceFingerprints.values());
        
        res.json({
            visitors,
            sessions,
            fingerprints
        });
    } catch (error) {
        console.error('Error getting visitor data:', error);
        res.status(500).json({ error: 'Failed to get visitor data' });
    }
});

// Search visitors by IP or fingerprint
app.get('/api/analytics/search', async (req, res) => {
    try {
        const { ip, fingerprint, sessionId } = req.query;
        
        let results = [];
        
        if (ip) {
            const sessions = Array.from(analyticsData.sessions.values())
                .filter(session => session.ip === ip);
            results.push(...sessions);
        }
        
        if (fingerprint) {
            const fingerprints = Array.from(analyticsData.deviceFingerprints.values())
                .filter(fp => JSON.stringify(fp.fingerprint).includes(fingerprint));
            results.push(...fingerprints);
        }
        
        if (sessionId) {
            const session = analyticsData.sessions.get(sessionId);
            if (session) results.push(session);
        }
        
        res.json({ results });
    } catch (error) {
        console.error('Error searching visitors:', error);
        res.status(500).json({ error: 'Failed to search visitors' });
    }
});

// Export data
app.get('/api/analytics/export', async (req, res) => {
    try {
        const dataDir = await ensureDataDirectory();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `export-${timestamp}.json`;
        
        const exportData = {
            timestamp: new Date().toISOString(),
            visitors: Array.from(analyticsData.visitors.values()),
            sessions: Array.from(analyticsData.sessions.values()),
            events: analyticsData.events,
            deviceFingerprints: Array.from(analyticsData.deviceFingerprints.values())
        };
        
        await fs.writeFile(path.join(dataDir, filename), JSON.stringify(exportData, null, 2));
        
        res.download(path.join(dataDir, filename), filename);
    } catch (error) {
        console.error('Error exporting data:', error);
        res.status(500).json({ error: 'Failed to export data' });
    }
});

// Health check
app.get('/api/analytics/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        stats: {
            visitors: analyticsData.visitors.size,
            sessions: analyticsData.sessions.size,
            events: analyticsData.events.length,
            fingerprints: analyticsData.deviceFingerprints.size
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Enhanced Analytics Server running on port ${PORT}`);
    console.log(`Dashboard available at: http://localhost:${PORT}/api/analytics/dashboard`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('Saving data before shutdown...');
    await saveData();
    process.exit(0);
});

module.exports = app; 