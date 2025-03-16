import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import '../App.css';
import axios from 'axios';

export default function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);



  const goToRegister = () => navigate("/register");
  const goToReset = () => navigate("/reset-password");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignIn = async () => {
    if (loading) return; // Prevent multiple submissions
    setLoading(true);
    
    if (username.trim() === "" || password.trim() === "") {
      setError("Both Username and Password are required!");
      setLoading(false);
      return;
    }
    setError("");
    const userData = { username, password };

    try {
      const response = await axios.post("http://localhost:8000/api/sign_in/", userData, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("API Response:", response.data);

      if (response.data.access && response.data.refresh) {
        localStorage.setItem("refreshToken", response.data.refresh);
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("role", response.data.role);

        setSuccessMessage("Sign-in successful! Redirecting...");

        setTimeout(() => {
          if (response.data.role === "entrepreneur") {
            navigate("/ent-home", { replace: true });
          } else if (response.data.role === "investor") {
            navigate("/investors", { replace: true });
          }
        }, 500);
      } else {
        throw new Error("Missing tokens in response!");
      }
    } catch (error) {
      console.error("Sign-in error:", error);
      const errorMessage = error.response ? error.response.data.error || "Sign-in failed! Please try again." : "Network error. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container"> 
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-left">
            <img src={logo} alt="Idea Hub Logo" className="auth-logo" />
            <h2 className="auth-title">Start your journey with us!</h2>
            <button className="auth-btn-yellow" onClick={goToRegister}>Sign Up</button>
          </div>

          <div className="auth-right">
            <h2 className="auth-signin-title">SIGN IN</h2>

            {successMessage && <p className="auth-success">{successMessage}</p>}
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
            
            <button className="auth-btn auth-btn-white" onClick={handleSignIn} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}