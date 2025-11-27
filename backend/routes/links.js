const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Link = require('../models/Link');
const QRCode = require('qrcode');
const { generateAnalyticsInsights, suggestLabel } = require('../utils/aiHelper');
const { generateCustomQR, getSocialQRTemplate, suggestQRCustomization } = require('../utils/qrGenerator');

// Get all links for user
router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(links);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get AI-powered analytics insights
router.get('/analytics/insights', auth, async (req, res) => {
    try {
        const links = await Link.find({ user: req.user.id });
        const insights = generateAnalyticsInsights(links);
        res.json(insights);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// AI-powered label suggestion
router.post('/suggest-label', auth, async (req, res) => {
    try {
        const { url } = req.body;
        const suggestion = suggestLabel(url);
        res.json({ suggestion });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get QR customization suggestions
router.post('/qr-suggestions', auth, async (req, res) => {
    try {
        const { label, url } = req.body;
        const suggestions = suggestQRCustomization(label, url);
        res.json(suggestions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get social media template
router.post('/social-template', auth, async (req, res) => {
    try {
        const { platform, username } = req.body;
        const template = getSocialQRTemplate(platform, username);
        if (!template) {
            return res.status(404).json({ msg: 'Platform not found' });
        }
        res.json(template);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Create link with custom QR (supports logo)
router.post('/', auth, async (req, res) => {
    const { label, url, qrCustomization } = req.body;
    try {
        // Validate required fields
        if (!label || !url) {
            return res.status(400).json({ msg: 'Label and URL are required' });
        }

        // Validate logo size if present (prevent overly large Base64 strings)
        if (qrCustomization?.logo) {
            const logoSize = Buffer.byteLength(qrCustomization.logo, 'utf8');
            if (logoSize > 5 * 1024 * 1024) { // 5MB limit
                return res.status(400).json({ msg: 'Logo size too large. Maximum 5MB.' });
            }
            
            // Validate Base64 format
            if (!qrCustomization.logo.startsWith('data:image/')) {
                return res.status(400).json({ msg: 'Invalid logo format. Must be a valid image data URL.' });
            }
        }

        const shortCode = Math.random().toString(36).substring(2, 8);
        const redirectUrl = `http://localhost:${process.env.PORT || 5000}/l/${shortCode}`;

        // Generate custom QR code with options including logo
        const customization = qrCustomization || suggestQRCustomization(label, url);
        const qrCode = await generateCustomQR(redirectUrl, {
            color: customization.color || '#000000',
            backgroundColor: customization.bgColor || '#ffffff',
            errorCorrectionLevel: customization.logo ? 'H' : (customization.errorCorrection || 'M'),
            width: 400,
            margin: 2,
            logo: customization.logo || null
        });

        const newLink = new Link({
            user: req.user.id,
            label,
            url,
            shortCode,
            qrCode,
            qrCustomization: {
                color: customization.color || '#000000',
                backgroundColor: customization.bgColor || '#ffffff',
                icon: customization.icon,
                platform: customization.platform,
                errorCorrection: customization.logo ? 'H' : (customization.errorCorrection || 'M'),
                logo: customization.logo
            }
        });

        const link = await newLink.save();
        res.json(link);
    } catch (err) {
        console.error('Error creating link:', err.message);
        console.error('Error stack:', err.stack);
        res.status(500).json({ 
            msg: 'Server error', 
            error: err.message,
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Update link
router.put('/:id', auth, async (req, res) => {
    const { label, url } = req.body;
    try {
        let link = await Link.findById(req.params.id);
        if (!link) return res.status(404).json({ msg: 'Link not found' });
        if (link.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        link.label = label || link.label;
        if (url && url !== link.url) {
            link.url = url;
            // If URL changes, the redirect destination changes, but the shortCode and QR code (which points to shortCode) remain valid!
            // So no need to regenerate QR code unless shortCode changes.
        }

        await link.save();
        res.json(link);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete link
router.delete('/:id', auth, async (req, res) => {
    try {
        let link = await Link.findById(req.params.id);
        if (!link) return res.status(404).json({ msg: 'Link not found' });
        if (link.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        await Link.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Link removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
