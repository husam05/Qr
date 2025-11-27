const mongoose = require('mongoose');

const uri = "mongodb+srv://hussam05:SecurePass2025@cluster0.tb7fkg9.mongodb.net/qrlinkhub?appName=Cluster0";

async function verifyConnection() {
    try {
        console.log("🔍 Testing MongoDB Atlas connection...");
        await mongoose.connect(uri);
        console.log("✅ Connected successfully!\n");

        // Check users
        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        console.log(`📊 Database: qrlinkhub`);
        console.log(`👥 Total Users: ${users.length}\n`);
        
        users.forEach(u => {
            console.log(`📧 Email: ${u.email}`);
            console.log(`👤 Username: ${u.username}`);
            console.log(`🔐 Role: ${u.role}`);
            console.log(`🆔 ID: ${u._id}`);
            console.log('---');
        });

        // Check links
        const links = await mongoose.connection.db.collection('links').countDocuments();
        console.log(`\n🔗 Total Links: ${links}`);

        console.log("\n✅ Everything looks good! Your database is ready.");
        
    } catch (err) {
        console.error("❌ Connection Error:", err.message);
        console.error("\n💡 Possible issues:");
        console.error("   - Password might be wrong");
        console.error("   - IP not whitelisted (should be 0.0.0.0/0)");
        console.error("   - Special characters in password need URL encoding");
    } finally {
        await mongoose.disconnect();
    }
}

verifyConnection();
