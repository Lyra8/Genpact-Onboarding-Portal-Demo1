import { mockContacts, mockCourses, mockTools } from "../data/mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function getFromApi(endpoint, fallbackData) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.warn(`Using mock data for ${endpoint}:`, error.message);
    return fallbackData;
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
