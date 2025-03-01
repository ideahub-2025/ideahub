import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/SignIn";  // Ensure correct path
import RegistPage from "./pages/Registration";  // Ensure correct path
import ResetPassword from "./pages/ResetPassword";
import NewPassword from "./pages/NewPassword";
import UserForm from "./pages/UserForm";
import InvestorForm from "./pages/InvestorForm";


export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/register" element={<RegistPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password/:uidb64/:token" element={<NewPassword />} />
        <Route path="/user-form" element={<UserForm />} />
        <Route path="/investor-form" element={<InvestorForm />} />
      </Routes>
    </Router>
  );
}
