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
    filename: `${nameEvent}-${nameTT}.jpeg`,
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
<head></head>
<body>
  <h1>Tu código QR</h1>
  <p>Acá está tu código QR para el evento: ${nameEvent} y el ticket ${nameTT} ID: ${ticketId}:</p>
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



// const AWS = require('aws-sdk');
// const ses = new AWS.SES({ region: 'us-east-1' });

// exports.handler = async (event) => {
//   const body = JSON.parse(event.body);
//   const userEmail = body.userEmail;
//   const nameEvent = body.nameEvent;
//   const ticketId = body.ticketId;
//   const to = userEmail;
//   const attachments = body.attachments;
//   const nameTT = body.nameTT;

//   const boundary = '----boundary';

//   let attachmentsString = '';

//   for (const attachment of attachments) {
//     attachmentsString += `
// --${boundary}
// Content-Type: ${attachment.contentType}
// Content-Disposition: ${attachment.contentDisposition}; filename="${attachment.filename}"
// Content-Transfer-Encoding: base64

// ${attachment.content}
// `;
//   }

//   const rawMessage = `From: 'Melo Tickets' <ticketsmelo@gmail.com>
// To: ${to}
// Subject: Tus Tickets para ${nameEvent}
// Content-Type: multipart/mixed; boundary=${boundary}

// --${boundary}
// Content-Type: text/html; charset=utf-8

// <html>
// <head></head>
// <body>
//   <h1>Tu código QR</h1>
//   <p>Acá están tus códigos QR para el evento: ${nameEvent} y el ticket ${nameTT} ID: ${ticketId}:</p>
// </body>
// </html>

// ${attachmentsString}

// --${boundary}--`;

//   const params = {
//     RawMessage: {
//       Data: rawMessage,
//     },
//   };

//   try {
//     const response = await ses.sendRawEmail(params).promise();
//     console.log('Email sent:', response);
//   } catch (error) {
//     console.error('Failed to send email:', error);
//   }
// };


