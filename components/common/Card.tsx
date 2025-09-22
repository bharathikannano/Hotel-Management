
import React from 'react';

const Card = ({ children, className = '', title, actions }: { children: React.ReactNode; className?: string; title?: string; actions?: React.ReactNode; }) => {
  return (
    <div className={`bg-neutral-50 dark:bg-neutral-800 rounded-2xl shadow-solid-light dark:shadow-solid-dark ${className}`}>
      {(title || actions) && (
        <div className="flex justify-between items-center p-4 border-b border-neutral-200 dark:border-neutral-700">
          {title && <h3 className="font-semibold text-neutral-800 dark:text-neutral-200">{title}</h3>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
