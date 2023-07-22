const AWS = require('aws-sdk');

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const handler = async (event) => {

    const body = JSON.parse(event.body);
    const createTypeTicketInput = body.createTypeTicketInput;

    try {

        const params = {
            TableName: 'TypeTicket-zn4tkt5eivea5af5egpjlychcm-dev',
            Item: {
                'id': createTypeTicketInput.id,
                'nameTT': createTypeTicketInput.nameTT,
                'priceTT': createTypeTicketInput.priceTT,
                'quantityTT': createTypeTicketInput.quantityTT,
                'descriptionTT': createTypeTicketInput.descriptionTT,
                'activeTT': createTypeTicketInput.activeTT,
                'startDateTT': createTypeTicketInput.startDateTT,
                'endDateTT': createTypeTicketInput.endDateTT,
                'eventID': createTypeTicketInput.eventID,
                '__typename': 'TypeTicket',
                'createdAt': new Date().toISOString(),
                'updatedAt': new Date().toISOString()

            }
        };

        await dynamoDb.put(params).promise();

        console.log("Type Ticket created successfully!");

    } catch (error) {

        console.log(error);

    }

    return createTypeTicketInput.id;

};

module.exports = { handler };