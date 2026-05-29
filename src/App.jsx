import { useEffect, useState } from "react";
import { fetchContacts, fetchCourses, fetchTools } from "./api/onboardingApi";
import ContactDirectory from "./features/contacts/ContactDirectory";
import TrainingDashboard from "./features/training/TrainingDashboard";
import ToolsList from "./features/tools/ToolsList";

function App() {
  const [tools, setTools] = useState([]);
  const [courses, setCourses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOnboardingData() {
      const [toolsData, coursesData, contactsData] = await Promise.all([
        fetchTools(),
        fetchCourses(),
        fetchContacts()
      ]);

      setTools(toolsData);
      setCourses(coursesData);
      setContacts(contactsData);
      setIsLoading(false);
    }

    loadOnboardingData();
  }, []);

  return (
    <main className="app-shell">
      <header className="portal-header">
        <div>
          <p className="eyebrow">Intern Onboarding Portal</p>
          <h1>Welcome to Genpact</h1>
          <p className="header-copy">
            Your Week 1 launch hub for required tools, mandatory learning, and
            the people who can help you get started.
          </p>
        </div>
        <div className="header-status" aria-label="Sprint status">
          <span>Sprint 1 UI</span>
          <strong>Demo Ready</strong>
        </div>
      </header>

      {isLoading ? (
        <section className="loading-panel">Loading onboarding resources...</section>
      ) : (
        <div className="dashboard-grid">
          <ToolsList tools={tools} />
          <TrainingDashboard courses={courses} />
          <ContactDirectory contacts={contacts} />
        </div>
      )}
    </main>
  );
}

export default App;
