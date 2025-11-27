// AI-Powered Helper Functions for QR System

/**
 * Generate AI-powered link suggestions based on user's existing links
 */
const generateLinkSuggestions = (existingLinks) => {
    const categories = analyzeLinkPatterns(existingLinks);
    const suggestions = [];

    // Analyze patterns and suggest improvements
    if (categories.social > 0) {
        suggestions.push({
            type: 'social',
            title: 'Complete Your Social Presence',
            description: 'Add missing social media profiles',
            suggestions: ['LinkedIn', 'Twitter', 'Instagram', 'YouTube'].filter(
                platform => !existingLinks.some(link => 
                    link.label.toLowerCase().includes(platform.toLowerCase())
                )
            )
        });
    }

    if (categories.business > 0) {
        suggestions.push({
            type: 'business',
            title: 'Enhance Business Profile',
            description: 'Consider adding professional links',
            suggestions: ['Portfolio Website', 'Contact Form', 'Booking Calendar', 'Reviews Page']
        });
    }

    return suggestions;
};

/**
 * Analyze link patterns to categorize them
 */
const analyzeLinkPatterns = (links) => {
    const patterns = {
        social: 0,
        business: 0,
        personal: 0,
        ecommerce: 0
    };

    const socialKeywords = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok'];
    const businessKeywords = ['portfolio', 'company', 'contact', 'booking', 'appointment'];
    const ecommerceKeywords = ['shop', 'store', 'buy', 'product', 'cart'];

    links.forEach(link => {
        const text = (link.label + ' ' + link.url).toLowerCase();
        
        if (socialKeywords.some(kw => text.includes(kw))) patterns.social++;
        if (businessKeywords.some(kw => text.includes(kw))) patterns.business++;
        if (ecommerceKeywords.some(kw => text.includes(kw))) patterns.ecommerce++;
        else patterns.personal++;
    });

    return patterns;
};

/**
 * Generate smart label suggestions based on URL
 */
const suggestLabel = (url) => {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname.replace('www.', '');
        
        // Social media detection
        const socialPlatforms = {
            'facebook.com': 'Facebook Profile',
            'twitter.com': 'Twitter Profile',
            'x.com': 'X (Twitter) Profile',
            'instagram.com': 'Instagram Profile',
            'linkedin.com': 'LinkedIn Profile',
            'youtube.com': 'YouTube Channel',
            'tiktok.com': 'TikTok Profile',
            'github.com': 'GitHub Profile',
            'behance.net': 'Behance Portfolio',
            'dribbble.com': 'Dribbble Portfolio'
        };

        if (socialPlatforms[domain]) {
            return socialPlatforms[domain];
        }

        // Business platforms
        if (domain.includes('calendly')) return 'Book Appointment';
        if (domain.includes('linktree')) return 'Link Collection';
        if (domain.includes('shopify') || domain.includes('etsy')) return 'Online Store';
        
        // Default: capitalize domain name
        return domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
    } catch {
        return 'My Link';
    }
};

/**
 * Analyze link performance and generate insights
 */
const generateAnalyticsInsights = (links) => {
    if (links.length === 0) {
        return {
            message: 'Create your first link to start tracking analytics',
            tips: ['Add clear, descriptive labels', 'Use short, memorable URLs', 'Update links regularly']
        };
    }

    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    const avgClicksPerLink = totalClicks / links.length;
    const topPerformer = links.reduce((max, link) => link.clicks > max.clicks ? link : max, links[0]);
    const leastPerformer = links.reduce((min, link) => link.clicks < min.clicks ? link : min, links[0]);

    const insights = {
        totalClicks,
        avgClicksPerLink: avgClicksPerLink.toFixed(1),
        topPerformer: {
            label: topPerformer.label,
            clicks: topPerformer.clicks,
            performance: topPerformer.clicks > avgClicksPerLink ? 'above average' : 'below average'
        },
        recommendations: []
    };

    // Generate AI recommendations
    if (topPerformer.clicks > avgClicksPerLink * 2) {
        insights.recommendations.push({
            type: 'success',
            message: `"${topPerformer.label}" is performing exceptionally well! Consider promoting similar content.`
        });
    }

    if (leastPerformer.clicks === 0 && links.length > 1) {
        insights.recommendations.push({
            type: 'warning',
            message: `"${leastPerformer.label}" hasn't received any clicks yet. Consider updating the label or placement.`
        });
    }

    if (links.length < 3) {
        insights.recommendations.push({
            type: 'info',
            message: 'Add more links to get better analytics insights and reach a wider audience.'
        });
    }

    if (totalClicks > 100) {
        insights.recommendations.push({
            type: 'success',
            message: 'Great engagement! You\'ve passed 100 total clicks. Keep up the momentum!'
        });
    }

    return insights;
};

/**
 * Optimize QR code design suggestions based on use case
 */
const suggestQROptimization = (linkData) => {
    const suggestions = {
        size: 'medium',
        errorCorrection: 'M',
        tips: []
    };

    // High-click links need better error correction for durability
    if (linkData.clicks > 50) {
        suggestions.errorCorrection = 'H';
        suggestions.tips.push('High traffic link - use high error correction for printed materials');
    }

    // Social media links benefit from color customization
    if (linkData.label.toLowerCase().includes('social') || 
        linkData.url.includes('facebook') || 
        linkData.url.includes('instagram')) {
        suggestions.tips.push('Consider adding brand colors to make QR code more recognizable');
    }

    // Business cards need smaller, dense QR codes
    if (linkData.label.toLowerCase().includes('card') || 
        linkData.label.toLowerCase().includes('contact')) {
        suggestions.size = 'small';
        suggestions.tips.push('Optimize for business card printing - use compact size');
    }

    return suggestions;
};

/**
 * Smart URL validation with AI-powered suggestions
 */
const validateAndSuggestURL = (url) => {
    const result = {
        valid: true,
        suggestions: [],
        security: 'safe'
    };

    try {
        const urlObj = new URL(url);

        // Check protocol
        if (urlObj.protocol === 'http:') {
            result.suggestions.push({
                type: 'security',
                message: 'Consider using HTTPS for better security',
                fix: url.replace('http://', 'https://')
            });
        }

        // Check for tracking parameters
        const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid'];
        const hasTracking = trackingParams.some(param => urlObj.searchParams.has(param));
        
        if (hasTracking) {
            result.suggestions.push({
                type: 'info',
                message: 'URL contains tracking parameters - useful for analytics'
            });
        }

        // Check URL length
        if (url.length > 100) {
            result.suggestions.push({
                type: 'warning',
                message: 'Long URL detected - consider using a URL shortener first'
            });
        }

        return result;
    } catch {
        result.valid = false;
        result.suggestions.push({
            type: 'error',
            message: 'Invalid URL format. Please include http:// or https://'
        });
        return result;
    }
};

module.exports = {
    generateLinkSuggestions,
    analyzeLinkPatterns,
    suggestLabel,
    generateAnalyticsInsights,
    suggestQROptimization,
    validateAndSuggestURL
};
