import { useEffect, useState } from "react";
import { fetchContacts } from "../api/onboardingApi";
import ContactDirectory from "../features/contacts/ContactDirectory";
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
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="support-page">
      <ContactDirectory contacts={contacts} isLoading={loading} error={error} />
    </div>
  );
}

export default Support;

