import { useAuth } from "../../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.brand} onClick={() => navigate("/dashboard")}>
          <h2 style={styles.brandText}>Agent Management</h2>
        </div>

        {user && (
          <div style={styles.navLinks}>
            <button
              style={{
                ...styles.navLink,
                ...(isActive("/dashboard") ? styles.navLinkActive : {}),
              }}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
            <button
              style={{
                ...styles.navLink,
                ...(isActive("/agents") ? styles.navLinkActive : {}),
              }}
              onClick={() => navigate("/agents")}
            >
              Agents
            </button>
            <button
              style={{
                ...styles.navLink,
                ...(isActive("/lists") ? styles.navLinkActive : {}),
              }}
              onClick={() => navigate("/lists")}
            >
              Lists
            </button>
          </div>
        )}

        {user && (
          <div style={styles.userSection}>
            <span style={styles.userName}>{user.name}</span>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
const styles = {
  navbar: {
    backgroundColor: "#1e293b",
    color: "white",
    padding: "1rem 0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    cursor: "pointer",
  },
  brandText: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    gap: "1rem",
    flex: 1,
    justifyContent: "center",
  },
  navLink: {
    background: "none",
    border: "none",
    color: "white",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontSize: "1rem",
    borderRadius: "4px",
    transition: "background-color 0.3s",
  },
  navLinkActive: {
    // Changed from backgroundColor to background
    background: "#334155",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  userName: {
    fontSize: "0.9rem",
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.9rem",
    transition: "background-color 0.3s",
  },
};
export default Navbar;
