const mongoose = require("mongoose")

const BaseServiceSchema = new mongoose.Schema({
    serviceType: { type: String, required: true },
    serviceTypeSubCategory: { type: String, required: true },
    serviceTypeSubSubCategory: { type: String, required: true },
    status: { type: String, default: "pending", enum: ["pending", "assigned", "completed", "cancelled"] },
    isPurchased: {
        type: Boolean,
        default: false
    },
    purchasedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceProvider",
        default: null
    },
    purchasedPrice: {
        type: Number,
        default: 0
    },
    purchasedDate: {
        type: Date
    },
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
        phoneNo: { type: String, required: true },
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

const PlumbingRequest = ServiceRequest.discriminator("PlumbingRequest", new mongoose.Schema({
    plumbingWorkType: {
        type: [String],
        enum: [
            "Faucet installation or replacement",
            "Toilet installation or repair",
            "Sink installation or repair",
            "Shower or bathtub plumbing",
            "Drain unclogging",
            "Leak detection or pipe repair",
            "Garbage disposal install or repair",
            "Water line for fridge or dishwasher",
            "Other"
        ],
        required: true
    },
    fixturesCount: {
        type: String,
        enum: [
            "1",
            "2",
            "3–5",
            "6–10",
            "More than 10"
        ],
        required: true
    },
    installationType: {
        type: String,
        enum: [
            "New installation",
            "Replacement of old fixture",
            "Repair of existing plumbing",
            "Not sure"
        ],
        required: true
    },
    waterShutoffStatus: {
        type: String,
        enum: [
            "Yes",
            "No",
            "Not sure"
        ],
        required: true
    },
    additionalWorkNeeded: {
        type: String,
        enum: [
            "Yes",
            "No",
            "Not sure"
        ],
        required: true
    },
    additionalNotes: {
        type: String,
        required: false
    }
}));
// Handyman Service schema
const HandymanRequest = ServiceRequest.discriminator('HandymanRequest', new mongoose.Schema({
    jobType: { type: String, enum: ["New Installation", "Repair", "Not Sure"] },
    urgency: { type: String, enum: ["Immediate (Today/Tomorrow)", "Within 3 Days", "Within a Week", "Just Exploring"] },
    location: { type: String, enum: ["Apartment", "House", "Office", "Commercial Space"] },
    issueDescription: String,
    projectSize: { type: String, enum: ["Small (Less than 1 hour)", "Medium (1-3 hours)", "Large (More than 3 hours)"] },
    materialsNeeded: { type: String, enum: ["I have everything", "Need guidance on what to buy", "Please bring all required materials"] },
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

const YardworkRequest = ServiceRequest.discriminator('YardworkRequest', new mongoose.Schema({
    generalTaskType: {
        type: String,
        enum: [
            "General maintenance",
            "Seasonal cleanup",
            "New installation or project",
            "Pest or hazard control",
            "Snow or ice removal",
            "Other"
        ],
        required: true
    },
    propertyType: {
        type: String,
        enum: ["Residential", "Commercial", "Industrial", "Other"],
        required: true
    },
    yardSize: {
        type: String,
        enum: ["Small", "Medium", "Large", "Not sure"],
        required: true
    },
    accessRestrictions: {
        type: String,
        enum: ["None", "Gated access", "Pet on property", "Other"],
        required: false
    },
    urgency: {
        type: String,
        enum: ["Emergency", "This week", "This month", "Just planning"],
        required: true
    },
    recurringNeed: {
        type: String,
        enum: ["One-time", "Recurring", "Not sure"],
        required: true
    },
    additionalDetails: {
        type: String,
        required: false
    }
}));
const CabinetCountertopRequest = ServiceRequest.discriminator('CabinetCountertopRequest', new mongoose.Schema({
    serviceType: {
        type: String,
        enum: [
            "New installation",
            "Replacement",
            "Refinishing or resurfacing",
            "Repair",
            "Custom or specialty work",
            "Commercial installation"
        ],
        required: true
    },
    serviceLocation: {
        type: String,
        enum: [
            "Kitchen",
            "Bathroom",
            "Office or Retail Space",
            "Pantry",
            "Office or retail space",
            "Restaurant or bar",
            "Medical or laboratory",
            "other"
        ],
        required: true
    },
    serviceFocus: {
        type: String,
        enum: ["Cabinets", "Countertops", "Both"],
        required: true
    },
    preferredMaterial: {
        type: String,
        enum: [
            "Wood",
            "Laminate",
            "Quartz",
            "Granite",
            "Marble",
            "Butcher block",
            "Not sure yet"
        ],
        required: false
    },
    propertyType: {
        type: String,
        enum: ["Residential", "Commercial", "Other"],
        required: true
    },
    urgency: {
        type: String,
        enum: ["Immediately", "Within a week", "Within a month", "Just exploring"],
        required: true
    },
    additionalDetails: {
        type: String,
        required: false
    }
}));



module.exports = { ServiceRequest, PlumbingRequest, HandymanRequest, MovingRequest, CustomRequest, CleaningRequest, YardworkRequest };
