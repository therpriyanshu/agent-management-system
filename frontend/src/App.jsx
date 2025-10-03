import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Loader from "./components/common/Loader";
import Navbar from "./components/common/Navbar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Agents from "./pages/Agents";
import Dashboard from "./pages/Dashboard";
import Lists from "./pages/Lists";
import Login from "./pages/Login";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <Loader message="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout Component
const Layout = ({ children }) => {
  return (
    <div style={styles.layout}>
      <Navbar />
      <main style={styles.main}>{children}</main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/agents"
            element={
              <ProtectedRoute>
                <Layout>
                  <Agents />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/lists"
            element={
              <ProtectedRoute>
                <Layout>
                  <Lists />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 - Not Found */}
          <Route
            path="*"
            element={
              <div style={styles.notFound}>
                <h1 style={styles.notFoundTitle}>404</h1>
                <p style={styles.notFoundText}>Page not found</p>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const styles = {
  layout: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
  },
  main: {
    minHeight: "calc(100vh - 70px)",
  },
  notFound: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
  },
  notFoundTitle: {
    fontSize: "6rem",
    color: "#3b82f6",
    margin: 0,
  },
  notFoundText: {
    fontSize: "1.5rem",
    color: "#6b7280",
  },
};

export default App;
