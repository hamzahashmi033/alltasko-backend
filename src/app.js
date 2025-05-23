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

async function deleteCategoriesWithoutDescription() {
   try {
      let deletedCount = 0;
      
      // Find all categories that either:
      // 1. Don't have a description field, OR
      // 2. Have description field that's empty or just whitespace
      const categoriesToDelete = await Category.find({
         $or: [
            { description: { $exists: false } }, // Field doesn't exist
            { description: null }, // Field is null
            { description: '' }, // Empty string
            { description: { $regex: /^\s*$/ } } // Only whitespace
         ]
      });

      // Delete all matching categories
      for (const category of categoriesToDelete) {
         await Category.deleteOne({ _id: category._id });
         deletedCount++;
         console.log(`Deleted category (missing/empty description): ${category.name}`);
      }

      console.log(`
      Deletion complete:
      - Total deleted: ${deletedCount} categories
      `);

   } catch (error) {
      console.error('Error deleting categories:', error);
   }
}

// Execute the function
// deleteCategoriesWithoutDescription();

module.exports = app;
