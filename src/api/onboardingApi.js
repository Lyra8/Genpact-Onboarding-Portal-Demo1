import { mockContacts, mockCourses, mockTools } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function safeFallback(endpoint, fallbackData, reason) {
  console.warn(`Using mock data for ${endpoint}: ${reason}`);
  return Array.isArray(fallbackData) ? fallbackData : [];
}

async function getFromApi(endpoint, fallbackData) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

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

export async function fetchHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);

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
