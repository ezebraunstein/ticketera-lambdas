const AWS = require('aws-sdk');
const createTicket = require('./createTicket');
const sendEmailFail = require('./sendEmailFail');
const updatePaymentFailed = require('./updatePaymentFailed');

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
                    //console.log("Fetched payment:", items.Items[0]);
                    resolve(items.Items[0]);
                }
            });
        });
    };

    const payment = await fetchPayment(paymentId);

    const paymentStatus = payment.paymentStatus;

    if (paymentStatus === 'COMPLETED') {
        //console.log('Payment already completed. Exiting...');
        return;
    }

    const cart = payment.cart;
    const emailBuyer = payment.emailBuyer;
    const dniBuyer = payment.dniBuyer;
    const eventName = payment.eventName;
    const eventID = payment.eventID;

    if (paymentStatus === 'PENDING') {

        //console.log('Payment status is pending. Continuing with the process...');

        if (status === 'completed') {

            //console.log('Go to create ticket');
            await createTicket(cart, emailBuyer, dniBuyer, eventName, eventID, paymentId);

        } else {
            //console.log('Handling failed payment...');
            await updatePaymentFailed(paymentId);
            await sendEmailFail(emailBuyer, eventName);
        }
    }
};