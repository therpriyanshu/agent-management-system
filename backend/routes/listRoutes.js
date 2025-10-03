const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  uploadAndDistributeLists,
  getAllLists,
  getListsByAgent,
  getDistributionsSummary,
  deleteListsBatch,
} = require("../controllers/listController");
const { protect, admin } = require("../middleware/authMiddleware");
const { isValidFileFormat } = require("../utils/csvValidator");

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "upload-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  if (isValidFileFormat(file.mimetype, file.originalname)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file format. Only CSV, XLSX, and XLS files are allowed"
      ),
      false
    );
  }
};

// Configure multer upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

// Apply protect and admin middleware to all routes
router.use(protect);
router.use(admin);

/**
 * @route   POST /api/lists/upload
 * @desc    Upload CSV/Excel file and distribute lists to agents
 * @access  Private/Admin
 */
router.post("/upload", upload.single("file"), uploadAndDistributeLists);

/**
 * @route   GET /api/lists/summary
 * @desc    Get distribution summary for all uploads
 * @access  Private/Admin
 */
router.get("/summary", getDistributionsSummary);

/**
 * @route   GET /api/lists/agent/:agentId
 * @desc    Get lists by agent ID
 * @access  Private/Admin
 */
router.get("/agent/:agentId", getListsByAgent);

/**
 * @route   GET /api/lists
 * @desc    Get all lists with optional filters
 * @access  Private/Admin
 */
router.get("/", getAllLists);

/**
 * @route   DELETE /api/lists/batch/:uploadBatch
 * @desc    Delete lists by upload batch
 * @access  Private/Admin
 */
router.delete("/batch/:uploadBatch", deleteListsBatch);

module.exports = router;
