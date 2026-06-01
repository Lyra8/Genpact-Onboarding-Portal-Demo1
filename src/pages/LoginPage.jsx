import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/onboardingApi";
import "./LoginPage.css";

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const auth = await login(username.trim(), password);
      onLogin(auth.user);
      navigate(auth.user.role === "Manager" ? "/manager-dashboard" : "/courses", {
        replace: true,
      });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-panel" onSubmit={handleSubmit}>
        <p className="login-kicker">Genpact Onboarding</p>
        <h1>Sign in</h1>
        <label className="login-field">
          Email
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="login-field">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <p className="login-error">{error}</p>}
        <button className="login-button" type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign in"}
        </button>
        <Link className="login-link" to="/signup">
          Create intern account
        </Link>
      </form>
    </div>
  );
}

export default LoginPage;

