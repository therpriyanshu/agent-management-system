import { useState } from "react";
import { validateEmail } from "../../utils/validation";
import ErrorMessage from "../common/ErrorMessage";
import Loader from "../common/Loader";

const LoginForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    email: "",
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

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData.email, formData.password);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={{
            ...styles.input,
            ...(errors.email ? styles.inputError : {}),
          }}
          placeholder="Enter your email"
          disabled={loading}
        />
        {errors.email && <span style={styles.error}>{errors.email}</span>}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          style={{
            ...styles.input,
            ...(errors.password ? styles.inputError : {}),
          }}
          placeholder="Enter your password"
          disabled={loading}
        />
        {errors.password && <span style={styles.error}>{errors.password}</span>}
      </div>

      <button
        type="submit"
        style={{
          ...styles.submitBtn,
          ...(loading ? styles.submitBtnDisabled : {}),
        }}
        disabled={loading}
      >
        {loading ? <Loader size="small" message="" /> : "Login"}
      </button>
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
  label: {
    display: "block",
    marginBottom: "0.5rem",
    color: "#374151",
    fontWeight: "500",
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
  submitBtn: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnDisabled: {
    backgroundColor: "#93c5fd",
    cursor: "not-allowed",
  },
};

export default LoginForm;
