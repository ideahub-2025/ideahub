import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const SettingsPage = () => {
  const navigate = useNavigate();

  // Stored credentials (in a real app, these would come securely from backend)
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");

  // Modal state flags
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // State for email change process
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // State for password change process
  const [currentPasswordForPassword, setCurrentPasswordForPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Handler for updating email
  const handleEmailChange = () => {
    if (currentPasswordForEmail !== password) {
      setEmailError("The current password is incorrect.");
      return;
    }
    setEmail(newEmail || email);
    setCurrentPasswordForEmail("");
    setNewEmail("");
    setEmailError("");
    alert("Email updated successfully!");
    setShowEmailModal(false);
  };

  // Handler for updating password
  const handlePasswordChange = () => {
    if (currentPasswordForPassword !== password) {
      setPasswordError("The current password is incorrect.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPassword(newPassword);
    setCurrentPasswordForPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError("");
    alert("Password updated successfully!");
    setShowPasswordModal(false);
  };

  // Handler for logout confirmation modal
  const confirmLogout = () => {
    setShowLogoutModal(false);
    navigate("/admin-login");
  };

  return (
    <div className="settings-page">
      <h2 className="sectionTitle">Settings</h2>

      <div className="settings-display">
        <p>Email: {email}</p>
        <p>Password: ********</p>
        <div className="button-group">
          <button className="btn-secondary" onClick={() => setShowEmailModal(true)}>
            Change Email
          </button>
          <button className="btn-secondary" onClick={() => setShowPasswordModal(true)}>
            Change Password
          </button>
        </div>
      </div>

      <div className="logout-section">
        <button className="btn-secondary" onClick={() => setShowLogoutModal(true)}>
          Log Out
        </button>
      </div>

      {/* Email Change Modal */}
      {showEmailModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Change Email</h3>
            <div className="form-group">
              <label>Current Password:</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPasswordForEmail}
                onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
              />
              {emailError && <p className="error-message">{emailError}</p>}
            </div>
            <div className="form-group">
              <label>New Email:</label>
              <input
                type="email"
                placeholder="Enter new email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={handleEmailChange}>
                Save Changes
              </button>
              <button className="btn-secondary" onClick={() => setShowEmailModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Change Password</h3>
            <div className="form-group">
              <label>Current Password:</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPasswordForPassword}
                onChange={(e) => setCurrentPasswordForPassword(e.target.value)}
              />
              {passwordError && <p className="error-message">{passwordError}</p>}
            </div>
            <div className="form-group">
              <label>New Password:</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password:</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <div className="form-actions">
              <button className="btn-primary" onClick={handlePasswordChange}>
                Save Changes
              </button>
              <button className="btn-secondary" onClick={() => setShowPasswordModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to log out?</p>
            <div className="form-actions">
              <button className="btn-primary" onClick={confirmLogout}>
                Yes
              </button>
              <button className="btn-secondary" onClick={() => setShowLogoutModal(false)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
