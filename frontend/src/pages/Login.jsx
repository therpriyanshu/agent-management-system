import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import ErrorMessage from "../components/common/ErrorMessage";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.header}>
          <h1 style={styles.title}>Agent Management System</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError("")} />}

        <LoginForm onSubmit={handleLogin} loading={loading} />

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Default credentials: <br />
            Email: <strong>admin@example.com</strong> <br />
            Password: <strong>admin123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    padding: "1rem",
  },
  loginBox: {
    width: "100%",
    maxWidth: "450px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    padding: "2rem",
  },
  header: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  title: {
    color: "#1f2937",
    fontSize: "1.75rem",
    marginBottom: "0.5rem",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "0.9rem",
  },
  footer: {
    marginTop: "1.5rem",
    padding: "1rem",
    backgroundColor: "#f9fafb",
    borderRadius: "4px",
    textAlign: "center",
  },
  footerText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "0.85rem",
    lineHeight: "1.6",
  },
};

export default Login;
