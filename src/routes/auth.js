const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Google Auth Route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
// Facebook Auth Route
router.get(
    "/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
);
// Google Auth Callback
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Generate JWT Token
        const token = jwt.sign(
            { _id: req.user._id, email: req.user.email, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Send token as cookie or JSON response
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/"); // Redirect to frontend/dashboard
    }
);
// Facebook Callback Route
router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: "/", // Redirect on success
        failureRedirect: "/login", // Redirect on failure
    }), (req, res) => {
        // Generate JWT Token
        const token = jwt.sign(
            { _id: req.user._id, email: req.user.email, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Send token as cookie or JSON response
        res.cookie("token", token, { httpOnly: true });
    }
);
// Logout Route
router.get("/logout", (req, res) => {
    req.logout(() => {
        res.clearCookie("token");
        res.redirect("/");
    });
});

module.exports = router;
