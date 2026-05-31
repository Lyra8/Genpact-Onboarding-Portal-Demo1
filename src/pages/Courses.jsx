import { useEffect, useState } from "react";
import { fetchCourses, fetchProgress } from "../api/onboardingApi";
import TrainingDashboard from "../features/training/TrainingDashboard";

const DEFAULT_INTERN_ID = "00000000-0000-0000-0000-000000000001";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [c, p] = await Promise.all([
          fetchCourses(),
          fetchProgress(DEFAULT_INTERN_ID),
        ]);
        setCourses(Array.isArray(c) ? c : []);
        setProgress(Array.isArray(p) ? p : []);
      } catch (err) {
        setError(err.message || "Unable to load courses.");
        setCourses([]);
        setProgress([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <TrainingDashboard
      courses={courses}
      progress={progress}
      isLoading={loading}
      error={error}
    />
  );
}

export default Courses;
