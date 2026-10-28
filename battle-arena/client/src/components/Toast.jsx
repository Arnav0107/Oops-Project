import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        const type = toast.type || 'info';
        return (
          <div key={toast.id} className={`toast-item toast-${type}`} role="alert">
            <div className="toast-icon">
              {type === 'error' && <AlertCircle size={18} strokeWidth={2} />}
              {type === 'success' && <CheckCircle2 size={18} strokeWidth={2} />}
              {type === 'warning' && <AlertCircle size={18} strokeWidth={2} />}
              {type === 'info' && <Info size={18} strokeWidth={2} />}
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
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
