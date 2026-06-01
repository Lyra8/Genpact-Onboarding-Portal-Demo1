import { useEffect, useMemo, useState } from "react";
import { fetchUsers, updateUserManager, updateUserRole } from "../api/onboardingApi";
import "./ManagerUsers.css";

function ManagerUsers() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("");

  async function loadUsers() {
    try {
      setUsers(await fetchUsers());
      setStatus("");
    } catch (err) {
      setStatus(err.message || "Unable to load users.");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const managers = useMemo(() => users.filter((user) => user.role === "Manager"), [users]);

  async function changeRole(userId, role) {
    await updateUserRole(userId, role);
    await loadUsers();
  }

  async function changeManager(userId, managerId) {
    await updateUserManager(userId, managerId);
    await loadUsers();
  }

  return (
    <div className="manager-users-page">
      <header className="portal-header">
        <div>
          <p className="eyebrow">Manager Tools</p>
          <h1>User management</h1>
        </div>
      </header>
      {status && <p className="section-message">{status}</p>}
      <section className="manager-users-list">
        {users.map((user) => (
          <article className="manager-user-row" key={user.id}>
            <div>
              <h2>{user.email}</h2>
              <p>{user.role}</p>
            </div>
            <label className="filter-field">
              Role
              <select value={user.role} onChange={(e) => changeRole(user.id, e.target.value)}>
                <option value="Intern">Intern</option>
                <option value="Manager">Manager</option>
              </select>
            </label>
            <label className="filter-field">
              Manager
              <select value={user.manager_id || ""} disabled={user.role !== "Intern"} onChange={(e) => changeManager(user.id, e.target.value)}>
                <option value="">Unassigned</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>{manager.email}</option>
                ))}
              </select>
            </label>
          </article>
        ))}
      </section>
    </div>
  );
}

export default ManagerUsers;

