import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import GuestCheckIn from "./components/GuestCheckIn/GuestCheckIn.jsx";
import GuestCheckOut from "./components/GuestCheckOut/GuestCheckOut.jsx";
import "./App.css";

/**
 * App only decides which page to show for which URL.
 * "/"          -> Dashboard
 * "/check-in"  -> Guest Check-in
 * "/check-out" -> Guest Check-out
 * Anything else falls back to the Dashboard.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/check-in" element={<GuestCheckIn />} />
      <Route path="/check-out" element={<GuestCheckOut />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
