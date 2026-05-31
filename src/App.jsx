import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Tools from "./pages/Tools";
import Support from "./pages/Support";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
