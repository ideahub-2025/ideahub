import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/SignIn";  // Ensure correct path
import RegistPage from "./pages/Registration";  // Ensure correct path
import ResetPassword from "./pages/ResetPassword";
import NewPassword from "./pages/NewPassword";
import UserForm from "./pages/UserForm";


export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/register" element={<RegistPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/user-form" element={<UserForm />} />
      </Routes>
    </Router>
  );
}
