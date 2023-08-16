const axios = require('axios');

async function sendEmailWithQR(emailBuyer, eventName, ticketId, base64QRCode, nameTT) {
    try {
        const result = axios.post('https://hrjth6ngan4xsuhd23d6wydjp40rgkmb.lambda-url.us-east-1.on.aws/', {
            emailBuyer, eventName, ticketId, base64QRCode, nameTT
        });
        console.log('Email sent:', result);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
};

module.exports = sendEmailWithQR;

