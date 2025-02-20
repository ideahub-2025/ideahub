import React, { useState } from 'react';
import logo from "./assets/logo.png";
import './App.css'; // Assuming you have the CSS file in the same directory

export default function RegistPage() {
    return (
      <div className="page-container"> 
        <div className="auth-container">
          <div className="auth-card">
            {/* Left Section - Signup */}
            <div className="Regi-left">
              <img src={logo} alt="Idea Hub Logo" className="auth-logo" />
              <h2 className="auth-title">Welcome Back!</h2>
              <button className="Regi-btn-yellow">Sign In</button>
            </div>
  
            {/* Right Section - Login */}
            <div className="Regi-right">
              <h2 className="auth-signin-title">SIGN UP</h2>
              <div className='Regi-form'>
                <input type="text" placeholder=" Full Name" className="Regi-input" required/>
                <input type="text" placeholder=" Username" className="Regi-input" required/>
                <input type="text" placeholder=" E-mail" className="Regi-input" required/>
                <input type="password" placeholder=" Password" className="Regi-input" required/>
                <input type="password" placeholder=" Confirm  Password" className="Regi-input" required/>
              </div>
              <button className="auth-btn auth-btn-white" >Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  