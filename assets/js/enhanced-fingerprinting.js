// Enhanced Device Fingerprinting
// Creates unique visitor identification without personal data

(function() {
    'use strict';

    // Enhanced fingerprinting configuration
    const FINGERPRINT_CONFIG = {
        trackReturningVisitors: true,
        trackDeviceUniqueness: true,
        trackBehavioralPatterns: true,
        trackSocialMediaPresence: true,
        trackBrowserExtensions: true,
        trackNetworkFingerprint: true
    };

    // Generate comprehensive device fingerprint
    function generateEnhancedFingerprint() {
        const fingerprint = {
            // Basic device info
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages,
            
            // Screen and display
            screenWidth: screen.width,
            screenHeight: screen.height,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth,
            devicePixelRatio: window.devicePixelRatio,
            
            // Hardware capabilities
            hardwareConcurrency: navigator.hardwareConcurrency,
            deviceMemory: navigator.deviceMemory,
            maxTouchPoints: navigator.maxTouchPoints,
            
            // Browser capabilities
            cookieEnabled: navigator.cookieEnabled,
            doNotTrack: navigator.doNotTrack,
            onLine: navigator.onLine,
            webdriver: navigator.webdriver,
            
            // Time and location
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timezoneOffset: new Date().getTimezoneOffset(),
            
            // Canvas fingerprint
            canvasFingerprint: getCanvasFingerprint(),
            
            // WebGL fingerprint
            webglVendor: getWebGLVendor(),
            webglRenderer: getWebGLRenderer(),
            
            // Audio fingerprint
            audioFingerprint: getAudioFingerprint(),
            
            // Font fingerprint
            fontFingerprint: getFontFingerprint(),
            
            // Plugin fingerprint
            pluginFingerprint: getPluginFingerprint(),
            
            // Behavioral fingerprint
            behavioralFingerprint: getBehavioralFingerprint(),
            
            // Network fingerprint
            networkFingerprint: getNetworkFingerprint(),
            
            // Social media detection
            socialMediaPresence: detectSocialMediaPresence(),
            
            // Browser extension detection
            browserExtensions: detectBrowserExtensions(),
            
            // Unique session ID
            sessionId: generateSessionId(),
            
            // Timestamp
            timestamp: Date.now()
        };

        return fingerprint;
    }

    // Get canvas fingerprint
    function getCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('Enhanced Fingerprint', 2, 2);
            return canvas.toDataURL();
        } catch (e) {
            return 'unknown';
        }
    }

    // Get WebGL fingerprint
    function getWebGLVendor() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return gl ? gl.getParameter(gl.VENDOR) : 'unknown';
        } catch (e) {
            return 'unknown';
        }
    }

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

    // Get font fingerprint
    function getFontFingerprint() {
        const fonts = [
            'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia',
            'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS', 'Trebuchet MS',
            'Arial Black', 'Impact', 'Lucida Console', 'Tahoma', 'Geneva'
        ];
        
        const testString = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const testSize = '72px';
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        const fontFingerprint = fonts.map(font => {
            context.font = testSize + ' ' + font;
            return context.measureText(testString).width;
        });
        
        return fontFingerprint.join(',');
    }

    // Get plugin fingerprint
    function getPluginFingerprint() {
        try {
            const plugins = Array.from(navigator.plugins).map(p => p.name);
            const mimeTypes = Array.from(navigator.mimeTypes).map(m => m.type);
            return {
                plugins: plugins,
                mimeTypes: mimeTypes
            };
        } catch (e) {
            return { plugins: [], mimeTypes: [] };
        }
    }

    // Get behavioral fingerprint
    function getBehavioralFingerprint() {
        return {
            mouseMovementPattern: trackMousePattern(),
            keyboardPattern: trackKeyboardPattern(),
            scrollPattern: trackScrollPattern(),
            clickPattern: trackClickPattern()
        };
    }

    // Track mouse movement pattern
    function trackMousePattern() {
        let mouseData = [];
        let startTime = Date.now();
        
        document.addEventListener('mousemove', function(e) {
            if (mouseData.length < 50) { // Limit to 50 data points
                mouseData.push({
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: Date.now() - startTime
                });
            }
        });
        
        // Return pattern after 5 seconds
        setTimeout(() => {
            return mouseData.length;
        }, 5000);
        
        return mouseData.length;
    }

    // Track keyboard pattern
    function trackKeyboardPattern() {
        let keyData = [];
        let startTime = Date.now();
        
        document.addEventListener('keydown', function(e) {
            if (keyData.length < 20) { // Limit to 20 data points
                keyData.push({
                    key: e.key,
                    keyCode: e.keyCode,
                    timestamp: Date.now() - startTime
                });
            }
        });
        
        return keyData.length;
    }

    // Track scroll pattern
    function trackScrollPattern() {
        let scrollData = [];
        let startTime = Date.now();
        
        window.addEventListener('scroll', function() {
            if (scrollData.length < 10) { // Limit to 10 data points
                scrollData.push({
                    scrollY: window.scrollY,
                    timestamp: Date.now() - startTime
                });
            }
        });
        
        return scrollData.length;
    }

    // Track click pattern
    function trackClickPattern() {
        let clickData = [];
        let startTime = Date.now();
        
        document.addEventListener('click', function(e) {
            if (clickData.length < 15) { // Limit to 15 data points
                clickData.push({
                    x: e.clientX,
                    y: e.clientY,
                    target: e.target.tagName,
                    timestamp: Date.now() - startTime
                });
            }
        });
        
        return clickData.length;
    }

    // Get network fingerprint
    function getNetworkFingerprint() {
        return {
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : 'unknown',
            onLine: navigator.onLine,
            userAgent: navigator.userAgent
        };
    }

    // Detect social media presence
    function detectSocialMediaPresence() {
        const socialMedia = {
            facebook: typeof FB !== 'undefined',
            twitter: typeof twttr !== 'undefined',
            linkedin: typeof IN !== 'undefined',
            instagram: document.querySelector('meta[property="og:site_name"][content="Instagram"]') !== null,
            youtube: document.querySelector('meta[property="og:site_name"][content="YouTube"]') !== null
        };
        
        return socialMedia;
    }

    // Detect browser extensions
    function detectBrowserExtensions() {
        const extensions = {
            adBlocker: detectAdBlocker(),
            passwordManager: detectPasswordManager(),
            vpn: detectVPN(),
            privacyTools: detectPrivacyTools()
        };
        
        return extensions;
    }

    // Detect ad blocker
    function detectAdBlocker() {
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox';
        document.body.appendChild(testAd);
        
        setTimeout(() => {
            const isAdBlockerActive = testAd.offsetHeight === 0;
            document.body.removeChild(testAd);
            return isAdBlockerActive;
        }, 100);
        
        return false; // Default return
    }

    // Detect password manager
    function detectPasswordManager() {
        return document.querySelector('input[type="password"]') !== null;
    }

    // Detect VPN
    function detectVPN() {
        // This is a basic detection - VPN detection is complex
        return false;
    }

    // Detect privacy tools
    function detectPrivacyTools() {
        return navigator.doNotTrack === '1';
    }

    // Generate unique session ID
    function generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Store fingerprint in localStorage
    function storeFingerprint(fingerprint) {
        try {
            localStorage.setItem('enhanced_fingerprint', JSON.stringify(fingerprint));
            return true;
        } catch (e) {
            return false;
        }
    }

    // Get stored fingerprint
    function getStoredFingerprint() {
        try {
            const stored = localStorage.getItem('enhanced_fingerprint');
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    }

    // Compare fingerprints to identify returning visitors
    function identifyReturningVisitor(newFingerprint) {
        const storedFingerprint = getStoredFingerprint();
        
        if (!storedFingerprint) {
            return { isReturning: false, confidence: 0 };
        }
        
        // Calculate similarity score
        let similarityScore = 0;
        let totalChecks = 0;
        
        // Compare basic properties
        if (storedFingerprint.userAgent === newFingerprint.userAgent) similarityScore += 10;
        if (storedFingerprint.platform === newFingerprint.platform) similarityScore += 5;
        if (storedFingerprint.language === newFingerprint.language) similarityScore += 3;
        if (storedFingerprint.screenWidth === newFingerprint.screenWidth) similarityScore += 5;
        if (storedFingerprint.screenHeight === newFingerprint.screenHeight) similarityScore += 5;
        if (storedFingerprint.timezone === newFingerprint.timezone) similarityScore += 3;
        
        totalChecks += 6;
        
        // Calculate confidence percentage
        const confidence = (similarityScore / (totalChecks * 10)) * 100;
        
        return {
            isReturning: confidence > 70,
            confidence: confidence,
            lastVisit: storedFingerprint.timestamp
        };
    }

    // Initialize enhanced fingerprinting
    function initEnhancedFingerprinting() {
        console.log('Enhanced fingerprinting initialized');
        
        const fingerprint = generateEnhancedFingerprint();
        const visitorInfo = identifyReturningVisitor(fingerprint);
        
        // Store new fingerprint
        storeFingerprint(fingerprint);
        
        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'enhanced_fingerprint', {
                event_category: 'Analytics',
                event_label: 'Enhanced Fingerprint Generated',
                custom_parameters: {
                    fingerprint: JSON.stringify(fingerprint),
                    visitor_info: JSON.stringify(visitorInfo)
                }
            });
        }
        
        return { fingerprint, visitorInfo };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initEnhancedFingerprinting);
    } else {
        initEnhancedFingerprinting();
    }

    // Expose functions globally
    window.EnhancedFingerprinting = {
        generateFingerprint: generateEnhancedFingerprint,
        identifyVisitor: identifyReturningVisitor,
        getStoredFingerprint: getStoredFingerprint
    };

})(); 