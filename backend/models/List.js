const mongoose = require("mongoose");

/**
 * List Schema - For storing uploaded list items and their distribution
 * Each list item from CSV is stored here with assignment to an agent
 */
const listSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
      required: [true, "Agent assignment is required"],
    },
    uploadBatch: {
      type: String,
      required: true,
      // This helps group items from the same CSV upload
    },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Index for faster queries
listSchema.index({ assignedTo: 1, uploadBatch: 1 });
listSchema.index({ uploadBatch: 1 });

const List = mongoose.model("List", listSchema);

module.exports = List;
