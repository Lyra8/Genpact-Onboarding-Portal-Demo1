import { useMemo, useState } from "react";
import "./TrainingDashboard.css";

function TrainingDashboard({ courses, isLoading, error }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const weekOneCourses = useMemo(() => {
    return courses.filter((course) => course.week_number === 1);
  }, [courses]);

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(weekOneCourses.map((course) => course.category).filter(Boolean))
    ];
  }, [weekOneCourses]);

  const filteredCourses = useMemo(() => {
    if (selectedCategory === "All") {
      return weekOneCourses;
    }

    return weekOneCourses.filter((course) => course.category === selectedCategory);
  }, [selectedCategory, weekOneCourses]);

  return (
    <section className="section-card training-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">US-02</p>
          <h2>Week 1 Training Dashboard</h2>
        </div>
        <span className="count-badge">{filteredCourses.length} courses</span>
      </div>

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

      {isLoading && <p className="section-message">Loading courses...</p>}
      {error && <p className="section-message error-message">{error}</p>}

      <div className="course-list">
        {!isLoading &&
          !error &&
          filteredCourses.map((course) => (
            <article className="course-row" key={course.id}>
              <div className="course-title-block">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>

              <div className="course-details">
                <span>
                  {course.category} | {course.duration_minutes} min | Week{" "}
                  {course.week_number}
                </span>
                <span
                  className={`course-status ${
                    course.is_mandatory ? "mandatory" : "optional"
                  }`}
                >
                  {course.is_mandatory ? "Mandatory" : "Optional"}
                </span>
              </div>

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
            </article>
          ))}
      </div>

      {!isLoading && !error && filteredCourses.length === 0 && (
        <p className="empty-state">No courses match this category.</p>
      )}
    </section>
  );
}

export default TrainingDashboard;
