// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  GET_ME: "/auth/me",

  // Agents
  AGENTS: "/agents",
  AGENT_BY_ID: (id) => `/agents/${id}`,
  ACTIVE_AGENTS_COUNT: "/agents/count/active",

  // Lists
  LISTS: "/lists",
  UPLOAD_LIST: "/lists/upload",
  LIST_BY_AGENT: (agentId) => `/lists/agent/${agentId}`,
  LIST_SUMMARY: "/lists/summary",
  DELETE_BATCH: (batchId) => `/lists/batch/${batchId}`,
};

// Country Codes
export const COUNTRY_CODES = [
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "India" },
  { code: "+86", country: "China" },
  { code: "+81", country: "Japan" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+39", country: "Italy" },
  { code: "+61", country: "Australia" },
  { code: "+971", country: "UAE" },
  { code: "+65", country: "Singapore" },
  { code: "+60", country: "Malaysia" },
  { code: "+62", country: "Indonesia" },
  { code: "+66", country: "Thailand" },
  { code: "+63", country: "Philippines" },
  { code: "+82", country: "South Korea" },
  { code: "+55", country: "Brazil" },
  { code: "+52", country: "Mexico" },
  { code: "+27", country: "South Africa" },
  { code: "+20", country: "Egypt" },
];

// Status Options
export const LIST_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
};

export const STATUS_OPTIONS = [
  { value: LIST_STATUS.PENDING, label: "Pending" },
  { value: LIST_STATUS.IN_PROGRESS, label: "In Progress" },
  { value: LIST_STATUS.COMPLETED, label: "Completed" },
];

// Colors for status badges
export const STATUS_COLORS = {
  [LIST_STATUS.PENDING]: "#FFA500",
  [LIST_STATUS.IN_PROGRESS]: "#2196F3",
  [LIST_STATUS.COMPLETED]: "#4CAF50",
};

// File upload
export const ALLOWED_FILE_TYPES = ".csv,.xlsx,.xls";
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Pagination
export const ITEMS_PER_PAGE = 10;

// Messages
export const MESSAGES = {
  LOGIN_SUCCESS: "Login successful!",
  LOGIN_FAILED: "Login failed. Please check your credentials.",
  LOGOUT_SUCCESS: "Logged out successfully!",
  AGENT_CREATED: "Agent created successfully!",
  AGENT_UPDATED: "Agent updated successfully!",
  AGENT_DELETED: "Agent deleted successfully!",
  FILE_UPLOADED: "File uploaded and distributed successfully!",
  FILE_UPLOAD_FAILED: "File upload failed. Please try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
};
