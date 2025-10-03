import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import UploadCSV from "../components/lists/UploadCSV";
import DistributedLists from "../components/lists/DistributedLists";
import ErrorMessage from "../components/common/ErrorMessage";

const Lists = () => {
  const [searchParams] = useSearchParams();
  const [summaries, setSummaries] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    fetchSummaries();

    // Check if agentId is in URL params
    const agentId = searchParams.get("agentId");
    if (agentId) {
      fetchListsByAgent(agentId);
    }
  }, [searchParams]);

  const fetchSummaries = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/lists/summary");
      setSummaries(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch summaries");
    } finally {
      setLoading(false);
    }
  };

  const fetchListsByBatch = async (batchId) => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/lists?uploadBatch=${batchId}`);
      setLists(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch lists");
    } finally {
      setLoading(false);
    }
  };

  const fetchListsByAgent = async (agentId) => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get(`/lists/agent/${agentId}`);
      setLists(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch agent lists");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file) => {
    try {
      setUploadLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/lists/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setSuccessMessage(
          `File uploaded successfully! ${response.data.data.totalItems} items distributed among agents.`
        );

        // Refresh summaries
        fetchSummaries();

        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload file");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSelectBatch = (batchId) => {
    setSelectedBatch(batchId);
    fetchListsByBatch(batchId);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Lists Management</h1>
          <p style={styles.subtitle}>Upload and manage distributed lists</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError("")} />}

      {successMessage && (
        <div style={styles.successMessage}>
          <span style={styles.successIcon}>✅</span>
          {successMessage}
        </div>
      )}

      <div style={styles.content}>
        <div style={styles.uploadSection}>
          <h2 style={styles.sectionTitle}>Upload CSV File</h2>
          <div style={styles.uploadContainer}>
            <UploadCSV onUpload={handleUpload} loading={uploadLoading} />
          </div>
        </div>

        <div style={styles.distributionSection}>
          <h2 style={styles.sectionTitle}>Distributed Lists</h2>
          <div style={styles.distributionContainer}>
            <DistributedLists
              summaries={summaries}
              lists={lists}
              loading={loading}
              onSelectBatch={handleSelectBatch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1rem",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    color: "#1f2937",
    fontSize: "2rem",
    margin: "0 0 0.5rem 0",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "1rem",
    margin: 0,
  },
  successMessage: {
    backgroundColor: "#d1fae5",
    border: "1px solid #6ee7b7",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1.5rem",
    color: "#065f46",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  successIcon: {
    fontSize: "1.5rem",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  uploadSection: {
    width: "100%",
  },
  sectionTitle: {
    color: "#1f2937",
    fontSize: "1.5rem",
    marginBottom: "1rem",
  },
  uploadContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "2rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  distributionSection: {
    width: "100%",
  },
  distributionContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "2rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
};

export default Lists;
