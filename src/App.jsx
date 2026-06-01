import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Announcements from "./pages/Announcements";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import LoginPage from "./pages/LoginPage";
import ManagerSupport from "./pages/ManagerSupport";
import ManagerProfile from "./pages/ManagerProfile";
import ManagerUsers from "./pages/ManagerUsers";
import Tools from "./pages/Tools";
import Support from "./pages/Support";
import SignUpPage from "./pages/SignUpPage";
import { clearAuth, getStoredUser } from "./api/onboardingApi";

function ProtectedRoute({ user, allowedRoles, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={user.role === "Manager" ? "/manager-dashboard" : "/courses"}
        replace
      />
    );
  }
  return children;
}

function HomeRedirect({ user }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return (
    <Navigate
      to={user.role === "Manager" ? "/manager-dashboard" : "/courses"}
      replace
    />
  );
}

function App() {
  const [user, setUser] = useState(() => getStoredUser());

  function handleLogout() {
    clearAuth();
    setUser(null);
  }

  return (
    <BrowserRouter>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <main className="app-shell">
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={setUser} />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/" element={<HomeRedirect user={user} />} />
          <Route
            path="/manager-dashboard"
            element={
              <ProtectedRoute user={user} allowedRoles={["Manager"]}>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/support"
            element={
              <ProtectedRoute user={user} allowedRoles={["Manager"]}>
                <ManagerSupport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/users"
            element={
              <ProtectedRoute user={user} allowedRoles={["Manager"]}>
                <ManagerUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager/profile"
            element={
              <ProtectedRoute user={user} allowedRoles={["Manager"]}>
                <ManagerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/announcements"
            element={
              <ProtectedRoute user={user}>
                <Announcements user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute user={user} allowedRoles={["Intern"]}>
                <Courses user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tools"
            element={
              <ProtectedRoute user={user} allowedRoles={["Intern"]}>
                <Tools />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute user={user} allowedRoles={["Intern"]}>
                <Support />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
