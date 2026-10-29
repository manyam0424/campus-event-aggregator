import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Signup from "./Signup";
import StudentDashboard from "./StudentDashboard";
import CoordinatorDashboard from "./CoordinatorDashboard";
import FacultyDashboard from "./FacultyDashboard";
import EventDetails from "./EventDetails";

function App() {
  return (
    <Router>

      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* STUDENT DASHBOARD */}
        <Route
          path="/student"
          element={<StudentDashboard />}
        />

        {/* COORDINATOR DASHBOARD */}
        <Route
          path="/coordinator"
          element={<CoordinatorDashboard />}
        />

        {/* FACULTY DASHBOARD */}
        <Route
          path="/faculty"
          element={<FacultyDashboard />}
        />

        {/* EVENT DETAILS / REGISTRATION */}
        <Route
          path="/events/:id"
          element={<EventDetails />}
        />

      </Routes>

    </Router>
  );
}

export default App;