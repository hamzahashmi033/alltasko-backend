const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const ReviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const ServiceProviderSchema = new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    about: { type: String, default: null },
    password: { type: String, required: false },
    contactInfo: { type: String, required: false },
    country: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false },
    postalCode: { type: String, required: false },
    verificationCode: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
    profilePicture: { type: String, default: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3DlfHx8fGVufDB8fHx8fA%3D%3D" },
    selectedCategories: [
        {
            category: { type: String, required: true },
            serviceRadius: { type: Number, required: true },
            postalCode: { type: String, required: true },
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
    reasonOfRejection: { type: String, default: null },
    accountStatus: { type: String, enum: ["working", "on_hold"], default: "working" },
    resaonOfHold: { type: String, default: null },
    onHold: { type: Boolean, default: false },
    reviews: [ReviewSchema],
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
});

ServiceProviderSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email, role: this.role },
        process.env.PROVIDER_JWT_SECRET,
        { expiresIn: "7d" }
    );
};
const ServiceProvider = mongoose.model("ServiceProvider", ServiceProviderSchema);
module.exports = ServiceProvider;
