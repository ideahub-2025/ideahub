import React, { useState } from "react";

const PostsPage = ({ posts, users, onTogglePostStatus, onDeletePost }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Handle search functionality
  const filteredPosts = posts.filter(post => {
    const user = users.find(u => u.id === post.userId);
    const userName = user ? user.name.toLowerCase() : "";
    const userEmail = user ? user.email.toLowerCase() : "";
    const userId = user ? user.id.toString() : "";

    return (
      userName.includes(searchTerm.toLowerCase()) ||
      userEmail.includes(searchTerm.toLowerCase()) ||
      userId.includes(searchTerm.toLowerCase()) ||
      post.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.link.toLowerCase().includes(searchTerm.toLowerCase()) // Added search for post link
    );
  });

  return (
    <div>
      <h2>Posts Management</h2>

      <input
        type="text"
        placeholder="Search by Name, Email, User ID, Post Text, or Post Link"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <table className="responsive-table">
        <thead>
          <tr>
            <th>Post ID</th>
            <th>Post Link</th>
            <th>Author</th>
            <th>Email</th>
            <th>User ID</th>
            <th>Text</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post) => {
            const user = users.find(u => u.id === post.userId);
            return (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>
                  <a href={post.link} target="_blank" rel="noopener noreferrer">
                    {post.link}
                  </a>
                </td>
                <td>{user ? user.name : "Unknown"}</td>
                <td>{user ? user.email : "Unknown"}</td>
                <td>{user ? user.id : "Unknown"}</td>
                <td>{post.text}</td>
                <td>
                  <button onClick={() => onTogglePostStatus(post.id)}>
                    {post.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
                <td>
                  <button onClick={() => onDeletePost(post.id)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PostsPage;
