const Stripe = require('stripe');
const axios = require('axios');
const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY);


const endpointSecret = process.env.STRIPE_TEST_WEBHOOK_SECRET;

exports.handler = async (event) => {

  const sig = event.headers['stripe-signature'];
  const body = event.body;

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  const paymentId = stripeEvent.data.object.metadata.payment_id;

  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      await axios.post('https://22uorwsuaswavypcnzkhemts2y0ymqsj.lambda-url.us-east-1.on.aws/',
        {
          paymentId: paymentId,
          status: 'completed',
        });
      break;
    case 'checkout.session.expired':
      await axios.post('https://22uorwsuaswavypcnzkhemts2y0ymqsj.lambda-url.us-east-1.on.aws/',
        {
          paymentId: paymentId,
          status: 'expired',
        });
      break;
    default:
      console.log(`Unhandled event type ${stripeEvent.type}`);
  }

  return {
    statusCode: 200,
    body: `OK PaymentID: ${paymentId}`,
  };
};



