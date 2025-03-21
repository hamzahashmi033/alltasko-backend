const User = require("../models/User");
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt");
const crypto = require("crypto")
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});


// Handler: To send Verification code to user 
const sendVerificationEmail = async (email, verificationCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${verificationCode}`,
  };

  await transporter.sendMail(mailOptions);
};

// Route to send verification code to user
exports.sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const verificationCode = crypto.randomInt(100000, 999999).toString();


    let user = await User.findOne({ email });
    if (user) {
      user.verificationCode = verificationCode;
    } else {
      user = new User({ email, verificationCode });
    }

    await user.save();
    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    res.status(500).json({ error: "Error sending verification code", message: error.message });
  }
};
// Route to verify the verification code
exports.verifyCodeAndRegister = async (req, res) => {
  try {
    const { email, verificationCode, name, password } = req.body;
    if (!email || !verificationCode || !name || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ error: "Invalid verification code" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    user.name = name;
    user.password = hashedPassword;
    user.isVerified = true;
    user.verificationCode = null;

    await user.save();

    const token = user.generateAuthToken()
    res
      .cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json({ message: "User registered successfully", token });

  } catch (error) {
    res.status(500).json({ error: "Error verifying code", message: error.message });
  }
};
exports.adminAccountCreation = async (req, res) => {
  try {
    const { email, verificationCode, name, password } = req.body;
    if (!email || !verificationCode || !name || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ error: "Invalid verification code" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    user.name = name;
    user.password = hashedPassword;
    user.isVerified = true;
    user.role = "admin";
    user.verificationCode = null;

    await user.save();

    const token = user.generateAuthToken()
    res
      .cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .status(200)
      .json({ message: "User registered successfully", token });

  } catch (error) {
    res.status(500).json({ error: "Error verifying code", message: error.message });
  }
}
// Route to login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = user.generateAuthToken();
    res.cookie("token", token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in", message: error.message });
  }
};
// Route to delete an user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.clearCookie("token"); // Clear the token cookie
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
};
// Route to change password of an user
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ error: "Both old and new password are required" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error changing password", message: error.message });
  }
};

// Route to get User Details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user details" });
  }
};
// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};
