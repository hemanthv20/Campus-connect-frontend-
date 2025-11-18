import React from 'react';
import './css/MessageBubble.css';

const MessageBubble = ({ message, isSent, onDelete }) => {
  const getRelativeTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now - messageDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`message-bubble ${isSent ? 'sent' : 'received'}`}>
      <div className="message-content">
        {message.content}
      </div>
      <div className="message-footer">
        <span className="message-time">{getRelativeTime(message.createdOn)}</span>
        {isSent && message.isRead && <span className="read-indicator">✓✓</span>}
        {isSent && (
          <button
            className="delete-message-btn"
            onClick={() => onDelete(message.id)}
            title="Delete message"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
