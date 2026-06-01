import "./WeekOneSchedule.css";

const SCHEDULE = [
  {
    day: "Day 1",
    title: "Orientation & Welcome Session",
    description:
      "Meet your cohort and leadership. Overview of Genpact culture, values, and the 8-week internship roadmap. HR will verify your paperwork and issue credentials.",
    time: "9:00 AM – 3:00 PM",
  },
  {
    day: "Day 2",
    title: "IT Setup & Tools Installation",
    description:
      "Configure your laptop, connect to VPN, set up Microsoft Teams and Outlook. Review the required software checklist under US-01 and confirm all access is working.",
    time: "9:00 AM – 5:00 PM",
  },
  {
    day: "Day 3",
    title: "Mandatory Training: Compliance & Security",
    description:
      "Complete Code of Conduct and Information Security Basics. These are tracked in your Progress Dashboard. All Week 1 mandatory courses should be started today.",
    time: "9:00 AM – 4:00 PM",
  },
  {
    day: "Day 4",
    title: "Team Meet & Project Introduction",
    description:
      "Meet your mentor and project team. Receive your Week 1 mini-project brief. Set up your development environment and review the project repository.",
    time: "10:00 AM – 4:00 PM",
  },
  {
    day: "Day 5",
    title: "Wrap-Up & Next Steps",
    description:
      "Complete any remaining Week 1 courses. Submit your onboarding checklist. Join the all-hands Q&A session and review the Week 2 preview.",
    time: "9:00 AM – 2:00 PM",
  },
];

function WeekOneSchedule() {
  return (
    <section className="section-card schedule-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">US-05</p>
          <h2>Week 1 Onboarding Timeline</h2>
        </div>
      </div>

      <ol className="timeline">
        {SCHEDULE.map((item, index) => (
          <li className="timeline-item" key={item.day}>
            <div className="timeline-marker">
              <span className="timeline-dot" />
              {index < SCHEDULE.length - 1 && <span className="timeline-line" />}
            </div>

            <div className="timeline-card">
              <div className="timeline-card-header">
                <span className="timeline-day">{item.day}</span>
                <span className="timeline-time">{item.time}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default WeekOneSchedule;
