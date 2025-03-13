import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role === "user") navigate("/ent-home");
    if (role === "admin") navigate("/admin-panel");
  }, []);

  const handleLogin = () => {
    localStorage.setItem("authToken", "user-token");
    localStorage.setItem("userRole", "user");
    navigate("/ent-home");
  };

  return (
    <div>
      <h2>Sign In</h2>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default AuthPage;
