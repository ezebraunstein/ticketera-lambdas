const https = require('https');
const AWS = require('aws-sdk');
const urlParse = require('url').URL;
const region = 'us-east-1';
const appsyncUrl = 'https://hs4zf6bhbvfu3ky3wwwbx5pm2u.appsync-api.us-east-1.amazonaws.com/graphql';
const endpoint = new urlParse(appsyncUrl).hostname.toString();

const createRRPPEventMutation =
    `mutation CreateRRPPEvent($input: CreateRRPPEventInput!) {
        createRRPPEvent(input: $input) {
            id
            Event {
            id
            }
        }
    }`;

exports.handler = async (event) => {

    const req = new AWS.HttpRequest(appsyncUrl, region);

    const body = JSON.parse(event.body);
    const createRRPPEventInput = body.rrppEventInput;

    const item = {
        id: createRRPPEventInput.id,
        rrppID: createRRPPEventInput.rrppID,
        rRPPEventEventId: createRRPPEventInput.eventID,
    };

    const graphqlData = {
        query: createRRPPEventMutation,
        operationName: "CreateRRPPEvent",
        variables: {
            input: item
        }
    };

    req.method = 'POST';
    req.headers.host = endpoint;
    req.headers['Content-Type'] = 'application/json';
    req.body = JSON.stringify(graphqlData);

    if (process.env.API_KEY) {
        req.headers['x-api-key'] = process.env.API_KEY;
    } else {
        const signer = new AWS.Signers.V4(req, "appsync", true);
        signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
    }

    const data = await new Promise((resolve, reject) => {
        const httpRequest = https.request({ ...req, hostname: endpoint }, (result) => {
            result.on('data', (data) => {
                resolve(JSON.parse(data.toString()));
            });
        });

        httpRequest.write(req.body);
        httpRequest.end();
    });

    if (data.errors) {
        console.log('Failed to run query', JSON.stringify(data.errors, null, 2));
        throw new Error("Failed to run query");
    }

    // Query was successful
    return data.data.createRRPPEvent;
};
