import React, { useState } from "react";

const SettingsPage = ({ onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPasswordError, setCurrentPasswordError] = useState("");

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    if (currentPassword !== password) {
      setCurrentPasswordError("The current password is incorrect.");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setEmail(newEmail || email);
    setPassword(newPassword || password);
    setIsEditing(false);
    setCurrentPassword("");
    setNewEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setCurrentPasswordError("");
    alert("Changes saved successfully!");
  };

  return (
    <div>
      <h2>Settings</h2>

      {/* Email and Password Change Form */}
      {isEditing ? (
        <div className="settings-form">
          {/* Current Password Field */}
          <div>
            <label>Current Password:</label>
            <input
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            {currentPasswordError && <p className="error-message">{currentPasswordError}</p>}
          </div>

          <div>
            <label>New Email:</label>
            <input
              type="email"
              placeholder="Enter new email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <div>
            <label>New Password:</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label>Confirm Password:</label>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button onClick={handleSaveChanges}>Save Changes</button>
        </div>
      ) : (
        <div>
          <p>Email: {email}</p>
          <p>Password: ********</p> {/* Mask password for security */}
          <button onClick={handleEditClick}>Change Email / Password</button>
        </div>
      )}

      {/* Log Out Button */}
      <button onClick={onLogout}>Log Out</button>
    </div>
  );
};

export default SettingsPage;
