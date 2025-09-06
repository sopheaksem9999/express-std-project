const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./src/routes/router");

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: true, // Allow all origins for development
    credentials: true,
  })
);

// Logging middleware
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// API test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API test route works" });
});

// Mount API routes
app.use("/api", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

module.exports = app;
