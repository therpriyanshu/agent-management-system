const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

// Load environment variables
dotenv.config();

// Connect to MongoDB (without deprecated options)
mongoose.connect(process.env.MONGO_URI);

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@example.com" });

    if (adminExists) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });

    console.log("Admin user created successfully");
    console.log("Email: admin@example.com");
    console.log("Password: admin123");
    console.log("Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  }
};

createAdminUser();
