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

// Update user (username/email)
router.put('/users/:id', auth, adminAuth, async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if username already exists (excluding current user)
        if (username && username !== user.username) {
            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.status(400).json({ msg: 'Username already taken' });
            }
            user.username = username;
        }

        // Check if email already exists (excluding current user)
        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ msg: 'Email already in use' });
            }
            user.email = email;
        }

        await user.save();
        res.json({ msg: 'User updated successfully', user: { ...user.toObject(), password: undefined } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Toggle user role (admin/user)
router.put('/users/:id/role', auth, adminAuth, async (req, res) => {
    try {
        const { role } = req.body;
        
        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ msg: 'Invalid role' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Prevent demoting yourself
        if (user._id.toString() === req.user.id && role === 'user') {
            return res.status(400).json({ msg: 'Cannot demote yourself' });
        }

        user.role = role;
        await user.save();
        
        res.json({ msg: `User ${role === 'admin' ? 'promoted to admin' : 'demoted to user'}`, user: { ...user.toObject(), password: undefined } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete user
router.delete('/users/:id', auth, adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Prevent deleting yourself
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({ msg: 'Cannot delete yourself' });
        }

        // Delete all user's links
        await Link.deleteMany({ user: user._id });
        
        // Delete user
        await User.findByIdAndDelete(req.params.id);
        
        res.json({ msg: 'User and associated links deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get system stats
router.get('/stats', auth, adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalLinks = await Link.countDocuments();
        const adminCount = await User.countDocuments({ role: 'admin' });
        
        // Get recent activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
        const newLinksThisWeek = await Link.countDocuments({ createdAt: { $gte: sevenDaysAgo } });
        
        // Get total clicks
        const clicksResult = await Link.aggregate([
            { $group: { _id: null, totalClicks: { $sum: '$clicks' } } }
        ]);
        const totalClicks = clicksResult.length > 0 ? clicksResult[0].totalClicks : 0;
        
        // Get most clicked link
        const topLink = await Link.findOne().sort({ clicks: -1 }).populate('user', 'username');
        
        // Get most active user
        const userLinkCounts = await Link.aggregate([
            { $group: { _id: '$user', linkCount: { $sum: 1 }, totalClicks: { $sum: '$clicks' } } },
            { $sort: { linkCount: -1 } },
            { $limit: 1 }
        ]);
        
        let topUser = null;
        if (userLinkCounts.length > 0) {
            const userData = await User.findById(userLinkCounts[0]._id).select('username email');
            topUser = {
                ...userData.toObject(),
                linkCount: userLinkCounts[0].linkCount,
                totalClicks: userLinkCounts[0].totalClicks
            };
        }
        
        res.json({
            totalUsers,
            totalLinks,
            totalClicks,
            adminCount,
            newUsersThisWeek,
            newLinksThisWeek,
            avgLinksPerUser: totalUsers > 0 ? (totalLinks / totalUsers).toFixed(1) : 0,
            topLink: topLink ? {
                label: topLink.label,
                clicks: topLink.clicks,
                username: topLink.user?.username
            } : null,
            topUser
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get user's links
router.get('/users/:id/links', auth, adminAuth, async (req, res) => {
    try {
        const links = await Link.find({ user: req.params.id }).sort({ createdAt: -1 });
        res.json(links);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete specific link
router.delete('/links/:id', auth, adminAuth, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id);
        if (!link) {
            return res.status(404).json({ msg: 'Link not found' });
        }
        await Link.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Link deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
