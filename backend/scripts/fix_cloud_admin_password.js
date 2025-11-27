const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = "mongodb+srv://hussam05:987987987@cluster0.tb7fkg9.mongodb.net/qrlinkhub?appName=Cluster0";

async function fixAdminPassword() {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(uri);
        console.log("✅ Connected!");

        const email = 'admin@qrlinkhub.com';
        const newPassword = 'admin123';

        // 1. Find the admin user
        const user = await mongoose.connection.db.collection('users').findOne({ email });

        if (!user) {
            console.log("❌ Admin user not found!");
            return;
        }

        console.log(`Found user: ${user.email}`);
        console.log(`Current Hash: ${user.password}`);

        // 2. Check if current password works
        const isMatch = await bcrypt.compare(newPassword, user.password);
        console.log(`Does 'admin123' match current hash? ${isMatch ? 'YES ✅' : 'NO ❌'}`);

        if (!isMatch) {
            console.log("Updating password to 'admin123'...");
            
            // Generate new hash
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update DB
            await mongoose.connection.db.collection('users').updateOne(
                { email },
                { $set: { password: hashedPassword } }
            );
            console.log("✅ Password updated successfully!");
        } else {
            console.log("Password is already correct. No changes needed.");
        }

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

fixAdminPassword();