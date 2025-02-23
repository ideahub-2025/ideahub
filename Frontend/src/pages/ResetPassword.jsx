import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function ResetPassword(){
  return (
    <div className="container">
      <div className="form-box">
        <div className="logo-container">
          <img src={logo} alt="Company Logo" className="logo" />
        </div>
        <h2 className='reset'>Reset Password</h2>
        <form className="reset-form">
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="input-field"
            />
          </div>
          <button type="submit" className="submit-btn">
            Send Verification Link
          </button>
        </form>
      </div>
    </div>
  );
};