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
    let cancelled = false;

    async function loadOnboardingData() {
      const requests = [
        { key: "tools", load: fetchTools, update: setTools },
        { key: "courses", load: fetchCourses, update: setCourses },
        { key: "contacts", load: fetchContacts, update: setContacts },
      ];

      const results = await Promise.allSettled(
        requests.map(async ({ key, load, update }) => {
          const data = await load();
          if (cancelled) return;
          update(data);
          setLoadingState((prev) => ({ ...prev, [key]: false }));
        })
      );

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const key = requests[i].key;
        if (result.status === "rejected" && !cancelled) {
          setErrorState((prev) => ({
            ...prev,
            [key]: result.reason?.message || "Unable to load this section.",
          }));
          setLoadingState((prev) => ({ ...prev, [key]: false }));
        }
      }
    }

    loadOnboardingData();
    return () => { cancelled = true; };
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
