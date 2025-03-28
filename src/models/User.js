const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  verificationCode: { type: String, required: false },
  isVerified: { type: Boolean, default: false },
  name: { type: String },
  password: { type: String },
  role: {
    type: String,
    enum: ["user", "admin", "service_provider"],
    default: "user",
  },
  loginMethod: {
    type: String,
    enum: ["password", "google", "facebook"],
    default: "password",
  },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
},{ timestamps: true });
UserSchema.methods.generateAuthToken = function () { 
  return jwt.sign(
    { _id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
module.exports = mongoose.model("User", UserSchema);
