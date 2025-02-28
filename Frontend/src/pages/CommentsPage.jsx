import React, { useState } from "react";

export default function CommentsPage() {
  const [comments, setComments] = useState([
    { id: 1, text: "Great platform!" },
    { id: 2, text: "Needs improvements." },
  ]);

  const handleDeleteComment = (id) => setComments(comments.filter((comment) => comment.id !== id));

  return (
    <div className="content">
      <h2>Comments Management</h2>
      <table>
        <thead>
          <tr><th>Comment</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td>{comment.text}</td>
              <td><button onClick={() => handleDeleteComment(comment.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
