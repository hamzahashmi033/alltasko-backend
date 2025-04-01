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
   credentials: true, // Allow sending cookies
   methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
   allowedHeaders: ["Content-Type", "Authorization"] // Allow these headers
}));
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(session({ secret: "dsdsddsfsdfdsfsdsdfsdf", resave: false, saveUninitialized: false }))
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
// async function createHandymanConfig() {
//    const serviceConfig = new FormConfiguration({
//       serviceType: "MovingService",
//       questions: [
//          {
//             fieldName: "moveType",
//             questionText: "What are you moving?",
//             fieldType: "radio",
//             required: true,
//             options: [
//                "Household items",
//                "Office equipment",
//                "Just furniture",
//                "Specialty items (piano, safe, etc.)",
//                "Storage items"
//             ]
//          },
//          {
//             fieldName: "urgency",
//             questionText: "How soon do you need help?",
//             fieldType: "radio",
//             required: true,
//             options: [
//                "Immediately (today/tomorrow)",
//                "Within 3 days",
//                "Planning ahead (1+ week)",
//                "Just getting estimates"
//             ]
//          },
//          {
//             fieldName: "itemsDescription",
//             questionText: "Briefly describe what needs moving:",
//             fieldType: "text",
//             required: true,
//             placeholder: "e.g. '3-bedroom apartment' or 'grand piano'"
//          },
//          {
//             fieldName: "specialRequirements",
//             questionText: "Any special handling needed?",
//             fieldType: "checkbox",
//             required: false,
//             options: [
//                "Fragile items",
//                "Disassembly/reassembly",
//                "Packing materials",
//                "Storage needed",
//                "Heavy lifting (>100 lbs)"
//             ]
//          },
//          {
//             fieldName: "accessInfo",
//             questionText: "Any access challenges?",
//             fieldType: "checkbox",
//             required: false,
//             options: [
//                "Stairs/no elevator",
//                "Narrow hallways",
//                "Limited parking",
//                "High floor"
//             ]
//          },
//          {
//             fieldName: "serviceAddOns",
//             questionText: "Additional services needed?",
//             fieldType: "checkbox",
//             required: false,
//             options: [
//                "Packing/unpacking",
//                "Cleaning",
//                "Junk removal",
//                "Insurance coverage"
//             ]
//          }
//       ]
//    });

//    try {
//       await serviceConfig.save();
//       console.log("Handyman configuration saved successfully!");
//    } catch (err) {
//       console.error("Error saving handyman configuration:", err);
//    }
// }
// createHandymanConfig()
module.exports = app;
