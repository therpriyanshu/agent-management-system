/**
 * Validate CSV/Excel file format
 * @param {string} mimetype - File mimetype
 * @param {string} originalname - Original filename
 * @returns {boolean} - True if valid format, false otherwise
 */
const isValidFileFormat = (mimetype, originalname) => {
  const validMimeTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const validExtensions = [".csv", ".xlsx", ".xls"];

  // Check mimetype
  const isMimeTypeValid = validMimeTypes.includes(mimetype);

  // Check file extension
  const fileExtension = originalname
    .toLowerCase()
    .slice(originalname.lastIndexOf("."));
  const isExtensionValid = validExtensions.includes(fileExtension);

  return isMimeTypeValid || isExtensionValid;
};

/**
 * Validate CSV data structure
 * @param {Array} data - Parsed CSV data
 * @returns {Object} - Validation result with success status and message
 */
const validateCSVData = (data) => {
  if (!data || data.length === 0) {
    return {
      success: false,
      message: "CSV file is empty",
    };
  }

  // Check if required fields exist in each row
  const requiredFields = ["firstName", "phone"];
  const optionalFields = ["notes"];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    // Check for required fields
    for (const field of requiredFields) {
      if (!row[field] || row[field].toString().trim() === "") {
        return {
          success: false,
          message: `Missing or empty required field '${field}' at row ${i + 1}`,
        };
      }
    }

    // Validate phone number (should contain only numbers, +, -, spaces, parentheses)
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(row.phone.toString())) {
      return {
        success: false,
        message: `Invalid phone number format at row ${i + 1}`,
      };
    }

    // Validate firstName (should not be too long)
    if (row.firstName.toString().length > 100) {
      return {
        success: false,
        message: `First name too long at row ${i + 1} (max 100 characters)`,
      };
    }
  }

  return {
    success: true,
    message: "CSV data is valid",
    data: data,
  };
};

/**
 * Normalize CSV headers
 * Convert all possible header variations to standard field names
 * @param {Object} row - Single row from CSV
 * @returns {Object} - Normalized row
 */
const normalizeCSVRow = (row) => {
  const normalized = {};

  // Normalize firstName field
  const firstNameFields = [
    "firstname",
    "first_name",
    "firstName",
    "FirstName",
    "FIRSTNAME",
  ];
  for (const field of firstNameFields) {
    if (row[field] !== undefined) {
      normalized.firstName = row[field];
      break;
    }
  }

  // Normalize phone field
  const phoneFields = [
    "phone",
    "Phone",
    "PHONE",
    "mobile",
    "Mobile",
    "phoneNumber",
  ];
  for (const field of phoneFields) {
    if (row[field] !== undefined) {
      normalized.phone = row[field];
      break;
    }
  }

  // Normalize notes field
  const notesFields = ["notes", "Notes", "NOTES", "note", "Note", "comments"];
  for (const field of notesFields) {
    if (row[field] !== undefined) {
      normalized.notes = row[field];
      break;
    }
  }

  // If notes is not present, set it as empty string
  if (!normalized.notes) {
    normalized.notes = "";
  }

  return normalized;
};

module.exports = {
  isValidFileFormat,
  validateCSVData,
  normalizeCSVRow,
};
