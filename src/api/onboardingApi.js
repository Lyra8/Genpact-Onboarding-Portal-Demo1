import { mockContacts, mockCourses, mockProgress, mockTools } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const FETCH_TIMEOUT = 5000;

function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(timer)
  );
}

function safeFallback(endpoint, fallbackData, reason) {
  console.warn(`Using mock data for ${endpoint}: ${reason}`);
  return Array.isArray(fallbackData) ? fallbackData : [];
}

async function getFromApi(endpoint, fallbackData) {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      return safeFallback(
        endpoint,
        fallbackData,
        `backend returned ${response.status}`
      );
    }

    const result = await response.json();

    if (!Array.isArray(result?.data)) {
      return safeFallback(endpoint, fallbackData, "response data was not an array");
    }

    return result.data;
  } catch (error) {
    return safeFallback(
      endpoint,
      fallbackData,
      error.message || "backend is unavailable"
    );
  }
}

export function fetchTools() {
  return getFromApi("/api/tools", mockTools);
}

export function fetchCourses() {
  return getFromApi("/api/courses", mockCourses);
}

export function fetchContacts() {
  return getFromApi("/api/contacts", mockContacts);
}

export function fetchProgress(internId) {
  const endpoint = `/api/progress?intern_id=${encodeURIComponent(internId)}`;
  return getFromApi(endpoint, mockProgress);
}

export async function updateProgress(courseId, status, internId) {
  const url = `${API_BASE_URL}/api/progress/${encodeURIComponent(courseId)}?intern_id=${encodeURIComponent(internId)}`;

  try {
    const response = await fetchWithTimeout(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.warn(`Progress update failed, using local state: ${error.message}`);
    return { course_id: courseId, status };
  }
}

export async function fetchHealth() {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/health`);

    if (!response.ok) {
      console.warn(`Health check failed with status ${response.status}`);
      return { status: "offline" };
    }

    return response.json();
  } catch (error) {
    console.warn("Health check unavailable:", error.message);
    return { status: "offline" };
  }
}
