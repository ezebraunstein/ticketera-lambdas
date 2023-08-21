const AWS = require('aws-sdk');

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const updateTypeTicket = async (cart) => {

    for (const typeTicket of cart) {

        const typeTicketId = typeTicket.id;

        const fetchTypeTicket = async (typeTicketId) => {

            return new Promise((resolve, reject) => {

                const params = {
                    TableName: 'TypeTicket-zn4tkt5eivea5af5egpjlychcm-dev',
                    KeyConditionExpression: 'id = :typeTicketId',
                    ExpressionAttributeValues: {
                        ':typeTicketId': typeTicketId,
                    },
                };

                dynamoDb.query(params, (err, items) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(items.Items[0]);
                    }
                });
            });
        };

        const item = await fetchTypeTicket(typeTicketId);

        const itemQuantity = item.quantityTT - typeTicket.selectedQuantity;

        await dynamoDb.update({
            TableName: 'TypeTicket-zn4tkt5eivea5af5egpjlychcm-dev',
            Key: { id: typeTicketId },
            UpdateExpression: 'set quantityTT = :q',
            ExpressionAttributeValues: { ':q': itemQuantity },
        }).promise();
    }

};

module.exports = updateTypeTicket;
