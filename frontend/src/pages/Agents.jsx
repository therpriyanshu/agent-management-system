import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AgentList from "../components/agents/AgentList";
import AddAgentForm from "../components/agents/AddAgentForm";
import ErrorMessage from "../components/common/ErrorMessage";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/agents");
      setAgents(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAgent = async (formData) => {
    try {
      setError("");
      setLoading(true);
      const response = await api.post("/agents", formData);

      if (response.data.success) {
        setSuccessMessage("Agent created successfully!");
        setShowAddForm(false);
        fetchAgents();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create agent");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (agentId) => {
    try {
      setError("");
      const response = await api.delete(`/agents/${agentId}`);

      if (response.data.success) {
        setSuccessMessage("Agent deleted successfully!");
        fetchAgents();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete agent");
    }
  };

  const handleViewAgentLists = (agentId) => {
    navigate(`/lists?agentId=${agentId}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Agents Management</h1>
          <p style={styles.subtitle}>
            Manage your agents and their assignments
          </p>
        </div>
        <button
          style={styles.addButton}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "✕ Cancel" : "➕ Add New Agent"}
        </button>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError("")} />}

      {successMessage && (
        <div style={styles.successMessage}>
          <span style={styles.successIcon}>✅</span>
          {successMessage}
        </div>
      )}

      {showAddForm && (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Add New Agent</h2>
          <AddAgentForm
            onSubmit={handleAddAgent}
            onCancel={() => setShowAddForm(false)}
            loading={loading}
          />
        </div>
      )}

      <div style={styles.listContainer}>
        <AgentList
          agents={agents}
          loading={loading}
          onDelete={handleDeleteAgent}
          onView={handleViewAgentLists}
        />
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    flexWrap: "wrap",
    gap: "1rem",
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
  addButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "0.75rem 1.5rem",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
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
  formContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "2rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "2rem",
  },
  formTitle: {
    color: "#1f2937",
    marginBottom: "1.5rem",
    fontSize: "1.5rem",
  },
  listContainer: {
    marginTop: "2rem",
  },
};

export default Agents;
