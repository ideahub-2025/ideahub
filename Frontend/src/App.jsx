import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/SignIn";  
import RegistPage from "./pages/Registration";
import InvestForm from "./pages/InvestorForm";


export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route index element={<AuthPage />} />
        <Route path="/register" element={<RegistPage />} />
        <Route path="/investorform" element={<InvestForm/>} />
      </Routes>
    </Router>
  );
}
