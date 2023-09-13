const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY);

exports.handler = async (event) => {
  const { line_items, success_url, cancel_url, email, payment_id, event_id, expires_at, locale } = JSON.parse(event.body);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items,
      success_url,
      cancel_url,
      expires_at,
      metadata: {
        payment_id,
        event_id,
      },
      locale,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};


