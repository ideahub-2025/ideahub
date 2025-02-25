import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/SignIn";  // Ensure correct path
import RegistPage from "./pages/Registration";  // Ensure correct path

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/register" element={<RegistPage />} />
      </Routes>
    </Router>
  );
}
