import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // useParams for getting uid and token from URL
import logo from "../assets/logo.png";
import "../App.css";

export default function NewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { uidb64, token } = useParams(); // Get uid and token from URL
  const navigate = useNavigate();

  // Password validation regex
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  // Submit handler for resetting the password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validate new password
    if (!validatePassword(newPassword)) {
      setError(
        "Password must be at least 8 characters long, with at least one number and one symbol."
      );
      return;
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Make API call to reset the password
    try {
      const response = await fetch(
        `http://localhost:8000/api/reset-password/${uidb64}/${token}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ new_password: newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Password reset successful! Redirecting to Sign In...");
        setTimeout(() => navigate('/'), 500);  // Redirect to login after 3 seconds
      } else {
        setError(data.error || "An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while resetting the password. Please try again later.");
    }
  };

  return (
    <div className="container">
      <div className="form-box">
        <div className="logo-container">
          <img src={logo} alt="Company Logo" className="logo" />
        </div>
        <h2 className="reset">Create New Password</h2>
        <form className="reset-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <div className="input-group">
            <input
              type="password"
              placeholder="New password"
              className="input-field"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm password"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-btn">
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
}
