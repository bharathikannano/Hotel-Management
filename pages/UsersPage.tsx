
import React, { useState, useMemo } from 'react';
import Table from '../components/common/Table';
import Select from '../components/common/Select';
import { Role } from '../types';
import { mockUsers } from '../data';
import { RoleBadge } from '../components/common/StatusBadge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';

const UserForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        role: Role.FrontDesk,
        avatarUrl: '',
    });
    const [avatarInputType, setAvatarInputType] = useState('url');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const switchAvatarInputType = (type) => {
        setAvatarInputType(type);
        // Clear previous avatar data on switch to avoid confusion
        setFormData(prev => ({ ...prev, avatarUrl: '' }));
        setAvatarPreview(null);
    };

    const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
                // FIX: Cast FileReader result to string to match state type.
                const result = loadEvent.target?.result as string;
                setAvatarPreview(result);
                setFormData(prev => ({ ...prev, avatarUrl: result }));
            };
            reader.readAsDataURL(file);
        } else {
            setAvatarPreview(null);
            setFormData(prev => ({...prev, avatarUrl: ''}));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'avatarUrl') {
            setAvatarPreview(value);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.username) {
            // Basic validation, could be more robust
            return;
        }
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* FIX: Add missing className prop. */}
            <Input label="Full Name" name="name" id="name" value={formData.name} onChange={handleChange} required className="" />
            {/* FIX: Add missing className prop. */}
            <Input label="Username" name="username" id="username" value={formData.username} onChange={handleChange} required className="" />
            {/* FIX: Add missing className prop. */}
            <Select label="Role" name="role" id="role" value={formData.role} onChange={handleChange} required className="">
                {Object.values(Role).filter(r => r !== Role.Guest).map(role => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </Select>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Avatar (Optional)</label>
                <div className="flex items-center gap-4">
                     <div className="flex p-1 bg-neutral-200 dark:bg-neutral-700 rounded-lg">
                        <button type="button" onClick={() => switchAvatarInputType('url')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${avatarInputType === 'url' ? 'bg-white dark:bg-neutral-600 text-primary-700 dark:text-primary-300 shadow' : 'text-neutral-600 dark:text-neutral-300'}`}>URL</button>
                        <button type="button" onClick={() => switchAvatarInputType('upload')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${avatarInputType === 'upload' ? 'bg-white dark:bg-neutral-600 text-primary-700 dark:text-primary-300 shadow' : 'text-neutral-600 dark:text-neutral-300'}`}>Upload</button>
                    </div>
                    {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="w-12 h-12 rounded-full object-cover border-2 border-neutral-200 dark:border-neutral-600"/>}
                </div>
                {avatarInputType === 'url' ? (
                    // FIX: Add missing className prop.
                    <Input label="" name="avatarUrl" id="avatarUrl" value={formData.avatarUrl} onChange={handleChange} placeholder="https://example.com/avatar.png" className="" />
                ) : (
                    <div>
                        <label htmlFor="avatarUpload" className="inline-block cursor-pointer bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 rounded-xl shadow-sm px-4 py-2 text-sm font-medium hover:border-primary-400 dark:hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-neutral-800 focus:ring-primary-500/50 transition-colors">
                           {avatarPreview ? 'Change File' : 'Choose File'}
                        </label>
                        <input id="avatarUpload" name="avatarUpload" type="file" className="sr-only" onChange={handleAvatarFileChange} accept="image/png, image/jpeg, image/gif"/>
                        {avatarPreview && <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">File selected.</p>}
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t dark:border-neutral-700 mt-4">
                {/* FIX: Add missing className prop. */}
                <Button type="button" variant="secondary" onClick={onCancel} className="">Cancel</Button>
                {/* FIX: Add missing className prop. */}
                <Button type="submit" className="">Create User</Button>
            </div>
        </form>
    );
};


const UsersPage = () => {
    const [users, setUsers] = useState(mockUsers);
    const [roleFilter, setRoleFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRoleChange = (userId, newRole) => {
        setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    };

    const handleSaveUser = (newUserData) => {
        const newUser = {
            id: `user-${Date.now()}`,
            name: newUserData.name,
            username: newUserData.username,
            role: newUserData.role,
            avatarUrl: newUserData.avatarUrl || `https://picsum.photos/seed/user${Date.now()}/100/100`,
        };
        setUsers(prevUsers => [...prevUsers, newUser]);
        setIsModalOpen(false);
    };

    const filteredUsers = useMemo(() => {
        if (!roleFilter) return users;
        return users.filter(user => user.role === roleFilter);
    }, [users, roleFilter]);

    const columns = [
        { 
            header: 'User', 
            accessor: (item) => (
                <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full object-cover" src={item.avatarUrl} alt={`${item.name}'s avatar`} />
                    <div className="ml-4">
                        <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.name}</div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">{item.username}</div>
                    </div>
                </div>
            )
        },
        { header: 'Role', accessor: (item) => <RoleBadge role={item.role} />, sortable: true, sortKey: 'role' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end space-y-4 sm:space-y-0">
                <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">User Management</h2>
                <div className="flex items-end space-x-4">
                    <div className="w-full sm:w-48">
                        {/* FIX: Add missing className prop. */}
                        <Select
                            label="Filter by Role"
                            id="role-filter"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className=""
                        >
                            <option value="">All Roles</option>
                            {Object.values(Role).map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </Select>
                    </div>
                    {/* FIX: Add missing className prop. */}
                    <Button onClick={() => setIsModalOpen(true)} className="">New User</Button>
                </div>
            </div>
            <Table
                columns={columns}
                data={filteredUsers}
                renderRowActions={(user) => (
                     user.role !== Role.Admin && (
                        // FIX: Add missing id prop.
                        <Select label="" id={`role-select-${user.id}`} value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value)} className="w-40 !py-1 text-xs">
                            {Object.values(Role).filter(r => r !== Role.Guest).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </Select>
                     )
                )}
            />
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New User">
                <UserForm onSave={handleSaveUser} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default UsersPage;
