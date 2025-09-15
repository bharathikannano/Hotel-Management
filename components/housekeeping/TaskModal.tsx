import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { HousekeepingTask, TaskStatus, Room, User, Role, TaskPriority } from '../../types';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Omit<HousekeepingTask, 'id' | 'date'>, id?: string) => void;
    initialData: HousekeepingTask | null;
    rooms: Room[];
    users: User[];
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialData, rooms, users }) => {
    
    const [formData, setFormData] = useState({
        roomId: '',
        task: '',
        assignedTo: '',
        status: TaskStatus.Pending,
        priority: TaskPriority.Medium,
        notes: '',
    });

    const housekeepers = users.filter(u => u.role === Role.Housekeeping);

    useEffect(() => {
        if (initialData) {
            setFormData({
                roomId: initialData.roomId,
                task: initialData.task,
                assignedTo: initialData.assignedTo,
                status: initialData.status,
                priority: initialData.priority || TaskPriority.Medium,
                notes: initialData.notes || '',
            });
        } else {
            // Reset for new task
            setFormData({
                roomId: '',
                task: '',
                assignedTo: housekeepers.length > 0 ? housekeepers[0].id : '', // Default to first housekeeper
                status: TaskStatus.Pending,
                priority: TaskPriority.Medium,
                notes: '',
            });
        }
    }, [initialData, users]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value }));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData, initialData?.id);
    }
    
    const modalTitle = initialData ? 'Edit Housekeeping Task' : 'New Housekeeping Task';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Select label="Room" name="roomId" id="roomId" value={formData.roomId} onChange={handleChange} required>
                    <option value="">Select Room</option>
                    {rooms.map(r => <option key={r.id} value={r.id}>{r.roomNumber}</option>)}
                </Select>
                <Input label="Task Description" name="task" id="task" value={formData.task} onChange={handleChange} required placeholder="e.g., Full Cleaning, Towel Change" />
                <Select label="Assign To" name="assignedTo" id="assignedTo" value={formData.assignedTo} onChange={handleChange} required>
                    <option value="">Select Staff</option>
                    {housekeepers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </Select>
                <Select label="Priority" name="priority" id="priority" value={formData.priority} onChange={handleChange} required>
                    {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                </Select>
                 {initialData && (
                    <Select label="Status" name="status" id="status" value={formData.status} onChange={handleChange} required>
                        {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                 )}
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Notes (Optional)
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-500 focus:border-brand-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:focus:ring-brand-400 dark:focus:border-brand-400"
                        placeholder="e.g., Guest preferences, maintenance issues"
                    />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t dark:border-slate-700 mt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit">Save Task</Button>
                </div>
            </form>
        </Modal>
    )
};

export default TaskModal;