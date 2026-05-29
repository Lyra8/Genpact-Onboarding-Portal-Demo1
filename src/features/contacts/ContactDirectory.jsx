import { useMemo, useState } from "react";
import "./ContactDirectory.css";

function ContactDirectory({ contacts }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) {
      return contacts;
    }

    return contacts.filter((contact) => {
      const searchableText = [
        contact.name,
        contact.role,
        contact.team,
        contact.location,
        ...contact.tags
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [contacts, searchTerm]);

  return (
    <section className="section-card contacts-section">
      <div className="section-heading contacts-heading">
        <div>
          <p className="section-kicker">US-03</p>
          <h2>Support Contacts and Mentors</h2>
        </div>
        <label className="search-field">
          <span>Search contacts</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name, role, team, or topic"
          />
        </label>
      </div>

      <div className="contacts-grid">
        {filteredContacts.map((contact) => (
          <article className="contact-card" key={contact.id}>
            <div className="contact-avatar" aria-hidden="true">
              {contact.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </div>

            <div className="contact-content">
              <h3>{contact.name}</h3>
              <p className="contact-role">{contact.role}</p>
              <p className="contact-meta">
                {contact.team} • {contact.location}
              </p>

              <div className="contact-actions">
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
              </div>

              <div className="tag-list">
                {contact.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <p className="empty-state">No contacts match your search.</p>
      )}
    </section>
  );
}

export default ContactDirectory;
