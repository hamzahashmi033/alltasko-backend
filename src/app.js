const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Import Routes
const userRoutes = require("./routes/userRoutes");

// Use Routes
app.use("/api/users", userRoutes);

module.exports = app;
