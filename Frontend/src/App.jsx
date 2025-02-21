import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import AuthPage from "./pages/SignIn";  // Ensure correct path
import RegistPage from "./pages/Registration";  // Ensure correct path
=======
import AuthPage from "./pages/SignIn";  
import RegistPage from "./pages/Registration";
import InvestForm from "./pages/InvestorForm";

>>>>>>> 5c5fb8b6df2a6cafaa254f1b013c0993acac1298

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        <Route path="/signin" element={<AuthPage />} />
        <Route path="/register" element={<RegistPage />} />
=======
        <Route index element={<AuthPage />} />
        <Route path="/register" element={<RegistPage />} />
        <Route path="/investorform" element={<InvestForm/>} />
>>>>>>> 5c5fb8b6df2a6cafaa254f1b013c0993acac1298
      </Routes>
    </Router>
  );
}
