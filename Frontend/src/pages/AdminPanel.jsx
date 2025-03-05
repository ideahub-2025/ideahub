import React, { useState } from "react";
import UsersPage from "./UsersPage";
import InvestorsPage from "./InvestorsPage";
import PostsPage from "./PostsPage";
import SettingsPage from "./SettingsPage";

export default function AdminPanel() {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active", joinDate: "2022-01-01" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Inactive", joinDate: "2021-05-15" },
    { id: 3, name: "Alice Brown", email: "alice@example.com", status: "Active", joinDate: "2023-02-12" },
  ]);

  const [investors, setInvestors] = useState([
    { id: 1, name: "Investor One", amount: 5000, firm: "ABC Corp", status: "Verified", email: "investor1@abc.com", joinDate: "2021-07-01" },
    { id: 2, name: "Investor Two", amount: 10000, firm: "XYZ Ltd", status: "Unverified", email: "investor2@xyz.com", joinDate: "2020-09-23" },
    { id: 3, name: "Investor Three", amount: 15000, firm: "DEF Investments", status: "Blocked", email: "investor3@def.com", joinDate: "2022-03-10" },
  ]);

  const [posts, setPosts] = useState([
    { id: 1, userId: 1, text: "Great platform!", link: "http://postlink1.com", isActive: true, date: "2023-03-01" },
    { id: 2, userId: 2, text: "Needs improvements.", link: "http://postlink2.com", isActive: false, date: "2023-03-02" },
  ]);

  const [page, setPage] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [userChanges, setUserChanges] = useState({});
  const [editingInvestor, setEditingInvestor] = useState(null);
  const [investorChanges, setInvestorChanges] = useState({});

  // Handle User Edit
  const handleEditUser = (id) => {
    const user = users.find(u => u.id === id);
    setUserChanges(user);
    setEditingUser(id);
  };

  const handleSaveUser = () => {
    setUsers(users.map(user => user.id === editingUser ? { ...user, ...userChanges } : user));
    setEditingUser(null);
    setUserChanges({});
  };

  const handleToggleStatus = (id) => {
    setUsers(users.map(user => user.id === id ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" } : user));
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  // Handle Investor Edit
  const handleEditInvestor = (id) => {
    const investor = investors.find(i => i.id === id);
    setInvestorChanges(investor);
    setEditingInvestor(id);
  };

  const handleSaveInvestor = () => {
    setInvestors(investors.map(investor => investor.id === editingInvestor ? { ...investor, ...investorChanges } : investor));
    setEditingInvestor(null);
    setInvestorChanges({});
  };

  const handleToggleInvestorStatus = (id) => {
    setInvestors(investors.map(investor => {
      if (investor.id === id) {
        const newStatus = investor.status === "Verified"
          ? "Unverified"
          : investor.status === "Unverified"
          ? "Blocked"
          : "Verified";
        return { ...investor, status: newStatus };
      }
      return investor;
    }));
  };

  const handleDeleteInvestor = (id) => {
    setInvestors(investors.filter(investor => investor.id !== id));
  };

  const handleTogglePostStatus = (id) => {
    setPosts(posts.map(post => post.id === id ? { ...post, isActive: !post.isActive } : post));
  };

  const handleDeletePost = (id) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      console.log("Logging out...");
    }
  };

  return (
    <div className="admin-panel">
      <div className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><button onClick={() => setPage("users")}>Users</button></li>
          <li><button onClick={() => setPage("investors")}>Investors</button></li>
          <li><button onClick={() => setPage("posts")}>Posts</button></li>
          <li><button onClick={() => setPage("settings")}>Settings</button></li>
        </ul>
      </div>

      <div className="content">
        {page === "users" && (
          <UsersPage
            users={users}
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onEditUser={handleEditUser}
            onSaveUser={handleSaveUser}
            onToggleStatus={handleToggleStatus}
            onDeleteUser={handleDeleteUser}
            userChanges={userChanges}
            setUserChanges={setUserChanges}
            editingUser={editingUser}
          />
        )}

        {page === "investors" && (
          <InvestorsPage
            investors={investors}
            onToggleInvestorStatus={handleToggleInvestorStatus}
            onDeleteInvestor={handleDeleteInvestor}
            onEditInvestor={handleEditInvestor}
            onSaveInvestor={handleSaveInvestor}
            investorChanges={investorChanges}
            setInvestorChanges={setInvestorChanges}
            editingInvestor={editingInvestor}
          />
        )}

        {page === "posts" && (
          <PostsPage
            posts={posts}
            users={users}
            onTogglePostStatus={handleTogglePostStatus}
            onDeletePost={handleDeletePost}
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
          />
        )}

        {page === "settings" && (
          <SettingsPage onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}
