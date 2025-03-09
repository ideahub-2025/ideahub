import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import '../App.css'; // Assuming you have the CSS file in the same directory
import ResetPassword from './ResetPassword';
import axios from 'axios';

export default function AuthPage() {
  const navigate = useNavigate();
  const goToRegister = () => {
    navigate("/register"); // Navigate to registration page
  };
const goToReset = () => {
    navigate("/reset-password"); // Navigate to reset password page
}
  /* Validation part */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error state
  const [successMessage, setSuccessMessage] = useState(""); // Success message state

  const handleSignIn = async () => {
    if (username.trim() === "" || password.trim() === "") {
      setError("Both Username and Password are required!");
      return;
    }
  
    setError("");
  
    const userData = { username, password };
  
    try {
      const response = await axios.post("http://localhost:8000/api/sign_in/", userData, {
        headers: { "Content-Type": "application/json" },
      });
  
      // ✅ Log the response data to check if tokens are received
      console.log("API Response:", response.data);
  
      // ✅ Confirm tokens exist before storing them
      if (response.data.access && response.data.refresh) {
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("role", response.data.role);
  
        setSuccessMessage("Sign-in successful! Redirecting...");
  
        // Redirect based on role
        if (response.data.role === "entrepreneur") {
          navigate("/ent-home");
        } else if (response.data.role === "investor") {
          navigate("/investor-dashboard");
        } 
      } else {
        throw new Error("Missing tokens in response!");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      const errorMessage = error.response ? error.response.data.error || "Sign-in failed! Please try again." : "Network error. Please try again.";
      setError(errorMessage);
    }
  };
  

  return (
    <div className="page-container"> 
      <div className="auth-container">
        <div className="auth-card">
          {/* Left Section - Signup */}
          <div className="auth-left">
            <img src={logo} alt="Idea Hub Logo" className="auth-logo" />
            <h2 className="auth-title">Start your journey with us!</h2>
            <button className="auth-btn-yellow" onClick={goToRegister}>Sign Up</button>
          </div>

          {/* Right Section - Login */}
          <div className="auth-right">
            <h2 className="auth-signin-title">SIGN IN</h2>

            {/* Success message */}
            {successMessage && <p className="auth-success">{successMessage}</p>}

            {/* Error message */}
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
            
            <a href="#" className="auth-forgot" onClick={goToReset}>Forgot your password?</a>
            
            <button className="auth-btn auth-btn-white" onClick={handleSignIn}>Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}
