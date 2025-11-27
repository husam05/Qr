const QRCode = require('qrcode');

/**
 * Generate customized QR code with logo overlay support
 * @param {string} data - URL or data to encode
 * @param {object} options - Customization options
 * @returns {Promise<string>} Base64 QR code image
 */
const generateCustomQR = async (data, options = {}) => {
    const {
        color = '#000000',
        backgroundColor = '#ffffff',
        errorCorrectionLevel = 'M',
        width = 400,
        margin = 2,
        label = null,
        logo = null
    } = options;

    // Use high error correction if logo present for better scanning
    const ecLevel = logo ? 'H' : errorCorrectionLevel;

    // QR Code generation options
    const qrOptions = {
        errorCorrectionLevel: ecLevel,
        type: 'image/png',
        quality: 1,
        margin,
        width,
        color: {
            dark: color,
            light: backgroundColor
        }
    };

    try {
        // Generate base QR code
        const qrDataUrl = await QRCode.toDataURL(data, qrOptions);

        // If logo provided, overlay it on QR (client-side or use canvas in future)
        // For now, return QR with logo data for client-side rendering
        if (logo) {
            // Logo will be overlayed on client side or can use canvas library here
            // Return QR code - logo overlay handled by frontend or future canvas implementation
            return qrDataUrl;
        }

        return qrDataUrl;
    } catch (err) {
        console.error('QR Generation Error:', err);
        throw err;
    }
};

/**
 * Get QR code templates for different social platforms
 */
const getSocialQRTemplate = (platform, username) => {
    const templates = {
        instagram: {
            url: `https://instagram.com/${username}`,
            color: '#E4405F',
            label: `@${username}`,
            icon: '📷'
        },
        tiktok: {
            url: `https://tiktok.com/@${username}`,
            color: '#000000',
            label: `@${username}`,
            icon: '🎵'
        },
        facebook: {
            url: `https://facebook.com/${username}`,
            color: '#1877F2',
            label: username,
            icon: '👥'
        },
        twitter: {
            url: `https://twitter.com/${username}`,
            color: '#1DA1F2',
            label: `@${username}`,
            icon: '🐦'
        },
        x: {
            url: `https://x.com/${username}`,
            color: '#000000',
            label: `@${username}`,
            icon: '✖️'
        },
        linkedin: {
            url: `https://linkedin.com/in/${username}`,
            color: '#0A66C2',
            label: username,
            icon: '💼'
        },
        youtube: {
            url: `https://youtube.com/@${username}`,
            color: '#FF0000',
            label: `@${username}`,
            icon: '▶️'
        },
        github: {
            url: `https://github.com/${username}`,
            color: '#181717',
            label: username,
            icon: '💻'
        },
        whatsapp: {
            url: `https://wa.me/${username}`,
            color: '#25D366',
            label: username,
            icon: '💬'
        },
        telegram: {
            url: `https://t.me/${username}`,
            color: '#26A5E4',
            label: `@${username}`,
            icon: '✈️'
        },
        snapchat: {
            url: `https://snapchat.com/add/${username}`,
            color: '#FFFC00',
            label: username,
            icon: '👻'
        },
        pinterest: {
            url: `https://pinterest.com/${username}`,
            color: '#E60023',
            label: username,
            icon: '📌'
        }
    };

    return templates[platform.toLowerCase()] || null;
};

/**
 * Generate business card QR with contact info
 */
const generateBusinessQR = (contactInfo) => {
    const {
        name,
        company,
        phone,
        email,
        website,
        address
    } = contactInfo;

    // vCard format for business cards
    let vCard = 'BEGIN:VCARD\n';
    vCard += 'VERSION:3.0\n';
    if (name) vCard += `FN:${name}\n`;
    if (company) vCard += `ORG:${company}\n`;
    if (phone) vCard += `TEL:${phone}\n`;
    if (email) vCard += `EMAIL:${email}\n`;
    if (website) vCard += `URL:${website}\n`;
    if (address) vCard += `ADR:${address}\n`;
    vCard += 'END:VCARD';

    return vCard;
};

/**
 * Suggest QR customization based on link type
 */
const suggestQRCustomization = (label, url) => {
    const lowerLabel = label.toLowerCase();
    const lowerUrl = url.toLowerCase();

    // Social media detection
    if (lowerUrl.includes('instagram') || lowerLabel.includes('instagram')) {
        return { color: '#E4405F', bgColor: '#ffffff', icon: '📷', platform: 'instagram' };
    }
    if (lowerUrl.includes('tiktok') || lowerLabel.includes('tiktok')) {
        return { color: '#000000', bgColor: '#69C9D0', icon: '🎵', platform: 'tiktok' };
    }
    if (lowerUrl.includes('facebook') || lowerLabel.includes('facebook')) {
        return { color: '#1877F2', bgColor: '#ffffff', icon: '👥', platform: 'facebook' };
    }
    if (lowerUrl.includes('twitter') || lowerUrl.includes('x.com') || lowerLabel.includes('twitter')) {
        return { color: '#000000', bgColor: '#ffffff', icon: '✖️', platform: 'x' };
    }
    if (lowerUrl.includes('linkedin') || lowerLabel.includes('linkedin')) {
        return { color: '#0A66C2', bgColor: '#ffffff', icon: '💼', platform: 'linkedin' };
    }
    if (lowerUrl.includes('youtube') || lowerLabel.includes('youtube')) {
        return { color: '#FF0000', bgColor: '#ffffff', icon: '▶️', platform: 'youtube' };
    }
    if (lowerUrl.includes('github') || lowerLabel.includes('github')) {
        return { color: '#181717', bgColor: '#ffffff', icon: '💻', platform: 'github' };
    }

    // Business/Store detection
    if (lowerLabel.includes('store') || lowerLabel.includes('shop')) {
        return { color: '#10B981', bgColor: '#ffffff', icon: '🏪', platform: 'store' };
    }
    if (lowerLabel.includes('menu') || lowerLabel.includes('restaurant')) {
        return { color: '#F59E0B', bgColor: '#ffffff', icon: '🍽️', platform: 'menu' };
    }
    if (lowerLabel.includes('portfolio') || lowerLabel.includes('website')) {
        return { color: '#6366F1', bgColor: '#ffffff', icon: '🌐', platform: 'website' };
    }

    // Default
    return { color: '#000000', bgColor: '#ffffff', icon: '🔗', platform: 'default' };
};

module.exports = {
    generateCustomQR,
    getSocialQRTemplate,
    generateBusinessQR,
    suggestQRCustomization
};
