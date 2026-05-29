import "./ToolsList.css";

function ToolsList({ tools }) {
  return (
    <section className="section-card tools-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">US-01</p>
          <h2>Required Software and Tools</h2>
        </div>
        <span className="count-badge">{tools.length} items</span>
      </div>

      <div className="tools-list">
        {tools.map((tool) => (
          <article className="tool-item" key={tool.id}>
            <div className="tool-main">
              <div>
                <h3>{tool.name}</h3>
                <p>{tool.requirement}</p>
              </div>
              <span className={`status-pill ${tool.status.toLowerCase()}`}>
                {tool.status}
              </span>
            </div>

            <div className="tool-meta">
              <span>{tool.category}</span>
              <span>{tool.estimatedTime}</span>
              <a href={tool.guideUrl} target="_blank" rel="noreferrer">
                Installation guide
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ToolsList;
