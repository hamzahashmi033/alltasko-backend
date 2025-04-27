const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session")
const passport = require("passport")
const FormConfiguration = require("./models/LeadGeneration/LeadFormConfiguration")
const webhooksRoutes = require("./routes/webhookRoutes")
require("dotenv").config();
require("./config/google");
require("./config/facebook")
const app = express();
const allowedOrigins = [
   "http://localhost:3000",
   "https://alltasko.technovativelab.com",
   "https://alltasko.com"
];
// Middleware
app.use(cors({
   origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
         callback(null, true); // Allow the request
      } else {
         callback(new Error("Not allowed by CORS"));
      }
   },
   credentials: true,  // Allow sending cookies (sessions)
   methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
   allowedHeaders: ["Content-Type", "Authorization"] // Allow these headers
}));
app.use("/api/stripe", webhooksRoutes)
app.use(express.json());

app.use(morgan("dev"));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(session({
   secret: "dsdsddsfsdfdsfsdsdfsdf",
   resave: false,
   saveUninitialized: false,
   cookie: {
      httpOnly: true, // Ensures the cookie is not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
      sameSite: "None", // Allow cross-origin cookies
   }
}));
app.use(passport.session())


// Import Routes
const paymentRoutes = require("./routes/PaymentRoutes")
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes")
const serviceProviderRoutes = require("./routes/serviceProviderRoutes")
const authRoutes = require("./routes/auth");
const leadGenerationRoutes = require("./routes/LeadGenerationRoutes")
// checking server state 
app.get("/", (req, res) => {
   return res.status(200).send("Working");
})
// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes)
app.use("/api/service-provider", serviceProviderRoutes)
app.use("/auth", authRoutes);
app.use("/api/leads", leadGenerationRoutes)
app.use("/api/payments", paymentRoutes)
// async function createCustomRequestConfig() {
//    const serviceConfig = new FormConfiguration({
//       serviceType: "Cleaning Services",
//       questions: [
//          {
//             fieldName: "cleaningType",
//             questionText: "What type of cleaning service do you need?",
//             fieldType: "radio",
//             options: [
//                "Home Cleaning",
//                "Office Cleaning",
//                "Deep Cleaning",
//                "Move-in/Move-out",
//                "Post-Construction"
//             ],
//             required: true
//          },
//          {
//             fieldName: "areaDescription",
//             questionText: "Briefly describe the area that needs cleaning",
//             fieldType: "text",
//             required: true,
//             placeholder: "e.g. 2 bedrooms, 1 bathroom, living area"
//          },
//          {
//             fieldName: "hasSensitiveSurfaces",
//             questionText: "Are there any surfaces or materials that need special care?",
//             fieldType: "checkbox",
//             options: [
//                "Wooden flooring",
//                "Marble or tiles",
//                "Electronics or appliances",
//                "Delicate furniture",
//                "None"
//             ],
//             required: false
//          },
//          {
//             fieldName: "cleaningFrequency",
//             questionText: "How often would you like the service?",
//             fieldType: "radio",
//             options: [
//                "One-time only",
//                "Weekly",
//                "Bi-weekly",
//                "Monthly",
//                "Not sure yet"
//             ],
//             required: true
//          },
//          {
//             fieldName: "urgency",
//             questionText: "How urgent is your request?",
//             fieldType: "radio",
//             options: [
//                "Today",
//                "Within 3 Days",
//                "This Week",
//                "Just Planning"
//             ],
//             required: true
//          },
//          {
//             fieldName: "hasPets",
//             questionText: "Are there any pets on the premises?",
//             fieldType: "radio",
//             options: [
//                "Yes",
//                "No"
//             ],
//             required: false
//          },
//          {
//             fieldName: "cleaningConcerns",
//             questionText: "Any specific concerns or cleaning instructions?",
//             fieldType: "text",
//             required: false,
//             placeholder: "e.g. Focus on kitchen, avoid strong chemicals, etc."
//          }
//       ]
//    }
//    );

//    try {
//       await serviceConfig.save();
//       console.log("CustomRequest configuration saved successfully!");
//    } catch (err) {
//       console.error("Error saving CustomRequest configuration:", err);
//    }
// }
// createCustomRequestConfig()
module.exports = app;
