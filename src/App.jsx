import { useEffect, useState } from "react";
import { fetchContacts, fetchCourses, fetchTools } from "./api/onboardingApi";
import ContactDirectory from "./features/contacts/ContactDirectory";
import TrainingDashboard from "./features/training/TrainingDashboard";
import ToolsList from "./features/tools/ToolsList";

function App() {
  const [tools, setTools] = useState([]);
  const [courses, setCourses] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loadingState, setLoadingState] = useState({
    tools: true,
    courses: true,
    contacts: true
  });
  const [errorState, setErrorState] = useState({
    tools: "",
    courses: "",
    contacts: ""
  });

  useEffect(() => {
    async function loadOnboardingData() {
      const requests = [
        { key: "tools", load: fetchTools, update: setTools },
        { key: "courses", load: fetchCourses, update: setCourses },
        { key: "contacts", load: fetchContacts, update: setContacts }
      ];

      requests.forEach(async ({ key, load, update }) => {
        try {
          const data = await load();
          update(data);
        } catch (error) {
          setErrorState((current) => ({
            ...current,
            [key]: error.message || "Unable to load this section."
          }));
        } finally {
          setLoadingState((current) => ({ ...current, [key]: false }));
        }
      });
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

      <div className="dashboard-grid">
        <ToolsList
          tools={tools}
          isLoading={loadingState.tools}
          error={errorState.tools}
        />
        <TrainingDashboard
          courses={courses}
          isLoading={loadingState.courses}
          error={errorState.courses}
        />
        <ContactDirectory
          contacts={contacts}
          isLoading={loadingState.contacts}
          error={errorState.contacts}
        />
      </div>
    </main>
  );
}

export default App;
