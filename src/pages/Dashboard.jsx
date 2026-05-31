import { useEffect, useState } from "react";
import {
  fetchContacts,
  fetchCourses,
  fetchProgress,
  fetchTools,
} from "../api/onboardingApi";
import WeekOneSchedule from "../features/schedule/WeekOneSchedule";
import "./Dashboard.css";

const DEFAULT_INTERN_ID = "00000000-0000-0000-0000-000000000001";

function Dashboard() {
  const [tools, setTools] = useState([]);
  const [courses, setCourses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [t, c, cnt, p] = await Promise.all([
          fetchTools(),
          fetchCourses(),
          fetchContacts(),
          fetchProgress(DEFAULT_INTERN_ID),
        ]);
        setTools(Array.isArray(t) ? t : []);
        setCourses(Array.isArray(c) ? c : []);
        setContacts(Array.isArray(cnt) ? cnt : []);
        setProgress(Array.isArray(p) ? p : []);
      } catch {
        setTools([]);
        setCourses([]);
        setContacts([]);
        setProgress([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const weekOneCourses = courses.filter((c) => c.week_number === 1);
  const doneCount = progress.filter((p) => p.status === "Done").length;
  const totalMandatory = weekOneCourses.filter((c) => c.is_mandatory).length;
  const percent = totalMandatory > 0 ? Math.round((doneCount / totalMandatory) * 100) : 0;

  const stats = [
    { label: "Tools Available", value: tools.length, accent: "#95B1EE" },
    { label: "Week 1 Courses", value: weekOneCourses.length, accent: "#95B1EE" },
    { label: "Courses Done", value: `${doneCount}/${totalMandatory}`, accent: "#E7F1A8" },
    { label: "Support Contacts", value: contacts.length, accent: "#95B1EE" },
  ];

  return (
    <div className="dashboard-page">
      <header className="dash-hero">
        <div className="dash-hero-content">
          <p className="dash-kicker">Intern Onboarding Portal</p>
          <h1>Welcome to Genpact</h1>
          <p className="dash-subtitle">
            Your Week 1 launch hub for required tools, mandatory learning, and
            the people who can help you get started.
          </p>
        </div>
        <div className="dash-hero-visual">
          <div className="hero-circle hero-circle--lg" />
          <div className="hero-circle hero-circle--md" />
          <div className="hero-circle hero-circle--sm" />
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

      {totalMandatory > 0 && !loading && (
        <div className="dash-progress-banner">
          <div className="progress-banner-header">
            <span className="progress-banner-title">Mandatory Training Progress</span>
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

      <section className="dash-schedule">
        <WeekOneSchedule />
      </section>
    </div>
  );
}

export default Dashboard;
