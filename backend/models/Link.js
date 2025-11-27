const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    qrCode: { type: String }, // Base64 string
    qrCustomization: {
        color: { type: String, default: '#000000' },
        backgroundColor: { type: String, default: '#ffffff' },
        logo: { type: String }, // Base64 logo image
        style: { type: String, default: 'square' }, // square, dots, rounded
        errorCorrection: { type: String, default: 'M' }, // L, M, Q, H
        icon: { type: String }, // Emoji icon
        platform: { type: String } // instagram, tiktok, etc.
    },
    clicks: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Link', LinkSchema);
