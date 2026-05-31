import { useEffect, useState } from "react";
import { fetchTools } from "../api/onboardingApi";
import ToolsList from "../features/tools/ToolsList";

function Tools() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchTools();
        setTools(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Unable to load tools.");
        setTools([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return <ToolsList tools={tools} isLoading={loading} error={error} />;
}

export default Tools;
