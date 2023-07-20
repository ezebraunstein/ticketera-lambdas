const axios = require('axios');

async function sendEmailWithQR(emailBuyer, eventName, ticketId, base64QRCode, nameTT) {
    try {
        const result = await axios.post('https://h456ccae4obnzd5xj2535byzk40pkrdf.lambda-url.us-east-1.on.aws/', {
            emailBuyer, eventName, ticketId, base64QRCode, nameTT
        });
        console.log('Email sent:', result);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
};

module.exports = sendEmailWithQR;