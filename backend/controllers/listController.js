const List = require("../models/List");
const Agent = require("../models/Agent");
const { validateCSVData, normalizeCSVRow } = require("../utils/csvValidator");
const {
  distributeItems,
  getDistributionSummary,
} = require("../utils/distributeItems");
const csvParser = require("csv-parser");
const ExcelJS = require("exceljs");
const fs = require("fs");

/**
 * @desc    Upload CSV/Excel file and distribute lists to agents
 * @route   POST /api/lists/upload
 * @access  Private/Admin
 */
const uploadAndDistributeLists = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const filePath = req.file.path;
    const fileExtension = req.file.originalname
      .toLowerCase()
      .slice(req.file.originalname.lastIndexOf("."));

    let parsedData = [];

    // Parse based on file type
    if (fileExtension === ".csv") {
      // Parse CSV file
      parsedData = await parseCSV(filePath);
    } else if (fileExtension === ".xlsx" || fileExtension === ".xls") {
      // Parse Excel file using ExcelJS
      parsedData = await parseExcel(filePath);
    } else {
      // Delete uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message:
          "Invalid file format. Only CSV, XLSX, and XLS files are allowed",
      });
    }

    // Normalize data
    const normalizedData = parsedData.map((row) => normalizeCSVRow(row));

    // Validate CSV data
    const validation = validateCSVData(normalizedData);

    if (!validation.success) {
      // Delete uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    // Get all active agents
    const agents = await Agent.find({ isActive: true });

    if (agents.length === 0) {
      // Delete uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: "No active agents available for distribution",
      });
    }

    // Generate unique batch ID for this upload
    const uploadBatch = `batch_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Distribute items among agents
    const distributedItems = distributeItems(normalizedData, agents);

    // Add uploadBatch to each item
    const itemsToSave = distributedItems.map((item) => ({
      ...item,
      uploadBatch,
    }));

    // Save all items to database
    const savedItems = await List.insertMany(itemsToSave);

    // Get distribution summary
    const summary = getDistributionSummary(distributedItems, agents);

    // Delete uploaded file after processing
    fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      message: "File uploaded and lists distributed successfully",
      data: {
        uploadBatch,
        totalItems: savedItems.length,
        distributionSummary: summary,
      },
    });
  } catch (error) {
    console.error("Upload and distribute error:", error);

    // Delete uploaded file in case of error
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }

    res.status(500).json({
      success: false,
      message: "Server error while processing file",
      error: error.message,
    });
  }
};

/**
 * Helper function to parse CSV file
 */
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};

/**
 * Helper function to parse Excel file using ExcelJS
 */
const parseExcel = async (filePath) => {
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    // Get the first worksheet
    const worksheet = workbook.worksheets[0];

    if (!worksheet) {
      throw new Error("No worksheet found in the Excel file");
    }

    const data = [];
    const headers = [];

    // Get headers from first row
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      headers[colNumber - 1] = cell.value?.toString().trim() || "";
    });

    // Process data rows (starting from row 2)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const rowData = {};
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        const header = headers[colNumber - 1];
        if (header) {
          rowData[header] = cell.value?.toString().trim() || "";
        }
      });

      // Only add row if it has data
      if (Object.keys(rowData).length > 0) {
        data.push(rowData);
      }
    });

    return data;
  } catch (error) {
    console.error("Error parsing Excel file:", error);
    throw new Error("Failed to parse Excel file: " + error.message);
  }
};

/**
 * @desc    Get all lists with filters
 * @route   GET /api/lists
 * @access  Private/Admin
 */
const getAllLists = async (req, res) => {
  try {
    const { agentId, uploadBatch, status } = req.query;

    // Build filter object
    const filter = {};
    if (agentId) filter.assignedTo = agentId;
    if (uploadBatch) filter.uploadBatch = uploadBatch;
    if (status) filter.status = status;

    // Get lists with populated agent data
    const lists = await List.find(filter)
      .populate("assignedTo", "name email mobile")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: lists.length,
      data: lists,
    });
  } catch (error) {
    console.error("Get all lists error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching lists",
      error: error.message,
    });
  }
};

/**
 * @desc    Get lists by agent ID
 * @route   GET /api/lists/agent/:agentId
 * @access  Private/Admin
 */
const getListsByAgent = async (req, res) => {
  try {
    const { agentId } = req.params;

    // Check if agent exists
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    // Get lists for this agent
    const lists = await List.find({ assignedTo: agentId })
      .populate("assignedTo", "name email mobile")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      agent: {
        _id: agent._id,
        name: agent.name,
        email: agent.email,
      },
      count: lists.length,
      data: lists,
    });
  } catch (error) {
    console.error("Get lists by agent error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching agent lists",
      error: error.message,
    });
  }
};

/**
/**
 * @desc    Get distribution summary for all uploads
 * @route   GET /api/lists/summary
 * @access  Private/Admin
 */
const getDistributionsSummary = async (req, res) => {
  try {
    // Get unique upload batches
    const batches = await List.distinct("uploadBatch");

    const summaries = [];

    for (const batch of batches) {
      // Get all lists for this batch with populated agent data
      const batchLists = await List.find({ uploadBatch: batch }).populate(
        "assignedTo",
        "name email"
      );

      // Filter out items with null/deleted agents
      const validBatchLists = batchLists.filter(
        (list) => list.assignedTo !== null
      );

      if (validBatchLists.length === 0) {
        continue; // Skip batches with no valid items
      }

      // Group by agent
      const agentGroups = {};

      validBatchLists.forEach((list) => {
        // Additional safety check
        if (list.assignedTo && list.assignedTo._id) {
          const agentId = list.assignedTo._id.toString();
          if (!agentGroups[agentId]) {
            agentGroups[agentId] = {
              agentId: list.assignedTo._id,
              agentName: list.assignedTo.name,
              agentEmail: list.assignedTo.email,
              itemsCount: 0,
            };
          }
          agentGroups[agentId].itemsCount++;
        }
      });

      summaries.push({
        uploadBatch: batch,
        totalItems: validBatchLists.length,
        uploadDate: validBatchLists[0]?.createdAt,
        distribution: Object.values(agentGroups),
      });
    }

    // Sort by upload date (newest first)
    summaries.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    res.json({
      success: true,
      count: summaries.length,
      data: summaries,
    });
  } catch (error) {
    console.error("Get distributions summary error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching summary",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete lists by upload batch
 * @route   DELETE /api/lists/batch/:uploadBatch
 * @access  Private/Admin
 */
const deleteListsBatch = async (req, res) => {
  try {
    const { uploadBatch } = req.params;

    const result = await List.deleteMany({ uploadBatch });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No lists found for this batch",
      });
    }

    res.json({
      success: true,
      message: `${result.deletedCount} lists deleted successfully`,
    });
  } catch (error) {
    console.error("Delete lists batch error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting lists",
      error: error.message,
    });
  }
};

module.exports = {
  uploadAndDistributeLists,
  getAllLists,
  getListsByAgent,
  getDistributionsSummary,
  deleteListsBatch,
};
