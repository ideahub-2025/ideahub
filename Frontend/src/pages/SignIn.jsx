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
    // Check if fields are empty
    if (username.trim() === "" || password.trim() === "") {
      setError("Both Username and Password are required!");
      return;
    }

    setError(""); // Clear error if inputs are valid

    const userData = { username, password };

    try {
      const response = await axios.post('http://localhost:8000/api/signin/', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Assuming the response contains the token and user role
      console.log(response.data);
      setSuccessMessage("Sign-in successful! Redirecting...");

      // Store tokens and user data in localStorage
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('role', response.data.role);

      // Redirect to dashboard based on role
      if (response.data.role === "entrepreneur") {
        navigate("/entrepreneur-dashboard");  // Redirect to Entrepreneur dashboard
      } else if (response.data.role === "investor") {
        navigate("/investor-dashboard");  // Redirect to Investor dashboard
      } else {
        navigate("/default-dashboard");  // Default dashboard if role is unknown
      }

    } catch (error) {
      console.error("There was an error during sign-in:", error);
      const errorMessage = error.response ? error.response.data.error || "Sign-in failed! Please try again." : "Network error. Please try again.";
      setError(errorMessage);  // Set the error message to display
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
