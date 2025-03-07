import React, { useState } from "react";
import logo from "../assets/logo.png";

const InvestorsPage = ({ investors, onSaveInvestor }) => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState(""); // New search term state
  const [editingInvestor, setEditingInvestor] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmationType, setConfirmationType] = useState(null); // "valid" or "invalid"

  // Filter investors based on both filterStatus and search term
  const filteredInvestors = investors.filter((investor) => {
    const matchesFilter = filterStatus === "All" || investor.status === filterStatus;
    const search = searchTerm.toLowerCase();
    const name = (investor.full_name || investor.name || "").toLowerCase();
    const email = investor.email ? investor.email.toLowerCase() : "";
    const firm = (investor.firmName || investor.firm || "").toLowerCase();
    const matchesSearch = name.includes(search) || email.includes(search) || firm.includes(search);
    return matchesFilter && matchesSearch;
  });

  // All status options shown in the dropdown.
  const allStatusOptions = ["Verified", "Unverified", "Blocked", "Rejected"];

  // Allowed transitions:
  // - If the investor is Verified, only a change to Blocked is allowed.
  // - If the investor is Unverified, allowed changes are to Verified or Rejected.
  // - For Blocked or Rejected, only a change to Verified is allowed.
  const getAllowedTransitions = (currentStatus) => {
    if (currentStatus === "Verified") {
      return ["Blocked"];
    } else if (currentStatus === "Unverified") {
      return ["Verified", "Rejected"];
    } else {
      return ["Verified"];
    }
  };

  // When clicking Edit, open the modal and default the dropdown to the investor’s current status.
  const handleEditClick = (investor) => {
    setEditingInvestor(investor);
    setNewStatus(investor.status);
  };

  // Instead of directly updating, show a confirmation popup.
  const handleUpdateStatus = () => {
    if (editingInvestor) {
      const allowedTransitions = getAllowedTransitions(editingInvestor.status);
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

  // Called when the admin confirms a valid update.
  const confirmStatusChange = () => {
    if (editingInvestor && confirmationType === "valid") {
      const updatedInvestor = { ...editingInvestor, status: newStatus };
      onSaveInvestor(updatedInvestor.id, updatedInvestor);
      setEditingInvestor(null);
    }
    setShowConfirm(false);
  };

  // Called when the admin declines the update (or dismisses an invalid-change message).
  const declineStatusChange = () => {
    setShowConfirm(false);
  };

  const handleCloseModal = () => {
    setEditingInvestor(null);
  };

  // Inline styles for the main modal popup.
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  };

  const modalStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "5px",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
  };

  const logoStyle = {
    width: "100px",
    height: "auto",
    marginBottom: "1rem",
  };

  // Styles for the confirmation popup modal.
  const confirmModalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1100,
  };

  const confirmModalStyle = {
    background: "#fff",
    padding: "20px",
    borderRadius: "5px",
    width: "90%",
    maxWidth: "400px",
    textAlign: "center",
  };

  return (
    <div>
      <h2>Investor Management</h2>

      {/* Search Input */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search by Name, Email, or Firm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Dropdown filter for status */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="statusFilter">Filter by Status: </label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Verified">Verified</option>
          <option value="Blocked">Blocked</option>
          <option value="Rejected">Rejected</option>
          <option value="Unverified">Unverified</option>
        </select>
      </div>

      {/* Investors Table */}
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Firm</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvestors.map((investor) => (
            <tr key={investor.id}>
              <td>
                {investor.profile_picture ? (
                  <img
                    src={investor.profile_picture}
                    alt="Profile"
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  "N/A"
                )}
              </td>
              <td>{investor.full_name || investor.name}</td>
              <td>{investor.email}</td>
              <td>{investor.firmName || investor.firm}</td>
              <td>{investor.status}</td>
              <td>
                <button onClick={() => handleEditClick(investor)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal Popup */}
      {editingInvestor && (
  <div className="modal-overlay">
    <div className="modal">
      <div className="form-header">
      <img src={logo} alt="Company Logo" className="logo" />
      </div>
      <h3>Investor Details</h3>
      <form>
        <div className="form-group">
          <label>Profile Picture:</label>
          {editingInvestor.profile_picture ? (
            <img
              src={editingInvestor.profile_picture}
              alt="Profile"
              className="profile-img"
            />
          ) : (
            "N/A"
          )}
        </div>
        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={editingInvestor.full_name || editingInvestor.name || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            value={editingInvestor.username || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Role:</label>
          <input
            type="text"
            value={editingInvestor.role || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={editingInvestor.email || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={editingInvestor.location || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Bio:</label>
          <textarea
            value={editingInvestor.bio || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="text"
            value={editingInvestor.phone || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>LinkedIn:</label>
          <input
            type="url"
            value={editingInvestor.linkedin || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Twitter:</label>
          <input
            type="url"
            value={editingInvestor.twitter || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Firm Name:</label>
          <input
            type="text"
            value={editingInvestor.firmName || editingInvestor.firm || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Investment Stage:</label>
          <input
            type="text"
            value={editingInvestor.investmentStage || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Portfolio Size:</label>
          <input
            type="text"
            value={editingInvestor.portfolioSize || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Website:</label>
          <input
            type="url"
            value={editingInvestor.website || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Min Investment:</label>
          <input
            type="text"
            value={editingInvestor.minInvestment || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Max Investment:</label>
          <input
            type="text"
            value={editingInvestor.maxInvestment || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Sectors:</label>
          <input
            type="text"
            value={editingInvestor.sectors || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Status:</label>
          <input
            type="text"
            value={editingInvestor.status || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Join Date:</label>
          <input
            type="text"
            value={editingInvestor.joinDate || ""}
            readOnly
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>ID Document:</label>
          {editingInvestor.id_document ? (
            <a
              href={editingInvestor.id_document}
              target="_blank"
              rel="noopener noreferrer"
              className="document-link"
            >
              View Document
            </a>
          ) : (
            "N/A"
          )}
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
          <button
            type="button"
            onClick={handleCloseModal}
            className="btn btn-secondary"
          >
            Close
          </button>
        </div>
      </form>
    </div></div>
    )}


      {/* Confirmation Popup Modal */}
      {showConfirm && (
        <div style={confirmModalOverlayStyle}>
          <div style={confirmModalStyle}>
            {confirmationType === "valid" ? (
              <>
                <p>
                  Are you sure you want to change the status to "{newStatus}"?
                </p>
                <button onClick={confirmStatusChange}>Confirm</button>
                <button onClick={declineStatusChange} style={{ marginLeft: "1rem" }}>
                  Decline
                </button>
              </>
            ) : (
              <>
                <p>
                  This change cannot be made. Allowed change from "{editingInvestor.status}" is only:{" "}
                  {getAllowedTransitions(editingInvestor.status).join(", ")}.
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

export default InvestorsPage;
