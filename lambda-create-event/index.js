// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const AWS = require('aws-sdk');

AWS.config.update({
    region: "us-east-1",
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

// const s3Client = new S3Client({
//     region: "sa-east-1",
//     credentials: {
//         accessKeyId: process.env.ACCESS_KEY,
//         secretAccessKey: process.env.SECRET_ACCESS_KEY,
//     }
// });

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const handler = async (event) => {

    const body = JSON.parse(event.body);
    const createEventInput = body.createEventInput;

    try {

        const params = {
            TableName: 'Event-zn4tkt5eivea5af5egpjlychcm-dev',
            Item: {
                'id': createEventInput.id,
                'nameEvent': createEventInput.nameEvent,
                'locationEvent': createEventInput.locationEvent,
                'descriptionEvent': createEventInput.descriptionEvent,
                'bannerEvent': createEventInput.bannerEvent,
                'miniBannerEvent': createEventInput.miniBannerEvent,
                'startDateE': createEventInput.startDateE,
                'upDateE': createEventInput.upDateE,
                'downDateE': createEventInput.downDateE,
                'nameLocationEvent': createEventInput.nameLocationEvent,
                'userID': createEventInput.userID,
                '__typename': 'Event',
                'createdAt': new Date().toISOString(),
                'updatedAt': new Date().toISOString()

            }
        };

        await dynamoDb.put(params).promise();

        console.log("Event created successfully!");

    } catch (error) {

        console.log(error);

    }

    return createEventInput.id;

};

module.exports = { handler };