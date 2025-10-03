// src/components/common/Loader.jsx
import React from "react";

const Loader = ({ size = "medium", message = "Loading..." }) => {
  const sizeStyles = {
    small: { width: "20px", height: "20px", borderWidth: "2px" },
    medium: { width: "40px", height: "40px", borderWidth: "4px" },
    large: { width: "60px", height: "60px", borderWidth: "5px" },
  };

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.spinner,
          ...sizeStyles[size],
        }}
      ></div>
      {message && <p style={styles.message}>{message}</p>}
      {/* Inline keyframes so no insertRule crash */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  spinner: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  message: {
    marginTop: "1rem",
    color: "#64748b",
    fontSize: "0.9rem",
  },
};

export default Loader;
