const mongoose = require('mongoose');
const Link = require('./models/Link');
const { generateCustomQR } = require('./utils/qrGenerator');

const uri = "mongodb+srv://hussam05:SecurePass2025@cluster0.tb7fkg9.mongodb.net/qrlinkhub?appName=Cluster0";
const BASE_URL = 'https://qr-enwn.onrender.com';

async function fixQrCodes() {
    try {
        console.log("🔍 Connecting to DB...");
        await mongoose.connect(uri);
        console.log("✅ Connected.");

        const links = await Link.find({});
        console.log(`Found ${links.length} links to check/update.`);

        for (const link of links) {
            const correctUrl = `${BASE_URL}/l/${link.shortCode}`;
            
            // We can't easily decode the QR to check if it's wrong, so we just regenerate it.
            // But we need to preserve the customization options.
            
            const customization = link.qrCustomization || {};
            
            console.log(`Updating QR for link: ${link.label} (${link.shortCode})`);
            
            const newQrCode = await generateCustomQR(correctUrl, {
                color: customization.color || '#000000',
                backgroundColor: customization.backgroundColor || '#ffffff',
                errorCorrectionLevel: customization.errorCorrection || 'M',
                width: 400,
                margin: 2,
                logo: customization.logo || null
            });

            link.qrCode = newQrCode;
            await link.save();
            console.log(`✅ Updated.`);
        }

        console.log("🎉 All QR codes updated successfully!");

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

fixQrCodes();