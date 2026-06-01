import "./ManagerSupport.css";

const SUPPORT_SECTIONS = [
  ["Dashboard Issues", "Help with missing intern progress or dashboard loading errors.", "dashboard-support@genpact.com"],
  ["Progress Reporting", "Escalate course records that look incorrect.", "onboarding-reporting@genpact.com"],
  ["Announcements", "Support for failed reminder posts or urgent corrections.", "manager-comms@genpact.com"],
  ["HR/Admin Escalation", "Role assignment and manager/intern mapping help.", "hr-admin@genpact.com"],
];

function ManagerSupport() {
  return (
    <div className="manager-support-page">
      <header className="portal-header">
        <div>
          <p className="eyebrow">Manager Support</p>
          <h1>Manager help desk</h1>
          <p className="header-copy">Support channels for manager-only workflows.</p>
        </div>
      </header>
      <section className="manager-support-grid">
        {SUPPORT_SECTIONS.map(([title, description, contact]) => (
          <article className="manager-support-card" key={title}>
            <h2>{title}</h2>
            <p>{description}</p>
            <a href={`mailto:${contact}`}>{contact}</a>
          </article>
        ))}
      </section>
    </div>
  );
}

export default ManagerSupport;

