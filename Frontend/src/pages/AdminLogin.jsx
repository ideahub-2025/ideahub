import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import logo from "../assets/logo.png";
import "../App.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
  
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/admin_login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // ✅ Store the token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        console.log("Token stored:", data.token); // Debugging
  
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/admin-panel"), 500);
      } else {
        setError(data.error || "An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      setError("An error occurred during login. Please try again later.");
    }
  };
  


  return (
    <div className="container">
      <div className="form-box">
        <div className="logo-container">
          <img src={logo} alt="Company Logo" className="logo" />
        </div>
        <h2 className="reset">Admin Login</h2>
        <form className="reset-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}