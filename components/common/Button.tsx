import React from 'react';

const Button = ({ children, variant = 'primary', className, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-px transition-all duration-200';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600 focus:ring-neutral-500',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
