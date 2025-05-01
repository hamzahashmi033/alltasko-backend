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

        // 1. Verify lead is available
        const lead = await ServiceRequest.findOne({
            _id: serviceRequestId,
            isPurchased: false
        }).session(session);

        if (!lead) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'Lead not available or already purchased' });
        }

        // 2. Get provider details
        const provider = await ServiceProvider.findById(serviceProviderId).session(session);
        if (!provider) {
            await session.abortTransaction();
            return res.status(400).json({ error: 'Professional not found' });
        }

        // 3. Create customer in Stripe
        const customer = await stripe.customers.create({
            email: provider.email,
            name: provider.name,
            metadata: {
                providerId: provider._id.toString(),
                serviceRequestId: serviceRequestId.toString()
            }
        });

        // 4. Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 15 * 100,
            currency: 'usd',
            payment_method: paymentMethod, // Test token
            customer: customer.id, // Attach customer
            confirm: true,
            return_url: process.env.FRONTEND_URL + "/leads", // Your success page
            metadata: {
                serviceRequestId: serviceRequestId.toString(),
                serviceProviderId: serviceProviderId.toString()
            },
            description: `Lead purchase for ${lead.serviceType}`
        });

        // 5. Create invoice
        const invoice = await stripe.invoices.create({
            customer: customer.id, // Use customer.id not stripeCustomerId
            collection_method: 'charge_automatically',
            auto_advance: true,
            metadata: paymentIntent.metadata
        });

        await stripe.invoiceItems.create({
            customer: customer.id, // Use customer.id here
            invoice: invoice.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            description: `Lead purchase - ${lead.serviceType}`
        });

        const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

        // 6. Create payment record
        const payment = new Payment({
            serviceProvider: serviceProviderId,
            serviceRequest: serviceRequestId,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            paymentMethod: paymentMethod,
            stripePaymentIntentId: paymentIntent.id,
            stripeInvoiceId: finalizedInvoice.id,
            stripeInvoiceUrl: finalizedInvoice.hosted_invoice_url,
            stripeInvoicePdfUrl: finalizedInvoice.invoice_pdf,
            stripeCustomerId: customer.id // Store customer ID for future reference
        });

        await payment.save({ session });

        // 7. Update provider with stripeCustomerId if needed
        if (!provider.stripeCustomerId) {
            provider.stripeCustomerId = customer.id;
            await provider.save({ session });
        }

        // 8. Mark lead as purchased
        await ServiceRequest.findByIdAndUpdate(
            serviceRequestId,
            {
                isPurchased: true,
                purchasedBy: serviceProviderId,
                purchasePrice: paymentIntent.amount,
                purchaseDate: new Date(),
                status: 'assigned'
            },
            { session }
        );

        await session.commitTransaction();

        res.status(201).json({
            success: true,
            payment,
            invoice: finalizedInvoice,
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        await session.abortTransaction();
        console.error('Payment initiation error:', error);
        res.status(500).json({
            error: 'Payment processing failed',
            details: error.message
        });
    } finally {
        session.endSession();
    }
};
// Handle Stripe webhook events
exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'payment_intent.succeeded':
                await handlePaymentIntentSucceeded(event.data.object);
                break;
            case 'invoice.paid':
                await handleInvoicePaid(event.data.object);
                break;
            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object);
                break;
            case 'invoice.finalized':
                await handleInvoiceFinalized(event.data.object);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};

// Add this new handler function
async function handleInvoiceFinalized(invoice) {
    console.log('Invoice finalized:', invoice.id);
    
    // Update your database with the invoice status
    await Payment.findOneAndUpdate(
        { stripeInvoiceId: invoice.id },
        { 
            invoiceStatus: 'finalized',
            stripeInvoiceUrl: invoice.hosted_invoice_url,
            stripeInvoicePdfUrl: invoice.invoice_pdf
        }
    );
}

async function handlePaymentIntentSucceeded(paymentIntent) {
    // Update payment status if needed
    await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        { paymentStatus: 'completed' }
    );
}

async function handleInvoicePaid(invoice) {
    await Payment.findOneAndUpdate(
        { stripeInvoiceId: invoice.id },
        {
            stripeInvoiceStatus: invoice.status,
            paymentStatus: 'completed'
        }
    );
}

async function handleInvoicePaymentFailed(invoice) {
    await Payment.findOneAndUpdate(
        { stripeInvoiceId: invoice.id },
        {
            stripeInvoiceStatus: invoice.status,
            paymentStatus: 'failed'
        }
    );
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

