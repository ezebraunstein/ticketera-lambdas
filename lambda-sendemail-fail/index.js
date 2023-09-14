const axios = require('axios');

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const eventName = body.eventName;
    const to = body.emailBuyer;
    const htmlContent = `
    <html>

    <head>
      <meta name="color-scheme" content="light">
      <meta name="supported-color-schemes" content="light">
    
      
        <style type="text/css">
            .ExternalClass,
            .ExternalClass div,
            .ExternalClass font,
            .ExternalClass p,
            .ExternalClass span,
            .ExternalClass td,
            img {
                line-height: 100%;
            }
    
            #outlook a {
                padding: 0;
            }
    
            .ExternalClass,
            .ReadMsgBody {
                width: 100%;
            }
    
            a,
            blockquote,
            body,
            li,
            p,
            table,
            td {
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
    
            table,
            td {
                mso-table-lspace: 0;
                mso-table-rspace: 0;
            }
    
            img {
                -ms-interpolation-mode: bicubic;
                border: 0;
                height: auto;
                outline: 0;
                text-decoration: none;
            }
    
            table {
                border-collapse: collapse !important;
            }
    
            #bodyCell,
            #bodyTable,
            body {
                height: 100% !important;
                margin: 0;
                padding: 0;
                font-family: ProximaNova, sans-serif;
            }
    
            #bodyCell {
                padding: 20px;
            }
    
            #bodyTable {
                width: 600px;
                background-color: #272727;
                border-radius: 10px;
            }
    
            @font-face {
                font-family: ProximaNova;
                src: url(https://cdn.auth0.com/fonts/proxima-nova/proximanova-regular-webfont-webfont.eot);
                src: url(https://cdn.auth0.com/fonts/proxima-nova/proximanova-regular-webfont-webfont.eot?#iefix) format("embedded-opentype"), url(https://cdn.auth0.com/fonts/proxima-nova/proximanova-regular-webfont-webfont.woff) format("woff");
                font-weight: 400;
                font-style: normal;
            }
    
            @font-face {
                font-family: ProximaNova;
                src: url(https://cdn.auth0.com/fonts/proxima-nova/proximanova-semibold-webfont-webfont.eot);
                src: url(https://cdn.auth0.com/fonts/proxima-nova/proximanova-semibold-webfont-webfont.eot?#iefix) format("embedded-opentype"), url(https://cdn.auth0.com/fonts/proxima-nova/proximanova-semibold-webfont-webfont.woff) format("woff");
                font-weight: 600;
                font-style: normal;
            }
    
            @media only screen and (max-width: 480px) {
                #bodyTable,
                body {
                    width: 100% !important;
                }
    
                a,
                blockquote,
                body,
                li,
                p,
                table,
                td {
                    -webkit-text-size-adjust: none !important;
                }
    
                body {
                    min-width: 100% !important;
                }
    
                #bodyTable {
                    max-width: 600px !important;
                }
    
                #signIn {
                    max-width: 280px !important;
                }
            }
    
            body, p, h1, h2, h3, strong {
                color: white;
            }
            a {
                color: #E4FF1A;
            }
        </style>
    </head>
    
    <body>
        <center>
            <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
                <tr>
                    <td align="center" valign="top" id="bodyCell">
                        <div class="main">
                            <p style="text-align: center; margin-bottom: 30px;">
                                <img src="https://www.melo.events/static/media/MeloLogo.0e8e41095e2054ab0721.png" width="300" alt="Your logo goes here" />
                            </p>
                            <br />
                            <h1>No se ha podido procesar tu pago</h1>
                            <br />
                            <h2>Se generó un error al intentar procesar tu pago para ${eventName}</h2>
                            <br />
                            <h3>Por favor intentá realizar la compra nuevamente</h3>
                            <br />
                        </div>
                    </td>
                </tr>
            </table>
        </center>
    </body>
    
    </html>
`;

    const sparkpostPayload = {
        content: {
            from: 'Melo<soporte@mail.melo.events>',
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