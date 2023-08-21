const axios = require('axios');

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const eventName = body.eventName;
    const to = body.emailBuyer;
    const htmlContent = `
<html>
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap');

        body {
        font-family: 'Poppins', sans-serif;
        text-align: center;
        background: linear-gradient(to right, lime, orange);
        color: #333;
        padding: 15px;
        }

        h1, p {
        margin: 0;
        padding: 10px 0;
        }
    </style>
</head>
<body>
  <h1>No se ha podido procesar tu pago</h1>
  <p>Se generó un error al intentar procesar tu pago para ${eventName}</p>
</body>
</html>
`;

    const sparkpostPayload = {
        content: {
            from: 'Melo@mail.melo.events',
            subject: `Error en tu pago para ${eventName}`,
            html: htmlContent
        },
        recipients: [
            {
                address: to
            }
        ]
    };

    const SPARKPOST_API_URL = "https://api.sparkpost.com/api/v1/transmissions";
    const SPARKPOST_API_KEY = process.env.SPARKPOST_API_KEY;

    try {
        await axios.post(SPARKPOST_API_URL, sparkpostPayload, {
            headers: {
                'Authorization': SPARKPOST_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Email sent successfully" }),
        };
    } catch (error) {
        console.error('Failed to send email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Email sending failed" }),
        };
    }
};