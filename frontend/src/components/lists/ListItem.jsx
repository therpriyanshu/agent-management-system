import { STATUS_COLORS } from "../../utils/constants";

const ListItem = ({ item }) => {
  return (
    <div style={styles.item}>
      <div style={styles.content}>
        <div style={styles.mainInfo}>
          <h4 style={styles.name}>{item.firstName}</h4>
          <span
            style={{
              ...styles.status,
              backgroundColor: STATUS_COLORS[item.status],
            }}
          >
            {item.status}
          </span>
        </div>

        <div style={styles.details}>
          <div style={styles.detailRow}>
            <span style={styles.label}>📞 Phone:</span>
            <span style={styles.value}>{item.phone}</span>
          </div>

          {item.notes && (
            <div style={styles.detailRow}>
              <span style={styles.label}>📝 Notes:</span>
              <span style={styles.value}>{item.notes}</span>
            </div>
          )}

          {item.assignedTo && (
            <div style={styles.detailRow}>
              <span style={styles.label}>👤 Assigned To:</span>
              <span style={styles.value}>{item.assignedTo.name}</span>
            </div>
          )}

          <div style={styles.detailRow}>
            <span style={styles.label}>📅 Created:</span>
            <span style={styles.value}>
              {new Date(item.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  item: {
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem",
    transition: "box-shadow 0.2s",
  },
  content: {
    width: "100%",
  },
  mainInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  name: {
    margin: 0,
    color: "#1f2937",
    fontSize: "1.1rem",
  },
  status: {
    padding: "0.25rem 0.75rem",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "500",
    color: "white",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  detailRow: {
    display: "flex",
    gap: "0.5rem",
  },
  label: {
    color: "#6b7280",
    fontSize: "0.9rem",
    minWidth: "120px",
  },
  value: {
    color: "#1f2937",
    fontSize: "0.9rem",
    fontWeight: "500",
    flex: 1,
  },
};

export default ListItem;
