import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalLists: 0,
    recentUploads: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch agents
      const agentsRes = await api.get("/agents");
      const agents = agentsRes.data.data;

      // Fetch lists
      const listsRes = await api.get("/lists");
      const lists = listsRes.data.data;

      // Fetch summaries
      const summariesRes = await api.get("/lists/summary");
      const summaries = summariesRes.data.data;

      setStats({
        totalAgents: agents.length,
        activeAgents: agents.filter((a) => a.isActive).length,
        totalLists: lists.length,
        recentUploads: summaries.length,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <Loader message="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <p style={styles.welcome}>Welcome back, {user?.name}!</p>
      </div>

      {error && <ErrorMessage message={error} onClose={() => setError("")} />}

      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, ...styles.statCard1 }}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{stats.totalAgents}</h3>
            <p style={styles.statLabel}>Total Agents</p>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.statCard2 }}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{stats.activeAgents}</h3>
            <p style={styles.statLabel}>Active Agents</p>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.statCard3 }}>
          <div style={styles.statIcon}>📋</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{stats.totalLists}</h3>
            <p style={styles.statLabel}>Total List Items</p>
          </div>
        </div>

        <div style={{ ...styles.statCard, ...styles.statCard4 }}>
          <div style={styles.statIcon}>📤</div>
          <div style={styles.statContent}>
            <h3 style={styles.statValue}>{stats.recentUploads}</h3>
            <p style={styles.statLabel}>Total Uploads</p>
          </div>
        </div>
      </div>

      <div style={styles.quickActions}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionGrid}>
          <button
            style={styles.actionButton}
            onClick={() => navigate("/agents")}
          >
            <span style={styles.actionIcon}>➕</span>
            <span style={styles.actionText}>Add New Agent</span>
          </button>

          <button
            style={styles.actionButton}
            onClick={() => navigate("/lists")}
          >
            <span style={styles.actionIcon}>📤</span>
            <span style={styles.actionText}>Upload CSV</span>
          </button>

          <button
            style={styles.actionButton}
            onClick={() => navigate("/agents")}
          >
            <span style={styles.actionIcon}>👥</span>
            <span style={styles.actionText}>View All Agents</span>
          </button>

          <button
            style={styles.actionButton}
            onClick={() => navigate("/lists")}
          >
            <span style={styles.actionIcon}>📊</span>
            <span style={styles.actionText}>View Distributions</span>
          </button>
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
    marginBottom: "0.5rem",
  },
  welcome: {
    color: "#6b7280",
    fontSize: "1rem",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "3rem",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    transition: "transform 0.2s",
    cursor: "pointer",
  },
  statCard1: {
    borderLeft: "4px solid #3b82f6",
  },
  statCard2: {
    borderLeft: "4px solid #10b981",
  },
  statCard3: {
    borderLeft: "4px solid #f59e0b",
  },
  statCard4: {
    borderLeft: "4px solid #8b5cf6",
  },
  statIcon: {
    fontSize: "3rem",
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1f2937",
    margin: "0 0 0.25rem 0",
  },
  statLabel: {
    color: "#6b7280",
    fontSize: "0.9rem",
    margin: 0,
  },
  quickActions: {
    marginTop: "3rem",
  },
  sectionTitle: {
    color: "#1f2937",
    marginBottom: "1rem",
  },
  actionGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
  },
  actionButton: {
    backgroundColor: "white",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  actionIcon: {
    fontSize: "2rem",
  },
  actionText: {
    color: "#374151",
    fontSize: "0.95rem",
    fontWeight: "500",
  },
};

export default Dashboard;
