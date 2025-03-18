const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());

// Import Routes
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes")
// checking server state 
app.get("/", (req, res) => {
   return res.status(200).send("Working");
})
// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/category",categoryRoutes)

module.exports = app;
