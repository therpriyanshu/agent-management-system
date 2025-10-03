// Import mongoose for MongoDB connection
const mongoose = require("mongoose");

/**
 * Connect to MongoDB database
 * This function establishes connection to MongoDB using the URI from environment variables
 */
const connectDB = async () => {
  try {
    // Connect to MongoDB (removed deprecated options)
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
