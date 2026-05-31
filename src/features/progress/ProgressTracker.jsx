import { useCallback, useEffect, useMemo, useState } from "react";
import { updateProgress } from "../../api/onboardingApi";
import "./ProgressTracker.css";

const DEFAULT_INTERN_ID = "00000000-0000-0000-0000-000000000001";

const STATUS_LABELS = {
  "Not Started": "Not Started",
  "In Progress": "In Progress",
  Done: "Done",
};

const STATUS_ORDER = ["Not Started", "In Progress", "Done"];

function ProgressTracker({ courses, progress, isLoading, error, internId }) {
  const [progressMap, setProgressMap] = useState({});
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const weekOneCourses = useMemo(() => {
    return courses.filter((course) => course.week_number === 1);
  }, [courses]);

  const intern = internId || DEFAULT_INTERN_ID;

  useEffect(() => {
    const map = {};
    progress.forEach((entry) => {
      map[entry.course_id] = entry.status;
    });
    setProgressMap(map);
  }, [progress]);

  const getStatus = (courseId) => {
    return progressMap[courseId] || "Not Started";
  };

  const handleStatusChange = useCallback(
    async (courseId, newStatus) => {
      setUpdatingIds((prev) => new Set(prev).add(courseId));
      setProgressMap((prev) => ({ ...prev, [courseId]: newStatus }));

      try {
        await updateProgress(courseId, newStatus, intern);
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(courseId);
          return next;
        });
      }
    },
    [intern],
  );

  const summary = useMemo(() => {
    const total = weekOneCourses.length;
    const done = weekOneCourses.filter(
      (c) => getStatus(c.id) === "Done",
    ).length;
    const inProgress = weekOneCourses.filter(
      (c) => getStatus(c.id) === "In Progress",
    ).length;
    const notStarted = total - done - inProgress;

    return { total, done, inProgress, notStarted, percent: total ? Math.round((done / total) * 100) : 0 };
  }, [weekOneCourses, progressMap]);

  return (
    <section className="section-card progress-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">US-04</p>
          <h2>Course Progress Tracker</h2>
        </div>
        <span className="count-badge">
          {summary.done}/{summary.total} done
        </span>
      </div>

      <div className="progress-summary-bar">
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${summary.percent}%` }}
          />
        </div>
        <div className="progress-stats">
          <span className="stat stat-done">{summary.done} Done</span>
          <span className="stat stat-progress">{summary.inProgress} In Progress</span>
          <span className="stat stat-pending">{summary.notStarted} Not Started</span>
        </div>
      </div>

      {isLoading && <p className="section-message">Loading progress...</p>}
      {error && <p className="section-message error-message">{error}</p>}

      <div className="progress-list">
        {!isLoading &&
          !error &&
          weekOneCourses.map((course) => {
            const status = getStatus(course.id);
            const isUpdating = updatingIds.has(course.id);

            return (
              <article className="progress-row" key={course.id}>
                <div className="progress-course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <span className="progress-meta">
                    {course.category} &middot; {course.duration_minutes} min
                    &middot;{" "}
                    {course.is_mandatory ? "Mandatory" : "Optional"}
                  </span>
                </div>

                <div className="progress-status-control">
                  <select
                    className={`status-select status-${status.toLowerCase().replace(/\s+/g, "-")}`}
                    value={status}
                    disabled={isUpdating}
                    onChange={(e) =>
                      handleStatusChange(course.id, e.target.value)
                    }
                  >
                    {STATUS_ORDER.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  {isUpdating && <span className="saving-indicator">Saving...</span>}
                </div>
              </article>
            );
          })}
      </div>

      {!isLoading && !error && weekOneCourses.length === 0 && (
        <p className="empty-state">No courses found for Week 1.</p>
      )}
    </section>
  );
}

export default ProgressTracker;
