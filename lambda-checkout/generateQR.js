const QRCode = require('qrcode');
const sendEmailSuccess = require('./sendEmailSuccess');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
    region: "sa-east-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    }
});

const qrGenerator = async (eventId, ticketId, emailBuyer, nameEvent, nameTT) => {
    try {
        const qrCodePng = await QRCode.toDataURL(ticketId, {
            errorCorrectionLevel: 'H',
        });

        const base64Data = qrCodePng.replace(/^data:image\/png;base64,/, "");

        const fileName = `public/events/${eventId}/tickets/${ticketId}.png`;

        const uploadParams = {
            Bucket: 'melo-tickets-bucket',
            Key: fileName,
            Body: Buffer.from(base64Data, 'base64'),
            ContentType: 'image/png'
        };

        try {
            const response = await s3Client.send(new PutObjectCommand(uploadParams));
            console.log("Success", response);
        } catch (err) {
            console.log("Error", err);
        }

        const attachment = {
            filename: `${nameEvent}-${nameTT}.png`,
            content: base64Data,
            contentType: 'image/png',
            contentDisposition: 'attachment',
        };

        await sendEmailSuccess(emailBuyer, nameEvent, ticketId, qrCodePng, nameTT);

        return {
            attachment,
            key: fileName,
        };

    } catch (error) {
        console.error('Failed to generate QR code as PNG:', error);
    }

};

module.exports = qrGenerator;
