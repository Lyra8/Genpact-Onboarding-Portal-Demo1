import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchManagerProgress } from "../api/onboardingApi";
import "./Dashboard.css";

function Dashboard({ user }) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "Manager") {
      setLoading(false);
      return;
    }

    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchManagerProgress();
        setProgress(Array.isArray(data) ? data : []);
      } catch (err) {
        setProgress([]);
        setError(err.message || "Unable to load manager progress");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user?.role]);

  const internsById = progress.reduce((groups, row) => {
    if (!groups[row.intern_id]) {
      groups[row.intern_id] = {
        id: row.intern_id,
        name: row.intern_name,
        email: row.intern_email,
        courses: [],
      };
    }
    groups[row.intern_id].courses.push(row);
    return groups;
  }, {});

  const internList = Object.values(internsById);
  const doneCount = progress.filter((p) => p.status === "Done").length;
  const inProgressCount = progress.filter(
    (p) => p.status === "In Progress",
  ).length;
  const percent =
    progress.length > 0 ? Math.round((doneCount / progress.length) * 100) : 0;

  if (user?.role !== "Manager") {
    return (
      <div className="dashboard-page">
        <section className="manager-empty">
          <p className="section-kicker">Dashboard</p>
          <h1>Manager access required</h1>
          <p>
            This dashboard shows assigned intern progress for logged-in
            managers.
          </p>
        </section>
      </div>
    );
  }

  const stats = [
    { label: "Assigned Interns", value: internList.length },
    { label: "Progress Records", value: progress.length },
    { label: "In Progress", value: inProgressCount },
    { label: "Courses Done", value: doneCount },
  ];

  return (
    <div className="dashboard-page">
      <header className="dash-hero">
        <div className="dash-hero-content">
          <p className="dash-kicker">Manager Dashboard</p>
          <h1>Assigned intern progress</h1>
          <p className="dash-subtitle">Review course progress for interns.</p>
        </div>
        <div className="dash-user-card">
          <span>Signed in as</span>
          <strong>{user.email}</strong>
          <Link to="/manager/support">Manager Support</Link>
        </div>
      </header>

      <section className="dash-stats">
        {loading
          ? stats.map((_, i) => (
              <div className="stat-card stat-card--loading" key={i}>
                <div className="stat-shimmer" />
              </div>
            ))
          : stats.map((stat) => (
              <div className="stat-card" key={stat.label}>
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
      </section>

      {progress.length > 0 && !loading && (
        <div className="dash-progress-banner">
          <div className="progress-banner-header">
            <span className="progress-banner-title">
              Overall assigned progress
            </span>
            <span className="progress-banner-pct">{percent}%</span>
          </div>
          <div className="progress-banner-track">
            <div
              className="progress-banner-fill"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {error && <p className="section-message error-message">{error}</p>}

      <section className="manager-progress">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Assigned Interns</p>
            <h2>Course progress</h2>
          </div>
          <span className="count-badge">{internList.length} interns</span>
        </div>

        {loading && (
          <div className="loading-panel">Loading assigned progress...</div>
        )}

        {!loading && !error && internList.length === 0 && (
          <p className="empty-state">
            No progress records found for your assigned interns.
          </p>
        )}

        {!loading && internList.length > 0 && (
          <div className="intern-progress-list">
            {internList.map((intern) => (
              <article className="intern-progress-card" key={intern.id}>
                <div className="intern-progress-header">
                  <div>
                    <h3>{intern.name}</h3>
                    {intern.email && <p>{intern.email}</p>}
                  </div>
                  <span className="count-badge">
                    {intern.courses.length} courses
                  </span>
                </div>
                <div className="course-progress-table">
                  {intern.courses.map((course) => (
                    <div
                      className="course-progress-row"
                      key={`${intern.id}-${course.course_id}`}
                    >
                      <span>{course.course_title}</span>
                      <strong>{course.status}</strong>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
