const AWS = require('aws-sdk');
const Swal = require('sweetalert2');
const { v4: uuid } = require('uuid');
const generateQR = require('./generateQR');

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const handleCheckout = async (cart, emailBuyer, dniBuyer, eventName, eventID, paymentId) => {

    try {

        const ticketPromises = [];

        for (const item of cart) {
            for (let i = 0; i < item.selectedQuantity; i++) {
                const ticketPromise = (async () => {

                    const ticketId = uuid();
                    const nameEvent = eventName;
                    const eventId = eventID;
                    const nameTT = item.nameTT;
                    const key = await generateQR(eventId, ticketId, emailBuyer, nameEvent, nameTT);

                    const ticketData = {
                        id: ticketId,
                        qrTicket: key.key,
                        validTicket: true,
                        dniTicket: dniBuyer,
                        emailTicket: emailBuyer,
                        typeticketID: item.id,
                    };

                    try {
                        await dynamoDb.put({
                            TableName: 'Ticket-zn4tkt5eivea5af5egpjlychcm-dev',
                            Item: ticketData
                        }).promise();
                        console.log('Ticket created:', ticketData);
                    } catch (error) {
                        console.error('Error creating ticket:', error);
                    }

                    try {
                        await dynamoDb.update({
                            TableName: 'Payment-zn4tkt5eivea5af5egpjlychcm-dev',
                            Key: { id: paymentId },
                            UpdateExpression: 'set paymentStatus = :q, updatedAt = :u',
                            ExpressionAttributeValues: { ':q': 'COMPLETED', ':u': new Date().toISOString() },
                        }).promise();
                        console.log('Payment updated:', paymentId);
                    } catch (error) {
                        console.error('Error updating payment:', error);
                    }

                })();

                ticketPromises.push(ticketPromise);
            };
        };

        await Promise.all(ticketPromises);

    } catch (error) {
        console.log('Error creating tickets:', error);
    }
};

module.exports = handleCheckout;
