'use client';

import { useState, useEffect } from 'react';
import api from '@/services/api';
import { Loader2, Shield, ShieldOff } from 'lucide-react';

export default function ManageUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!window.confirm(`Change role to ${newRole}?`)) return;
        try {
            await api.patch(`/admin/users/${id}/role`, { role: newRole });
            setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
        } catch (err) {
            console.error('Failed to update role', err);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-10 h-10 animate-spin" /></div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Manage Users</h1>
            <div className="glass rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-muted-foreground uppercase text-xs">
                        <tr>
                            <th className="p-6">User</th>
                            <th className="p-6">Email</th>
                            <th className="p-6">Role</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {users.map(user => (
                            <tr key={user._id} className="hover:bg-white/5 transition-colors">
                                <td className="p-6 flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                                        {user.name?.[0] || 'U'}
                                    </div>
                                    <span>{user.name || 'Anonymous'}</span>
                                </td>
                                <td className="p-6 text-muted-foreground">{user.email}</td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-white/10'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <button
                                        onClick={() => handleRoleUpdate(user._id, user.role)}
                                        className="p-2 hover:bg-white/10 rounded-full text-muted-foreground hover:text-white"
                                        title={user.role === 'admin' ? "Demote to User" : "Promote to Admin"}
                                    >
                                        {user.role === 'admin' ? <ShieldOff className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
