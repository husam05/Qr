const mongoose = require('mongoose');

const uri = "mongodb+srv://hussam05:987987987@cluster0.tb7fkg9.mongodb.net/qrlinkhub?appName=Cluster0";

async function checkDb() {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(uri);
        console.log("✅ Connected!");

        const users = await mongoose.connection.db.collection('users').find({}).toArray();
        
        console.log(`\nFound ${users.length} users in 'qrlinkhub' database:`);
        users.forEach(u => {
            console.log(`- Email: ${u.email}, Role: ${u.role}, ID: ${u._id}`);
        });

        if (users.length === 0) {
            console.log("\n⚠️ No users found! The database might be empty or you restored to a different database name.");
        }

    } catch (err) {
        console.error("❌ Connection Error:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

checkDb();