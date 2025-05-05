const Payment = require('../models/payments');
const { ServiceRequest } = require('../models//LeadGeneration/ServiceRequest');
const ServiceProvider = require('../models/ServiceProvider');
const Stripe = require('stripe');
const mongoose = require('mongoose');

// Initialize payment for a lead purchase
exports.initiatePayment = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { serviceRequestId, paymentMethod } = req.body;
        const serviceProviderId = req.provider._id;

        // 1. Verify lead availability
        const lead = await ServiceRequest.findOne({
            _id: serviceRequestId,
            isPurchased: false
        }).session(session);

        if (!lead) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'Lead not available' });
        }

        // 2. Get provider (with Stripe customer)
        const provider = await ServiceProvider.findById(serviceProviderId).session(session);
        if (!provider) {
            await session.abortTransaction();
            return res.status(404).json({ error: 'Professional not found' });
        }

        // 3. Ensure provider has a Stripe customer ID
        if (!provider.stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: provider.email,
                name: provider.name,
                metadata: { providerId: provider._id.toString() }
            });
            provider.stripeCustomerId = customer.id;
            await provider.save({ session });
        }

        // 4. Create and confirm PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 15 * 100, // $15 in cents
            currency: 'usd',
            customer: provider.stripeCustomerId,
            payment_method: paymentMethod,
            confirm: true,
            metadata: {
                serviceRequestId: serviceRequestId.toString(),
                serviceProviderId: serviceProviderId.toString()
            },
            description: `Lead purchase for ${lead.serviceType}`,
        });

        // 5. Create minimal payment record (webhook will update later)
        const payment = new Payment({
            serviceProvider: serviceProviderId,
            serviceRequest: serviceRequestId,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            paymentMethod: paymentMethod,
            stripePaymentIntentId: paymentIntent.id,
            paymentStatus: 'pending', // Webhook will update to 'completed'
            stripeCustomerId: provider.stripeCustomerId
        });

        await payment.save({ session });
        await session.commitTransaction();

        res.status(201).json({
            success: true,
            clientSecret: paymentIntent.client_secret, // For frontend confirmation
            paymentId: payment._id
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Payment error:', error);
        res.status(500).json({
            error: error.message || 'Payment failed',
            details: error.type === 'StripeCardError' ? 'Card declined' : undefined
        });
    } finally {
        session.endSession();
    }
};
// Handle Stripe webhook events
exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    let event;

    try {
        event = Stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('❌ Webhook signature verification failed:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentSuccess(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await handlePaymentFailure(event.data.object);
                break;
            default:
                console.log(`🔔 Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('❌ Webhook processing error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};

// ===== Payment Success Handler =====
async function handlePaymentSuccess(paymentIntent) {
    console.log('💰 Payment succeeded:', paymentIntent.id);
    
    const updateData = {
        paymentStatus: 'completed',
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount, 
        currency: paymentIntent.currency,
        paymentMethod: paymentIntent.payment_method_types?.[0] || 'card',
        stripeInvoiceStatus: paymentIntent.invoice ? 'paid' : undefined,
    };

    await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        updateData,
        { new: true, upsert: false } // Don't create new record if not found
    );

}

// ===== Payment Failure Handler =====
async function handlePaymentFailure(paymentIntent) {
    console.log('❌ Payment failed:', paymentIntent.id);
    
    const updateData = {
        paymentStatus: 'failed',
        failureReason: paymentIntent.last_payment_error?.message || 'Payment failed',
        serviceStatus: 'pending', // Reset service status
    };

    await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        updateData,
        { new: true }
    );

    // Optional: Notify user to retry payment
}
// Get all payments for a provider
exports.getProviderPayments = async (req, res) => {
    try {
        const { status } = req.query;
        const query = { serviceProvider: req.provider._id };

        if (status) {
            query.paymentStatus = status;
        }

        const payments = await Payment.find(query)
            .populate('serviceRequest')
            .sort({ createdAt: -1 });

        res.json({ success: true, payments });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: 'Failed to fetch payments' });
    }
};

// Get a specific payment with invoice details
exports.getPaymentDetails = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('serviceProvider')
            .populate('serviceRequest');

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // Verify the requesting user has access
        if (
            !req.provider._id.equals(payment.serviceProvider._id)
        ) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // If Stripe invoice exists, fetch latest data
        let stripeInvoice = null;
        if (payment.stripeInvoiceId) {
            try {
                stripeInvoice = await stripe.invoices.retrieve(payment.stripeInvoiceId);
            } catch (error) {
                console.error('Error fetching Stripe invoice:', error);
            }
        }

        res.json({
            success: true,
            payment,
            stripeInvoice
        });
    } catch (error) {
        console.error('Error fetching payment details:', error);
        res.status(500).json({ error: 'Failed to fetch payment details' });
    }
};

// Download invoice PDF
exports.downloadInvoice = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        // Verify the requesting user has access
        if (
            !req.provider._id.equals(payment.serviceProvider) &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // If Stripe invoice exists, redirect to their PDF
        if (payment.stripeInvoicePdfUrl) {
            return res.redirect(payment.stripeInvoicePdfUrl);
        }

        // Otherwise generate our own PDF (implementation from previous example)
        const pdfBuffer = await generatePdfInvoice(payment._id);

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=invoice-${payment.invoiceDetails.invoiceNumber || payment._id}.pdf`
        );
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating invoice PDF:', error);
        res.status(500).json({ error: 'Failed to generate invoice' });
    }
};

