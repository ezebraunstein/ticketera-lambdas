const { registerFont, createCanvas, loadImage } = require('canvas');

async function mergeImageWithQR(QRTicket, eventName, nameTT, templatePath) {

    registerFont(__dirname.concat('/fonts/display-black.woff'), { family: 'Helvetica Display Black' });
    registerFont(__dirname.concat('/fonts/display-extrabold.woff'), { family: 'Helvetica Display ExtraBold' });

    const canvas = createCanvas(1170, 2532);
    const ctx = canvas.getContext('2d');

    // Load the pre-designed template image
    const template = await loadImage(templatePath);

    // Draw the template onto the canvas
    ctx.drawImage(template, 0, 0, 1170, 2532);

    // Load the QR code image
    const qrImage = await loadImage(QRTicket);

    // Draw the QR code
    const qrSize = 700;
    const qrX = 585 - qrSize / 2;  // Centering QR
    const qrY = 1450.75 - qrSize / 2; // Centering QR
    ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

    // Set text color
    ctx.fillStyle = "#E4FF1A";

    // Add eventName to the image
    ctx.font = '150px "Helvetica Display Black""';
    const eventNameMetrics = ctx.measureText(eventName);
    const eventNameX = 585 - eventNameMetrics.width / 2;  // Centering text
    const eventNameY = 896;
    ctx.fillText(eventName, eventNameX, eventNameY);

    // Add ticketID to the image
    ctx.font = '100px "Helvetica Display ExtraBold"';
    const nameTTMetrics = ctx.measureText(nameTT);
    const nameTTX = 585 - nameTTMetrics.width / 2; // Centering text
    const nameTTY = 2120;
    ctx.fillText(nameTT, nameTTX, nameTTY);

    // Convert canvas to image
    const mergedImage = canvas.toDataURL();

    return mergedImage;
}

module.exports = mergeImageWithQR;
