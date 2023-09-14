const { createCanvas, loadImage } = require('canvas');

async function mergeImageWithQR(QRTicket, eventName, ticketID, templatePath) {

    console.log("Merging image with QR...");
    
    const canvas = createCanvas(2532, 1170);
    const ctx = canvas.getContext('2d');

    // Load the pre-designed template image
    const template = await loadImage(templatePath);

    // Draw the template onto the canvas
    ctx.drawImage(template, 0, 0, 2532, 1170);

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
    ctx.font = '150px Arial';
    const eventNameMetrics = ctx.measureText(eventName);
    const eventNameX = 585 - eventNameMetrics.width / 2;  // Centering text
    const eventNameY = 896;
    ctx.fillText(eventName, eventNameX, eventNameY);

    // Add ticketID to the image
    ctx.font = '100px Arial';
    const ticketIDMetrics = ctx.measureText(ticketID);
    const ticketIDX = 585 - ticketIDMetrics.width / 2; // Centering text
    const ticketIDY = 2120;
    ctx.fillText(ticketID, ticketIDX, ticketIDY);

    // Convert canvas to image
    const mergedImage = canvas.toDataURL();

    console.log("Merged Image Data:", mergedImage);

    return mergedImage;
}

module.exports = mergeImageWithQR;
