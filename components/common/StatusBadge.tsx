import React from 'react';
import { ReservationStatus, RoomStatus, TaskStatus, Role, TaskPriority } from '../../types';

interface BadgeProps {
    className?: string;
    children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ className, children }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {children}
    </span>
);

export const ReservationStatusBadge: React.FC<{ status: ReservationStatus }> = ({ status }) => {
    const statusStyles: Record<ReservationStatus, string> = {
        [ReservationStatus.Confirmed]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        [ReservationStatus.CheckedIn]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
        [ReservationStatus.CheckedOut]: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
        [ReservationStatus.Cancelled]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };
    return <Badge className={statusStyles[status]}>{status}</Badge>;
};

export const RoomStatusBadge: React.FC<{ status: RoomStatus }> = ({ status }) => {
    const statusStyles: Record<RoomStatus, string> = {
        [RoomStatus.Available]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        [RoomStatus.Occupied]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300',
        [RoomStatus.Dirty]: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
        [RoomStatus.OutOfService]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return <Badge className={statusStyles[status]}>{status}</Badge>;
};

export const TaskStatusBadge: React.FC<{ status: TaskStatus }> = ({ status }) => {
    const statusStyles: Record<TaskStatus, string> = {
        [TaskStatus.Pending]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        [TaskStatus.InProgress]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        [TaskStatus.Done]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    };
    return <Badge className={statusStyles[status]}>{status}</Badge>;
};

export const RoleBadge: React.FC<{ role: Role }> = ({ role }) => {
    const roleStyles: Record<Role, string> = {
        [Role.Admin]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        [Role.Manager]: 'bg-brand-100 text-brand-800 dark:bg-brand-900/50 dark:text-brand-300',
        [Role.FrontDesk]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        [Role.Housekeeping]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        [Role.Guest]: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
    };
    return <Badge className={roleStyles[role]}>{role}</Badge>;
};

export const PriorityBadge: React.FC<{ priority: TaskPriority }> = ({ priority }) => {
    const priorityStyles: Record<TaskPriority, string> = {
        [TaskPriority.High]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        [TaskPriority.Medium]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        [TaskPriority.Low]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    };
    return <Badge className={priorityStyles[priority]}>{priority}</Badge>;
};