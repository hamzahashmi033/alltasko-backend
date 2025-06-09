const express = require('express')
const router = express.Router()
const paymentController = require("../controllers/PaymentController")
const { verifyToken, verifyProviderToken } = require("../middlewares/verifyTokens.js");

router.post("/initiate", verifyProviderToken, paymentController.initiatePayment)


// Get all provider payments
router.get('/', verifyProviderToken, paymentController.getProviderPayments);

// Get payment details
router.get('/:id', verifyProviderToken, paymentController.getPaymentDetails);

// Download invoice
router.get('/:id/download', verifyProviderToken, paymentController.downloadInvoice);


router.post('/initiate-professional-plus', verifyProviderToken, paymentController.initiateProfessionalPlusPayment)
module.exports = router;