/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long",
    };
  }

  return { isValid: true, message: "" };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validatePhone = (phone) => {
  const phoneRegex = /^\d{7,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate country code
 * @param {string} code - Country code to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateCountryCode = (code) => {
  const codeRegex = /^\+\d{1,4}$/;
  return codeRegex.test(code);
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {object} - Validation result with isValid and message
 */
export const validateName = (name) => {
  if (!name || name.trim() === "") {
    return { isValid: false, message: "Name is required" };
  }

  if (name.length < 2) {
    return {
      isValid: false,
      message: "Name must be at least 2 characters long",
    };
  }

  if (name.length > 100) {
    return { isValid: false, message: "Name must not exceed 100 characters" };
  }

  return { isValid: true, message: "" };
};

/**
 * Validate file format
 * @param {File} file - File to validate
 * @returns {object} - Validation result with isValid and message
 */
export const validateFileFormat = (file) => {
  if (!file) {
    return { isValid: false, message: "No file selected" };
  }

  const allowedExtensions = [".csv", ".xlsx", ".xls"];
  const fileName = file.name.toLowerCase();
  const isValidExtension = allowedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!isValidExtension) {
    return {
      isValid: false,
      message: "Invalid file format. Only CSV, XLSX, and XLS files are allowed",
    };
  }

  // Check file size (10MB limit)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      message: "File size exceeds 10MB limit",
    };
  }

  return { isValid: true, message: "" };
};
