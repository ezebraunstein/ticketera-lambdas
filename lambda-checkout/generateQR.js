const QRCode = require('qrcode');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    }
});

const qrGenerator = async (eventID, ticketID, eventName, nameTT) => {
    try {
        const QRTicket = await QRCode.toDataURL(ticketID, {
            errorCorrectionLevel: 'H',
        });

        const base64Data = QRTicket.replace(/^data:image\/png;base64,/, "");

        const fileName = `events/${eventID}/tickets/${nameTT}/${ticketID}.png`;

        const uploadParams = {
            Bucket: 'melo-tickets',
            Key: fileName,
            Body: Buffer.from(base64Data, 'base64'),
            ContentType: 'image/png'
        };

        try {
            await s3Client.send(new PutObjectCommand(uploadParams));
            //console.log("Success uploading so S3");
        } catch (error) {
            console.log("Error uploading to S3", error);
        }

        return {
            key: fileName,
            attachment: {
                content: QRTicket.split('base64,')[1],
                filename: `${eventName}-${nameTT}.png`,
                contentType: 'image/png',
                contentDisposition: 'attachment',
            }
        };

    } catch (error) {
        console.error('Failed to generate QR code as PNG:', error);
    }

};

module.exports = qrGenerator;
