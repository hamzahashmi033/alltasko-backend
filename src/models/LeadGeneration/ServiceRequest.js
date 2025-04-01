const mongoose = require("mongoose")

const BaseServiceSchema = new mongoose.Schema({
    serviceType: { type: String, required: true },
    serviceTypeSubCategory: { type: String, required: true },
    serviceTypeSubSubCategory: { type: String, required: true },
    status: { type: String, default: "pending", enum: ["pending", "assigned", "completed", "cancelled"] },
    description: {
        type: String,
        required: false,
        maxlength: 500
    },
    photos: [{
        type: String,
        required: false
    }],
    serviceProvider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceProvider',
        required: false,
        default: null
    },
    customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true },
        address: { type: String, required: true },
        zipCode: { type: String, required: true },
        contactPreference: { type: String, enum: ["Call", "SMS", "WhatsApp", "Email"], required: true }
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
    urgency: { type: String, enum: ["Immediate", "Within 3 Days", "Within a Week", "Just Exploring"] },
    location: { type: String, enum: ["Apartment", "House", "Office", "Commercial Space"] },
    issueDescription: String,
    projectSize: { type: String, enum: ["Small", "Medium", "Large"] },
    materialsNeeded: { type: String, enum: ["I have everything", "Need guidance", "Please bring all"] },
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

module.exports = { ServiceRequest, HandymanRequest, MovingRequest };
