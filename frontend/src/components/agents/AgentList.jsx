import AgentCard from "./AgentCard";
import Loader from "../common/Loader";

const AgentList = ({ agents, loading, onDelete, onView }) => {
  if (loading) {
    return <Loader message="Loading agents..." />;
  }

  if (!agents || agents.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>👥</div>
        <h3 style={styles.emptyTitle}>No Agents Found</h3>
        <p style={styles.emptyText}>
          Get started by creating your first agent.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {agents.map((agent) => (
          <AgentCard
            key={agent._id}
            agent={agent}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1.5rem",
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "1rem",
  },
  emptyTitle: {
    color: "#1f2937",
    marginBottom: "0.5rem",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: "0.9rem",
  },
};

export default AgentList;
