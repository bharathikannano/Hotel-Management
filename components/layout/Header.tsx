import React from 'react';
import { MenuIcon, SunIcon, MoonIcon, SystemIcon, SearchIcon } from '../icons';

const Header = ({ currentPage, user, onToggleSidebar, onOpenSearch, theme, onThemeChange }) => {
    return (
        <header className="bg-neutral-50 dark:bg-neutral-800 shadow-lg p-4 flex justify-between items-center sticky top-0 z-30">
            <div className="flex items-center">
                <button onClick={onToggleSidebar} className="md:hidden mr-4 text-neutral-500 dark:text-neutral-400">
                    <MenuIcon className="text-2xl" />
                </button>
                <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">{currentPage}</h2>
            </div>
            <div className="flex items-center space-x-4">
                <button onClick={onOpenSearch} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
                    <SearchIcon className="text-xl text-neutral-500 dark:text-neutral-400" />
                </button>
                <div className="flex p-1 bg-neutral-200 dark:bg-neutral-700 rounded-2xl">
                    <button onClick={() => onThemeChange('light')} className={`p-1.5 rounded-xl ${theme === 'light' ? 'bg-white dark:bg-primary-600 shadow-lg' : ''}`}>
                        <SunIcon className="text-xl text-neutral-600 dark:text-neutral-300" />
                    </button>
                    <button onClick={() => onThemeChange('dark')} className={`p-1.5 rounded-xl ${theme === 'dark' ? 'bg-white dark:bg-primary-600 shadow-lg' : ''}`}>
                         <MoonIcon className="text-xl text-neutral-600 dark:text-neutral-300" />
                    </button>
                    <button onClick={() => onThemeChange('system')} className={`p-1.5 rounded-xl ${theme === 'system' ? 'bg-white dark:bg-primary-600 shadow-lg' : ''}`}>
                        <SystemIcon className="text-xl text-neutral-600 dark:text-neutral-300" />
                    </button>
                </div>
                <div className="flex items-center space-x-3">
                    <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl} alt="User avatar" />
                    <div>
                        <p className="font-semibold text-neutral-800 dark:text-neutral-200 text-sm">{user.name}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{user.role}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
