import React from 'react';

const Input = ({ label, id, className, ...props }) => {
  return (
    <div>
      {label && <label htmlFor={id} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
        {label}
      </label>}
      <input
        id={id}
        className={`w-full px-3 py-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 rounded-xl shadow-sm placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors duration-200 hover:border-primary-400 dark:hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:border-primary-400 disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
