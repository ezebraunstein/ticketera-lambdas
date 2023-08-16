const axios = require('axios');

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
    const eventType = body.type;
    const eventData = body.data;

    switch (eventType) {
        case 'payment':

            const status = eventData.status;
            const paymentId = eventData.metadata.payment_id;

            switch (status) {

                case 'approved':
                    await axios.post('https://22uorwsuaswavypcnzkhemts2y0ymqsj.lambda-url.us-east-1.on.aws/',
                        {
                            paymentId: paymentId,
                            status: 'success',
                        });
                    break;

                case 'rejected':
                    await axios.post('https://22uorwsuaswavypcnzkhemts2y0ymqsj.lambda-url.us-east-1.on.aws/',
                        {
                            paymentId: paymentId,
                            status: 'failed',
                        });
                    break;

                case 'cancelled':
                    await axios.post('https://22uorwsuaswavypcnzkhemts2y0ymqsj.lambda-url.us-east-1.on.aws/',
                        {
                            paymentId: paymentId,
                            status: 'failed',
                        });
                    break;

                default:
                    console.log('Estado de pago desconocido:', status);
            }
            break;
    }

    return {
        statusCode: 200,
        body: "OK",
    };
};

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});