const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Link = require('../models/Link');

// Get public profile
router.get('/u/:slug', async (req, res) => {
    try {
        const user = await User.findOne({ slug: req.params.slug }).select('-password -email');
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const links = await Link.find({ user: user.id }).select('-qrCode -clicks'); // Maybe hide clicks? Or show them?
        // Requirement says "render the page". Since this is an API, we return JSON data for the frontend to render.

        res.json({ user, links });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Redirect short code
router.get('/l/:shortCode', async (req, res) => {
    try {
        const link = await Link.findOne({ shortCode: req.params.shortCode });
        if (!link) return res.status(404).send('Link not found');

        link.clicks++;
        await link.save();

        res.redirect(link.url);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
