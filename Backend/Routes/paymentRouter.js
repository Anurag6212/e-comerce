const express = require("express");
const {
  processPayment,
  sendStripeApiKey,
} = require("../Controller/paymentController");
const router = express.Router();
const { auth, authorizeRole } = require("../Middleware/auth");

router.route("/payment/process").post(auth, processPayment);

router.route("/payment/process").get(auth, sendStripeApiKey);

module.exports = router;
