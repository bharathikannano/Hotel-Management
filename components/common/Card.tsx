import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, actions }) => {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-solid-light dark:shadow-solid-dark ${className}`}>
      {(title || actions) && (
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
          {title && <h3 className="font-semibold text-slate-800 dark:text-slate-200">{title}</h3>}
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