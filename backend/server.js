// Import required packages
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Import routes
const authRoutes = require("./routes/authRoutes");
const agentRoutes = require("./routes/agentRoutes");
const listRoutes = require("./routes/listRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
// Enable CORS for all origins (configure for production)
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/lists", listRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Agent Management System API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      agents: "/api/agents",
      lists: "/api/lists",
    },
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
    ╔═══════════════════════════════════════════════╗
    ║   🚀 Server running in ${
      process.env.NODE_ENV || "development"
    } mode      ║
    ║   📡 Port: ${PORT}                              ║
    ║   🌐 URL: http://localhost:${PORT}             ║
    ╚═══════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  console.error(err.stack);
  // Close server & exit process
  process.exit(1);
});
