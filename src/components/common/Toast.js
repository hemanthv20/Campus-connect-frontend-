import React, { useEffect } from 'react';
import './Toast.css';

function Toast({ message, type = 'info', duration = 3000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fi-rr-check-circle';
      case 'error':
        return 'fi-rr-cross-circle';
      case 'warning':
        return 'fi-rr-exclamation';
      default:
        return 'fi-rr-info';
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <i className={`fi ${getIcon()}`}></i>
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>
        <i className="fi fi-rr-cross-small"></i>
      </button>
    </div>
  );
}

export default Toast;
