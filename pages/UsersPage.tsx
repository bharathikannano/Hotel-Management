import React, { useState, useMemo } from 'react';
import Table, { Column } from '../components/common/Table';
import Select from '../components/common/Select';
import { User, Role } from '../types';
import { mockUsers } from '../data';
import { RoleBadge } from '../components/common/StatusBadge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';

const UserForm = ({ onSave, onCancel }: { onSave: (data: Omit<User, 'id' | 'avatarUrl'> & { avatarUrl?: string }) => void, onCancel: () => void }) => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        role: Role.FrontDesk,
        avatarUrl: '',
    });
    const [avatarInputType, setAvatarInputType] = useState<'url' | 'upload'>('url');
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const switchAvatarInputType = (type: 'url' | 'upload') => {
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'avatarUrl') {
            setAvatarPreview(value);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.username) {
            // Basic validation, could be more robust
            return;
        }
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" name="name" id="name" value={formData.name} onChange={handleChange} required />
            <Input label="Username" name="username" id="username" value={formData.username} onChange={handleChange} required />
            <Select label="Role" name="role" id="role" value={formData.role} onChange={handleChange} required>
                {Object.values(Role).filter(r => r !== Role.Guest).map(role => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </Select>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Avatar (Optional)</label>
                <div className="flex items-center gap-4">
                     <div className="flex p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
                        <button type="button" onClick={() => switchAvatarInputType('url')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${avatarInputType === 'url' ? 'bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-300 shadow' : 'text-slate-600 dark:text-slate-300'}`}>URL</button>
                        <button type="button" onClick={() => switchAvatarInputType('upload')} className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${avatarInputType === 'upload' ? 'bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-300 shadow' : 'text-slate-600 dark:text-slate-300'}`}>Upload</button>
                    </div>
                    {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-600"/>}
                </div>
                {avatarInputType === 'url' ? (
                    <Input label="" name="avatarUrl" id="avatarUrl" value={formData.avatarUrl} onChange={handleChange} placeholder="https://example.com/avatar.png" />
                ) : (
                    <div>
                        <label htmlFor="avatarUpload" className="inline-block cursor-pointer bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-500 rounded-md shadow-sm px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-brand-500">
                           {avatarPreview ? 'Change File' : 'Choose File'}
                        </label>
                        <input id="avatarUpload" name="avatarUpload" type="file" className="sr-only" onChange={handleAvatarFileChange} accept="image/png, image/jpeg, image/gif"/>
                        {avatarPreview && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">File selected.</p>}
                    </div>
                )}
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t dark:border-slate-700 mt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Create User</Button>
            </div>
        </form>
    );
};


const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [roleFilter, setRoleFilter] = useState<Role | ''>('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRoleChange = (userId: string, newRole: Role) => {
        setUsers(users.map(user => user.id === userId ? { ...user, role: newRole } : user));
    };

    const handleSaveUser = (newUserData: Omit<User, 'id' | 'avatarUrl'> & { avatarUrl?: string }) => {
        const newUser: User = {
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

    const columns: Column<User>[] = [
        { 
            header: 'User', 
            accessor: (item) => (
                <div className="flex items-center">
                    <img className="h-10 w-10 rounded-full object-cover" src={item.avatarUrl} alt={`${item.name}'s avatar`} />
                    <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">{item.username}</div>
                    </div>
                </div>
            )
        },
        { header: 'Role', accessor: (item) => <RoleBadge role={item.role} />, sortable: true, sortKey: 'role' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end space-y-4 sm:space-y-0">
                <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">User Management</h2>
                <div className="flex items-end space-x-4">
                    <div className="w-full sm:w-48">
                        <Select
                            label="Filter by Role"
                            id="role-filter"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as Role | '')}
                        >
                            <option value="">All Roles</option>
                            {Object.values(Role).map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </Select>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>New User</Button>
                </div>
            </div>
            <Table
                columns={columns}
                data={filteredUsers}
                renderRowActions={(user) => (
                     user.role !== Role.Admin && (
                        <Select label="" value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value as Role)} className="w-40 !py-1 text-xs">
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