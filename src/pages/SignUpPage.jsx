import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/onboardingApi";
import "./LoginPage.css";

function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await register(email.trim(), password, confirmPassword);
      setMessage("Account created successfully. Redirecting to login...");
      setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (err) {
      setError(err.message || "Sign up failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-panel" onSubmit={handleSubmit}>
        <p className="login-kicker">Genpact Onboarding</p>
        <h1>Sign up</h1>
        <label className="login-field">
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className="login-field">
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label className="login-field">
          Confirm password
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </label>
        {message && <p className="login-success">{message}</p>}
        {error && <p className="login-error">{error}</p>}
        <button className="login-button" type="submit" disabled={submitting}>
          {submitting ? "Creating..." : "Create account"}
        </button>
        <Link className="login-link" to="/login">Back to sign in</Link>
      </form>
    </div>
  );
}

export default SignUpPage;

