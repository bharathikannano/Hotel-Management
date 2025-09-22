import React from 'react';
import Toast from './Toast';

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed inset-0 pointer-events-none p-4 flex items-end justify-end z-[100]"
    >
      <div className="w-full max-w-sm space-y-4">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={onRemove} />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
