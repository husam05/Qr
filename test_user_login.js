const axios = require('axios');

const API_URL = 'https://qr-enwn.onrender.com';

async function testUserLogin() {
    try {
        console.log(`Testing login for qq@gmail.com against: ${API_URL}`);
        const res = await axios.post(`${API_URL}/api/auth/login`, {
            email: 'qq@gmail.com',
            password: '123'
        });
        console.log("✅ Login SUCCESS!");
        console.log("Token:", res.data.token);
        
        // Decode token
        const token = res.data.token;
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("Payload:", payload);

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

function atob(str) {
    return Buffer.from(str, 'base64').toString('binary');
}

testUserLogin();