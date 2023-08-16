const AWS = require('aws-sdk');
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

                    const ticketID = uuid();
                    const key = await generateQR(eventID, ticketID, emailBuyer, eventName, item.nameTT);
                    let rrppEventID = item.rrppEventId;

                    if (!rrppEventID) {
                        rrppEventID = '0';
                    }

                    const ticketData = {
                        id: ticketID,
                        qrTicket: key.key,
                        validTicket: true,
                        dniTicket: dniBuyer,
                        emailTicket: emailBuyer,
                        eventID: eventID,
                        typeticketID: item.id,
                        rrppeventID: rrppEventID
                    };

                    console.log('Ticket data:', ticketData);

                    try {
                        await dynamoDb.put({
                            TableName: 'Ticket-zn4tkt5eivea5af5egpjlychcm-dev',
                            Item: ticketData
                        }).promise();
                        console.log('Ticket created:', ticketData);
                    } catch (error) {
                        console.error('Error creating ticket:', error);
                    }

                })();
                ticketPromises.push(ticketPromise);
            };

            try {
                await dynamoDb.update({
                    TableName: 'Payment-zn4tkt5eivea5af5egpjlychcm-dev',
                    Key: { id: paymentId },
                    UpdateExpression: 'set paymentStatus = :q, updatedDate = :u',
                    ExpressionAttributeValues: { ':q': 'COMPLETED', ':u': new Date().toISOString() },
                }).promise();
                console.log('Payment updated:', paymentId);
            } catch (error) {
                console.error('Error updating payment:', error);
            }

            for (const item of cart) {
                const itemID = item.id;
                const itemQuantity = item.quantityTT - item.selectedQuantity;
        
                const updateTypeTicketInput = {
                    id: itemID,
                    quantityTT: itemQuantity
                };
        
                await API.graphql({
                    query: updateTypeTicket,
                    variables: { input: updateTypeTicketInput }
                });
        
            };
        };

        await Promise.all(ticketPromises);

    } catch (error) {
        console.log('Error creating tickets:', error);
    }
};

module.exports = handleCheckout;
