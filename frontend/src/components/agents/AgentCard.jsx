const AgentCard = ({ agent, onDelete, onView }) => {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${agent.name}?`)) {
      onDelete(agent._id);
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.avatar}>{agent.name.charAt(0).toUpperCase()}</div>
        <div style={styles.info}>
          <h3 style={styles.name}>{agent.name}</h3>
          <span
            style={{
              ...styles.status,
              ...(agent.isActive ? styles.statusActive : styles.statusInactive),
            }}
          >
            {agent.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      <div style={styles.details}>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>📧 Email:</span>
          <span style={styles.detailValue}>{agent.email}</span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>📱 Mobile:</span>
          <span style={styles.detailValue}>
            {agent.mobile.countryCode} {agent.mobile.number}
          </span>
        </div>
        <div style={styles.detailItem}>
          <span style={styles.detailLabel}>📅 Created:</span>
          <span style={styles.detailValue}>
            {new Date(agent.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div style={styles.actions}>
        <button style={styles.viewBtn} onClick={() => onView(agent._id)}>
          View Lists
        </button>
        <button style={styles.deleteBtn} onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "1.5rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",
    gap: "1rem",
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  info: {
    flex: 1,
  },
  name: {
    margin: "0 0 0.5rem 0",
    fontSize: "1.25rem",
    color: "#1f2937",
  },
  status: {
    padding: "0.25rem 0.75rem",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "500",
  },
  statusActive: {
    backgroundColor: "#d1fae5",
    color: "#065f46",
  },
  statusInactive: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  details: {
    marginBottom: "1rem",
  },
  detailItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.5rem 0",
    borderBottom: "1px solid #f3f4f6",
  },
  detailLabel: {
    color: "#6b7280",
    fontSize: "0.9rem",
  },
  detailValue: {
    color: "#1f2937",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  viewBtn: {
    flex: 1,
    padding: "0.5rem",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "background-color 0.3s",
  },
  deleteBtn: {
    flex: 1,
    padding: "0.5rem",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "background-color 0.3s",
  },
};

export default AgentCard;
