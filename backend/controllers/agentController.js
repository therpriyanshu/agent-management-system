const Agent = require("../models/Agent");
const { validationResult } = require("express-validator");

/**
 * @desc    Create a new agent
 * @route   POST /api/agents
 * @access  Private/Admin
 */
const createAgent = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, email, countryCode, mobileNumber, password } = req.body;

    // Check if agent with email already exists
    const agentExists = await Agent.findOne({ email });

    if (agentExists) {
      return res.status(400).json({
        success: false,
        message: "Agent with this email already exists",
      });
    }

    // Create agent
    const agent = await Agent.create({
      name,
      email,
      mobile: {
        countryCode,
        number: mobileNumber,
      },
      password,
    });

    if (agent) {
      res.status(201).json({
        success: true,
        message: "Agent created successfully",
        data: {
          _id: agent._id,
          name: agent.name,
          email: agent.email,
          mobile: agent.mobile,
          isActive: agent.isActive,
          createdAt: agent.createdAt,
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid agent data",
      });
    }
  } catch (error) {
    console.error("Create agent error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating agent",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all agents
 * @route   GET /api/agents
 * @access  Private/Admin
 */
const getAllAgents = async (req, res) => {
  try {
    // Get all agents, exclude password field
    const agents = await Agent.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: agents.length,
      data: agents,
    });
  } catch (error) {
    console.error("Get all agents error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching agents",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single agent by ID
 * @route   GET /api/agents/:id
 * @access  Private/Admin
 */
const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select("-password");

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    res.json({
      success: true,
      data: agent,
    });
  } catch (error) {
    console.error("Get agent by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching agent",
      error: error.message,
    });
  }
};

/**
 * @desc    Update agent
 * @route   PUT /api/agents/:id
 * @access  Private/Admin
 */
const updateAgent = async (req, res) => {
  try {
    const { name, email, countryCode, mobileNumber, isActive } = req.body;

    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== agent.email) {
      const emailExists = await Agent.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already in use by another agent",
        });
      }
    }

    // Update fields
    agent.name = name || agent.name;
    agent.email = email || agent.email;

    if (countryCode || mobileNumber) {
      agent.mobile.countryCode = countryCode || agent.mobile.countryCode;
      agent.mobile.number = mobileNumber || agent.mobile.number;
    }

    if (typeof isActive !== "undefined") {
      agent.isActive = isActive;
    }

    const updatedAgent = await agent.save();

    res.json({
      success: true,
      message: "Agent updated successfully",
      data: {
        _id: updatedAgent._id,
        name: updatedAgent.name,
        email: updatedAgent.email,
        mobile: updatedAgent.mobile,
        isActive: updatedAgent.isActive,
        updatedAt: updatedAgent.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update agent error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating agent",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete agent
 * @route   DELETE /api/agents/:id
 * @access  Private/Admin
 */
const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    await agent.deleteOne();

    res.json({
      success: true,
      message: "Agent deleted successfully",
    });
  } catch (error) {
    console.error("Delete agent error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting agent",
      error: error.message,
    });
  }
};

/**
 * @desc    Get active agents count
 * @route   GET /api/agents/count/active
 * @access  Private/Admin
 */
const getActiveAgentsCount = async (req, res) => {
  try {
    const count = await Agent.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        activeAgents: count,
      },
    });
  } catch (error) {
    console.error("Get active agents count error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while counting agents",
      error: error.message,
    });
  }
};

module.exports = {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  getActiveAgentsCount,
};
