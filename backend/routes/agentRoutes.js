const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const {
  createAgent,
  getAllAgents,
  getAgentById,
  updateAgent,
  deleteAgent,
  getActiveAgentsCount,
} = require("../controllers/agentController");
const { protect, admin } = require("../middleware/authMiddleware");

// Apply protect and admin middleware to all routes
router.use(protect);
router.use(admin);

/**
 * @route   GET /api/agents/count/active
 * @desc    Get count of active agents
 * @access  Private/Admin
 */
router.get("/count/active", getActiveAgentsCount);

/**
 * @route   POST /api/agents
 * @desc    Create a new agent
 * @access  Private/Admin
 */
router.post(
  "/",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("countryCode")
      .trim()
      .notEmpty()
      .withMessage("Country code is required")
      .matches(/^\+\d{1,4}$/)
      .withMessage("Country code must start with + and contain 1-4 digits"),
    body("mobileNumber")
      .trim()
      .notEmpty()
      .withMessage("Mobile number is required")
      .matches(/^\d{7,15}$/)
      .withMessage("Mobile number must contain 7-15 digits"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  createAgent
);

/**
 * @route   GET /api/agents
 * @desc    Get all agents
 * @access  Private/Admin
 */
router.get("/", getAllAgents);

/**
 * @route   GET /api/agents/:id
 * @desc    Get single agent by ID
 * @access  Private/Admin
 */
router.get("/:id", getAgentById);

/**
 * @route   PUT /api/agents/:id
 * @desc    Update agent
 * @access  Private/Admin
 */
router.put(
  "/:id",
  [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Name must be between 2 and 100 characters"),
    body("email")
      .optional()
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email")
      .normalizeEmail(),
    body("countryCode")
      .optional()
      .trim()
      .matches(/^\+\d{1,4}$/)
      .withMessage("Country code must start with + and contain 1-4 digits"),
    body("mobileNumber")
      .optional()
      .trim()
      .matches(/^\d{7,15}$/)
      .withMessage("Mobile number must contain 7-15 digits"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean value"),
  ],
  updateAgent
);

/**
 * @route   DELETE /api/agents/:id
 * @desc    Delete agent
 * @access  Private/Admin
 */
router.delete("/:id", deleteAgent);

module.exports = router;
