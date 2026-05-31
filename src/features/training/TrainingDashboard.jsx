import { useCallback, useEffect, useMemo, useState } from "react";
import { updateProgress } from "../../api/onboardingApi";
import "./TrainingDashboard.css";

const DEFAULT_INTERN_ID = "00000000-0000-0000-0000-000000000001";

const STATUS_ORDER = ["Not Started", "In Progress", "Done"];

function TrainingDashboard({ courses, progress, isLoading, error, internId }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [progressMap, setProgressMap] = useState({});
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const intern = internId || DEFAULT_INTERN_ID;

  const weekOneCourses = useMemo(() => {
    return courses.filter((course) => course.week_number === 1);
  }, [courses]);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        weekOneCourses.map((course) => course.category).filter(Boolean),
      ),
    ];
  }, [weekOneCourses]);

  const filteredCourses = useMemo(() => {
    if (selectedCategory === "All") {
      return weekOneCourses;
    }
    return weekOneCourses.filter(
      (course) => course.category === selectedCategory,
    );
  }, [selectedCategory, weekOneCourses]);

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
    const total = filteredCourses.length;
    const done = filteredCourses.filter(
      (c) => getStatus(c.id) === "Done",
    ).length;
    const inProgress = filteredCourses.filter(
      (c) => getStatus(c.id) === "In Progress",
    ).length;
    const notStarted = total - done - inProgress;

    return { total, done, inProgress, notStarted };
  }, [filteredCourses, progressMap]);

  return (
    <section className="section-card training-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">US-02 / US-04</p>
          <h2>Week 1 Training & Progress</h2>
        </div>
        <span className="count-badge">
          {summary.done}/{summary.total} done
        </span>
      </div>

      <div className="training-controls">
        <label className="filter-field">
          <span>Category</span>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <div className="progress-summary">
          <span className="stat stat-done">{summary.done} Done</span>
          <span className="stat stat-progress">{summary.inProgress} In Progress</span>
          <span className="stat stat-pending">{summary.notStarted} Not Started</span>
        </div>
      </div>

      {isLoading && <p className="section-message">Loading courses...</p>}
      {error && <p className="section-message error-message">{error}</p>}

      <div className="course-list">
        {!isLoading &&
          !error &&
          filteredCourses.map((course) => {
            const status = getStatus(course.id);
            const isUpdating = updatingIds.has(course.id);

            return (
              <article className="course-row" key={course.id}>
                <div className="course-title-block">
                  <div>
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                  </div>
                </div>

                <div className="course-details">
                  <span className="course-meta">
                    {course.category} &middot; {course.duration_minutes} min
                    &middot; Week {course.week_number}
                  </span>

                  <div className="course-actions">
                    <span
                      className={`course-status ${
                        course.is_mandatory ? "mandatory" : "optional"
                      }`}
                    >
                      {course.is_mandatory ? "Mandatory" : "Optional"}
                    </span>

                    {course.content_url && (
                      <a
                        className="course-link"
                        href={course.content_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open course
                      </a>
                    )}
                  </div>
                </div>

                <div className="course-progress-row">
                  <label className="progress-label">Status</label>
                  <div className="progress-select-wrap">
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
                          {s}
                        </option>
                      ))}
                    </select>
                    {isUpdating && (
                      <span className="saving-indicator">Saving...</span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
      </div>

      {!isLoading && !error && filteredCourses.length === 0 && (
        <p className="empty-state">No courses match this category.</p>
      )}
    </section>
  );
}

export default TrainingDashboard;
