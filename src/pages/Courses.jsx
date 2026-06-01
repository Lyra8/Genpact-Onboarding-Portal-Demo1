import { useEffect, useState } from "react";
import { fetchCourses, fetchProgress } from "../api/onboardingApi";
import TrainingDashboard from "../features/training/TrainingDashboard";

function Courses({ user }) {
  const [courses, setCourses] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const internId = user?.id;

  useEffect(() => {
    async function load() {
      if (!internId) {
        setError("Unable to identify logged-in intern.");
        setLoading(false);
        return;
      }

      try {
        const [c, p] = await Promise.all([
          fetchCourses(),
          fetchProgress(internId),
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
  }, [internId]);

  return (
    <TrainingDashboard
      courses={courses}
      progress={progress}
      isLoading={loading}
      error={error}
      internId={internId}
    />
  );
}

export default Courses;
