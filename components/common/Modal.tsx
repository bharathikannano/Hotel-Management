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
        className="fixed inset-0 bg-slate-900/70 z-50 flex justify-center items-center p-4 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-solid-light dark:shadow-solid-dark w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-full overflow-y-auto animate-zoom-in-95"
        onClick={(e) => e.stopPropagation()}
    >
        <div className="flex justify-between items-center p-4 border-b dark:border-slate-700">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
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