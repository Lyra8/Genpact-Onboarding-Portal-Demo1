import "./TrainingDashboard.css";

function TrainingDashboard({ courses }) {
  const completedCount = courses.filter(
    (course) => course.status === "Completed"
  ).length;

  return (
    <section className="section-card training-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">US-02</p>
          <h2>Week 1 Training Dashboard</h2>
        </div>
        <span className="count-badge">
          {completedCount}/{courses.length} complete
        </span>
      </div>

      <div className="course-list">
        {courses.map((course) => (
          <article className="course-row" key={course.id}>
            <div className="course-title-block">
              <h3>{course.title}</h3>
              <p>
                {course.provider} • {course.duration}
              </p>
            </div>

            <div className="course-details">
              <span>{course.dueDate}</span>
              <span className={`course-status ${course.status.replaceAll(" ", "-").toLowerCase()}`}>
                {course.status}
              </span>
            </div>

            <div className="progress-track" aria-label={`${course.progress}% complete`}>
              <span style={{ width: `${course.progress}%` }} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TrainingDashboard;
