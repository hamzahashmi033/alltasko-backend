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
    city: { type: String, required: false },
    postalCode: { type: String, required: false },
    verificationCode: { type: String, required: false },
    isVerified: { type: Boolean, default: false },
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
    resaonOfHold: { type: String, default: null },
    onHold: { type: Boolean, default: false },
    reviews: [ReviewSchema] 
});


ServiceProviderSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, role: this.role }, 
    process.env.JWT_SECRET, 
    { expiresIn: "7d" } 
  );
};
const ServiceProvider = mongoose.model("ServiceProvider", ServiceProviderSchema);
module.exports = ServiceProvider;
