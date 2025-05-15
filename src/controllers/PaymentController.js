const Payment = require('../models/payments');
const { ServiceRequest } = require('../models//LeadGeneration/ServiceRequest');
const ServiceProvider = require('../models/ServiceProvider');
const Stripe = require('stripe');
const mongoose = require('mongoose');
const frontURL = process.env.ENV === "production" ? process.env.FRONTEND_URL : process.env.DEV_FRONTEND_URL
// Initialize payment for a lead purchase
exports.initiatePayment = async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { serviceRequestId } = req.body;
        const serviceProviderId = req.provider._id;

        // Validate inputs
        if (!serviceRequestId || !serviceProviderId) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Verify lead availability
        const lead = await ServiceRequest.findOne({
            _id: serviceRequestId,
            isPurchased: false
        }).session(session);

        if (!lead) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'Lead not available or already purchased' });
        }

        // 2. Get provider
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
                phone: provider.phone,
                metadata: {
                    providerId: provider._id.toString(),
                    accountType: 'service-provider'
                }
            });
            provider.stripeCustomerId = customer.id;
            await provider.save({ session });
        }

        // 4. Create Checkout Session with enhanced metadata
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Lead purchase: ${lead.serviceType}`,
                        description: `Lead ID: ${lead._id.toString()}`
                    },
                    unit_amount: 15 * 100, // $15 in cents
                },
                quantity: 1,
            }],
            mode: 'payment',
            customer: provider.stripeCustomerId,
            success_url: `${frontURL}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontURL}/payments/canceled?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {
                serviceRequestId: serviceRequestId.toString(),
                serviceProviderId: serviceProviderId.toString(),
                leadType: lead.serviceType,
                purchaseType: 'lead'
            },
            payment_intent_data: {
                metadata: {
                    serviceRequestId: serviceRequestId.toString(),
                    serviceProviderId: serviceProviderId.toString()
                }
            },
            expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes from now
            allow_promotion_codes: true
        });

        // 5. Create payment record
        const payment = new Payment({
            serviceProvider: serviceProviderId,
            serviceRequest: serviceRequestId,
            amount: 1500,
            currency: 'usd',
            stripeCheckoutSessionId: checkoutSession.id,
            paymentStatus: 'pending',
            stripeCustomerId: provider.stripeCustomerId,
            paymentMethod: 'card',

        });

        await payment.save({ session });
        await session.commitTransaction();

        res.status(201).json({
            success: true,
            sessionId: checkoutSession.id,
            paymentId: payment._id,
            url: checkoutSession.url
        });

    } catch (error) {
        await session.abortTransaction();

        console.error('Payment initiation error:', {
            error: error.message,
            stack: error.stack,
            type: error.type,
            timestamp: new Date().toISOString()
        });

        // Handle specific Stripe errors
        if (error.type === 'StripeInvalidRequestError') {
            return res.status(400).json({
                error: 'Payment configuration issue',
                details: 'Please contact support',
                code: 'STRIPE_CONFIG_ERROR'
            });
        }

        res.status(500).json({
            error: 'Payment processing failed',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
            code: 'PAYMENT_PROCESSING_ERROR'
        });
    } finally {
        session.endSession();
    }
};
// Handle Stripe webhook events
exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Initialize Stripe

    let event;
    let rawBody = req.body;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
        console.log(`✅ Webhook verified: ${event.type}`);
    } catch (err) {
        console.error('❌ Webhook verification failed:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const checkoutSession = event.data.object;

                if (checkoutSession.payment_status !== 'paid') {
                    throw new Error(`Session not paid: ${checkoutSession.id}`);
                }

                // Get payment details directly from session
                const amountPaid = checkoutSession.amount_total; // in cents

                // 1. Update payment record
                const updatedPayment = await Payment.findOneAndUpdate(
                    { stripeCheckoutSessionId: checkoutSession.id },
                    {
                        paymentStatus: 'completed',
                        completedAt: new Date(),
                        amount: amountPaid,
                        'invoiceDetails.paidAt': new Date(),
                        'invoiceDetails.total': amountPaid,
                        'stripeInvoiceStatus': 'paid',
                        $push: {
                            'invoiceDetails.items': {
                                description: `Lead purchase for ${checkoutSession.metadata.serviceRequestId}`,
                                amount: amountPaid,
                                quantity: 1
                            }
                        }
                    },
                    { session, new: true }
                );

                if (!updatedPayment) {
                    throw new Error('Payment record not found');
                }

                // 2. Update lead record only (no provider updates)
                const updatedLead = await ServiceRequest.findByIdAndUpdate(
                    checkoutSession.metadata.serviceRequestId,
                    {
                        $set: {
                            isPurchased: true,
                            purchasedBy: checkoutSession.metadata.serviceProviderId,
                            purchasedPrice: amountPaid / 100,
                            purchasedDate: new Date(),
                            status: 'assigned'
                        }
                        // Removed $addToSet for serviceProvider since we're not updating provider
                    },
                    { session, new: true }
                );

                if (!updatedLead) {
                    throw new Error('Lead not found');
                }

                console.log('🔄 Updated records:', {
                    paymentId: updatedPayment._id,
                    leadId: updatedLead._id
                });
                break;
        }

        await session.commitTransaction();
        res.json({ received: true });
    } catch (err) {
        await session.abortTransaction();

        res.status(500).json({
            error: 'Webhook processing failed',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    } finally {
        session.endSession();
    }
};

// Get all payments for a provider
exports.getProviderPayments = async (req, res) => {
    try {
        const { status } = req.query;
        const query = { serviceProvider: req.provider._id };
        const serviceProvider = req.provider._id;
        const result = await Payment.find({ serviceProvider }).populate("serviceRequest")
        if (!result) {
            res.status(404).json({ error: 'Purchased lead history is not available' });
        }


        res.json({ success: true, result });
    } catch (error) {
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
                stripeInvoice = await Stripe.invoices.retrieve(payment.stripeInvoiceId);
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

