const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * Agent Schema - For Agents who receive distributed lists
 * Agents are created by admin and can be assigned list items
 */
const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Agent name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    mobile: {
      countryCode: {
        type: String,
        required: [true, "Country code is required"],
        trim: true,
      },
      number: {
        type: String,
        required: [true, "Mobile number is required"],
        trim: true,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * Hash password before saving agent
 * This middleware runs before saving the agent document
 */
agentSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    next();
  }

  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Method to compare entered password with hashed password
 * @param {string} enteredPassword - Password entered by agent
 * @returns {boolean} - True if passwords match, false otherwise
 */
agentSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Agent = mongoose.model("Agent", agentSchema);

module.exports = Agent;
