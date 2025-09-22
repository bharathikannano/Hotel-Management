import React from 'react';
import { CloseIcon } from '../icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-neutral-900/70 z-50 flex justify-center items-center p-4 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl shadow-solid-light dark:shadow-solid-dark w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-full overflow-y-auto animate-zoom-in-95"
        onClick={(e) => e.stopPropagation()}
    >
        <div className="flex justify-between items-center p-4 border-b dark:border-neutral-700">
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
          >
            <CloseIcon className="text-2xl" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;