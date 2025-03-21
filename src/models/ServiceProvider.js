const mongoose = require("mongoose");
const ServiceProviderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactInfo: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    selectedCategories: [
        {
            category: { type: String, required: true },
            subcategories: [
                {
                    subcategory: { type: String, required: true },
                    subSubcategories: [{ type: String, required: true }],
                },
            ],
        },
    ],
    verificationDocument: { type: String, default: null },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reasonOfRejection: {
        type: String, default: null
    },
    accountStatus: { type: String, enum: ["working", "on_hold"] },
    resaonOfHold: { type: String, default: null }
});



const ServiceProvider = mongoose.model("ServiceProvider", ServiceProviderSchema);
module.exports = ServiceProvider;
