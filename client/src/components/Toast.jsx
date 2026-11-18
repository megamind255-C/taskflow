// client/src/components/Toast.jsx
// Auto-dismissing toast messages. The parent manages the array of toasts;
// this component just renders them.

import { useEffect } from 'react';

export default function Toast({ toasts, onDismiss }) {
  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div className={`toast toast--${toast.type}`} onClick={() => onDismiss(toast.id)}>
      {toast.message}
    </div>
  );
}