const ErrorMessage = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div style={styles.container}>
      <div style={styles.errorBox}>
        <div style={styles.iconContainer}>
          <span style={styles.icon}>⚠️</span>
        </div>
        <div style={styles.content}>
          <p style={styles.message}>{message}</p>
        </div>
        {onClose && (
          <button style={styles.closeBtn} onClick={onClose}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: "1rem",
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    position: "relative",
  },
  iconContainer: {
    flexShrink: 0,
  },
  icon: {
    fontSize: "1.5rem",
  },
  content: {
    flex: 1,
  },
  message: {
    margin: 0,
    color: "#991b1b",
    fontSize: "0.9rem",
  },
  closeBtn: {
    position: "absolute",
    top: "0.5rem",
    right: "0.5rem",
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#991b1b",
    padding: "0",
    lineHeight: 1,
  },
};

export default ErrorMessage;
