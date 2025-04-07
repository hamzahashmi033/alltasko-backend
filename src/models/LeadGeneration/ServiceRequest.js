const mongoose = require("mongoose")

const BaseServiceSchema = new mongoose.Schema({
    serviceType: { type: String, required: true },
    serviceTypeSubCategory: { type: String, required: true },
    serviceTypeSubSubCategory: { type: String, required: true },
    status: { type: String, default: "pending", enum: ["pending", "assigned", "completed", "cancelled"] },
    photos: [{
        type: String,
        required: false
    }],
    serviceProvider: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ServiceProvider',
                required: false
            }
        ],
        default: []
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    customerDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        zipCode: { type: String, required: true },
        contactPreference: {
            type: String,
            enum: ["Call", "SMS", "WhatsApp", "Email"],
            required: true
        }
    },
    createdAt: { type: Date, default: Date.now }
}, {
    discriminatorKey: 'kind',
    timestamps: true
});

const ServiceRequest = mongoose.model('ServiceRequest', BaseServiceSchema);

// Handyman Service schema
const HandymanRequest = ServiceRequest.discriminator('HandymanRequest', new mongoose.Schema({
    jobType: { type: String, enum: ["New Installation", "Repair", "Not Sure"] },
    urgency: { type: String, enum: ["Immediate (Today/Tomorrow)", "Within 3 Days", "Within a Week", "Just Exploring"] },
    location: { type: String, enum: ["Apartment", "House", "Office", "Commercial Space"] },
    issueDescription: String,
    projectSize: { type: String, enum: ["Small (Less than 1 hour)", "Medium (1-3 hours)", "Large (More than 3 hours)"] },
    materialsNeeded: { type: String, enum: ["I have everything", "Need guidance", "Please bring all required materials"] },
}));
const MovingRequest = ServiceRequest.discriminator('MovingRequest',
    new mongoose.Schema({
        moveType: {
            type: String,
            enum: ["Household items", "Office equipment", "Just furniture", "Specialty items (piano, safe, etc.)", "Storage items"],
            required: true
        },
        urgency: {
            type: String,
            enum: ["Immediately (today/tomorrow)", "Within 3 days", "Planning ahead (1+ week)", "Just getting estimates"],
            required: true
        },
        itemsDescription: {
            type: String,
            required: true
        },
        specialRequirements: [{
            type: String,
            enum: ["Fragile items", "Disassembly/reassembly", "Packing materials", "Storage needed", "Heavy lifting (>100 lbs)"]
        }],
        accessInfo: [{
            type: String,
            enum: ["Stairs/no elevator", "Narrow hallways", "Limited parking", "High floor"]
        }],
        serviceAddOns: [{
            type: String,
            enum: ["Packing/unpacking", "Cleaning", "Junk removal", "Insurance coverage"]
        }],
    })
);
const CustomRequest = ServiceRequest.discriminator('CustomRequest', new mongoose.Schema({
    serviceNature: {
        type: String,
        enum: ["Consultation", "Repair", "Emergency", "Delivery", "Support", "Inquiry", "Other"],
        required: true
    },
    urgencyLevel: {
        type: String,
        enum: ["Emergency", "Within 24 hours", "This week", "Not urgent"],
        required: true
    },
    locationType: {
        type: String,
        enum: ["Home", "Office", "Public Place", "Remote/Online", "Other"],
        required: true
    },
    serviceTimePreference: {
        type: String,
        enum: ["Morning", "Afternoon", "Evening", "Weekend", "Anytime"],
        required: false
    },
    shortDescription: {
        type: String,
        required: true
    },
}));
const CleaningRequest = ServiceRequest.discriminator('CleaningRequest', new mongoose.Schema({
    cleaningType: {
        type: String,
        enum: ["Home Cleaning", "Office Cleaning", "Deep Cleaning", "Move-in/Move-out", "Post-Construction"],
        required: true
    },
    areaDescription: {
        type: String,
        required: true
    },
    hasSensitiveSurfaces: [{
        type: String,
        enum: [
            "Wooden flooring",
            "Marble or tiles",
            "Electronics or appliances",
            "Delicate furniture",
            "None"
        ]
    }],
    cleaningFrequency: {
        type: String,
        enum: ["One-time only", "Weekly", "Bi-weekly", "Monthly", "Not sure yet"],
        required: true
    },
    urgency: {
        type: String,
        enum: ["Today", "Within 3 Days", "This Week", "Just Planning"],
        required: true
    },
    hasPets: {
        type: String,
        enum: ["Yes", "No"]
    },
    cleaningConcerns: {
        type: String
    }
}));

module.exports = { ServiceRequest, HandymanRequest, MovingRequest, CustomRequest, CleaningRequest };
