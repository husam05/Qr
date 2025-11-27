const axios = require('axios');

const API_URL = 'https://qr-enwn.onrender.com';

async function testProdLogin() {
    try {
        console.log(`Testing login against: ${API_URL}`);
        const res = await axios.post(`${API_URL}/api/auth/login`, {
            email: 'admin@qrlinkhub.com',
            password: 'admin123'
        });
        console.log("✅ Login SUCCESS!");
        console.log("Token:", res.data.token);
    } catch (err) {
        console.error("❌ Login FAILED");
        if (err.response) {
            console.error("Status:", err.response.status);
            console.error("Data:", err.response.data);
        } else {
            console.error("Error:", err.message);
        }
    }
}

testProdLogin();