process.env["PATH"] =
    process.env["PATH"] + ":" + process.env["LAMBDA_TASK_ROOT"] + "/lib";
process.env["LD_LIBRARY_PATH"] = process.env["LAMBDA_TASK_ROOT"] + "/lib";
process.env["PKG_CONFIG_PATH"] = process.env["LAMBDA_TASK_ROOT"] + "/lib";

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
                    resolve(items.Items[0]);
                }
            });
        });
    };

    const payment = await fetchPayment(paymentId);

    const paymentStatus = payment.paymentStatus;

    if (paymentStatus === 'COMPLETED') {
        return;
    }

    const cart = payment.cart;
    const emailBuyer = payment.emailBuyer;
    const dniBuyer = payment.dniBuyer;
    const eventName = payment.eventName;
    const eventID = payment.eventID;

    if (paymentStatus === 'PENDING') {
        if (status === 'completed') {
            await createTicket(cart, emailBuyer, dniBuyer, eventName, eventID, paymentId);
        } else {
            await updatePaymentFailed(paymentId);
            await sendEmailFail(emailBuyer, eventName);
        }
    }
};