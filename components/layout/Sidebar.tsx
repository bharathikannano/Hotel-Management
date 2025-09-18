import React from 'react';
import { Page, User, Role } from '../../types';
import { DashboardIcon, ReservationIcon, GuestIcon, BedIcon, HousekeepingIcon, ReportIcon, UserIcon, LogoutIcon, FeedbackIcon, HistoryIcon } from '../icons';

interface SidebarProps {
  currentPage: Page;
  user: User;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  isSidebarOpen: boolean;
}

// FIX: Defined a NavItem type to handle the optional 'name' property, resolving a TypeScript error.
type NavItem = {
  page: Page;
  name?: string;
  icon: React.FC<{ className?: string }>;
  roles: ReadonlyArray<Role>;
};

const navItems: ReadonlyArray<NavItem> = [
  { page: 'Dashboard', icon: DashboardIcon, roles: [Role.Admin, Role.Manager, Role.FrontDesk] },
  { page: 'Reservations', icon: ReservationIcon, roles: [Role.Admin, Role.Manager, Role.FrontDesk] },
  { page: 'Guests', icon: GuestIcon, roles: [Role.Admin, Role.Manager, Role.FrontDesk] },
  { page: 'Rooms', icon: BedIcon, roles: [Role.Admin, Role.Manager, Role.FrontDesk, Role.Housekeeping] },
  { page: 'Housekeeping', icon: HousekeepingIcon, roles: [Role.Admin, Role.Manager, Role.Housekeeping] },
  { page: 'Reports', icon: ReportIcon, roles: [Role.Admin, Role.Manager] },
  { page: 'ActivityLog', name: 'Activity Log', icon: HistoryIcon, roles: [Role.Admin, Role.Manager] },
  { page: 'Feedback', icon: FeedbackIcon, roles: [Role.Admin, Role.Manager] },
  { page: 'Users', icon: UserIcon, roles: [Role.Admin] },
  { page: 'SubmitFeedback', name: 'Submit Feedback', icon: FeedbackIcon, roles: [Role.Guest] },
];


const Sidebar: React.FC<SidebarProps> = ({ currentPage, user, onNavigate, onLogout, isSidebarOpen }) => {
  return (
    <aside className={`fixed inset-y-0 left-0 bg-primary-900 text-primary-200 w-64 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:flex-col z-40`}>
        <div className="flex items-center justify-center h-20 border-b border-primary-700">
            <h1 className="text-2xl font-bold text-neutral-100">Zenith Grand</h1>
        </div>
        <nav className="flex-grow p-4">
            <ul>
                {navItems.filter(item => item.roles.includes(user.role)).map(item => (
                    <li key={item.page}>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); onNavigate(item.page); }}
                            className={`flex items-center p-3 my-1 rounded-xl transition-colors ${
                                currentPage === item.page
                                    ? 'bg-primary-600 text-white shadow-lg'
                                    : 'hover:bg-primary-700 hover:text-white'
                            }`}
                        >
                            <item.icon className="text-2xl mr-3 w-6 text-center" />
                            <span>{item.name || item.page}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
        <div className="p-4 border-t border-primary-700">
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); onLogout(); }}
                className="flex items-center p-3 rounded-xl hover:bg-primary-700 hover:text-white"
            >
                <LogoutIcon className="text-2xl mr-3 w-6 text-center" />
                <span>Logout</span>
            </a>
        </div>
    </aside>
  );
};

export default Sidebar;
