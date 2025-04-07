const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session")
const passport = require("passport")
const FormConfiguration = require("./models/LeadGeneration/LeadFormConfiguration")

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
app.use(express.json());
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
async function createCustomRequestConfig() {
   const serviceConfig = new FormConfiguration({
      serviceType: "CustomRequest",
      questions: [
         {
            fieldName: "serviceNature",
            questionText: "What best describes your request?",
            fieldType: "select",
            options: ["Consultation", "Repair", "Emergency", "Delivery", "Support", "Inquiry", "Other"],
            required: true,
            placeholder: "Select a category"
         },
         {
            fieldName: "urgencyLevel",
            questionText: "How urgent is your request?",
            fieldType: "radio",
            options: ["Emergency", "Within 24 hours", "This week", "Not urgent"],
            required: true
         },
         {
            fieldName: "locationType",
            questionText: "Where is this service required?",
            fieldType: "select",
            options: ["Home", "Office", "Public Place", "Remote/Online", "Other"],
            required: true,
            placeholder: "Select location type"
         },
         {
            fieldName: "serviceTimePreference",
            questionText: "When would you prefer the service to be delivered?",
            fieldType: "select",
            options: ["Morning", "Afternoon", "Evening", "Weekend", "Anytime"],
            required: false,
            placeholder: "Choose time slot"
         },
         {
            fieldName: "shortDescription",
            questionText: "Briefly describe what you need",
            fieldType: "text",
            required: true,
            placeholder: "Describe your request in a few words"
         }
      ]
   });

   try {
      await serviceConfig.save();
      console.log("CustomRequest configuration saved successfully!");
   } catch (err) {
      console.error("Error saving CustomRequest configuration:", err);
   }
}
// createCustomRequestConfig()
module.exports = app;
