const axios = require('axios');

const URL_1 = 'https://qr-enwn.onrender.com';
const URL_2 = 'https://qrlinkhub-api.onrender.com';

async function checkUrl(url) {
    try {
        console.log(`Checking ${url}...`);
        await axios.get(url);
        console.log(`✅ ${url} is UP`);
    } catch (err) {
        console.log(`❌ ${url} is DOWN or unreachable: ${err.message}`);
    }
}

async function run() {
    await checkUrl(URL_1);
    await checkUrl(URL_2);
}

run();