import { useState } from "react";
import { validateFileFormat } from "../../utils/validation";
import ErrorMessage from "../common/ErrorMessage";
import Loader from "../common/Loader";

const UploadCSV = ({ onUpload, loading }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  };

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      const validation = validateFileFormat(selectedFile);
      if (!validation.isValid) {
        setError(validation.message);
        setFile(null);
      } else {
        setError("");
        setFile(selectedFile);
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onUpload(file);
    } else {
      setError("Please select a file to upload");
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError("");
  };

  return (
    <div style={styles.container}>
      {error && <ErrorMessage message={error} onClose={() => setError("")} />}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            ...styles.dropzone,
            ...(dragActive ? styles.dropzoneActive : {}),
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="fileInput"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            style={styles.fileInput}
            disabled={loading}
          />

          {!file ? (
            <label htmlFor="fileInput" style={styles.dropzoneLabel}>
              <div style={styles.uploadIcon}>📁</div>
              <p style={styles.dropzoneText}>
                Drag and drop your file here, or click to select
              </p>
              <p style={styles.dropzoneSubtext}>
                Supported formats: CSV, XLSX, XLS (Max 10MB)
              </p>
            </label>
          ) : (
            <div style={styles.fileInfo}>
              <div style={styles.fileIcon}>📄</div>
              <div style={styles.fileDetails}>
                <p style={styles.fileName}>{file.name}</p>
                <p style={styles.fileSize}>
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              {!loading && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  style={styles.removeBtn}
                >
                  ×
                </button>
              )}
            </div>
          )}
        </div>

        {file && (
          <button
            type="submit"
            style={{
              ...styles.uploadBtn,
              ...(loading ? styles.uploadBtnDisabled : {}),
            }}
            disabled={loading}
          >
            {loading ? (
              <Loader size="small" message="" />
            ) : (
              "Upload & Distribute"
            )}
          </button>
        )}
      </form>

      <div style={styles.infoBox}>
        <h4 style={styles.infoTitle}>📋 CSV Format Requirements:</h4>
        <ul style={styles.infoList}>
          <li>
            Required columns: <strong>firstName</strong>, <strong>phone</strong>
          </li>
          <li>
            Optional column: <strong>notes</strong>
          </li>
          <li>Headers are case-insensitive</li>
          <li>Lists will be distributed equally among active agents</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
  },
  dropzone: {
    border: "2px dashed #d1d5db",
    borderRadius: "8px",
    padding: "2rem",
    textAlign: "center",
    backgroundColor: "#f9fafb",
    transition: "all 0.3s",
    cursor: "pointer",
    marginBottom: "1rem",
  },
  dropzoneActive: {
    borderColor: "#3b82f6",
    backgroundColor: "#eff6ff",
  },
  fileInput: {
    display: "none",
  },
  dropzoneLabel: {
    cursor: "pointer",
  },
  uploadIcon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  dropzoneText: {
    color: "#374151",
    fontSize: "1rem",
    marginBottom: "0.5rem",
  },
  dropzoneSubtext: {
    color: "#6b7280",
    fontSize: "0.875rem",
  },
  fileInfo: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1rem",
    backgroundColor: "white",
    borderRadius: "8px",
    position: "relative",
  },
  fileIcon: {
    fontSize: "2rem",
  },
  fileDetails: {
    flex: 1,
    textAlign: "left",
  },
  fileName: {
    margin: 0,
    color: "#1f2937",
    fontWeight: "500",
  },
  fileSize: {
    margin: "0.25rem 0 0 0",
    color: "#6b7280",
    fontSize: "0.875rem",
  },
  removeBtn: {
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#6b7280",
    padding: "0",
    lineHeight: 1,
  },
  uploadBtn: {
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
    marginBottom: "1.5rem",
  },
  uploadBtnDisabled: {
    backgroundColor: "#93c5fd",
    cursor: "not-allowed",
  },
  infoBox: {
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    padding: "1rem",
  },
  infoTitle: {
    margin: "0 0 0.75rem 0",
    color: "#1e40af",
    fontSize: "0.9rem",
  },
  infoList: {
    margin: 0,
    paddingLeft: "1.5rem",
    color: "#1e3a8a",
    fontSize: "0.875rem",
  },
};

export default UploadCSV;
