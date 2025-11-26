const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    label: { type: String, required: true },
    url: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    qrCode: { type: String }, // Base64 string
    clicks: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Link', LinkSchema);
