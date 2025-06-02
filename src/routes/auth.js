const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const router = express.Router();


const frontURL = process.env.FRONTEND_URL
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
        const isProduction = false;
        res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            domain: isProduction ? '.alltasko.com' : undefined, // Only set domain in production
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        }).redirect(frontURL);
    }
);
// Facebook Callback Route

// router.get(
//     "/facebook/callback",
//     passport.authenticate("facebook", {
//         successRedirect: process.env.FRONTEND_URL, // Redirect on success
//         failureRedirect: `${process.env.FRONTEND_URL}/login`, // Redirect on failure
//     }),
//     (req, res) => {
//         try {
//             // Generate JWT Token
//             const token = jwt.sign(
//                 { _id: req.user._id, email: req.user.email, role: req.user.role },
//                 process.env.JWT_SECRET,
//                 { expiresIn: "7d" }
//             );

//             // Send token as cookie or JSON response
//             const isProduction = process.env.NODE_ENV === 'production';
//             res.cookie("token", token, {
//                 httpOnly: true,
//                 secure: isProduction,
//                 sameSite: isProduction ? 'None' : 'Lax',
//                 domain: isProduction ? '.alltasko.com' : undefined, // Only set domain in production
//                 path: '/',
//                 maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//             })
//                 .redirect("/"); // Make sure to redirect to home after success
//         } catch (error) {
//             console.error("Error generating JWT token:", error);
//             res.redirect("/login"); // Send user to login in case of failure
//         }
//     }
// );

// Logout Route
router.get("/logout", (req, res) => {
    const isProduction = false;

    req.logout(() => {
        res.clearCookie('token', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'None' : 'Lax',
            domain: isProduction ? '.alltasko.com' : undefined,
            path: '/'
        });

        res.redirect("/");
    });
});


module.exports = router;
