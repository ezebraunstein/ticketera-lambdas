const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const nameEvent = body.eventName;
  const ticketId = body.ticketId;
  const to = body.emailBuyer;
  const base64QRCode = body.base64QRCode;
  const nameTT = body.nameTT;

  const attachment = {
    filename: `${nameEvent}_${nameTT}.jpeg`,
    content: base64QRCode.split('base64,')[1],
    contentType: 'image/jpeg',
    contentDisposition: 'attachment',
  };

  const boundary = '----boundary';

  const rawMessage = `From: 'Melo Tickets' <ticketsmelo@gmail.com>
To: ${to}
Subject: Tus Tickets para ${nameEvent}
Content-Type: multipart/mixed; boundary=${boundary}

--${boundary}
Content-Type: text/html; charset=utf-8

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
  <h1>Tu código QR</h1>
  <p>Acá está tu código QR ${nameTT} para ${nameEvent}: </p>
</body>
</html>


--${boundary}
Content-Type: ${attachment.contentType}
Content-Disposition: ${attachment.contentDisposition}; filename="${attachment.filename}"
Content-Transfer-Encoding: base64

${attachment.content}

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

