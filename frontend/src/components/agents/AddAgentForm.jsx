import { useState } from "react";
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
  validateCountryCode,
} from "../../utils/validation";
import { COUNTRY_CODES } from "../../utils/constants";
import ErrorMessage from "../common/ErrorMessage";
import Loader from "../common/Loader";

const AddAgentForm = ({ onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    mobileNumber: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    // Validate name
    const nameValidation = validateName(formData.name);
    if (!nameValidation.isValid) {
      newErrors.name = nameValidation.message;
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Validate country code
    if (!validateCountryCode(formData.countryCode)) {
      newErrors.countryCode = "Invalid country code format";
    }

    // Validate mobile number
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!validatePhone(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 7-15 digits";
    }

    // Validate password
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{
            ...styles.input,
            ...(errors.name ? styles.inputError : {}),
          }}
          placeholder="Enter agent name"
          disabled={loading}
        />
        {errors.name && <span style={styles.error}>{errors.name}</span>}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={{
            ...styles.input,
            ...(errors.email ? styles.inputError : {}),
          }}
          placeholder="Enter email address"
          disabled={loading}
        />
        {errors.email && <span style={styles.error}>{errors.email}</span>}
      </div>

      <div style={styles.formRow}>
        <div style={{ ...styles.formGroup, flex: "0 0 30%" }}>
          <label style={styles.label}>Country Code *</label>
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.countryCode ? styles.inputError : {}),
            }}
            disabled={loading}
          >
            {COUNTRY_CODES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.code} ({item.country})
              </option>
            ))}
          </select>
          {errors.countryCode && (
            <span style={styles.error}>{errors.countryCode}</span>
          )}
        </div>

        <div style={{ ...styles.formGroup, flex: 1 }}>
          <label style={styles.label}>Mobile Number *</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            style={{
              ...styles.input,
              ...(errors.mobileNumber ? styles.inputError : {}),
            }}
            placeholder="Enter mobile number"
            disabled={loading}
          />
          {errors.mobileNumber && (
            <span style={styles.error}>{errors.mobileNumber}</span>
          )}
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Password *</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          style={{
            ...styles.input,
            ...(errors.password ? styles.inputError : {}),
          }}
          placeholder="Enter password (min 6 characters)"
          disabled={loading}
        />
        {errors.password && <span style={styles.error}>{errors.password}</span>}
      </div>

      <div style={styles.buttonGroup}>
        <button
          type="button"
          onClick={onCancel}
          style={styles.cancelBtn}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          style={{
            ...styles.submitBtn,
            ...(loading ? styles.submitBtnDisabled : {}),
          }}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Agent"}
        </button>
      </div>
    </form>
  );
};

const styles = {
  form: {
    width: "100%",
  },
  formGroup: {
    marginBottom: "1.5rem",
  },
  formRow: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#374151",
    fontWeight: "500",
    fontSize: "0.9rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "1rem",
    transition: "border-color 0.3s",
    boxSizing: "border-box",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  error: {
    display: "block",
    color: "#ef4444",
    fontSize: "0.875rem",
    marginTop: "0.25rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    justifyContent: "flex-end",
    marginTop: "2rem",
  },
  cancelBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#e5e7eb",
    color: "#374151",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  submitBtn: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  submitBtnDisabled: {
    backgroundColor: "#93c5fd",
    cursor: "not-allowed",
  },
};

export default AddAgentForm;
