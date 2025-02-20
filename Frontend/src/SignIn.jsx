import React, { useState } from 'react';
import logo from "./assets/logo.png";
import Registration from "./Registration.jsx"
import './App.css'; // Assuming you have the CSS file in the same directory

export default function AuthPage() {
    return (
      <div className="page-container"> 
        <div className="auth-container">
          <div className="auth-card">
            {/* Left Section - Signup */}
            <div className="auth-left">
              <img src={logo} alt="Idea Hub Logo" className="auth-logo" />
              <h2 className="auth-title">Start your journey with us!</h2>
              <a href='Registration' className="auth-btn-yellow">Sign Up as Entrepreneur</a>
              <button className="auth-btn-yellow">Sign Up as Investor</button>
            </div>
  
            {/* Right Section - Login */}
            <div className="auth-right">
              <h2 className="auth-signin-title">SIGN IN</h2>
              <input type="text" placeholder=" Username" className="auth-input" required/>
              <input type="password" placeholder="  Password" className="auth-input" required/>
              <a href="#" className="auth-forgot">Forgot your password?</a>
              <button className="auth-btn auth-btn-white">Sign In</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  