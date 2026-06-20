const express = require("express");
const supabase = require("./config/supabase");
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
app.get("/health", async (req, res) => {
  try {
    // Test Supabase connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    const dbStatus = error ? 'disconnected' : 'connected';
    
    res.status(200).json({
      status: "OK",
      database: dbStatus,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      database: "disconnected",
      error: error.message
    });
  }
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

// Supabase connection verification
const verifySupabaseConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is OK
      throw error;
    }
    
    console.log("✓ Supabase connected successfully");
    console.log(`  Database: PostgreSQL`);
    console.log(`  URL: ${process.env.SUPABASE_URL}`);
  } catch (error) {
    console.error("✗ Supabase connection error:", error.message);
    console.error("  Check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env");
    
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  }
};

// Routes
try {
  const usersRouter = require("./routes/users");
  // const postsRouter = require("./routes/posts"); // Temporarily disabled - needs Supabase conversion
  const uploadRouter = require("./routes/upload");

  app.use("/api/users", usersRouter);
  // app.use("/api/posts", postsRouter); // Temporarily disabled
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
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

// Verify Supabase connection
verifySupabaseConnection();

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  // Server started successfully
});

// Handle server errors
server.on("error", (error) => {
  console.error("Server error:", error);
});

module.exports = app;
