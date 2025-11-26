const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Link = require('../models/Link');
const QRCode = require('qrcode');

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

// Create link
router.post('/', auth, async (req, res) => {
    const { label, url } = req.body;
    try {
        const shortCode = Math.random().toString(36).substring(2, 8);
        // Generate QR Code pointing to the public redirect URL
        // Assuming the frontend/public url is something like http://localhost:5000/l/{shortCode}
        // But usually it points to the frontend or backend redirect.
        // The requirement says "/l/{shortCode} to redirect to target URL". This is a backend route.
        // So the QR code should point to the backend URL or a domain that hits the backend.
        // For local dev, I'll use http://localhost:5000/l/{shortCode}
        // In production, this would be the domain.
        const redirectUrl = `http://localhost:${process.env.PORT || 5000}/l/${shortCode}`;

        const qrCode = await QRCode.toDataURL(redirectUrl);

        const newLink = new Link({
            user: req.user.id,
            label,
            url,
            shortCode,
            qrCode
        });

        const link = await newLink.save();
        res.json(link);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
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
