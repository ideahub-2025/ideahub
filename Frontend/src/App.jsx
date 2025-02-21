import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/SignIn";  
import RegistPage from "./pages/Registration";
import Test from "./pages/Test";
import Another from "./pages/Another";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route index element={<AuthPage />} />
        <Route path="/register" element={<RegistPage />} />
      </Routes>
    </Router>
  );
}
