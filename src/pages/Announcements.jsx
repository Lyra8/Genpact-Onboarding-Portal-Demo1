import { useEffect, useState } from "react";
import {
  createAnnouncement,
  fetchInternAnnouncements,
  fetchManagerAnnouncements,
} from "../api/onboardingApi";

function formatDate(value) {
  return value ? new Date(value).toLocaleString() : "";
}

function AnnouncementList({ items, emptyMessage }) {
  if (!items.length) {
    return <p className="empty-state">{emptyMessage}</p>;
  }

  return (
    <div className="intern-progress-list">
      {items.map((item) => (
        <article className="intern-progress-card" key={item.id}>
          <div className="intern-progress-header">
            <div>
              <h3>{item.title || "Reminder"}</h3>
              <p>{formatDate(item.posted_at)}</p>
            </div>
          </div>
          <p>{item.content}</p>
        </article>
      ))}
    </div>
  );
}

function Announcements({ user }) {
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const data =
        user?.role === "Manager"
          ? await fetchManagerAnnouncements()
          : await fetchInternAnnouncements();
      setAnnouncements(Array.isArray(data) ? data : []);
      setStatus("");
    } catch (err) {
      setStatus(err.message || "Unable to load announcements.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [user?.role]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!message.trim()) {
      return;
    }
    try {
      await createAnnouncement(message.trim());
      setMessage("");
      setStatus("Announcement posted.");
      await load();
    } catch (err) {
      setStatus(err.message || "Unable to post announcement.");
    }
  }

  return (
    <div className="dashboard-page">
      <section className="manager-progress">
        <div className="section-heading">
          <div>
            <p className="section-kicker">US-06 Announcements</p>
            <h2>{user?.role === "Manager" ? "Post reminder" : "Manager reminders"}</h2>
          </div>
        </div>

        {user?.role === "Manager" && (
          <form className="announcement-form" onSubmit={handleSubmit}>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={500}
              rows={4}
              placeholder="Write a short reminder for your interns"
            />
            <button className="login-button" type="submit">
              Post
            </button>
          </form>
        )}

        {status && <p className="section-message">{status}</p>}
        {loading ? (
          <div className="loading-panel">Loading announcements...</div>
        ) : (
          <AnnouncementList
            items={announcements}
            emptyMessage="No announcements yet."
          />
        )}
      </section>
    </div>
  );
}

export default Announcements;

