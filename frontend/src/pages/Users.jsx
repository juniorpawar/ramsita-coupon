import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUserRole } from '../api/admin.api.js';
import { parseError } from '../utils/errorParser.js';
import Sidebar from '../components/Sidebar.jsx';
import { UserPlus, Shield, Eye, Edit2 } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);

    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        password: '',
        role: 'viewer'
    });

    const [newRole, setNewRole] = useState('viewer');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await getUsers();
            setUsers(data.users);
        } catch (err) {
            setError(parseError(err));
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setCreating(true);

        try {
            await createUser(newUser);
            setShowCreateModal(false);
            setNewUser({ name: '', email: '', password: '', role: 'viewer' });
            loadUsers();
        } catch (err) {
            alert(parseError(err));
        } finally {
            setCreating(false);
        }
    };

    const handleUpdateRole = async () => {
        if (!selectedUser) return;

        setUpdating(true);

        try {
            await updateUserRole(selectedUser._id, newRole);
            setShowEditModal(false);
            setSelectedUser(null);
            loadUsers();
        } catch (err) {
            alert(parseError(err));
        } finally {
            setUpdating(false);
        }
    };

    const openEditModal = (user) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setShowEditModal(true);
    };

    const getRoleBadge = (role) => {
        if (role === 'admin') {
            return (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    <Shield className="w-3 h-3" />
                    Admin
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                <Eye className="w-3 h-3" />
                Viewer
            </span>
        );
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />

            <div className="flex-1 overflow-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
                            <p className="text-gray-600">Manage system users and their roles</p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" />
                            Create User
                        </button>
                    </div>

                    {error && (
                        <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {/* Users Table */}
                    <div className="card">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="spinner mx-auto"></div>
                            </div>
                        ) : users.length === 0 ? (
                            <p className="text-gray-500 text-center py-12">No users found</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Role</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Login</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {users.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium text-gray-800">{user.name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                                                <td className="px-4 py-3 text-center">{getRoleBadge(user.role)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => openEditModal(user)}
                                                        className="text-primary hover:text-primary-dark inline-flex items-center gap-1"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                        <span className="text-sm">Edit Role</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4">Create New User</h3>

                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="label">Name</label>
                                <input
                                    type="text"
                                    value={newUser.name}
                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    className="input-field"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Email</label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    className="input-field"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Password</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                    className="input-field"
                                    placeholder="Min 8 characters"
                                    required
                                    minLength={8}
                                />
                            </div>

                            <div>
                                <label className="label">Role</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                    className="input-field"
                                    required
                                >
                                    <option value="viewer">Viewer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="btn-primary flex-1"
                                >
                                    {creating ? 'Creating...' : 'Create User'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setNewUser({ name: '', email: '', password: '', role: 'viewer' });
                                    }}
                                    className="btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Role Modal */}
            {showEditModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-bold mb-4">Update User Role</h3>

                        <div className="mb-4">
                            <p className="text-sm text-gray-600">User</p>
                            <p className="font-semibold text-gray-800">{selectedUser.name}</p>
                            <p className="text-sm text-gray-600">{selectedUser.email}</p>
                        </div>

                        <div className="mb-6">
                            <label className="label">Role</label>
                            <select
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                                className="input-field"
                            >
                                <option value="viewer">Viewer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleUpdateRole}
                                disabled={updating || newRole === selectedUser.role}
                                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updating ? 'Updating...' : 'Update Role'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedUser(null);
                                }}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
