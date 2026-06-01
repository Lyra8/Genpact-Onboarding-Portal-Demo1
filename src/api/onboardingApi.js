import { mockContacts, mockCourses, mockTools } from "../data/mockData";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const FETCH_TIMEOUT = 5000;
const AUTH_STORAGE_KEY = "genpact_auth";

function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  return fetch(url, { ...options, signal: controller.signal }).finally(() =>
    clearTimeout(timer),
  );
}

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
        `backend returned ${response.status}`,
      );
    }

    const result = await response.json();

    if (!Array.isArray(result?.data)) {
      return safeFallback(
        endpoint,
        fallbackData,
        "response data was not an array",
      );
    }

    return result.data;
  } catch (error) {
    return safeFallback(
      endpoint,
      fallbackData,
      error.message || "backend is unavailable",
    );
  }
}

function getStoredAuth() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

export function getStoredUser() {
  return getStoredAuth()?.user || null;
}

export function getAccessToken() {
  return getStoredAuth()?.access_token || null;
}

export function saveAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function authHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function protectedJson(endpoint, options = {}) {
  let response;
  try {
    response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...authHeaders(),
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "Backend connection timed out. Is FastAPI running on port 8000?",
      );
    }
    throw new Error(
      "Backend connection error. Start FastAPI on http://127.0.0.1:8000 and try again.",
    );
  }

  if (!response.ok) {
    const message = await response
      .json()
      .then((body) => body.detail)
      .catch(() => `Backend returned ${response.status}`);
    if (response.status === 401) {
      throw new Error("Invalid credentials");
    }
    throw new Error(message || `Backend returned ${response.status}`);
  }

  return response.json();
}

export async function login(username, password) {
  const body = new URLSearchParams();
  body.set("username", username);
  body.set("password", password);

  const auth = await protectedJson("/api/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const normalizedAuth = auth.user
    ? auth
    : {
        ...auth,
        user: { id: auth.user_id, role: auth.role, email: username },
      };
  saveAuth(normalizedAuth);
  return normalizedAuth;
}

export function register(email, password, confirmPassword) {
  return protectedJson("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      confirm_password: confirmPassword,
    }),
  });
}

export function fetchCurrentUser() {
  return protectedJson("/api/auth/me");
}

export async function fetchManagerProgress() {
  const result = await protectedJson("/api/progress/manager");
  return Array.isArray(result?.data) ? result.data : [];
}

export function createAnnouncement(message) {
  return protectedJson("/api/announcements", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
}

export function fetchManagerAnnouncements() {
  return protectedJson("/api/announcements/manager");
}

export function fetchInternAnnouncements() {
  return protectedJson("/api/announcements/intern");
}

export async function fetchUsers() {
  const result = await protectedJson("/api/users");
  return Array.isArray(result?.data) ? result.data : [];
}

export function fetchManagerProfile() {
  return protectedJson("/api/users/me");
}

export function changeManagerPassword(
  currentPassword,
  newPassword,
  confirmNewPassword,
) {
  return protectedJson("/api/users/me/password", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
      confirm_new_password: confirmNewPassword,
    }),
  });
}

export function updateUserRole(userId, role) {
  return protectedJson(`/api/users/${encodeURIComponent(userId)}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
}

export function updateUserManager(userId, managerId) {
  return protectedJson(`/api/users/${encodeURIComponent(userId)}/manager`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ manager_id: managerId || null }),
  });
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

export async function fetchProgress(internId) {
  const endpoint = `/api/progress?intern_id=${encodeURIComponent(internId)}`;
  try {
    const result = await protectedJson(endpoint);
    return Array.isArray(result?.data) ? result.data : [];
  } catch (error) {
    return safeFallback(
      endpoint,
      [],
      error.message || "progress unavailable",
    );
  }
}

export async function updateProgress(courseId, status, internId) {
  const url = `${API_BASE_URL}/api/progress/${encodeURIComponent(courseId)}?intern_id=${encodeURIComponent(internId)}`;

  try {
    const response = await fetchWithTimeout(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
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
