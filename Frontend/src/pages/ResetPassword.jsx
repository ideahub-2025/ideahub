import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/forgot-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✔ A password reset link has been sent to your email. Please check your inbox.");
        setTimeout(() => navigate("/"), 1000);  // Delay before redirecting
      } else {
        setError(data.error || "❌ This email is not registered. Please sign up.");
        setTimeout(() => navigate("/register"), 2000);
      }
    } catch (error) {
      setError("⚠ Unable to process the request. Please try again later.");
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <div className="logo-container">
          <img src={logo} alt="Company Logo" className="logo" />
        </div>
        <h2 className="reset">Reset Password</h2>
      
        <form className="reset-form" onSubmit={handleSubmit}>
          <div className="input-group">
              {/* Success Message */}
              {message && <p className="success-message">{message}</p>}

              {/* Error Message */}
             {error && <p className="error-message">{error}</p>}
            <input 
              type="email" 
              placeholder="Enter your email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Send Verification Link
          </button>
        </form>

        
      </div>
    </div>
  );
}
