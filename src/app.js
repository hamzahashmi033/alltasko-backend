const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session")
const passport = require("passport")
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
// checking server state 
app.get("/", (req, res) => {
   return res.status(200).send("Working");
})
// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes)
app.use("/api/service-provider", serviceProviderRoutes)
app.use("/auth", authRoutes);

module.exports = app;
