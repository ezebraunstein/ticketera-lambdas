const AWS = require('aws-sdk');

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const updatePaymentCompleted = async (paymentId) => {

    await dynamoDb.update({
        TableName: 'Payment-zn4tkt5eivea5af5egpjlychcm-dev',
        Key: { id: paymentId },
        UpdateExpression: 'set paymentStatus = :q, updatedDate = :u',
        ExpressionAttributeValues: { ':q': 'COMPLETED', ':u': new Date().toISOString() },
    }).promise();

};

module.exports = updatePaymentCompleted;
