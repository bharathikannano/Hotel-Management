import React from 'react';
import { ReservationStatus, RoomStatus, TaskStatus, Role, TaskPriority } from '../../types';
import { CheckIcon } from '../icons';

const Badge = ({ className, children }) => (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium shadow-sm ${className}`}>
        {children}
    </span>
);

export const ReservationStatusBadge = ({ status }) => {
    const statusStyles = {
        [ReservationStatus.Confirmed]: 'bg-info-100 text-info-800 dark:bg-info-900/50 dark:text-info-300',
        [ReservationStatus.CheckedIn]: 'bg-accent-100 text-accent-800 dark:bg-accent-900/50 dark:text-accent-300',
        [ReservationStatus.CheckedOut]: 'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300',
        [ReservationStatus.Cancelled]: 'bg-danger-100 text-danger-800 dark:bg-danger-900/50 dark:text-danger-300',
    };
    return <Badge className={statusStyles[status]}>{status}</Badge>;
};

export const RoomStatusBadge = ({ status }) => {
    const statusStyles = {
        [RoomStatus.Available]: 'bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-300',
        [RoomStatus.Occupied]: 'bg-accent-100 text-accent-800 dark:bg-accent-900/50 dark:text-accent-300',
        [RoomStatus.Dirty]: 'bg-danger-100 text-danger-800 dark:bg-danger-900/50 dark:text-danger-300',
        [RoomStatus.OutOfService]: 'bg-neutral-200 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300',
    };
    return <Badge className={statusStyles[status]}>{status}</Badge>;
};

export const TaskStatusBadge = ({ status }) => {
    const statusStyles = {
        [TaskStatus.Pending]: 'bg-accent-100 text-accent-800 dark:bg-accent-900/50 dark:text-accent-300',
        [TaskStatus.InProgress]: 'bg-info-100 text-info-800 dark:bg-info-900/50 dark:text-info-300',
        [TaskStatus.Done]: 'bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-300',
    };
    
    if (status === TaskStatus.Done) {
        return (
            <Badge className={statusStyles[status]}>
                <CheckIcon className="text-base mr-1.5 animate-checkmark" />
                {status}
            </Badge>
        );
    }
    
    return <Badge className={statusStyles[status]}>{status}</Badge>;
};

export const RoleBadge = ({ role }) => {
    const roleStyles = {
        [Role.Admin]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
        [Role.Manager]: 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300',
        [Role.FrontDesk]: 'bg-info-100 text-info-800 dark:bg-info-900/50 dark:text-info-300',
        [Role.Housekeeping]: 'bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-300',
        [Role.Guest]: 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300',
    };
    return <Badge className={roleStyles[role]}>{role}</Badge>;
};

export const PriorityBadge = ({ priority }) => {
    const priorityStyles = {
        [TaskPriority.High]: 'bg-danger-100 text-danger-800 dark:bg-danger-900/50 dark:text-danger-300',
        [TaskPriority.Medium]: 'bg-accent-100 text-accent-800 dark:bg-accent-900/50 dark:text-accent-300',
        [TaskPriority.Low]: 'bg-success-100 text-success-800 dark:bg-success-900/50 dark:text-success-300',
    };
    return <Badge className={priorityStyles[priority]}>{priority}</Badge>;
};
