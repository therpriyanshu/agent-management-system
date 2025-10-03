import { useState } from "react";
import ListItem from "./ListItem";
import Loader from "../common/Loader";

const DistributedLists = ({ summaries, lists, loading, onSelectBatch }) => {
  const [selectedBatch, setSelectedBatch] = useState(null);

  const handleBatchSelect = (batch) => {
    setSelectedBatch(batch);
    onSelectBatch(batch);
  };

  if (loading) {
    return <Loader message="Loading distributions..." />;
  }

  if (!summaries || summaries.length === 0) {
    return (
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>📋</div>
        <h3 style={styles.emptyTitle}>No Distributions Yet</h3>
        <p style={styles.emptyText}>
          Upload a CSV file to distribute lists among agents.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.summarySection}>
        <h3 style={styles.sectionTitle}>Upload History</h3>
        <div style={styles.summaryList}>
          {summaries.map((summary) => (
            <div
              key={summary.uploadBatch}
              style={{
                ...styles.summaryCard,
                ...(selectedBatch === summary.uploadBatch
                  ? styles.summaryCardActive
                  : {}),
              }}
              onClick={() => handleBatchSelect(summary.uploadBatch)}
            >
              <div style={styles.summaryHeader}>
                <span style={styles.batchId}>
                  Batch: {summary.uploadBatch.split("_")[1].substring(0, 8)}...
                </span>
                <span style={styles.totalItems}>
                  {summary.totalItems} items
                </span>
              </div>

              <div style={styles.summaryDate}>
                📅 {new Date(summary.uploadDate).toLocaleString()}
              </div>

              <div style={styles.distributionGrid}>
                {summary.distribution.map((dist) => (
                  <div key={dist.agentId} style={styles.agentDistribution}>
                    <span style={styles.agentName}>{dist.agentName}</span>
                    <span style={styles.itemCount}>
                      {dist.itemsCount} items
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedBatch && lists && lists.length > 0 && (
        <div style={styles.listsSection}>
          <h3 style={styles.sectionTitle}>List Items ({lists.length} total)</h3>
          <div style={styles.listItems}>
            {lists.map((item) => (
              <ListItem key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: "100%",
  },
  summarySection: {
    marginBottom: "2rem",
  },
  sectionTitle: {
    color: "#1f2937",
    marginBottom: "1rem",
  },
  summaryList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1rem",
  },
  summaryCard: {
    backgroundColor: "white",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    padding: "1rem",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  summaryCardActive: {
    borderColor: "#3b82f6",
    boxShadow: "0 4px 6px rgba(59, 130, 246, 0.1)",
  },
  summaryHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
  },
  batchId: {
    color: "#6b7280",
    fontSize: "0.85rem",
    fontFamily: "monospace",
  },
  totalItems: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    padding: "0.25rem 0.5rem",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "600",
  },
  summaryDate: {
    color: "#6b7280",
    fontSize: "0.85rem",
    marginBottom: "1rem",
  },
  distributionGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  agentDistribution: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem",
    backgroundColor: "#f9fafb",
    borderRadius: "4px",
  },
  agentName: {
    color: "#374151",
    fontSize: "0.9rem",
    fontWeight: "500",
  },
  itemCount: {
    color: "#6b7280",
    fontSize: "0.85rem",
  },
  listsSection: {
    marginTop: "2rem",
  },
  listItems: {
    maxHeight: "600px",
    overflowY: "auto",
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

export default DistributedLists;
