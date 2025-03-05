import React, { useState } from "react";

const UsersPage = ({ users, searchTerm, onSearchChange, onEditUser, onToggleStatus, onSaveUser }) => {
  const [editingUser, setEditingUser] = useState(null);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    status: "",
    userId: "", // Added userId field
  });

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setUserDetails({
      name: user.name,
      email: user.email,
      status: user.status,
      userId: user.id, // Populating the userId field
    });
  };

  const handleSaveClick = () => {
    onSaveUser(editingUser, userDetails); // Pass the updated details to onSaveUser
    setEditingUser(null); // Clear edit state after saving
    setUserDetails({}); // Clear the input fields after saving
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2>User Management</h2>
      <input
        type="text"
        placeholder="Search Users..."
        value={searchTerm}
        onChange={onSearchChange}
        className="search-input"
      />
      <table className="responsive-table">
        <thead>
          <tr>
            <th>User ID</th> {/* Added User ID header */}
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Join Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((user) => (
              <tr key={user.id}>
                {editingUser === user.id ? (
                  <>
                    <td>{user.id}</td> {/* Displaying User ID in edit mode */}
                    <td>
                      <input
                        type="text"
                        name="name"
                        value={userDetails.name}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        name="email"
                        value={userDetails.email}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <select
                        name="status"
                        value={userDetails.status}
                        onChange={handleChange}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </td>
                    <td>{user.joinDate}</td>
                    <td>
                      <button onClick={handleSaveClick}>Save</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{user.id}</td> {/* Displaying User ID in non-edit mode */}
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.status}</td>
                    <td>{user.joinDate}</td>
                    <td>
                      <button onClick={() => handleEditClick(user)}>Edit</button>
                      <button onClick={() => onToggleStatus(user.id)}>
                        {user.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
