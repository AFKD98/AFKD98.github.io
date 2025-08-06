// Social Data Collector
// Detects social media profiles, email from autofill, and names from social logins

(function() {
    'use strict';

    // Configuration
    const SOCIAL_CONFIG = {
        detectSocialProfiles: true,
        detectEmailAutofill: true,
        detectSocialLogins: true,
        detectSocialMediaPresence: true,
        trackSocialInteractions: true,
        detectEmailFromForms: true,
        detectNamesFromSocial: true
    };

    // Social media detection patterns
    const SOCIAL_PATTERNS = {
        facebook: {
            patterns: ['facebook.com', 'fb.com', 'FB', 'Facebook'],
            api: 'FB',
            loginDetectors: ['fb-login', 'facebook-login', 'fb-login-button']
        },
        twitter: {
            patterns: ['twitter.com', 'x.com', 'Twitter', 'X'],
            api: 'twttr',
            loginDetectors: ['twitter-login', 'twitter-signin']
        },
        linkedin: {
            patterns: ['linkedin.com', 'LinkedIn'],
            api: 'IN',
            loginDetectors: ['linkedin-login', 'li-login']
        },
        instagram: {
            patterns: ['instagram.com', 'Instagram'],
            api: 'instagram',
            loginDetectors: ['instagram-login', 'ig-login']
        },
        google: {
            patterns: ['google.com', 'gmail.com', 'Google'],
            api: 'gapi',
            loginDetectors: ['google-login', 'gmail-login']
        },
        github: {
            patterns: ['github.com', 'GitHub'],
            api: 'github',
            loginDetectors: ['github-login', 'gh-login']
        }
    };

    // Initialize social data collection
    function initSocialDataCollection() {
        console.log('Social data collector initialized');
        
        const socialData = {
            socialProfiles: detectSocialProfiles(),
            emailAutofill: detectEmailAutofill(),
            socialLogins: detectSocialLogins(),
            socialMediaPresence: detectSocialMediaPresence(),
            formInteractions: detectFormInteractions(),
            socialInteractions: trackSocialInteractions()
        };
        
        // Store social data
        storeSocialData(socialData);
        
        // Send to analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'social_data_collected', {
                event_category: 'Social Analytics',
                event_label: 'Social Data Detected',
                custom_parameters: {
                    social_data: JSON.stringify(socialData)
                }
            });
        }
        
        return socialData;
    }

    // Detect social media profiles
    function detectSocialProfiles() {
        const profiles = {};
        
        // Check for social media APIs
        Object.keys(SOCIAL_PATTERNS).forEach(platform => {
            const config = SOCIAL_PATTERNS[platform];
            
            // Check if API is available
            if (typeof window[config.api] !== 'undefined') {
                profiles[platform] = {
                    apiAvailable: true,
                    loggedIn: detectSocialLogin(platform),
                    profileData: getSocialProfileData(platform)
                };
            }
            
            // Check for social media links
            const socialLinks = document.querySelectorAll(`a[href*="${platform}"]`);
            if (socialLinks.length > 0) {
                profiles[platform] = profiles[platform] || {};
                profiles[platform].linksFound = socialLinks.length;
                profiles[platform].linkUrls = Array.from(socialLinks).map(link => link.href);
            }
        });
        
        return profiles;
    }

    // Detect social login status
    function detectSocialLogin(platform) {
        const config = SOCIAL_PATTERNS[platform];
        
        // Check for login buttons
        const loginButtons = document.querySelectorAll('[class*="login"], [id*="login"]');
        const platformLoginButtons = Array.from(loginButtons).filter(button => 
            config.loginDetectors.some(detector => 
                button.className.toLowerCase().includes(detector) ||
                button.id.toLowerCase().includes(detector)
            )
        );
        
        // Check for social login forms
        const socialForms = document.querySelectorAll('form[action*="' + platform + '"]');
        
        return {
            loginButtonsFound: platformLoginButtons.length,
            loginFormsFound: socialForms.length,
            isLoggedIn: checkSocialLoginStatus(platform)
        };
    }

    // Check if user is logged into social platform
    function checkSocialLoginStatus(platform) {
        try {
            switch (platform) {
                case 'facebook':
                    return typeof FB !== 'undefined' && FB.getLoginStatus;
                case 'twitter':
                    return typeof twttr !== 'undefined' && twttr.ready;
                case 'linkedin':
                    return typeof IN !== 'undefined' && IN.User;
                case 'google':
                    return typeof gapi !== 'undefined' && gapi.auth2;
                case 'github':
                    return document.querySelector('[data-github-login]') !== null;
                default:
                    return false;
            }
        } catch (e) {
            return false;
        }
    }

    // Get social profile data
    function getSocialProfileData(platform) {
        try {
            switch (platform) {
                case 'facebook':
                    if (typeof FB !== 'undefined') {
                        return {
                            apiVersion: FB.getVersion(),
                            permissions: FB.getPermissions()
                        };
                    }
                    break;
                case 'twitter':
                    if (typeof twttr !== 'undefined') {
                        return {
                            apiVersion: twttr.version,
                            ready: twttr.ready
                        };
                    }
                    break;
                case 'linkedin':
                    if (typeof IN !== 'undefined') {
                        return {
                            apiAvailable: true,
                            user: IN.User
                        };
                    }
                    break;
            }
        } catch (e) {
            return { error: e.message };
        }
        
        return { apiAvailable: false };
    }

    // Detect email from autofill
    function detectEmailAutofill() {
        const emailData = {
            autofillDetected: false,
            emailFields: [],
            autofilledEmails: [],
            formInteractions: []
        };
        
        // Find all email input fields
        const emailFields = document.querySelectorAll('input[type="email"], input[name*="email"], input[placeholder*="email"]');
        
        emailFields.forEach((field, index) => {
            const fieldData = {
                id: field.id,
                name: field.name,
                placeholder: field.placeholder,
                value: field.value,
                hasAutofill: field.matches(':autofill') || field.matches(':-webkit-autofill'),
                formId: field.form ? field.form.id : 'unknown'
            };
            
            emailData.emailFields.push(fieldData);
            
            // Monitor for autofill events
            field.addEventListener('input', function(e) {
                if (this.value && this.value.includes('@')) {
                    emailData.autofilledEmails.push({
                        email: this.value,
                        timestamp: Date.now(),
                        fieldId: this.id,
                        formId: this.form ? this.form.id : 'unknown'
                    });
                    
                    // Send to analytics
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'email_autofill_detected', {
                            event_category: 'Form Analytics',
                            event_label: 'Email Autofill',
                            custom_parameters: {
                                email_domain: this.value.split('@')[1],
                                field_id: this.id,
                                form_id: this.form ? this.form.id : 'unknown'
                            }
                        });
                    }
                }
            });
            
            // Check for autofill on page load
            if (field.value && field.value.includes('@')) {
                emailData.autofillDetected = true;
                emailData.autofilledEmails.push({
                    email: field.value,
                    timestamp: Date.now(),
                    fieldId: field.id,
                    formId: field.form ? field.form.id : 'unknown',
                    source: 'page_load'
                });
            }
        });
        
        return emailData;
    }

    // Detect social logins
    function detectSocialLogins() {
        const socialLogins = {
            loginButtons: [],
            loginForms: [],
            loginAPIs: [],
            detectedLogins: []
        };
        
        // Find social login buttons
        const loginButtons = document.querySelectorAll('button, a, input[type="button"]');
        loginButtons.forEach(button => {
            const buttonText = button.textContent.toLowerCase();
            const buttonClass = button.className.toLowerCase();
            const buttonId = button.id.toLowerCase();
            
            Object.keys(SOCIAL_PATTERNS).forEach(platform => {
                const config = SOCIAL_PATTERNS[platform];
                
                if (config.patterns.some(pattern => 
                    buttonText.includes(pattern.toLowerCase()) ||
                    buttonClass.includes(pattern.toLowerCase()) ||
                    buttonId.includes(pattern.toLowerCase())
                )) {
                    socialLogins.loginButtons.push({
                        platform: platform,
                        element: button.tagName,
                        text: button.textContent,
                        id: button.id,
                        className: button.className
                    });
                }
            });
        });
        
        // Find social login forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const formAction = form.action.toLowerCase();
            const formClass = form.className.toLowerCase();
            
            Object.keys(SOCIAL_PATTERNS).forEach(platform => {
                const config = SOCIAL_PATTERNS[platform];
                
                if (config.patterns.some(pattern => 
                    formAction.includes(pattern.toLowerCase()) ||
                    formClass.includes(pattern.toLowerCase())
                )) {
                    socialLogins.loginForms.push({
                        platform: platform,
                        action: form.action,
                        method: form.method,
                        className: form.className
                    });
                }
            });
        });
        
        // Check for social login APIs
        Object.keys(SOCIAL_PATTERNS).forEach(platform => {
            const config = SOCIAL_PATTERNS[platform];
            if (typeof window[config.api] !== 'undefined') {
                socialLogins.loginAPIs.push({
                    platform: platform,
                    api: config.api,
                    available: true
                });
            }
        });
        
        return socialLogins;
    }

    // Detect social media presence
    function detectSocialMediaPresence() {
        const presence = {
            socialMediaLoggedIn: [],
            socialMediaAvailable: [],
            socialMediaInteractions: []
        };
        
        // Check for social media cookies
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            
            Object.keys(SOCIAL_PATTERNS).forEach(platform => {
                if (name.toLowerCase().includes(platform.toLowerCase())) {
                    presence.socialMediaLoggedIn.push({
                        platform: platform,
                        cookieName: name,
                        hasValue: !!value
                    });
                }
            });
        });
        
        // Check for social media meta tags
        const metaTags = document.querySelectorAll('meta[property*="og"], meta[name*="twitter"]');
        metaTags.forEach(tag => {
            const property = tag.getAttribute('property') || tag.getAttribute('name') || '';
            
            Object.keys(SOCIAL_PATTERNS).forEach(platform => {
                if (property.toLowerCase().includes(platform.toLowerCase())) {
                    presence.socialMediaAvailable.push({
                        platform: platform,
                        metaProperty: property,
                        content: tag.getAttribute('content')
                    });
                }
            });
        });
        
        return presence;
    }

    // Detect form interactions
    function detectFormInteractions() {
        const formData = {
            forms: [],
            emailFields: [],
            nameFields: [],
            interactions: []
        };
        
        // Find all forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const formInfo = {
                id: form.id,
                action: form.action,
                method: form.method,
                fields: []
            };
            
            // Find form fields
            const fields = form.querySelectorAll('input, textarea, select');
            fields.forEach(field => {
                const fieldInfo = {
                    type: field.type,
                    name: field.name,
                    id: field.id,
                    placeholder: field.placeholder,
                    value: field.value,
                    isEmail: field.type === 'email' || field.name.toLowerCase().includes('email'),
                    isName: field.name.toLowerCase().includes('name') || field.placeholder.toLowerCase().includes('name')
                };
                
                formInfo.fields.push(fieldInfo);
                
                if (fieldInfo.isEmail) {
                    formData.emailFields.push(fieldInfo);
                }
                
                if (fieldInfo.isName) {
                    formData.nameFields.push(fieldInfo);
                }
                
                // Monitor field interactions
                field.addEventListener('input', function(e) {
                    const interaction = {
                        fieldType: this.type,
                        fieldName: this.name,
                        fieldId: this.id,
                        value: this.value,
                        timestamp: Date.now(),
                        formId: this.form ? this.form.id : 'unknown'
                    };
                    
                    formData.interactions.push(interaction);
                    
                    // Send to analytics
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_field_interaction', {
                            event_category: 'Form Analytics',
                            event_label: this.name || this.id,
                            custom_parameters: {
                                field_type: this.type,
                                field_name: this.name,
                                has_value: !!this.value,
                                form_id: this.form ? this.form.id : 'unknown'
                            }
                        });
                    }
                });
            });
            
            formData.forms.push(formInfo);
        });
        
        return formData;
    }

    // Track social interactions
    function trackSocialInteractions() {
        const interactions = {
            socialClicks: [],
            socialShares: [],
            socialLogins: []
        };
        
        // Monitor social media clicks
        document.addEventListener('click', function(e) {
            const target = e.target;
            const href = target.href || target.getAttribute('href');
            
            if (href) {
                Object.keys(SOCIAL_PATTERNS).forEach(platform => {
                    const config = SOCIAL_PATTERNS[platform];
                    
                    if (config.patterns.some(pattern => href.includes(pattern.toLowerCase()))) {
                        const interaction = {
                            platform: platform,
                            url: href,
                            element: target.tagName,
                            text: target.textContent,
                            timestamp: Date.now()
                        };
                        
                        interactions.socialClicks.push(interaction);
                        
                        // Send to analytics
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'social_click', {
                                event_category: 'Social Analytics',
                                event_label: platform,
                                custom_parameters: {
                                    platform: platform,
                                    url: href,
                                    element: target.tagName
                                }
                            });
                        }
                    }
                });
            }
        });
        
        return interactions;
    }

    // Store social data
    function storeSocialData(socialData) {
        try {
            localStorage.setItem('social_data', JSON.stringify(socialData));
            return true;
        } catch (e) {
            console.log('Could not store social data');
            return false;
        }
    }

    // Get stored social data
    function getStoredSocialData() {
        try {
            const stored = localStorage.getItem('social_data');
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSocialDataCollection);
    } else {
        initSocialDataCollection();
    }

    // Expose functions globally
    window.SocialDataCollector = {
        getSocialData: initSocialDataCollection,
        getStoredData: getStoredSocialData,
        detectSocialProfiles: detectSocialProfiles,
        detectEmailAutofill: detectEmailAutofill,
        detectSocialLogins: detectSocialLogins
    };

})(); 