import React, { useState, useEffect } from "react";
import axios from "axios";
import { Lightbulb } from "lucide-react";
import UsersPage from "./UsersPage";
import InvestorsPage from "./InvestorsPage";
import PostsPage from "./PostsPage";
import SettingsPage from "./SettingsPage";
import CreateEvent from "./CreateEvent";
import "../App.css";
import pp from "../assets/defaultpp.jpg";

export default function AdminPanel() {
  const [page, setPage] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [posts, setPosts] = useState([]);

  // Fetch users from Django API
  useEffect(() => {
    axios.get("http://localhost:8000/api/users/")
      .then((response) => {
        console.log("API Response:", response.data); // Debugging step
        setUsers(Array.isArray(response.data.data) ? response.data.data : []);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setUsers([]); // Ensure state is always an array
      });
  }, []);
  
  
  console.log("Fetched Users:", users);
  // Fetch investors from Django API
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/investors/")
      .then((response) => setInvestors(response.data))
      .catch((error) => console.error("Error fetching investors:", error));
  }, []);

  // Fetch posts from Django API
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/ideas/")
      .then((response) => setPosts(response.data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const renderContent = () => {
    switch (page) {
      case "users":
        return <UsersPage users={users} searchTerm={searchTerm} onSearchChange={(e) => setSearchTerm(e.target.value)} />;
      case "investors":
        return <InvestorsPage investors={investors} />;
      // case "posts":
      //   return <PostsPage posts={posts} />;
      case "settings":
        return <SettingsPage />;
      case "createEvent":
        return <CreateEvent />;
      default:
        return null;
    }
  };

  return (
    <>
      <header className="headerSection">
        <div className="EntContainer">
          <nav className="navigationBar">
            <a href="/" className="logoContainer">
              <Lightbulb className="logoIcon" />
              <span className="logoText">IdeaHub Admin</span>
            </a>
          </nav>
        </div>
      </header>

      <div className="EntContainer">
        <div className="admin-panel">
          <div className="sidebar">
            <h2>Admin Panel</h2>
            <ul>
              <li><button onClick={() => setPage("users")}>Users</button></li>
              <li><button onClick={() => setPage("investors")}>Investors</button></li>
              {/* <li><button onClick={() => setPage("posts")}>Posts</button></li> */}
              <li><button onClick={() => setPage("settings")}>Settings</button></li>
              <li><button onClick={() => setPage("createEvent")}>Create Event</button></li>
            </ul>
          </div>
          <div className="content">{renderContent()}</div>
        </div>
      </div>
    </>
  );
}
