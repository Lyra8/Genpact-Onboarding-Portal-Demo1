import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: "◉" },
  { to: "/courses", label: "Courses", icon: "◈" },
  { to: "/tools", label: "Tools", icon: "◇" },
  { to: "/support", label: "Support", icon: "◉" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">G</span>
          <span className="brand-text">
            <strong>Genpact</strong>
            <small>Onboarding</small>
          </span>
        </NavLink>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span className={`hamburger ${menuOpen ? "open" : ""}`} />
        </button>

        <ul className={`navbar-links ${menuOpen ? "navbar-links--open" : ""}`}>
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `navbar-link ${isActive ? "navbar-link--active" : ""}`
                }
                onClick={() => setMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
