import React, { useState } from "react";

const InvestorsPage = ({ investors, onSaveInvestor }) => {
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingInvestor, setEditingInvestor] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Filter investors based on the selected status
  const filteredInvestors = investors.filter((investor) =>
    filterStatus === "All" ? true : investor.status === filterStatus
  );

  // When starting to edit, set the default newStatus based on current status
  const handleEditClick = (investor) => {
    setEditingInvestor(investor);
    if (investor.status === "Rejected") {
      setNewStatus("Verified");
    } else if (investor.status === "Verified") {
      setNewStatus("Blocked");
    } else if (investor.status === "Blocked") {
      setNewStatus("Verified");
    } else {
      setNewStatus("");
    }
  };

  // Allowed status transitions based on current status
  const getStatusOptions = (currentStatus) => {
    if (currentStatus === "Rejected") {
      return ["Verified"];
    } else if (currentStatus === "Verified") {
      return ["Blocked", "Rejected"];
    } else if (currentStatus === "Blocked") {
      return ["Verified", "Rejected"];
    }
    return [];
  };

  // Handle the update action with a confirmation popup
  const handleUpdateStatus = () => {
    if (editingInvestor) {
      if (
        window.confirm(
          `Are you sure you want to change the status to "${newStatus}"?`
        )
      ) {
        const updatedInvestor = { ...editingInvestor, status: newStatus };
        onSaveInvestor(updatedInvestor.id, updatedInvestor);
        setEditingInvestor(null);
      }
    }
  };

  const handleCloseModal = () => {
    setEditingInvestor(null);
  };

  // Inline styles for the modal popup
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

  return (
    <div>
      <h2>Investor Management</h2>

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
                <button onClick={() => handleEditClick(investor)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Popup with Full Investor Details */}
      {editingInvestor && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            {/* Project Logo */}
            <div style={{ textAlign: "center" }}>
              <img src="/logo.png" alt="Project Logo" style={logoStyle} />
            </div>
            <h3>Investor Details</h3>
            <form>
              <div>
                <label>Profile Picture: </label>
                {editingInvestor.profile_picture ? (
                  <img
                    src={editingInvestor.profile_picture}
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
              </div>
              <div>
                <label>Full Name: </label>
                <input
                  type="text"
                  value={
                    editingInvestor.full_name ||
                    editingInvestor.name ||
                    ""
                  }
                  readOnly
                />
              </div>
              <div>
                <label>Username: </label>
                <input
                  type="text"
                  value={editingInvestor.username || ""}
                  readOnly
                />
              </div>
              <div>
                <label>Role: </label>
                <input
                  type="text"
                  value={editingInvestor.role || ""}
                  readOnly
                />
              </div>
              <div>
                <label>Email: </label>
                <input
                  type="email"
                  value={editingInvestor.email || ""}
                  readOnly
                />
              </div>
              <div>
                <label>Location: </label>
                <input
                  type="text"
                  value={editingInvestor.location || ""}
                  readOnly
                />
              </div>
              <div>
                <label>Bio: </label>
                <textarea value={editingInvestor.bio || ""} readOnly />
              </div>
              <div>
                <label>Phone: </label>
                <input
                  type="text"
                  value={editingInvestor.phone || ""}
                  readOnly
                />
              </div>
              <div>
                <label>LinkedIn: </label>
                <input
                  type="url"
                  value={editingInvestor.linkedin || ""}
                  readOnly
                />
              </div>
              <div>
                <label>Twitter: </label>
                <input
                  type="url"
                  value={editingInvestor.twitter || ""}
                  readOnly
                />
              </div>
              <div>
                <label>Firm Name: </label>
                <input
                  type="text"
                  value={editingInvestor.firmName || editingInvestor.firm || ""}
                  readOnly
                />
              </div>
              <div>
                <label>Investment Stage: </label>
                <input
                  type="text"
                  value={editingInvestor.investmentStage || ""}
                  readOnly
                />
              </div>
              <div>
                <label>Portfolio Size: </label>
                <input
                  type="text"
                  value={editingInvestor.portfolioSize || ""}
                  readOnly
                />
              </div>
              <div>
                <label>Website: </label>
                <input
                  type="url"
                  value={editingInvestor.website || ""}
                  readOnly
                />
              </div>
              <div>
                <label>Min Investment: </label>
                <input
                  type="text"
                  value={editingInvestor.minInvestment || ""}
                  readOnly
                />
              </div>
              <div>
                <label>Max Investment: </label>
                <input
                  type="text"
                  value={editingInvestor.maxInvestment || ""}
                  readOnly
                />
              </div>
              <div>
                <label>Sectors: </label>
                <input
                  type="text"
                  value={editingInvestor.sectors || ""}
                  readOnly
                />
              </div>
              <div>
                <label>Status: </label>
                <input
                  type="text"
                  value={editingInvestor.status || ""}
                  readOnly
                />
              </div>
              <div>
                <label>Join Date: </label>
                <input
                  type="text"
                  value={editingInvestor.joinDate || ""}
                  readOnly
                />
              </div>
              <div>
                <label>ID Document: </label>
                {editingInvestor.id_document ? (
                  <a
                    href={editingInvestor.id_document}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Document
                  </a>
                ) : (
                  "N/A"
                )}
              </div>
              {/* Dropdown for status change */}
              <div style={{ marginTop: "1rem" }}>
                <label>Change Status: </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {getStatusOptions(editingInvestor.status).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <button type="button" onClick={handleUpdateStatus}>
                  Update Status
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{ marginLeft: "1rem" }}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorsPage;
