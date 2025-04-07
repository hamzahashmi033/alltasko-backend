const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User"); // Your User model


passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/facebook/callback",
            profileFields: ["id", "displayName", "emails", "picture.type(large)"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("Facebook Profile: ", profile); // Add this to see the profile details

                const email = profile.emails ? profile.emails[0].value : null;
                const name = profile.displayName;
                const facebookId = profile.id;

                let user = await User.findOne({ email });

                if (!user) {
                    user = new User({
                        email,
                        name,
                        role: "user",
                        isVerified: true,
                        loginMethod: "facebook",
                    });
                    await user.save();
                } else if (user.loginMethod !== "facebook") {
                    return done(null, false, { message: "This email is already registered with a different method." });
                }

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
