
import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { TaskStatus, Role, TaskPriority } from '../../types';

const TaskModal = ({ isOpen, onClose, onSave, initialData, rooms, users }) => {
    
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, initialData?.id);
    }
    
    const modalTitle = initialData ? 'Edit Housekeeping Task' : 'New Housekeeping Task';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* FIX: Add missing className prop. */}
                <Select label="Room" name="roomId" id="roomId" value={formData.roomId} onChange={handleChange} required className="">
                    <option value="">Select Room</option>
                    {rooms.map(r => <option key={r.id} value={r.id}>{r.roomNumber}</option>)}
                </Select>
                {/* FIX: Add missing className prop. */}
                <Input label="Task Description" name="task" id="task" value={formData.task} onChange={handleChange} required placeholder="e.g., Full Cleaning, Towel Change" className="" />
                {/* FIX: Add missing className prop. */}
                <Select label="Assign To" name="assignedTo" id="assignedTo" value={formData.assignedTo} onChange={handleChange} required className="">
                    <option value="">Select Staff</option>
                    {housekeepers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </Select>
                {/* FIX: Add missing className prop. */}
                <Select label="Priority" name="priority" id="priority" value={formData.priority} onChange={handleChange} required className="">
                    {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                </Select>
                 {initialData && (
                    // FIX: Add missing className prop.
                    <Select label="Status" name="status" id="status" value={formData.status} onChange={handleChange} required className="">
                        {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                 )}
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        Notes (Optional)
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 rounded-xl shadow-sm placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors duration-200 hover:border-primary-400 dark:hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:border-primary-400 disabled:bg-neutral-100 dark:disabled:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
                        placeholder="e.g., Guest preferences, maintenance issues"
                    />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t dark:border-neutral-700 mt-4">
                    {/* FIX: Add missing className prop. */}
                    <Button type="button" variant="secondary" onClick={onClose} className="">Cancel</Button>
                    {/* FIX: Add missing className prop. */}
                    <Button type="submit" className="">Save Task</Button>
                </div>
            </form>
        </Modal>
    )
};

export default TaskModal;
