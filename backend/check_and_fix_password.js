const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = "mongodb+srv://hussam05:SecurePass2025@cluster0.tb7fkg9.mongodb.net/qrlinkhub?appName=Cluster0";

async function checkPassword() {
    try {
        await mongoose.connect(uri);
        console.log("✅ Connected\n");

        const user = await mongoose.connection.db.collection('users').findOne({ email: 'admin@qrlinkhub.com' });
        
        console.log(`Testing password for: ${user.email}`);
        console.log(`Current hash: ${user.password}\n`);

        // Test both possible passwords
        const passwords = ['admin123', 'Admin@123'];
        
        for (const pwd of passwords) {
            const isMatch = await bcrypt.compare(pwd, user.password);
            console.log(`Password "${pwd}": ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);
        }

        // If no match, set to admin123
        const match = await bcrypt.compare('admin123', user.password);
        if (!match) {
            console.log('\n🔧 Updating password to "admin123"...');
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash('admin123', salt);
            await mongoose.connection.db.collection('users').updateOne(
                { email: 'admin@qrlinkhub.com' },
                { $set: { password: hash } }
            );
            console.log('✅ Password updated!');
        }

    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

checkPassword();
