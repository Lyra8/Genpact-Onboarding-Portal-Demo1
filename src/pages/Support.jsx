import { useEffect, useState } from "react";
import { fetchContacts } from "../api/onboardingApi";
import ContactDirectory from "../features/contacts/ContactDirectory";
import FaqResources from "../features/faq/FaqResources";
import "./Support.css";

function Support() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchContacts();
        setContacts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Unable to load contacts.");
        setContacts([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="support-page">
      <ContactDirectory
        contacts={contacts}
        isLoading={loading}
        error={error}
      />
      <FaqResources />
    </div>
  );
}

export default Support;
