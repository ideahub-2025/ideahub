import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';

const ChatPopup = ({ receiver, ideaId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchChatHistory();
    const interval = setInterval(fetchChatHistory, 5000);
    return () => clearInterval(interval);
  }, [receiver, ideaId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/chat-history/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          sender: username,
          receiver: receiver,
          idea_id: ideaId
        })
      });
      
      const data = await response.json();
      if (data.status) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Optimistically add message to UI
    const tempMessage = {
      id: Date.now(),
      sender: username,
      receiver: receiver,
      message: newMessage,
      timestamp: new Date().toISOString(),
      idea_id: ideaId
    };
    
    setMessages([...messages, tempMessage]);
    setNewMessage('');

    try {
      const response = await fetch(`http://localhost:8000/api/send-message/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          sender: username,
          receiver: receiver,
          message: newMessage,
          idea_id: ideaId
        })
      });
      
      const data = await response.json();
      if (!data.status) {
        console.error('Failed to send message:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-popup" ref={chatBoxRef}>
      <div className="chat-popup-header">
        <div className="chat-popup-title">
          <div className="chat-popup-avatar">{receiver.charAt(0).toUpperCase()}</div>
          <h3>{receiver}</h3>
        </div>
        <button className="chat-popup-close" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
      
      <div className="chat-popup-messages">
        {loading ? (
          <div className="chat-loading">Loading messages...</div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`chat-message ${msg.sender === username ? 'sent' : 'received'}`}
              >
                <div className="message-content">{msg.message}</div>
                <div className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <form className="chat-popup-input" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="send-button">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatPopup;