const jwt = require("jsonwebtoken");

/**
 * Generate JWT Token
 * @param {string} id - User ID to encode in token
 * @returns {string} - JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

module.exports = generateToken;
