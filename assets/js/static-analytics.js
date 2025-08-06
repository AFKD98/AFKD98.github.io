// Static Analytics for GitHub Pages
// Works without a server by storing data locally and sending to external endpoint

(function() {
    'use strict';

    // Configuration
    const ANALYTICS_CONFIG = {
        // You can use a free service like:
        // - https://webhook.site (for testing)
        // - Your own server endpoint
        // - Google Analytics (optional)
        WEBHOOK_URL: 'https://webhook.site/your-unique-id', // Replace with your webhook URL
        GA_MEASUREMENT_ID: 'G-GKGQWV5HBD', // Optional: Your Google Analytics ID
        
        // Enhanced tracking options
        trackPageViews: true,
        trackClicks: true,
        trackScroll: true,
        trackTimeOnPage: true,
        trackUserDetails: true,
        trackDeviceInfo: true,
        trackLocation: true,
        trackReferrer: true,
        trackSessionInfo: true,
        trackMouseMovements: true,
        trackKeyboardEvents: true,
        trackFormData: true,
        trackSocialMedia: true,
        trackAdBlockers: true,
        trackGeolocation: true,
        trackFingerprint: true,
        storeLocally: true // Store data in localStorage
    };

    // Enhanced visitor data collection
    let visitorData = {
        sessionId: generateSessionId(),
        startTime: Date.now(),
        pageViews: 0,
        clicks: [],
        scrollEvents: [],
        mouseMovements: [],
        keyboardEvents: [],
        formInteractions: [],
        deviceInfo: {},
        locationInfo: {},
        fingerprint: null
    };

    // Initialize analytics
    function initAnalytics() {
        console.log('Static Analytics loaded successfully');
        
        // Load existing data from localStorage
        loadStoredData();
        
        // Collect comprehensive device information
        if (ANALYTICS_CONFIG.trackDeviceInfo) {
            collectDeviceInfo();
        }
        
        // Collect location information
        if (ANALYTICS_CONFIG.trackLocation) {
            collectLocationInfo();
        }
        
        // Generate device fingerprint
        if (ANALYTICS_CONFIG.trackFingerprint) {
            generateDeviceFingerprint();
        }
        
        // Initialize all tracking
        if (ANALYTICS_CONFIG.trackPageViews) {
            trackPageView();
        }
        
        if (ANALYTICS_CONFIG.trackClicks) {
            trackClicks();
        }
        
        if (ANALYTICS_CONFIG.trackScroll) {
            trackScroll();
        }
        
        if (ANALYTICS_CONFIG.trackTimeOnPage) {
            trackTimeOnPage();
        }
        
        if (ANALYTICS_CONFIG.trackMouseMovements) {
            trackMouseMovements();
        }
        
        if (ANALYTICS_CONFIG.trackKeyboardEvents) {
            trackKeyboardEvents();
        }
        
        if (ANALYTICS_CONFIG.trackFormData) {
            trackFormData();
        }
        
        if (ANALYTICS_CONFIG.trackSocialMedia) {
            trackSocialMedia();
        }
        
        if (ANALYTICS_CONFIG.trackAdBlockers) {
            detectAdBlockers();
        }
        
        if (ANALYTICS_CONFIG.trackGeolocation) {
            trackGeolocation();
        }
        
        // Send initial data
        sendVisitorData();
        
        // Set up periodic data sending
        setInterval(sendVisitorData, 60000); // Send data every minute
        
        // Save data to localStorage periodically
        if (ANALYTICS_CONFIG.storeLocally) {
            setInterval(saveToLocalStorage, 30000); // Save every 30 seconds
        }
    }

    // Load stored data from localStorage
    function loadStoredData() {
        try {
            const stored = localStorage.getItem('analytics_data');
            if (stored) {
                const data = JSON.parse(stored);
                visitorData = { ...visitorData, ...data };
            }
        } catch (error) {
            console.log('Could not load stored analytics data');
        }
    }

    // Save data to localStorage
    function saveToLocalStorage() {
        try {
            localStorage.setItem('analytics_data', JSON.stringify(visitorData));
        } catch (error) {
            console.log('Could not save analytics data to localStorage');
        }
    }

    // Generate unique session ID
    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Collect comprehensive device information
    function collectDeviceInfo() {
        visitorData.deviceInfo = {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            doNotTrack: navigator.doNotTrack,
            hardwareConcurrency: navigator.hardwareConcurrency,
            maxTouchPoints: navigator.maxTouchPoints,
            screenResolution: screen.width + 'x' + screen.height,
            screenColorDepth: screen.colorDepth,
            screenPixelDepth: screen.pixelDepth,
            viewportSize: window.innerWidth + 'x' + window.innerHeight,
            devicePixelRatio: window.devicePixelRatio,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            memory: navigator.deviceMemory || 'unknown',
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : 'unknown',
            battery: null,
            webdriver: navigator.webdriver,
            plugins: Array.from(navigator.plugins).map(p => p.name),
            mimeTypes: Array.from(navigator.mimeTypes).map(m => m.type)
        };

        // Get battery information if available
        if (navigator.getBattery) {
            navigator.getBattery().then(battery => {
                visitorData.deviceInfo.battery = {
                    level: battery.level,
                    charging: battery.charging,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime
                };
            });
        }
    }

    // Collect location information
    function collectLocationInfo() {
        visitorData.locationInfo = {
            referrer: document.referrer,
            url: window.location.href,
            pathname: window.location.pathname,
            search: window.location.search,
            hash: window.location.hash,
            hostname: window.location.hostname,
            protocol: window.location.protocol,
            port: window.location.port
        };
    }

    // Generate device fingerprint
    function generateDeviceFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Device Fingerprint', 2, 2);
        
        const fingerprint = {
            canvas: canvas.toDataURL(),
            screenResolution: screen.width + 'x' + screen.height,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory,
            maxTouchPoints: navigator.maxTouchPoints,
            webglVendor: getWebGLVendor(),
            webglRenderer: getWebGLRenderer(),
            audioContext: getAudioFingerprint()
        };
        
        visitorData.fingerprint = fingerprint;
    }

    // Get WebGL vendor
    function getWebGLVendor() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return gl ? gl.getParameter(gl.VENDOR) : 'unknown';
        } catch (e) {
            return 'unknown';
        }
    }

    // Get WebGL renderer
    function getWebGLRenderer() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return gl ? gl.getParameter(gl.RENDERER) : 'unknown';
        } catch (e) {
            return 'unknown';
        }
    }

    // Get audio fingerprint
    function getAudioFingerprint() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const analyser = audioContext.createAnalyser();
            const gainNode = audioContext.createGain();
            const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
            
            gainNode.gain.value = 0;
            oscillator.type = 'triangle';
            oscillator.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.start(0);
            
            return audioContext.sampleRate + '_' + analyser.frequencyBinCount;
        } catch (e) {
            return 'unknown';
        }
    }

    // Track page view with enhanced data
    function trackPageView() {
        visitorData.pageViews++;
        
        const pageData = {
            title: document.title,
            url: window.location.href,
            pathname: window.location.pathname,
            referrer: document.referrer,
            timestamp: Date.now(),
            sessionId: visitorData.sessionId,
            deviceInfo: visitorData.deviceInfo,
            locationInfo: visitorData.locationInfo,
            fingerprint: visitorData.fingerprint
        };
        
        // Send to Google Analytics (optional)
        if (typeof gtag !== 'undefined' && ANALYTICS_CONFIG.GA_MEASUREMENT_ID !== 'G-GKGQWV5HBD') {
            gtag('event', 'page_view', {
                page_title: pageData.title,
                page_location: pageData.url,
                page_path: pageData.pathname,
                custom_parameters: {
                    session_id: pageData.sessionId,
                    device_info: JSON.stringify(pageData.deviceInfo),
                    location_info: JSON.stringify(pageData.locationInfo),
                    fingerprint: JSON.stringify(pageData.fingerprint)
                }
            });
        }
        
        // Store locally
        visitorData.pageViews++;
    }

    // Enhanced click tracking
    function trackClicks() {
        document.addEventListener('click', function(e) {
            const clickData = {
                timestamp: Date.now(),
                x: e.clientX,
                y: e.clientY,
                target: e.target.tagName,
                targetText: e.target.textContent?.substring(0, 50),
                targetId: e.target.id,
                targetClass: e.target.className,
                targetHref: e.target.href,
                button: e.button,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                altKey: e.altKey,
                metaKey: e.metaKey,
                sessionId: visitorData.sessionId
            };
            
            visitorData.clicks.push(clickData);
            
            if (typeof gtag !== 'undefined' && ANALYTICS_CONFIG.GA_MEASUREMENT_ID !== 'G-GKGQWV5HBD') {
                gtag('event', 'click', {
                    event_category: 'User Interaction',
                    event_label: clickData.target + ' - ' + clickData.targetText,
                    custom_parameters: {
                        click_data: JSON.stringify(clickData)
                    }
                });
            }
        });
    }

    // Enhanced scroll tracking
    function trackScroll() {
        let maxScroll = 0;
        let scrollThresholds = [10, 25, 50, 75, 90, 100];
        let trackedThresholds = new Set();

        window.addEventListener('scroll', function() {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                const scrollData = {
                    timestamp: Date.now(),
                    scrollPercent: scrollPercent,
                    scrollY: window.scrollY,
                    scrollHeight: document.body.scrollHeight,
                    clientHeight: window.innerHeight,
                    sessionId: visitorData.sessionId
                };
                
                visitorData.scrollEvents.push(scrollData);
                
                // Track scroll milestones
                scrollThresholds.forEach(threshold => {
                    if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
                        trackedThresholds.add(threshold);
                        
                        if (typeof gtag !== 'undefined' && ANALYTICS_CONFIG.GA_MEASUREMENT_ID !== 'G-GKGQWV5HBD') {
                            gtag('event', 'scroll', {
                                event_category: 'Engagement',
                                event_label: 'Scroll Depth',
                                value: threshold,
                                custom_parameters: {
                                    scroll_data: JSON.stringify(scrollData)
                                }
                            });
                        }
                    }
                });
            }
        });
    }

    // Enhanced time tracking
    function trackTimeOnPage() {
        const startTime = Date.now();
        const timeThresholds = [10, 30, 60, 120, 300, 600]; // seconds
        let trackedTimeThresholds = new Set();

        const timeTracker = setInterval(() => {
            const timeOnPage = Math.floor((Date.now() - startTime) / 1000);
            
            timeThresholds.forEach(threshold => {
                if (timeOnPage >= threshold && !trackedTimeThresholds.has(threshold)) {
                    trackedTimeThresholds.add(threshold);
                    
                    if (typeof gtag !== 'undefined' && ANALYTICS_CONFIG.GA_MEASUREMENT_ID !== 'G-GKGQWV5HBD') {
                        gtag('event', 'timing', {
                            event_category: 'Engagement',
                            event_label: 'Time on Page',
                            value: threshold,
                            custom_parameters: {
                                session_id: visitorData.sessionId,
                                total_time: timeOnPage
                            }
                        });
                    }
                }
            });
        }, 1000);

        // Clean up when page is unloaded
        window.addEventListener('beforeunload', () => {
            clearInterval(timeTracker);
            
            const totalTimeOnPage = Math.floor((Date.now() - startTime) / 1000);
            
            if (typeof gtag !== 'undefined' && ANALYTICS_CONFIG.GA_MEASUREMENT_ID !== 'G-GKGQWV5HBD') {
                gtag('event', 'timing', {
                    event_category: 'Engagement',
                    event_label: 'Total Time on Page',
                    value: totalTimeOnPage,
                    custom_parameters: {
                        session_id: visitorData.sessionId,
                        total_time: totalTimeOnPage
                    }
                });
            }
        });
    }

    // Track mouse movements
    function trackMouseMovements() {
        let lastMove = Date.now();
        
        document.addEventListener('mousemove', function(e) {
            const now = Date.now();
            if (now - lastMove > 100) { // Track every 100ms to avoid spam
                lastMove = now;
                
                const moveData = {
                    timestamp: now,
                    x: e.clientX,
                    y: e.clientY,
                    pageX: e.pageX,
                    pageY: e.pageY,
                    sessionId: visitorData.sessionId
                };
                
                visitorData.mouseMovements.push(moveData);
            }
        });
    }

    // Track keyboard events
    function trackKeyboardEvents() {
        document.addEventListener('keydown', function(e) {
            const keyData = {
                timestamp: Date.now(),
                key: e.key,
                keyCode: e.keyCode,
                code: e.code,
                ctrlKey: e.ctrlKey,
                shiftKey: e.shiftKey,
                altKey: e.altKey,
                metaKey: e.metaKey,
                target: e.target.tagName,
                targetId: e.target.id,
                sessionId: visitorData.sessionId
            };
            
            visitorData.keyboardEvents.push(keyData);
        });
    }

    // Track form data
    function trackFormData() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const formData = {
                    timestamp: Date.now(),
                    formId: this.id || 'unknown',
                    formAction: this.action || 'unknown',
                    formMethod: this.method || 'unknown',
                    formElements: Array.from(this.elements).map(el => ({
                        name: el.name,
                        type: el.type,
                        value: el.type === 'password' ? '[HIDDEN]' : el.value
                    })),
                    sessionId: visitorData.sessionId
                };
                
                visitorData.formInteractions.push(formData);
                
                if (typeof gtag !== 'undefined' && ANALYTICS_CONFIG.GA_MEASUREMENT_ID !== 'G-GKGQWV5HBD') {
                    gtag('event', 'form_submit', {
                        event_category: 'Form',
                        event_label: formData.formId,
                        custom_parameters: {
                            form_data: JSON.stringify(formData)
                        }
                    });
                }
            });
        });
    }

    // Track social media interactions
    function trackSocialMedia() {
        const socialLinks = document.querySelectorAll('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"], a[href*="instagram"]');
        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const socialData = {
                    timestamp: Date.now(),
                    platform: this.href.includes('facebook') ? 'Facebook' : 
                             this.href.includes('twitter') ? 'Twitter' :
                             this.href.includes('linkedin') ? 'LinkedIn' :
                             this.href.includes('instagram') ? 'Instagram' : 'Other',
                    url: this.href,
                    text: this.textContent,
                    sessionId: visitorData.sessionId
                };
                
                if (typeof gtag !== 'undefined' && ANALYTICS_CONFIG.GA_MEASUREMENT_ID !== 'G-GKGQWV5HBD') {
                    gtag('event', 'social_click', {
                        event_category: 'Social Media',
                        event_label: socialData.platform,
                        custom_parameters: {
                            social_data: JSON.stringify(socialData)
                        }
                    });
                }
            });
        });
    }

    // Detect ad blockers
    function detectAdBlockers() {
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox';
        document.body.appendChild(testAd);
        
        setTimeout(() => {
            const isAdBlockerActive = testAd.offsetHeight === 0;
            document.body.removeChild(testAd);
            
            if (typeof gtag !== 'undefined' && ANALYTICS_CONFIG.GA_MEASUREMENT_ID !== 'G-GKGQWV5HBD') {
                gtag('event', 'ad_blocker_detected', {
                    event_category: 'Technical',
                    event_label: isAdBlockerActive ? 'Ad Blocker Active' : 'No Ad Blocker',
                    value: isAdBlockerActive ? 1 : 0
                });
            }
        }, 100);
    }

    // Track geolocation
    function trackGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const locationData = {
                        timestamp: Date.now(),
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        heading: position.coords.heading,
                        speed: position.coords.speed,
                        sessionId: visitorData.sessionId
                    };
                    
                    if (typeof gtag !== 'undefined' && ANALYTICS_CONFIG.GA_MEASUREMENT_ID !== 'G-GKGQWV5HBD') {
                        gtag('event', 'geolocation', {
                            event_category: 'Location',
                            event_label: 'Location Captured',
                            custom_parameters: {
                                location_data: JSON.stringify(locationData)
                            }
                        });
                    }
                },
                function(error) {
                                    if (typeof gtag !== 'undefined' && ANALYTICS_CONFIG.GA_MEASUREMENT_ID !== 'G-GKGQWV5HBD') {
                    gtag('event', 'geolocation_error', {
                        event_category: 'Location',
                        event_label: 'Location Error',
                        value: error.code
                    });
                }
                }
            );
        }
    }

    // Send visitor data to webhook
    function sendVisitorData() {
        const dataToSend = {
            sessionId: visitorData.sessionId,
            timestamp: Date.now(),
            pageViews: visitorData.pageViews,
            clicks: visitorData.clicks.slice(-10), // Last 10 clicks
            scrollEvents: visitorData.scrollEvents.slice(-5), // Last 5 scroll events
            mouseMovements: visitorData.mouseMovements.slice(-20), // Last 20 mouse movements
            keyboardEvents: visitorData.keyboardEvents.slice(-10), // Last 10 keyboard events
            formInteractions: visitorData.formInteractions,
            deviceInfo: visitorData.deviceInfo,
            locationInfo: visitorData.locationInfo,
            fingerprint: visitorData.fingerprint
        };
        
        // Send to Google Analytics (optional)
        if (typeof gtag !== 'undefined' && ANALYTICS_CONFIG.GA_MEASUREMENT_ID !== 'G-GKGQWV5HBD') {
            gtag('event', 'visitor_data', {
                event_category: 'Analytics',
                event_label: 'Visitor Data Collected',
                custom_parameters: {
                    visitor_data: JSON.stringify(dataToSend)
                }
            });
        }
        
        // Send to webhook (if configured)
        if (ANALYTICS_CONFIG.WEBHOOK_URL && ANALYTICS_CONFIG.WEBHOOK_URL !== 'https://webhook.site/your-unique-id') {
            fetch(ANALYTICS_CONFIG.WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend)
            }).catch(error => {
                console.log('Could not send data to webhook');
            });
        }
    }

    // Custom event tracking function
    function trackCustomEvent(eventName, eventCategory, eventLabel, value, customData) {
        if (typeof gtag !== 'undefined' && ANALYTICS_CONFIG.GA_MEASUREMENT_ID !== 'G-GKGQWV5HBD') {
            gtag('event', eventName, {
                event_category: eventCategory,
                event_label: eventLabel,
                value: value,
                custom_parameters: customData
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnalytics);
    } else {
        initAnalytics();
    }

    // Expose functions globally for manual tracking
    window.AnalyticsTracker = {
        trackCustomEvent: trackCustomEvent,
        getVisitorData: () => visitorData,
        sendVisitorData: sendVisitorData,
        trackPageView: trackPageView,
        saveToLocalStorage: saveToLocalStorage
    };

})(); 