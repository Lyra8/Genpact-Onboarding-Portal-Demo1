import { useMemo, useState } from "react";
import "./ContactDirectory.css";

function ContactDirectory({ contacts, isLoading, error }) {
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
        contact.department,
        contact.email
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
            placeholder="Search by name, role, department, or email"
          />
        </label>
      </div>

      {isLoading && <p className="section-message">Loading contacts...</p>}
      {error && <p className="section-message error-message">{error}</p>}

      <div className="contacts-grid">
        {!isLoading &&
          !error &&
          filteredContacts.map((contact) => (
            <article className="contact-card" key={contact.id}>
              <div className="contact-avatar" aria-hidden="true">
                {contact.name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </div>

              <div className="contact-content">
                <div className="contact-name-row">
                  <h3>{contact.name}</h3>
                  {contact.is_primary && <span className="primary-badge">Primary</span>}
                </div>
                <p className="contact-role">{contact.role}</p>
                <p className="contact-meta">{contact.department}</p>

                <div className="contact-actions">
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                  )}
                </div>
              </div>
            </article>
          ))}
      </div>

      {!isLoading && !error && filteredContacts.length === 0 && (
        <p className="empty-state">No contacts match your search.</p>
      )}
    </section>
  );
}

export default ContactDirectory;
