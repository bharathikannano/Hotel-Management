
import React, { useState, useMemo } from 'react';
import Table from '../components/common/Table';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { EditIcon, DeleteIcon } from '../components/icons';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { Role } from '../types';

const GuestForm = ({ onSave, onCancel, guest }) => {
    const [formData, setFormData] = useState({
        firstName: guest?.firstName || '',
        lastName: guest?.lastName || '',
        email: guest?.email || '',
        phone: guest?.phone || '',
        address: guest?.address || '',
        notes: guest?.notes || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                {/* FIX: Add missing className prop. */}
                <Input label="First Name" name="firstName" id="firstName" value={formData.firstName} onChange={handleChange} required className="" />
                {/* FIX: Add missing className prop. */}
                <Input label="Last Name" name="lastName" id="lastName" value={formData.lastName} onChange={handleChange} required className="" />
            </div>
            {/* FIX: Add missing className prop. */}
            <Input label="Email" name="email" id="email" type="email" value={formData.email} onChange={handleChange} required className="" />
            {/* FIX: Add missing className prop. */}
            <Input label="Phone" name="phone" id="phone" type="tel" value={formData.phone} onChange={handleChange} required className="" />
            {/* FIX: Add missing className prop. */}
            <Input label="Address" name="address" id="address" value={formData.address} onChange={handleChange} required className="" />
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
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 rounded-xl shadow-sm placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors duration-200 hover:border-primary-400 dark:hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 dark:focus:border-primary-400"
                    placeholder="e.g., Guest preferences, allergies, special requests"
                />
            </div>
            <div className="flex justify-end space-x-2 pt-4 border-t dark:border-neutral-700 mt-4">
                {/* FIX: Add missing className prop. */}
                <Button type="button" variant="secondary" onClick={onCancel} className="">Cancel</Button>
                {/* FIX: Add missing className prop. */}
                <Button type="submit" className="">{guest ? 'Save Changes' : 'Create Guest'}</Button>
            </div>
        </form>
    );
};

const GuestsPage = ({ guests, onAddGuest, onUpdateGuest, onDeleteGuest, onViewProfile, currentUser }) => {
    const [filter, setFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGuest, setEditingGuest] = useState(null);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [guestToDelete, setGuestToDelete] = useState(null);

    const filteredGuests = useMemo(() =>
        guests.filter(g =>
            `${g.firstName} ${g.lastName}`.toLowerCase().includes(filter.toLowerCase()) ||
            g.email.toLowerCase().includes(filter.toLowerCase()) ||
            g.phone.includes(filter)
        ), [guests, filter]);

    const handleOpenModal = (guest = null) => {
        setEditingGuest(guest);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingGuest(null);
    };

    const handleSaveGuest = (guestData) => {
        if (editingGuest) {
            onUpdateGuest(editingGuest.id, guestData);
        } else {
            onAddGuest(guestData);
        }
        handleCloseModal();
    };
    
    const handleDelete = (id) => {
        setGuestToDelete(id);
        setIsDeleteConfirmOpen(true);
    };
    
    const handleConfirmDelete = () => {
        if (guestToDelete) {
            onDeleteGuest(guestToDelete);
        }
        handleCloseDeleteConfirm();
    };

    const handleCloseDeleteConfirm = () => {
        setIsDeleteConfirmOpen(false);
        setGuestToDelete(null);
    };

    const columns = [
        { header: 'Name', accessor: (item) => <a href="#" onClick={(e) => { e.preventDefault(); onViewProfile(item); }} className="font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">{`${item.firstName} ${item.lastName}`}</a>, sortable: true },
        { header: 'Email', accessor: 'email', sortable: true },
        { header: 'Phone', accessor: 'phone', sortable: true },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="w-full md:w-1/3">
                    {/* FIX: Add missing className prop. */}
                    <Input label="" id="search" type="text" placeholder="Search by name, email, or phone..." value={filter} onChange={e => setFilter(e.target.value)} className="" />
                </div>
                <Button onClick={() => handleOpenModal()} className="w-full md:w-auto">New Guest</Button>
            </div>
            <Table
                columns={columns}
                data={filteredGuests}
                renderRowActions={(guest) => (
                    <div className="flex space-x-2">
                        <button onClick={() => handleOpenModal(guest)} className="text-primary-600 hover:text-primary-800" title="Edit"><EditIcon className="text-xl"/></button>
                        {currentUser.role === Role.Admin && (
                            <button onClick={() => handleDelete(guest.id)} className="text-danger-600 hover:danger-800" title="Delete"><DeleteIcon className="text-xl"/></button>
                        )}
                    </div>
                )}
            />
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingGuest ? 'Edit Guest' : 'New Guest'}>
                <GuestForm onSave={handleSaveGuest} onCancel={handleCloseModal} guest={editingGuest} />
            </Modal>
            <ConfirmationModal
                isOpen={isDeleteConfirmOpen}
                onClose={handleCloseDeleteConfirm}
                onConfirm={handleConfirmDelete}
                title="Confirm Deletion"
                message="Are you sure you want to delete this guest? This will also remove associated reservations."
            />
        </div>
    );
};

export default GuestsPage;
