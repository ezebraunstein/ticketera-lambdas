const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');
const generateQR = require('./generateQR');
const sendEmailSuccess = require('./sendEmailSuccess');
const updateTypeTicket = require('./updateTypeTicket');
const updatePaymentCompleted = require('./updatePaymentCompleted');

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const createTicket = async (cart, emailBuyer, dniBuyer, eventName, eventID, paymentId) => {

    try {

        const ticketPromises = [];
        const emailAttachments = [];

        for (const item of cart) {
            for (let i = 0; i < item.selectedQuantity; i++) {

                const ticketID = uuid();

                const qr = await generateQR(eventID, ticketID, eventName, item.nameTT);

                emailAttachments.push(qr.attachment);

                const rrppEventID = item.rrppEventId || '0';
                const ticketData = {
                    id: ticketID,
                    qrTicket: qr.key,
                    validTicket: true,
                    dniTicket: dniBuyer,
                    emailTicket: emailBuyer,
                    eventID: eventID,
                    typeticketID: item.id,
                    rrppeventID: rrppEventID
                };

                const ticketPromise = dynamoDb.put({
                    TableName: 'Ticket-zn4tkt5eivea5af5egpjlychcm-dev',
                    Item: ticketData
                }).promise();

                ticketPromises.push(ticketPromise);
            };
        };

        await Promise.all(ticketPromises);

        await updateTypeTicket(cart);
        await updatePaymentCompleted(paymentId);
        await sendEmailSuccess(emailBuyer, eventName, emailAttachments);

    } catch (error) {
        console.log('Error creating tickets:', error);
    }
};

module.exports = createTicket;
