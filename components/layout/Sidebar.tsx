import React from 'react';
import { Page, User, Role } from '../../types';
import { DashboardIcon, ReservationIcon, GuestIcon, RoomIcon, HousekeepingIcon, ReportIcon, UserIcon, LogoutIcon } from '../icons';

interface SidebarProps {
  currentPage: Page;
  user: User;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  isSidebarOpen: boolean;
}

const navItems = [
  { page: 'Dashboard', icon: DashboardIcon, roles: [Role.Admin, Role.Manager, Role.FrontDesk] },
  { page: 'Reservations', icon: ReservationIcon, roles: [Role.Admin, Role.Manager, Role.FrontDesk] },
  { page: 'Guests', icon: GuestIcon, roles: [Role.Admin, Role.Manager, Role.FrontDesk] },
  { page: 'Rooms', icon: RoomIcon, roles: [Role.Admin, Role.Manager, Role.FrontDesk, Role.Housekeeping] },
  { page: 'Housekeeping', icon: HousekeepingIcon, roles: [Role.Admin, Role.Manager, Role.Housekeeping] },
  { page: 'Reports', icon: ReportIcon, roles: [Role.Admin, Role.Manager] },
  { page: 'Users', icon: UserIcon, roles: [Role.Admin] },
] as const;


const Sidebar: React.FC<SidebarProps> = ({ currentPage, user, onNavigate, onLogout, isSidebarOpen }) => {
  return (
    <aside className={`fixed inset-y-0 left-0 bg-slate-800 text-slate-300 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col z-40`}>
        <div className="flex items-center justify-center h-20 border-b border-slate-700">
            <h1 className="text-2xl font-bold text-white">Zenith Grand</h1>
        </div>
        <nav className="flex-grow p-4">
            <ul>
                {/* FIX: Widen the type of item.roles to allow checking against the general Role enum. This resolves a type error caused by the strict typing from 'as const'. */}
                {navItems.filter(item => (item.roles as readonly Role[]).includes(user.role)).map(item => (
                    <li key={item.page}>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); onNavigate(item.page); }}
                            className={`flex items-center p-3 my-1 rounded-xl transition-colors ${
                                currentPage === item.page
                                    ? 'bg-brand-600 text-white shadow-lg'
                                    : 'hover:bg-slate-700 hover:text-white'
                            }`}
                        >
                            <item.icon className="w-6 h-6 mr-3" />
                            <span>{item.page}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
        <div className="p-4 border-t border-slate-700">
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); onLogout(); }}
                className="flex items-center p-3 rounded-xl hover:bg-slate-700 hover:text-white"
            >
                <LogoutIcon className="w-6 h-6 mr-3" />
                <span>Logout</span>
            </a>
        </div>
    </aside>
  );
};

export default Sidebar;