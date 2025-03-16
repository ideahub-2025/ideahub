import React, { useState, useCallback } from "react";
import logo from "../assets/logo.png"; 
import pp from "../assets/defaultpp.jpg";
import "../App.css";

// Sample users for demonstration purposes.
const sampleUsers = [
  {
    id: 1,
    full_name: "John Doe",
    email: "john@example.com",
    status: "Active",
    profile_picture: "https://via.placeholder.com/50",
    job_role: "Founder",
    location: "San Francisco",
    bio: "Entrepreneur and innovator",
    phone: "1234567890",
    linkedin: "https://linkedin.com/in/johndoe",
    twitter: "https://twitter.com/johndoe",
    startup_name: "Startup Inc.",
    start_date: "2023-01-15",
    team_size: "10",
    website: "https://startup.com",
  },
  {
    id: 2,
    full_name: "Jane Smith",
    email: "jane@example.com",
    status: "Inactive",
    profile_picture: "", // No profile picture; will use default
    job_role: "CTO",
    location: "New York",
    bio: "Tech leader with 20 years experience",
    phone: "0987654321",
    linkedin: "https://linkedin.com/in/janesmith",
    twitter: "https://twitter.com/janesmith",
    startup_name: "Tech Solutions",
    start_date: "2022-12-01",
    team_size: "15",
    website: "https://techsolutions.com",
  },
];

const UsersPage = ({ users, onSaveUser, searchTerm, onSearchChange }) => {
  // Use provided users prop if available, otherwise fallback to sampleUsers.
  const usersData = Array.isArray(users) && users.length > 0 ? users : sampleUsers;

  const [filterStatus, setFilterStatus] = useState("All");
  const [editingUser, setEditingUser] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmationType, setConfirmationType] = useState(null); // "valid" or "invalid"

  // Filter users based on search term and filter status.
  const filteredUsers = usersData.filter((user) => {
    const matchesSearch = user.full_name
      ? user.full_name.toLowerCase().includes((searchTerm || "").toLowerCase())
      : false;
    const matchesFilter = filterStatus === "All" || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // All possible status options for users.
  const allStatusOptions = ["Active", "Inactive"];

  // Allowed transitions:
  // - If current status is Active, allowed transition is only Inactive.
  // - If current status is Inactive, allowed transition is only Active.
  const getAllowedTransitions = (currentStatus) => {
    return currentStatus === "Active" ? ["Inactive"] : ["Active"];
  };

  const handleCloseModal = useCallback(() => {
    setEditingUser(null);
    setShowConfirm(false);
  }, []);

  const declineStatusChange = () => {
    setShowConfirm(false);
  };

  // When clicking Edit, open the modal and set default dropdown to the user’s current status.
  const handleEditClick = (user) => {
    setEditingUser(user);
    setNewStatus(user.status);
  };

  // When updating, show a confirmation popup.
  const handleUpdateStatus = () => {
    if (editingUser) {
      const allowedTransitions = getAllowedTransitions(editingUser.status);
      if (!allowedTransitions.includes(newStatus)) {
        setConfirmationType("invalid");
        setShowConfirm(true);
        return;
      } else {
        setConfirmationType("valid");
        setShowConfirm(true);
      }
    }
  };

  const confirmStatusChange = async () => {
    if (editingUser && confirmationType === "valid") {
      try {
        const response = await fetch(
          `http://localhost:8000/api/entrepreneur/${editingUser.id}/update-status/`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
          }
        );

        const result = await response.json();
        console.log("Server response:", result);

        if (!response.ok) {
          alert("Error: " + (result.error || "Failed to update status"));
          return;
        }

        alert("Status updated successfully!");

        if (typeof onSaveUser === "function") {
          onSaveUser(editingUser.id, { ...editingUser, status: newStatus });
          handleCloseModal();
        } else {
          console.error("onSaveUser function is missing!");
        }

        setShowConfirm(false);
        setEditingUser(null);
      } catch (error) {
        console.error("Error updating status:", error);
        alert("An error occurred while updating status.");
      }
    }
  };

  return (
    <div>
      <h2>User Management</h2>

      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Users..."
          value={searchTerm}
          onChange={onSearchChange}
          className="search-input"
        />
      </div>

      {/* Dropdown filter for status */}
      <div className="filter-container">
        <label htmlFor="userStatusFilter">Filter by Status: </label>
        <select
          id="userStatusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Users Table */}
      <table className="responsive-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>
                {user?.profile_picture ? (
                  <img
                    src={
                      user.profile_picture.startsWith("http")
                        ? user.profile_picture
                        : `http://localhost:8000/media/${user.profile_picture}`
                    }
                    alt="Profile"
                    className="profile-img-thumb"
                  />
                ) : (
                  <img src={pp} alt="Default Profile" className="profile-img-thumb" />
                )}
              </td>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.status}</td>
              <td>
                <button onClick={() => handleEditClick(user)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Popup with Full User Details */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="form-header">
              <img src={logo} alt="Company Logo" className="logo" />
            </div>
            <h3>User Details</h3>
            <form>
              <div className="form-group">
                <label>Photo:</label>
                {editingUser.profile_picture ? (
                  <img
                    src={`http://localhost:8000/media/${editingUser.profile_picture}`}
                    alt="User"
                    className="profile-img"
                  />
                ) : (
                  <img src={pp} alt="Default Profile" className="profile-img-thumb" />
                )}
              </div>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={editingUser.full_name || ""}
                  readOnly
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={editingUser.email || ""}
                  readOnly
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <input
                  type="text"
                  value={editingUser.job_role || ""}
                  readOnly
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  value={editingUser.location || ""}
                  readOnly
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Bio:</label>
                <textarea
                  value={editingUser.bio || ""}
                  readOnly
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="text"
                  value={editingUser.phone || ""}
                  readOnly
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>LinkedIn:</label>
                <input
                  type="url"
                  value={editingUser.linkedin || ""}
                  readOnly
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Twitter:</label>
                <input
                  type="url"
                  value={editingUser.twitter || ""}
                  readOnly
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Startup Name:</label>
                <input
                  type="text"
                  value={editingUser.startup_name || ""}
                  readOnly
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Start Date:</label>
                <input
                  type="text"
                  value={editingUser.start_date || ""}
                  readOnly
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Team Size:</label>
                <input
                  type="text"
                  value={editingUser.team_size || ""}
                  readOnly
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Website:</label>
                <input
                  type="url"
                  value={editingUser.website || ""}
                  readOnly
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <input
                  type="text"
                  value={editingUser.status || ""}
                  readOnly
                  className="form-control"
                />
              </div>
              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label>Change Status:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="form-control"
                >
                  {allStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="button" onClick={handleUpdateStatus} className="btn">
                  Update Status
                </button>
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Popup Modal */}
      {showConfirm && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            {confirmationType === "valid" ? (
              <>
                <p>Are you sure you want to change the status to "{newStatus}"?</p>
                <button onClick={confirmStatusChange}>Confirm</button>
                <button onClick={declineStatusChange} className="ml-1">
                  Decline
                </button>
              </>
            ) : (
              <>
                <p>
                  This change cannot be made. Allowed change from "{editingUser.status}" is only:{" "}
                  {getAllowedTransitions(editingUser.status).join(", ")}.
                </p>
                <button onClick={declineStatusChange}>OK</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
