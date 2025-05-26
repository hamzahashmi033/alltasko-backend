const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session")
const passport = require("passport")
const FormConfiguration = require("./models/LeadGeneration/LeadFormConfiguration")
const webhooksRoutes = require("./routes/webhookRoutes")
const Category = require("./models/Category")
require("dotenv").config();
require("./config/google");
require("./config/facebook")
const app = express();
const allowedOrigins = [
   "http://localhost:3000",
   "https://alltasko.technovativelab.com",
   "https://alltasko.com",
   "https://staging.alltasko.com"
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
const uploadDir = process.env.NODE_ENV === "production"
   ? "/app/uploads"
   : path.join(__dirname, "../uploads");

app.use("/uploads", express.static(uploadDir));
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
app.use("/api/admin", require("./routes/adminRoutes"))

const plumbingFormConfig = {
   serviceType: "Plumbing",
   questions: [
      {
         fieldName: "plumbingWorkType",
         questionText: "What type of plumbing work do you need?",
         fieldType: "checkbox",
         options: [
            "Faucet installation or replacement",
            "Toilet installation or repair",
            "Sink installation or repair",
            "Shower or bathtub plumbing",
            "Drain unclogging",
            "Leak detection or pipe repair",
            "Garbage disposal install or repair",
            "Water line for fridge or dishwasher",
            "Other"
         ],
         required: true
      },
      {
         fieldName: "fixturesCount",
         questionText: "How many fixtures or areas need plumbing work?",
         fieldType: "radio",
         options: [
            "1",
            "2",
            "3–5",
            "6–10",
            "More than 10"
         ],
         required: true
      },
      {
         fieldName: "installationType",
         questionText: "Is this a new installation or a repair?",
         fieldType: "radio",
         options: [
            "New installation",
            "Replacement of old fixture",
            "Repair of existing plumbing",
            "Not sure"
         ],
         required: true
      },
      {
         fieldName: "waterShutoffStatus",
         questionText: "Is the water shutoff valve accessible and working?",
         fieldType: "radio",
         options: [
            "Yes",
            "No",
            "Not sure"
         ],
         required: true
      },
      {
         fieldName: "additionalWorkNeeded",
         questionText: "Do you expect any additional work (caulking, wall patching, etc.)?",
         fieldType: "radio",
         options: [
            "Yes",
            "No",
            "Not sure"
         ],
         required: true
      },
      {
         fieldName: "additionalNotes",
         questionText: "Any additional notes or special requests?",
         fieldType: "text",
         required: false,
         placeholder: "Please provide any additional details about your plumbing needs..."
      }
   ]
};
async function insertPlumbingForm() {
   try {
      const existingConfig = await FormConfiguration.findOne({ serviceType: "Plumbing" });
      if (existingConfig) {
         console.log("Plumbing form configuration already exists");
         return;
      }

      const newConfig = new FormConfiguration(plumbingFormConfig);
      await newConfig.save();
      console.log("Plumbing form configuration saved successfully");
   } catch (error) {
      console.error("Error saving plumbing form configuration:", error);
   }
}
// insertPlumbingForm()
module.exports = app;
