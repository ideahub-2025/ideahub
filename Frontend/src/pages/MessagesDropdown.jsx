import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X } from 'lucide-react';
import "../App.css";

const MessagesDropdown = ({ username, onChatOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch messages when dropdown opens
  useEffect(() => {
    if (isOpen && username) {
      fetchMessages();
    }
  }, [isOpen, username]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/messages/?username=${username}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      const data = await response.json();
      if (data.status) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatOpen = (sender, ideaId) => {
    onChatOpen(sender, ideaId);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="messages-dropdown-container" ref={dropdownRef}>
      <button 
        className="iconButton"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Messages"
      >
        <MessageSquare />
        {messages.length > 0 && <span className="message-badge">{messages.length}</span>}
      </button>
      
      {isOpen && (
        <div className="messages-dropdown">
          <div className="messages-dropdown-header">
            <h3>Messages</h3>
          </div>
          <div className="messages-dropdown-content">
            {loading ? (
              <div className="messages-loading">Loading messages...</div>
            ) : messages.length > 0 ? (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className="message-preview"
                  onClick={() => handleChatOpen(msg.sender, msg.idea_id)}
                >
                  <div className="message-preview-avatar">
                    {msg.sender.charAt(0).toUpperCase()}
                  </div>
                  <div className="message-preview-content">
                    <div className="message-preview-sender">{msg.sender}</div>
                    <div className="message-preview-text">
                      {msg.message.length > 30 
                        ? `${msg.message.substring(0, 30)}...` 
                        : msg.message}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-messages">No new messages</div>
            )}
          </div>
          <div className="messages-dropdown-footer">
            <button className="view-all-messages">View All Messages</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesDropdown;