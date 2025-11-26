const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Link = require('../models/Link');

// Middleware to check if admin
const adminAuth = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied' });
    }
    next();
};

// Get all users and stats
router.get('/users', auth, adminAuth, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        const stats = await Promise.all(users.map(async (user) => {
            const linkCount = await Link.countDocuments({ user: user.id });
            return {
                ...user.toObject(),
                linkCount
            };
        }));
        res.json(stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
