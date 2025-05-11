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
app.use('/api/conversations', require('./routes/conversationRoutes'));
app.use('/api/messages', require('./routes/messagesRoutes'));
async function createCustomRequestConfig() {
   const formConfig = new FormConfiguration({
      serviceType: "Yardwork & Outdoor Services",
      questions: [
         {
            fieldName: "generalTaskType",
            questionText: "What kind of yard service do you need?",
            fieldType: "radio",
            options: [
               "General maintenance",
               "Seasonal cleanup",
               "New installation or project",
               "Pest or hazard control",
               "Snow or ice removal",
               "Other"
            ],
            required: true
         },
         {
            fieldName: "propertyType",
            questionText: "What type of property is this?",
            fieldType: "radio",
            options: ["Residential", "Commercial", "Industrial", "Other"],
            required: true
         },
         {
            fieldName: "yardSize",
            questionText: "How big is the outdoor area?",
            fieldType: "radio",
            options: ["Small", "Medium", "Large", "Not sure"],
            required: true
         },
         {
            fieldName: "accessRestrictions",
            questionText: "Are there any access restrictions we should know about?",
            fieldType: "radio",
            options: ["None", "Gated access", "Pet on property", "Other"],
            required: false
         },
         {
            fieldName: "urgency",
            questionText: "How soon do you need the service?",
            fieldType: "radio",
            options: ["Emergency", "This week", "This month", "Just planning"],
            required: true
         },
         {
            fieldName: "recurringNeed",
            questionText: "Is this a one-time job or recurring service?",
            fieldType: "radio",
            options: ["One-time", "Recurring", "Not sure"],
            required: true
         },
         {
            fieldName: "additionalDetails",
            questionText: "Any additional details you'd like to share?",
            fieldType: "text",
            required: false,
            placeholder: "e.g., avoid back garden, be careful near flower beds, etc."
         }
      ]
   });

   try {
      await formConfig.save();
      console.log("formConfig configuration saved successfully!");
   } catch (err) {
      console.error("Error saving CustomRequest configuration:", err);
   }
}
// createCustomRequestConfig()
module.exports = app;
