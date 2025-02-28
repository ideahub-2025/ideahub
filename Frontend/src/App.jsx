import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/SignIn";  // Ensure correct path
import RegistPage from "./pages/Registration";  // Ensure correct path
import ResetPassword from "./pages/ResetPassword";
import NewPassword from "./pages/NewPassword";
import UserForm from "./pages/UserForm";
import InvestorForm from "./pages/InvestorForm";
import AdminPanel from "./pages/AdminPanel";
import UsersPage from "./pages/UsersPage";
import InvestorsPage from "./pages/InvestorsPage";
import CommentsPage from "./pages/CommentsPage";
import SettingsPage from "./pages/SettingsPage";


export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/register" element={<RegistPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password" element={<NewPassword />} />
        <Route path="/user-form" element={<UserForm />} />
        <Route path="/investor-form" element={<InvestorForm />} />
        <Route path="/admin-panel" element ={<AdminPanel/>}></Route>
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/investors" element={<InvestorsPage />} />
        <Route path="/admin/comments" element={<CommentsPage />} />
        <Route path="/admin/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}
