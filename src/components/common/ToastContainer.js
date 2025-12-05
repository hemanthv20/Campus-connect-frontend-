import React, { useState, useEffect } from 'react';
import Toast from './Toast';
import { toast } from '../../utils/toastManager';

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((toastData) => {
      setToasts(prev => [...prev, toastData]);
    });

    return unsubscribe;
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          duration={t.duration}
          onClose={() => removeToast(t.id)}
        />
      ))}
    </div>
  );
}

export default ToastContainer;
