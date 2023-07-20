const AWS = require('aws-sdk');
const createTicket = require('./createTicket');
const updateTypeTicket = require('./updateTypeTicket');
const sendEmailFail = require('./sendEmailFail');

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {

    const body = JSON.parse(event.body);
    const paymentId = body.paymentId;
    const status = body.status;

    const fetchPayment = async (paymentId) => {

        return new Promise((resolve, reject) => {

            const params = {
                TableName: 'Payment-zn4tkt5eivea5af5egpjlychcm-dev',
                KeyConditionExpression: 'id = :paymentId',
                ExpressionAttributeValues: {
                    ':paymentId': paymentId,
                },
            };

            dynamoDb.query(params, (err, items) => {
                if (err) {
                    console.error("Error fetching payment:", err);
                    reject(err);
                } else {
                    console.log("Fetched payment:", items.Items[0]);
                    resolve(items.Items[0]);
                }
            });
        });
    };

    const payment = await fetchPayment(paymentId);

    const cart = payment.cart;
    const emailBuyer = payment.emailBuyer;
    const dniBuyer = payment.dniBuyer;
    const eventName = payment.eventName;
    const eventId = payment.eventID;


    if (status === 'completed') {
        await createTicket(cart, emailBuyer, dniBuyer, eventName, eventId, paymentId);
    } else {
        await updateTypeTicket(cart, paymentId);
        await sendEmailFail(emailBuyer, eventName);
    }

};