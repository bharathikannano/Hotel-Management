import React from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { HousekeepingTask, Room, User } from '../../types';
import { TaskStatusBadge, PriorityBadge } from '../common/StatusBadge';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: HousekeepingTask | null;
  room: Room | undefined;
  assignedUser: User | undefined;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  task,
  room,
  assignedUser,
}) => {
  if (!isOpen || !task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Task Details: ${task.task}`}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-neutral-100 dark:bg-neutral-700/50 rounded-lg">
          <div>
            <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Room Number</h4>
            <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">{room?.roomNumber || 'N/A'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Assigned To</h4>
            <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">{assignedUser?.name || 'N/A'}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Status</h4>
            <TaskStatusBadge status={task.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Date</h4>
                <p className="text-neutral-800 dark:text-neutral-200">{task.date}</p>
            </div>
             <div>
                <h4 className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Priority</h4>
                <PriorityBadge priority={task.priority} />
            </div>
        </div>

        {task.notes && (
          <div>
            <h4 className="text-md font-semibold text-neutral-700 dark:text-neutral-300 border-t dark:border-neutral-700 pt-4 mt-4">Notes</h4>
            <p className="text-neutral-600 dark:text-neutral-300 mt-2 whitespace-pre-wrap">{task.notes}</p>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t dark:border-neutral-700 mt-6">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailsModal;