const axios = require('axios');

async function sendEmailWithQR(emailBuyer, eventName, emailAttachments) {
    try {
        await axios.post('https://hrjth6ngan4xsuhd23d6wydjp40rgkmb.lambda-url.us-east-1.on.aws/', {
            emailBuyer, eventName, emailAttachments
        });
        //console.log('Email sent');
    } catch (error) {
        console.error('Failed to send email:', error);
    }
};

module.exports = sendEmailWithQR;