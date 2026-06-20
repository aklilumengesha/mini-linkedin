const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration for production
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://linkedin-platform.vercel.app",
      /\.vercel\.app$/,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "LinkedIn API is running!",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      users: "/api/users",
      posts: "/api/posts",
      upload: "/api/upload",
    },
  });
});

// MongoDB connection with enhanced SSL/TLS configuration and error handling
const connectDB = async (retryCount = 0) => {
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 5000;

  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/linkedin";

    // Enhanced connection options for MongoDB Atlas with proper SSL/TLS configuration
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      
      // SSL/TLS Configuration - Critical for MongoDB Atlas
      ssl: true,
      tls: true,
      tlsAllowInvalidCertificates: false,
      
      // Connection timeout settings
      serverSelectionTimeoutMS: 10000, // 10 seconds to select a server
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      connectTimeoutMS: 10000, // 10 seconds to establish initial connection
      
      // Connection pool settings for better performance
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2, // Minimum number of connections to maintain
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      
      // Retry configuration
      retryWrites: true,
      retryReads: true,
      
      // Write concern
      w: "majority",
      
      // Family preference for DNS resolution (IPv4 first)
      family: 4,
    };

    await mongoose.connect(mongoURI, connectionOptions);
    
    console.log("✓ MongoDB connected successfully");
    console.log(`  Database: ${mongoose.connection.name}`);
    console.log(`  Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error("✗ MongoDB connection error:", error.message);
    
    // Detailed error logging for debugging
    if (error.name === "MongoServerSelectionError") {
      console.error("  Issue: Unable to reach MongoDB server");
      console.error("  Check: Network connectivity and firewall settings");
    } else if (error.message.includes("SSL") || error.message.includes("TLS")) {
      console.error("  Issue: SSL/TLS handshake failed");
      console.error("  Check: MongoDB Atlas IP whitelist and connection string");
    } else if (error.message.includes("authentication")) {
      console.error("  Issue: Authentication failed");
      console.error("  Check: Username and password in connection string");
    }
    
    // Retry logic with exponential backoff
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`  Retrying connection in ${delay / 1000} seconds... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
      setTimeout(() => connectDB(retryCount + 1), delay);
    } else {
      console.error(`  Failed to connect after ${MAX_RETRIES} attempts`);
      if (process.env.NODE_ENV !== "production") {
        process.exit(1);
      }
    }
  }
};

// Handle MongoDB connection events with improved logging
mongoose.connection.on("connected", () => {
  console.log("✓ Mongoose connected to MongoDB");
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠ Mongoose disconnected from MongoDB");
  if (process.env.NODE_ENV === "production") {
    console.log("  Attempting to reconnect...");
    setTimeout(connectDB, 5000);
  }
});

mongoose.connection.on("reconnected", () => {
  console.log("✓ Mongoose reconnected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("✗ MongoDB connection error:", err.message);
  
  // Handle specific SSL/TLS errors
  if (err.message.includes("SSL") || err.message.includes("TLS")) {
    console.error("  SSL/TLS Error Details:");
    console.error("  - Ensure MongoDB Atlas cluster is accessible");
    console.error("  - Verify your IP address is whitelisted (0.0.0.0/0 for all IPs)");
    console.error("  - Check that your connection string includes SSL parameters");
  }
});

// Routes
try {
  const usersRouter = require("./routes/users");
  const postsRouter = require("./routes/posts");
  const uploadRouter = require("./routes/upload");

  app.use("/api/users", usersRouter);
  app.use("/api/posts", postsRouter);
  app.use("/api/upload", uploadRouter);
} catch (error) {
  console.error("Error loading routes:", error);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "production" ? {} : err.stack,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Graceful shutdown handling
process.on("SIGTERM", async () => {
  try {
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    process.exit(1);
  }
});

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  // Server started successfully
});

// Handle server errors
server.on("error", (error) => {
  console.error("Server error:", error);
});

module.exports = app;
