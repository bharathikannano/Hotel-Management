import React, { useEffect } from 'react';
import { CloseIcon, SuccessIcon, ErrorIcon, InfoIcon } from '../icons';

const toastConfig = {
  success: {
    Icon: SuccessIcon,
    bg: 'bg-success-100 dark:bg-success-900/70',
    border: 'border-success-400 dark:border-success-500',
    text: 'text-success-800 dark:text-success-200',
    iconColor: 'text-success-500',
  },
  error: {
    Icon: ErrorIcon,
    bg: 'bg-danger-100 dark:bg-danger-900/70',
    border: 'border-danger-400 dark:border-danger-500',
    text: 'text-danger-800 dark:text-danger-200',
    iconColor: 'text-danger-500',
  },
  info: {
    Icon: InfoIcon,
    bg: 'bg-info-100 dark:bg-info-900/70',
    border: 'border-info-400 dark:border-info-500',
    text: 'text-info-800 dark:text-info-200',
    iconColor: 'text-info-500',
  },
};


const Toast = ({ toast, onClose }) => {
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
      className={`max-w-sm w-full ${config.bg} shadow-xl rounded-2xl pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border-l-4 ${config.border} animate-fade-in-right`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <config.Icon className={`text-2xl ${config.iconColor}`} aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-medium ${config.text}`}>{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={() => onClose(id)}
              className="inline-flex rounded-md bg-transparent text-neutral-500 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-800"
            >
              <span className="sr-only">Close</span>
              <CloseIcon className="text-xl" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
