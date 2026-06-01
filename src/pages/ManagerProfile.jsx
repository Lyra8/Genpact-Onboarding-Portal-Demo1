import { useEffect, useState } from "react";
import { changeManagerPassword, fetchManagerProfile } from "../api/onboardingApi";
import "./ManagerProfile.css";
import "./LoginPage.css";

function ManagerProfile() {
  const [profile, setProfile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchManagerProfile().then(setProfile).catch((err) => setMessage(err.message));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (newPassword.length < 8) {
      setMessage("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    try {
      const result = await changeManagerPassword(currentPassword, newPassword, confirmPassword);
      setMessage(result.message || "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage(err.message || "Unable to update password.");
    }
  }

  return (
    <div className="manager-profile-page">
      <header className="portal-header">
        <div>
          <p className="eyebrow">Manager Profile</p>
          <h1>Account settings</h1>
        </div>
      </header>
      <section className="profile-grid">
        <article className="profile-card">
          <h2>Account information</h2>
          {profile && (
            <dl className="profile-details">
              <div><dt>Email</dt><dd>{profile.email}</dd></div>
              <div><dt>Role</dt><dd>{profile.role}</dd></div>
              <div><dt>User ID</dt><dd>{profile.id}</dd></div>
              <div><dt>Manager ID</dt><dd>{profile.manager_id || "Not assigned"}</dd></div>
            </dl>
          )}
        </article>
        <article className="profile-card">
          <h2>Change password</h2>
          <form className="profile-password-form" onSubmit={handleSubmit}>
            <label className="login-field">Current password<input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required /></label>
            <label className="login-field">New password<input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /></label>
            <label className="login-field">Confirm new password<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></label>
            {message && <p className="section-message">{message}</p>}
            <button className="login-button" type="submit">Update password</button>
          </form>
        </article>
      </section>
    </div>
  );
}

export default ManagerProfile;

