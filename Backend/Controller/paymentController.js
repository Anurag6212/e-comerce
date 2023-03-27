const asyncFn = require("../Middleware/asyncErros");
const ApiFeatues = require("../utils/apiFeatures");
const ErrorHandler = require("../utils/errorHandler");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const processPayment = asyncFn(async (req, res) => {
  const payment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metaData: {
      company: "E-COMMERCE",
    },
  });
  res.status(200).json({
    success: true,
    client_secret: payment.client_secret,
  });
});

const sendStripeApiKey = asyncFn(async (req, res) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
});

module.exports = {
  processPayment,
  sendStripeApiKey,
};
