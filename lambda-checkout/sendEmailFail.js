const axios = require('axios');

async function sendEmailWithQR(emailBuyer, eventName) {
    try {
        const result = await axios.post('https://b743o3q3py6zyxf7a3tve35duy0xcyyf.lambda-url.us-east-1.on.aws/', {
            emailBuyer, eventName
        });
        console.log('Email sent:', result);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
};

module.exports = sendEmailWithQR;