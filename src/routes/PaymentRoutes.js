const express = require('express')
const router = express.Router()
const paymentController = require("../controllers/PaymentController")
const { verifyToken, verifyProviderToken } = require("../middlewares/verifyTokens.js");

router.post("/initiate",paymentController.initiatePayment)


// Get all provider payments
router.get('/', verifyProviderToken, paymentController.getProviderPayments);

// Get payment details
router.get('/:id', verifyProviderToken, paymentController.getPaymentDetails);

// Download invoice
router.get('/:id/download', verifyProviderToken, paymentController.downloadInvoice);

module.exports = router;