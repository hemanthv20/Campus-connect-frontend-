import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import MessageBubble from './MessageBubble';
import './css/ChatWindow.css';

const ChatWindow = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const MAX_CHARS = 100;
  const charCount = newMessage.length;
  const isOverLimit = charCount > MAX_CHARS;
  const isNearLimit = charCount > 80;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchMessages();
    markAsRead();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}${API_ENDPOINTS.GET_CHAT_MESSAGES}/${chatId}/messages?page=0&size=50`
      );
      setMessages(response.data.messages.reverse());
      
      // Extract other user from first message
      if (response.data.messages.length > 0) {
        const firstMsg = response.data.messages[0];
        if (firstMsg.senderId !== user.user_id) {
          setOtherUser({
            firstName: firstMsg.senderName.split(' ')[0],
            lastName: firstMsg.senderName.split(' ')[1] || '',
            profilePicture: firstMsg.senderProfilePicture
          });
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}${API_ENDPOINTS.MARK_MESSAGES_READ}/${chatId}/read?userId=${user.user_id}`
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isOverLimit || sending) return;

    setSending(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}${API_ENDPOINTS.SEND_MESSAGE}/${chatId}/messages`,
        {
          senderId: user.user_id,
          content: newMessage.trim()
        }
      );
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (error) {
      alert(error.response?.data || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(
        `${API_BASE_URL}${API_ENDPOINTS.DELETE_MESSAGE}/${messageId}?userId=${user.user_id}`
      );
      setMessages(messages.filter(m => m.id !== messageId));
    } catch (error) {
      alert('Failed to delete message');
    }
  };

  return (
    <div className="chat-window-page">
      <div className="chat-window-container">
        <div className="chat-window-header">
          <button onClick={() => navigate('/chat')} className="back-button">
            ←
          </button>
          <div className="header-user-info">
            {otherUser && (
              <>
                <img src={otherUser.profilePicture || require('../assets/placeholder.png')} alt="" />
                <span>{otherUser.firstName} {otherUser.lastName}</span>
              </>
            )}
          </div>
        </div>

        <div className="messages-container">
          {loading ? (
            <div className="loading">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="no-messages">No messages yet. Start the conversation!</div>
          ) : (
            messages.map(message => (
              <MessageBubble
                key={message.id}
                message={message}
                isSent={message.senderId === user.user_id}
                onDelete={deleteMessage}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-input-container" onSubmit={sendMessage}>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="message-input"
            rows="1"
          />
          <div className="input-footer">
            <span className={`char-counter ${isNearLimit ? 'warning' : ''} ${isOverLimit ? 'error' : ''}`}>
              {charCount}/{MAX_CHARS}
            </span>
            <button
              type="submit"
              disabled={!newMessage.trim() || isOverLimit || sending}
              className="send-button"
            >
              {sending ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
