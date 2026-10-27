/**
 * Toast.jsx
 * Non-blocking floating notification system replacing default browser alert() dialogs.
 * Used for C++ GameException alerts, opponent disconnects, and file persistence notices.
 */
import React from 'react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        const typeClass = toast.type || 'info'; // error, success, info, warning
        return (
          <div
            key={toast.id}
            className={`toast-item toast-${typeClass}`}
            role="alert"
          >
            <div className="toast-icon">
              {typeClass === 'error' && '⚠️'}
              {typeClass === 'success' && '✓'}
              {typeClass === 'warning' && '🔔'}
              {typeClass === 'info' && 'ℹ️'}
            </div>
            <div className="toast-body">
              {toast.title && <div className="toast-title">{toast.title}</div>}
              <div className="toast-message">{toast.message}</div>
            </div>
            <button
              className="toast-close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Close notification"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
