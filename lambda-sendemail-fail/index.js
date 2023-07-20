const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const to = body.emailBuyer;
    const nameEvent = body.eventName;
    const boundary = '----boundary';

    const rawMessage = `From: 'Melo Tickets' <ticketsmelo@gmail.com>
To: ${to}
Subject: Error en tu pago para ${nameEvent}
Content-Type: multipart/mixed; boundary=${boundary}

--${boundary}
Content-Type: text/html; charset=utf-8

<html>
<head></head>
<body>
  <h1>No se ha podido procesar tu pago</h1>
  <p>Se generó un error al intentar procesar tu pago para el evento: ${nameEvent}</p>
</body>
</html>

--${boundary}--`;

    const params = {
        RawMessage: {
            Data: rawMessage,
        },
    };

    try {
        const response = await ses.sendRawEmail(params).promise();
        console.log('Email sent:', response);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
};