import { useMemo, useState } from "react";
import "./ToolsList.css";

function ToolsList({ tools, isLoading, error }) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    return ["All", ...new Set(tools.map((tool) => tool.category).filter(Boolean))];
  }, [tools]);

  const filteredTools = useMemo(() => {
    if (selectedCategory === "All") {
      return tools;
    }

    return tools.filter((tool) => tool.category === selectedCategory);
  }, [tools, selectedCategory]);

  return (
    <section className="section-card tools-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">US-01</p>
          <h2>Required Software and Tools</h2>
        </div>
        <span className="count-badge">{filteredTools.length} items</span>
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

      {isLoading && <p className="section-message">Loading tools...</p>}
      {error && <p className="section-message error-message">{error}</p>}

      <div className="tools-list">
        {!isLoading &&
          !error &&
          filteredTools.map((tool) => (
            <article className="tool-item" key={tool.id}>
              <div className="tool-main">
                <div>
                  <h3>{tool.name}</h3>
                  <p>{tool.description}</p>
                </div>
                <span
                  className={`status-pill ${
                    tool.is_required ? "required" : "recommended"
                  }`}
                >
                  {tool.is_required ? "Required" : "Optional"}
                </span>
              </div>

              <div className="tool-meta">
                <span>{tool.category}</span>
                {tool.download_url ? (
                  <a href={tool.download_url} target="_blank" rel="noreferrer">
                    Download guide
                  </a>
                ) : (
                  <span>Download link pending</span>
                )}
              </div>
            </article>
          ))}
      </div>

      {!isLoading && !error && filteredTools.length === 0 && (
        <p className="empty-state">No tools match this category.</p>
      )}
    </section>
  );
}

export default ToolsList;
