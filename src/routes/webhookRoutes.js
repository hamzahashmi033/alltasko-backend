const express = require('express')
const router = express.Router()
const paymentController = require("../controllers/PaymentController")

router.post("/webhooks",
    express.raw({ type: "application/json" }), // Crucial for signature verification
    paymentController.handleWebhook
);

module.exports = router