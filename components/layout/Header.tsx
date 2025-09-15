import React from 'react';
import { User, Page, Theme } from '../../types';
import { MenuIcon, SunIcon, MoonIcon, SystemIcon } from '../icons';

interface HeaderProps {
    currentPage: Page;
    user: User;
    onToggleSidebar: () => void;
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, user, onToggleSidebar, theme, onThemeChange }) => {
    return (
        <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex justify-between items-center sticky top-0 z-30">
            <div className="flex items-center">
                <button onClick={onToggleSidebar} className="md:hidden mr-4 text-slate-500 dark:text-slate-400">
                    <MenuIcon className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">{currentPage}</h2>
            </div>
            <div className="flex items-center space-x-4">
                <div className="flex p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
                    <button onClick={() => onThemeChange('light')} className={`p-1.5 rounded-md ${theme === 'light' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}>
                        <SunIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                    <button onClick={() => onThemeChange('dark')} className={`p-1.5 rounded-md ${theme === 'dark' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}>
                         <MoonIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                    <button onClick={() => onThemeChange('system')} className={`p-1.5 rounded-md ${theme === 'system' ? 'bg-white dark:bg-slate-800 shadow' : ''}`}>
                        <SystemIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                    </button>
                </div>
                <div className="flex items-center space-x-3">
                    <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl} alt="User avatar" />
                    <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
