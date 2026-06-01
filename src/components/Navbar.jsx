import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const NAV_ITEMS = [
  {
    to: "/manager-dashboard",
    label: "Manager Dashboard",
    icon: "M",
    roles: ["Manager"],
  },
  { to: "/announcements", label: "Announcements", icon: "A" },
  { to: "/manager/users", label: "Users", icon: "U", roles: ["Manager"] },
  {
    to: "/manager/support",
    label: "Manager Support",
    icon: "H",
    roles: ["Manager"],
  },
  { to: "/manager/profile", label: "Profile", icon: "P", roles: ["Manager"] },
  { to: "/courses", label: "Courses", icon: "C", roles: ["Intern"] },
  { to: "/tools", label: "Tools", icon: "T", roles: ["Intern"] },
  { to: "/support", label: "Support", icon: "S", roles: ["Intern"] },
];

function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || item.roles.includes(user?.role),
  );

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink
          to="/"
          className="navbar-brand"
          onClick={() => setMenuOpen(false)}
        >
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
          {visibleItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end
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
          <li className="navbar-user">
            <span>{user?.role}</span>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onLogout();
              }}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
