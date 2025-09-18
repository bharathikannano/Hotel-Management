import React, { useState, useMemo } from 'react';
import Table, { Column } from '../components/common/Table';
import Button from '../components/common/Button';
import { HousekeepingTask, Room, User, Role } from '../types';
import { TaskStatusBadge, PriorityBadge } from '../components/common/StatusBadge';
import { EditIcon, DeleteIcon, InfoIcon } from '../components/icons';
import ConfirmationModal from '../components/common/ConfirmationModal';
import TaskDetailsModal from '../components/housekeeping/TaskDetailsModal';


interface HousekeepingPageProps {
    tasks: HousekeepingTask[];
    rooms: Room[];
    users: User[];
    onOpenModal: (task: HousekeepingTask | null) => void;
    onDeleteTask: (id: string) => void;
    currentUser: User;
}

const HousekeepingPage: React.FC<HousekeepingPageProps> = ({ tasks, rooms, users, onOpenModal, onDeleteTask, currentUser }) => {
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [viewingTask, setViewingTask] = useState<HousekeepingTask | null>(null);

    const usersMap = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);
    const roomsMap = useMemo(() => new Map(rooms.map(r => [r.id, r])), [rooms]);

    const handleOpenDetailsModal = (task: HousekeepingTask) => {
        setViewingTask(task);
        setIsDetailsModalOpen(true);
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setViewingTask(null);
    };

    const handleDelete = (id: string) => {
        setTaskToDelete(id);
        setIsDeleteConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (taskToDelete) {
            onDeleteTask(taskToDelete);
        }
        handleCloseDeleteConfirm();
    };

    const handleCloseDeleteConfirm = () => {
        setIsDeleteConfirmOpen(false);
        setTaskToDelete(null);
    };

    const columns: Column<HousekeepingTask>[] = [
        { header: 'Room', accessor: (item) => roomsMap.get(item.roomId)?.roomNumber || 'N/A', sortable: true, sortKey: 'roomId' },
        { header: 'Task', accessor: 'task', sortable: true },
        { header: 'Assigned To', accessor: (item) => usersMap.get(item.assignedTo)?.name || 'N/A', sortable: true, sortKey: 'assignedTo' },
        { header: 'Date', accessor: 'date', sortable: true },
        { header: 'Priority', accessor: (item) => <PriorityBadge priority={item.priority} />, sortable: true, sortKey: 'priority' },
        { header: 'Status', accessor: (item) => <TaskStatusBadge status={item.status} />, sortable: true, sortKey: 'status' },
    ];

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">Housekeeping Schedule</h2>
                <Button onClick={() => onOpenModal(null)}>New Task</Button>
            </div>
            <Table
                columns={columns}
                data={tasks}
                renderRowActions={(task) => (
                    <div className="flex space-x-2">
                        <button onClick={() => handleOpenDetailsModal(task)} className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200" title="View Details"><InfoIcon className="text-xl"/></button>
                        <button onClick={() => onOpenModal(task)} className="text-primary-600 hover:text-primary-800" title="Edit"><EditIcon className="text-xl"/></button>
                        {currentUser.role === Role.Admin && (
                            <button onClick={() => handleDelete(task.id)} className="text-danger-600 hover:danger-800" title="Delete"><DeleteIcon className="text-xl"/></button>
                        )}
                    </div>
                )}
            />
            <ConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onClose={handleCloseDeleteConfirm}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this task? This action cannot be undone."
            />
            <TaskDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={handleCloseDetailsModal}
                task={viewingTask}
                room={viewingTask ? roomsMap.get(viewingTask.roomId) : undefined}
                assignedUser={viewingTask ? usersMap.get(viewingTask.assignedTo) : undefined}
            />
        </div>
    );
};

export default HousekeepingPage;