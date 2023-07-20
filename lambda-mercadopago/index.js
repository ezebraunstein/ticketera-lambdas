const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.REACT_APP_MP_ACESS_TOKEN,
})

exports.handler = async (event) => {

  const { name, surname, email, dni, cart, eventData, path, paymentId } = JSON.parse(event.body);

  const nameEvent = eventData.nameEvent;

  const preference = {

    binary_mode: true,

    items: [
      ...cart.map((item) => ({

        title: `Tus entradas para ${nameEvent}`,
        description: `Tus entradas para ${nameEvent}`,
        picture_url: `https://static.vecteezy.com/system/resources/previews/014/275/554/non_2x/kiwi-kiwi-symbol-kiwi-on-white-background-logo-design-free-vector.jpg`,
        quantity: item.selectedQuantity,
        currency_id: "ARS",
        unit_price: (item.priceTT) * 1.15,
      }))
    ],

    payer: {
      name,
      surname,
      email,
      identification: {
        type: "DNI",
        number: dni,
      },
    },

    back_urls: {
      success: `http://localhost:3000${path}?status=success`,
      failure: `http://localhost:3000${path}?status=failure`,
      pending: `http://localhost:3000${path}?status=pending`,
    },

    auto_return: "approved",

    notification_url: "https://gclw4przbk65n5hp3mofzaxvre0bhgra.lambda-url.us-east-1.on.aws/",

    metadata: {
      payment_id: paymentId,
    },

  };

  try {
    const response = await mercadopago.preferences.create(preference);
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: response.body.id,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
      }),
    };
  }
};




