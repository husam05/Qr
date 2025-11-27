const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const uri = "mongodb+srv://hussam05:SecurePass2025@cluster0.tb7fkg9.mongodb.net/qrlinkhub?appName=Cluster0";

async function testLogin() {
    try {
        console.log("🔍 Connecting to Cloud DB...");
        await mongoose.connect(uri);
        console.log("✅ Connected.");

        const email = 'admin@qrlinkhub.com';
        const password = 'admin123';

        console.log(`\n🔑 Attempting login for: ${email}`);
        
        const user = await User.findOne({ email });
        if (!user) {
            console.error("❌ User not found in DB!");
            return;
        }
        console.log("✅ User found.");

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            console.log("✅ Password MATCHES! Credentials are correct.");
        } else {
            console.error("❌ Password MISMATCH! The stored hash does not match 'admin123'.");
            
            // Optional: Reset password if it fails
            // const salt = await bcrypt.genSalt(10);
            // user.password = await bcrypt.hash(password, salt);
            // await user.save();
            // console.log("🔄 Password has been reset to 'admin123'.");
        }

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

testLogin();