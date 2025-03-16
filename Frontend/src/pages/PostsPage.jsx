import React, { useState } from "react";
import logo from "../assets/logo.png"; 
import "../App.css";


const PostsPage = ({ posts, users, onSavePost, searchTerm, onSearchChange }) => {
  const [editingPost, setEditingPost] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Filter posts by link or text (if available)
  const filteredPosts = posts.filter(
    (post) =>
      post.link.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.text && post.text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Open the edit modal and set default status
  const handleEditClick = (post) => {
    setEditingPost(post);
    setNewStatus(post.isActive ? "Active" : "Inactive");
  };

  const handleCloseModal = () => {
    setEditingPost(null);
    setShowConfirm(false);
  };

  // Update status after confirmation
  const handleUpdateStatus = () => {
    if (editingPost) {
      const updatedPost = { ...editingPost, isActive: newStatus === "Active" };
      onSavePost(updatedPost.id, updatedPost);
      setEditingPost(null);
      setShowConfirm(false);
    }
  };

  return (
    <div>
      <h2>Posts Management</h2>
      {/* Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Link or Text..."
          value={searchTerm}
          onChange={onSearchChange}
          className="search-input"
        />
      </div>
      <table className="responsive-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Link</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>
                <a href={post.link} target="_blank" rel="noopener noreferrer">
                  {post.link}
                </a>
              </td>
              <td>{post.date}</td>
              <td>{post.isActive ? "Active" : "Inactive"}</td>
              <td>
                <button onClick={() => handleEditClick(post)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingPost && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="form-header">
              <img src={logo} alt="Company Logo" className="logo" />
            </div>
            <h3>Edit Post Status</h3>
            <p>
              <strong>Link: </strong>
              <a href={editingPost.link} target="_blank" rel="noopener noreferrer">
                {editingPost.link}
              </a>
            </p>
            <p>
              <strong>Date: </strong>
              {editingPost.date}
            </p>
            <div className="form-group">
              <label>Change Status:</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="form-control"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="form-actions">
              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="btn"
              >
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
            {showConfirm && (
              <div className="modal-overlay">
                <div className="modal">
                  <h3>Confirmation</h3>
                  <p>Are you sure you want to update the status?</p>
                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={handleUpdateStatus}
                      className="btn"
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfirm(false)}
                      className="btn btn-secondary"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsPage;
