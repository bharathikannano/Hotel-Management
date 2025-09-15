import React, { useEffect } from 'react';
import { CloseIcon, SuccessIcon, ErrorIcon, InfoIcon } from '../icons';
import { ToastMessage } from '../../types';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: string) => void;
}

const toastConfig = {
  success: {
    Icon: SuccessIcon,
    bg: 'bg-green-100 dark:bg-green-900/70',
    border: 'border-green-400 dark:border-green-500',
    text: 'text-green-800 dark:text-green-200',
    iconColor: 'text-green-500',
  },
  error: {
    Icon: ErrorIcon,
    bg: 'bg-red-100 dark:bg-red-900/70',
    border: 'border-red-400 dark:border-red-500',
    text: 'text-red-800 dark:text-red-200',
    iconColor: 'text-red-500',
  },
  info: {
    Icon: InfoIcon,
    bg: 'bg-blue-100 dark:bg-blue-900/70',
    border: 'border-blue-400 dark:border-blue-500',
    text: 'text-blue-800 dark:text-blue-200',
    iconColor: 'text-blue-500',
  },
};


const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const { id, message, type } = toast;
  const config = toastConfig[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [id, onClose]);

  return (
    <div
      className={`max-w-sm w-full ${config.bg} shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border-l-4 ${config.border} animate-fade-in-right`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <config.Icon className={`h-6 w-6 ${config.iconColor}`} aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-medium ${config.text}`}>{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onClose(id)}
              className="inline-flex rounded-md bg-transparent text-slate-500 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-offset-slate-800"
            >
              <span className="sr-only">Close</span>
              <CloseIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;