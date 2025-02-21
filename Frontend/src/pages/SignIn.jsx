import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
<<<<<<< HEAD
import '../App.css'; // Assuming you have the CSS file in the same directory
=======
import '../App.css'; 
>>>>>>> 5c5fb8b6df2a6cafaa254f1b013c0993acac1298

export default function AuthPage() {
  const navigate = useNavigate();
  const goToRegister = () => {
    navigate("/register"); // Navigate to registration page
  };
<<<<<<< HEAD


  /*validation part*/
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Error stat

  const handleSignIn = () => {
    // Check if fields are empty
=======
  const goToInvestor = () => {
    navigate("/test"); // Navigate to test page
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = () => {
>>>>>>> 5c5fb8b6df2a6cafaa254f1b013c0993acac1298
    if (username.trim() === "" || password.trim() === "") {
      setError("Both Username and Password are required!");
      return;
    }

<<<<<<< HEAD
    setError(""); // Clear error if inputs are valid
    console.log("Sign-in successful with:", { username, password });
    // Add authentication logic here (API call, etc.)
  };
  
=======
    setError("");
    console.log("Sign-in successful with:", { username, password });
    // Add authentication logic here (API call, etc.)
  };
>>>>>>> 5c5fb8b6df2a6cafaa254f1b013c0993acac1298

  return (
    <div className="page-container"> 
      <div className="auth-container">
        <div className="auth-card">
<<<<<<< HEAD
          {/* Left Section - Signup */}
=======
>>>>>>> 5c5fb8b6df2a6cafaa254f1b013c0993acac1298
          <div className="auth-left">
            <img src={logo} alt="Idea Hub Logo" className="auth-logo" />
            <h2 className="auth-title">Start your journey with us!</h2>
            <button className="auth-btn-yellow" onClick={goToRegister}>Sign Up</button>
          </div>
<<<<<<< HEAD

          {/* Right Section - Login */}
          <div className="auth-right">
            <h2 className="auth-signin-title">SIGN IN</h2>
            {error && <p className="auth-error">{error}</p>} {/* Error message */}

=======
          <div className="auth-right">
            <h2 className="auth-signin-title">SIGN IN</h2>
            {error && <p className="auth-error">{error}</p>}
>>>>>>> 5c5fb8b6df2a6cafaa254f1b013c0993acac1298
            <input 
              type="text" 
              placeholder="Username" 
              className="auth-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
<<<<<<< HEAD
            
=======
>>>>>>> 5c5fb8b6df2a6cafaa254f1b013c0993acac1298
            <input 
              type="password" 
              placeholder="Password" 
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
<<<<<<< HEAD
            
            
            <a href="#" className="auth-forgot">Forgot your password?</a>
            
=======
            <a href="#" className="auth-forgot">Forgot your password?</a>
>>>>>>> 5c5fb8b6df2a6cafaa254f1b013c0993acac1298
            <button className="auth-btn auth-btn-white" onClick={handleSignIn}>Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 5c5fb8b6df2a6cafaa254f1b013c0993acac1298
