import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import '../App.css'; 

export default function AuthPage() {
  const navigate = useNavigate();
  const goToRegister = () => {
    navigate("/register"); // Navigate to registration page
  };
  const goToInvestor = () => {
    navigate("/test"); // Navigate to test page
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = () => {
    if (username.trim() === "" || password.trim() === "") {
      setError("Both Username and Password are required!");
      return;
    }

    setError("");
    console.log("Sign-in successful with:", { username, password });
    // Add authentication logic here (API call, etc.)
  };

  return (
    <div className="page-container"> 
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-left">
            <img src={logo} alt="Idea Hub Logo" className="auth-logo" />
            <h2 className="auth-title">Start your journey with us!</h2>
            <button className="auth-btn-yellow" onClick={goToRegister}>Sign Up</button>
            <button className="auth-btn-yellow" onClick={goToInvestor}>Investor</button>
          </div>
          <div className="auth-right">
            <h2 className="auth-signin-title">SIGN IN</h2>
            {error && <p className="auth-error">{error}</p>}
            <input 
              type="text" 
              placeholder="Username" 
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a href="#" className="auth-forgot">Forgot your password?</a>
            <button className="auth-btn auth-btn-white" onClick={handleSignIn}>Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}