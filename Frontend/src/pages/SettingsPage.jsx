import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

export default function SettingsPage() {
  const [username, setUsername] = useState(localStorage.getItem("username") || ""); // Get username from localStorage
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleUpdate = async () => {
    const username = localStorage.getItem("username"); // Get username from localStorage
  
    if (!username) {
      alert("Username is missing. Please log in again.");
      return;
    }
  
    const payload = {
      username: username, // Ensure username is sent in the request
      current_password: currentPassword,
      new_password: newPassword,
    };
  
    try {
      const response = await axios.put("http://localhost:8000/api/update-admin-user/", payload, {
        headers: { "Content-Type": "application/json" },
      });
  
      alert(response.data.message);
      setShowPasswordModal(false);
    } catch (error) {
      console.error("API Error:", error.response);
      alert(error.response?.data?.error || "An error occurred");
    }
  };
  
  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2>Settings</h2>

        {/* Display Username */}
        <div className="settings-section">
          <h3>Username</h3>
          <p className="username-display">{username || "Loading..."}</p>
        </div>

        {/* Password Update Section */}
        <div className="settings-section">
          <h3>Update Password</h3>
          <button className="btn-primary" onClick={() => setShowPasswordModal(true)}>
            Change Password
          </button>
        </div>
        
        {showPasswordModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Change Password</h3>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-control"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control"
              />
              <div className="modal-actions">
                <button className="btn-primary" onClick={handleUpdate}>
                  Save Changes
                </button>
                <button className="btn-secondary" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
