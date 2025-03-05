import React, { useState } from "react";

const InvestorsPage = ({
  investors,
  onToggleInvestorStatus,
  onSaveInvestor,
  investorChanges,
  setInvestorChanges,
  editingInvestor,
  onEditInvestor
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter investors based on the search term
  const filteredInvestors = investors.filter((investor) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return (
      investor.name.toLowerCase().includes(lowercasedSearchTerm) ||
      investor.firm.toLowerCase().includes(lowercasedSearchTerm) ||
      investor.status.toLowerCase().includes(lowercasedSearchTerm)
    );
  });

  const handleEditClick = (investor) => {
    onEditInvestor(investor.id); // Set the investor to be edited
    setInvestorChanges({
      name: investor.name,
      email: investor.email,
      amount: investor.amount,
      firm: investor.firm,
      status: investor.status,
    });
  };

  const handleSaveClick = (id) => {
    onSaveInvestor(id, investorChanges);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvestorChanges((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2>Investor Management</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by Name, Firm, or Status"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {/* Investors Table */}
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Investor ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Total Investments</th>
            <th>Firm</th>
            <th>Status</th>
            <th>Join Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvestors.map((investor) => (
            <tr key={investor.id}>
              <td>{investor.id}</td>
              <td>{investor.name}</td>
              <td>{investor.email}</td>
              <td>${investor.amount}</td>
              <td>{investor.firm}</td>
              <td>
                <button onClick={() => onToggleInvestorStatus(investor.id)}>
                  {investor.status}
                </button>
              </td>
              <td>{investor.joinDate}</td>
              <td>
                {editingInvestor === investor.id ? (
                  <div>
                    <button onClick={() => handleSaveClick(investor.id)}>
                      Save
                    </button>
                  </div>
                ) : (
                  <button onClick={() => handleEditClick(investor)}>
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingInvestor && (
        <div>
          <h3>Edit Investor Details</h3>
          <form>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={investorChanges.name}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="email"
                value={investorChanges.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Total Investments:
              <input
                type="number"
                name="amount"
                value={investorChanges.amount}
                onChange={handleChange}
              />
            </label>
            <label>
              Firm:
              <input
                type="text"
                name="firm"
                value={investorChanges.firm}
                onChange={handleChange}
              />
            </label>
            <label>
              Status:
              <select
                name="status"
                value={investorChanges.status}
                onChange={handleChange}
              >
                <option value="Verified">Verified</option>
                <option value="Unverified">Unverified</option>
                <option value="Blocked">Blocked</option>
              </select>
            </label>
            <div>
              <button
                type="button"
                onClick={() => handleSaveClick(investor.id)}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default InvestorsPage;
