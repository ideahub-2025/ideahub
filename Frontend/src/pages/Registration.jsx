import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import '../App.css'; // Assuming you have the CSS file in the same directory

export default function RegistPage() {
  const navigate = useNavigate();
  const goToSignin = () => {
    navigate("/signin"); // Navigate to sign-in page
  };

  // validation part
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); 

  const handleSignUp = () => {
    if (!fullName || !username || !email || !role || !password || !confirmPassword) {
      setError("All fields are required!");
      return;
    }

    //password validation
  const validatePassword = (password) => {
    const check = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return check.test(password);
  };

  

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long, include one number, and one special character.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    //email validation
    const validateEmail = (email) => {
      const check = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return check.test(email);
    };

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(""); 
    console.log("User registered successfully:", { fullName, username, email, role, password });

  };
  //main part

  return (
    <div className="page-container"> 
      <div className="auth-container">
        <div className="auth-card">
          {/* Left Section - Sign In */}
          <div className="Regi-left">
            <img src={logo} alt="Idea Hub Logo" className="auth-logo" />
            <h2 className="auth-title">Welcome Back!</h2>
            <button className="Regi-btn-yellow" onClick={goToSignin}>Sign In</button>
          </div>

          {/* Right Section - Sign Up */}
          <div className="Regi-right">
            <h2 className="auth-signin-title">SIGN UP</h2>
            
            {/* Error Message */}
            {error && <p className="auth-error">{error}</p>} 

            <div className='Regi-form'>
              <input type="text" placeholder="Full Name" className="Regi-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              <input type="text" placeholder="Username" className="Regi-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
              <input type="text" placeholder="E-mail" className="Regi-input" value={email} onChange={(e) => setEmail(e.target.value)} required />

              {/* Role Dropdown */}
              <select className="Regi-input Regi-dropdown" value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="" disabled>Select Role</option>
                <option value="entrepreneur">Entrepreneur</option>
                <option value="investor">Investor</option>
              </select>

              <input type="password" placeholder="Password" className="Regi-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <input type="password" placeholder="Confirm Password" className="Regi-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <button className="auth-btn auth-btn-white" onClick={handleSignUp}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}
