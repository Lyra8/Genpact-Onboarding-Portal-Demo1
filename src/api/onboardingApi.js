import { mockContacts, mockCourses, mockTools } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

async function getFromApi(endpoint, fallbackData) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const result = await response.json();
    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    if (error instanceof TypeError) {
      console.warn(`Backend offline. Using mock data for ${endpoint}:`, error.message);
      return fallbackData;
    }

    throw error;
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
  const response = await fetch(`${API_BASE_URL}/api/health`);

  if (!response.ok) {
    throw new Error(`Health check failed with status ${response.status}`);
  }

  return response.json();
}
