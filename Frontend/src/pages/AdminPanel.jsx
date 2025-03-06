import React, { useState } from "react";
import { Lightbulb, Search, Bell, MessageSquare } from "lucide-react";
import UsersPage from "./UsersPage";
import InvestorsPage from "./InvestorsPage";
import PostsPage from "./PostsPage";
import SettingsPage from "./SettingsPage";
import "../App.css";

export default function AdminPanel() {
  const [page, setPage] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");

  // Dummy data (replace with real data as needed)
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active", photo: "/defaultpp.jpg" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Inactive", photo: "/defaultpp.jpg" },
  ]);
  const [investors, setInvestors] = useState([
    { id: 1, name: "Investor One", email: "investor1@example.com", status: "Verified", firmName: "ABC Corp", profile_picture: "/defaultpp.jpg" },
    { id: 2, name: "Investor Two", email: "investor2@example.com", status: "Unverified", firmName: "XYZ Ltd", profile_picture: "/defaultpp.jpg" },
  ]);
  const [posts, setPosts] = useState([
    { id: 1, link: "http://postlink1.com", date: "2023-03-01", isActive: true },
    { id: 2, link: "http://postlink2.com", date: "2023-03-02", isActive: false },
  ]);

  // Functions to handle updates (omitted for brevity)

  const renderContent = () => {
    switch (page) {
      case "users":
        return (
          <UsersPage
            users={users}
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onSaveUser={(id, updatedUser) =>
              setUsers(users.map((user) => (user.id === id ? updatedUser : user)))
            }
          />
        );
      case "investors":
        return (
          <InvestorsPage
            investors={investors}
            searchTerm={searchTerm}
            onSaveInvestor={(id, updatedInvestor) =>
              setInvestors(investors.map((inv) => (inv.id === id ? updatedInvestor : inv)))
            }
          />
        );
      case "posts":
        return (
          <PostsPage
            posts={posts}
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onSavePost={(id, updatedPost) =>
              setPosts(posts.map((post) => (post.id === id ? updatedPost : post)))
            }
          />
        );
      case "settings":
        return <SettingsPage onLogout={() => console.log("Logging out...")} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Common Header */}
      <header className="headerSection">
        <div className="EntContainer">
          <nav className="navigationBar">
            <a href="/" className="logoContainer">
              <Lightbulb className="logoIcon" />
              <span className="logoText">IdeaHub Admin</span>
            </a>
            <div className="searchWrapper">
              <Search className="searchIconWrapper" />
              <input
                type="text"
                className="searchInput"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="userActions">
              <button className="iconButton">
                <Bell />
              </button>
              <button className="iconButton">
                <MessageSquare />
              </button>
              <div className="userAvatar">
                <img src="/defaultpp.jpg" alt="Admin" />
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="EntContainer">
        <div className="admin-panel">
          <div className="sidebar">
            <h2>Admin Panel</h2>
            <ul>
              <li>
                <button onClick={() => setPage("users")}>Users</button>
              </li>
              <li>
                <button onClick={() => setPage("investors")}>Investors</button>
              </li>
              <li>
                <button onClick={() => setPage("posts")}>Posts</button>
              </li>
              <li>
                <button onClick={() => setPage("settings")}>Settings</button>
              </li>
            </ul>
          </div>
          <div className="content">{renderContent()}</div>
        </div>
      </div>
    </>
  );
}
