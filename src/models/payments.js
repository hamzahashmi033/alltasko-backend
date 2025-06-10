const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
    // Basic payment info
    serviceProvider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceProvider",
        required: true
    },
    serviceRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceRequest",
        unique: false
    },
    stripeCheckoutSessionId: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "usd",
        required: true
    },

    // Payment processing info
    paymentMethod: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "completed", "failed", "refunded", "partially_refunded"],
        default: "pending"
    },

    // Stripe-specific fields
    stripePaymentIntentId: String,
    stripeInvoiceId: String,
    stripeInvoiceUrl: String,
    stripeInvoicePdfUrl: String,
    stripeInvoiceNumber: String,
    stripeInvoiceStatus: {
        type: String,
        enum: ["draft", "open", "paid", "void", "uncollectible"]
    },
    stripeInvoiceMetadata: mongoose.Schema.Types.Mixed,

    // Invoice details
    invoiceDetails: {
        invoiceNumber: String,
        date: Date,
        dueDate: Date,
        items: [{
            description: String,
            amount: Number,
            quantity: {
                type: Number,
                default: 1
            },
            taxRates: [{
                name: String,
                percentage: Number
            }]
        }],
        subtotal: Number,
        taxAmount: Number,
        discountAmount: Number,
        total: Number,
        notes: String,
        terms: String,
        stripeCustomerId: String
    },

    // Refund information
    refunds: [{
        amount: Number,
        reason: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
        stripeRefundId: String,
        status: String
    }],

    // Service tracking
    serviceStatus: {
        type: String,
        enum: ["pending", "in_progress", "completed", "cancelled"],
        default: "pending"
    },
    paymentType: {
        type: String,
    },
    // Timestamps
    purchasedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: Date,
    cancelledAt: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for efficient querying
PaymentSchema.index({ serviceProvider: 1, serviceStatus: 1 });
PaymentSchema.index({ stripePaymentIntentId: 1 });
PaymentSchema.index({ stripeInvoiceId: 1 });
PaymentSchema.index({ "invoiceDetails.invoiceNumber": 1 });

// Virtual for formatted amount
PaymentSchema.virtual("formattedAmount").get(function () {
    return `${this.currency.toUpperCase()} ${(this.amount / 100).toFixed(2)}`;
});

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;