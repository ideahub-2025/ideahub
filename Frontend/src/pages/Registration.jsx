import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import '../App.css';
import axios from 'axios';


export default function RegistPage() {
  const navigate = useNavigate();
  const goToSignin = () => {
    navigate("/signin"); // Navigate to sign-in page
  };

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 


  const validatePassword = (password) => {
    const check = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return check.test(password);
  };

  const validateEmail = (email) => {
    const check = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return check.test(email);
  };

  const handleSignUp = (e) => {
    e.preventDefault(); // Prevent form default submission behavior

    if (!fullName || !username || !email || !role || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long, include one number, and one special character.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(""); // Clear previous errors if validation passes
    

    const userData = { full_name: fullName, // Change to match the field name in Django
      username,
      email,
      role,
      password,
   };

   axios.post('http://localhost:8000/api/user_profiles/', userData, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      console.log(response.data);
      setSuccessMessage("Registration successful! You can now sign in.");
      // Redirect to sign-in page after a successful registration
      setTimeout(() => {
        navigate("/signin");
      }, 2000);  // Redirect after 2 seconds
    })
    .catch(error => {
      console.error("There was an error registering the user:", error);
      // Check if error response exists and get the error message
      const errorMessage = error.response ? error.response.data.error || "Registration failed! Please try again." : "Network error. Please try again.";
      setError(errorMessage);  // Set the error message to display
    });
  
  };

  return (
    <div className="page-container"> 
      <div className="auth-container">
        <div className="auth-card">
          <div className="Regi-left">
            <img src={logo} alt="Idea Hub Logo" className="auth-logo" />
            <h2 className="auth-title">Welcome Back!</h2>
            <button className="Regi-btn-yellow" onClick={goToSignin}>Sign In</button>
          </div>

          <div className="Regi-right">
            <h2 className="auth-signin-title">SIGN UP</h2>

            {/* Success message */}
            {successMessage && <p className="auth-success">{successMessage}</p>}

            {/* Error message */}
            {error && <p className="auth-error">{error}</p>} 

            <form className="Regi-form" onSubmit={handleSignUp}>
              <input
                type="text"
                placeholder="Full Name"
                className="Regi-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Username"
                className="Regi-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="E-mail"
                className="Regi-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Role Dropdown */}
              <select
                className="Regi-input Regi-dropdown"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="" disabled>Select Role</option>
                <option value="entrepreneur">Entrepreneur</option>
                <option value="investor">Investor</option>
              </select>

              <input
                type="password"
                placeholder="Password"
                className="Regi-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="Regi-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="submit" className="auth-btn auth-btn-white">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
