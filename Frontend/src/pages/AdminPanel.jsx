import React, { useState } from "react";
import "../App.css";

export default function AdminPanel() {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
  ]);

  const [investors, setInvestors] = useState([
    { id: 1, name: "Investor One", amount: 5000, firm: "ABC Corp", status: "Active" },
    { id: 2, name: "Investor Two", amount: 10000, firm: "XYZ Ltd", status: "Pending" },
  ]);

  const [comments, setComments] = useState([
    { id: 1, text: "Great platform!" },
    { id: 2, text: "Needs improvements." },
  ]);

  const [page, setPage] = useState("users");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleDeleteUser = (id) => setUsers(users.filter((user) => user.id !== id));
  const handleDeleteInvestor = (id) => setInvestors(investors.filter((investor) => investor.id !== id));
  const handleDeleteComment = (id) => setComments(comments.filter((comment) => comment.id !== id));

  const handleLogout = () => {
    alert("Logging out... Redirecting to login page.");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div className={`admin-panel ${darkMode ? "dark-theme" : ""}`}>
      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <button className="sidebar-toggle fixed-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? "❌" : "☰"}
        </button>
        <h2>Admin Panel</h2>
        <ul>
          <li><button onClick={() => setPage("users")}>Users</button></li>
          <li><button onClick={() => setPage("investors")}>Investors</button></li>
          <li><button onClick={() => setPage("comments")}>Comments</button></li>
          <li><button onClick={() => setPage("settings")}>Settings</button></li>
        </ul>
      </div>

      <div className={`content ${sidebarOpen ? "shifted" : "full-width"}`}>
        {page === "users" && (
          <div>
            <h2>User Management</h2>
            <table className="responsive-table">
              <thead>
                <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {page === "investors" && (
          <div>
            <h2>Investor Management</h2>
            <table className="responsive-table">
              <thead>
                <tr><th>Name</th><th>Investment</th><th>Firm</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {investors.map((investor) => (
                  <tr key={investor.id}>
                    <td>{investor.name}</td>
                    <td>${investor.amount}</td>
                    <td>{investor.firm}</td>
                    <td>{investor.status}</td>
                    <td>
                      <button onClick={() => handleDeleteInvestor(investor.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {page === "comments" && (
          <div>
            <h2>Comments Management</h2>
            <table className="responsive-table">
              <thead>
                <tr><th>Comment</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment.id}>
                    <td>{comment.text}</td>
                    <td>
                      <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {page === "settings" && (
          <div>
            <h2>Settings</h2>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
            <button onClick={toggleDarkMode} className="dark-mode-btn">
              {darkMode ? "Disable Dark Mode" : "Enable Dark Mode"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
