'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, X, RefreshCw, Mail, Phone, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useConfirmModal } from '@/hooks/useConfirmModal';

interface TeamMember {
    id: number;
    name: string;
    role: 'manager' | 'support' | 'guide';
    email: string;
    phone?: string;
    is_active: boolean;
    created_at?: string;
}

export default function TeamPage() {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
    const [lastRefresh, setLastRefresh] = useState(Date.now());
    const [formData, setFormData] = useState({
        name: '',
        role: 'support' as 'manager' | 'support' | 'guide',
        email: '',
        phone: '',
        password: '',
    });
    const { show, ConfirmModalComponent } = useConfirmModal();

    useEffect(() => {
        fetchTeam();
    }, [lastRefresh]);

    const fetchTeam = async () => {
        try {
            console.log('Fetching team members...');
            const response = await fetch('/api/admin/team');
            
            if (response.status === 401) {
                toast.error('Session expired. Please log in again.');
                window.location.href = '/admin/login';
                return;
            }

            if (response.ok) {
                const data = await response.json();
                console.log('Team members:', data);
                setTeam(data);
            }
        } catch (error) {
            console.error('Error fetching team:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (editingMember) {
                // Update existing member
                const response = await fetch(`/api/admin/team?id=${editingMember.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    toast.success('Team member updated successfully');
                    setShowModal(false);
                    setEditingMember(null);
                    resetForm();
                    setLastRefresh(Date.now());
                }
            } else {
                // Create new member
                const response = await fetch('/api/admin/team', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    toast.success('Team member added successfully');
                    setShowModal(false);
                    resetForm();
                    setLastRefresh(Date.now());
                }
            }
        } catch (error) {
            console.error('Error saving team member:', error);
            toast.error('Failed to save team member');
        }
    };

    const handleEdit = (member: TeamMember) => {
        setEditingMember(member);
        setFormData({
            name: member.name,
            role: member.role,
            email: member.email,
            phone: member.phone || '',
            password: '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        const confirmed = await show({
            title: 'Remove Team Member',
            message: 'Are you sure you want to remove this team member? This action cannot be undone.',
            type: 'delete'
        });

        if (!confirmed) return;

        try {
            const response = await fetch(`/api/admin/team?id=${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setTeam(team.filter(m => m.id !== id));
                toast.success('Team member removed successfully');
            }
        } catch (error) {
            console.error('Error deleting team member:', error);
            toast.error('Failed to remove team member');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            role: 'support',
            email: '',
            phone: '',
            password: '',
        });
    };

    const getRoleColor = (role: string) => {
        const colors: Record<string, string> = {
            manager: 'bg-purple-500/20 text-purple-400',
            support: 'bg-blue-500/20 text-blue-400',
            guide: 'bg-green-500/20 text-green-400',
        };
        return colors[role] || 'bg-gray-500/20 text-gray-400';
    };

    const getRoleIcon = (role: string) => {
        const icons: Record<string, string> = {
            manager: '👔',
            support: '🎧',
            guide: '🏔️',
        };
        return icons[role] || '👤';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Team Management</h1>
                    <p className="text-gray-400 mt-1">{team.length} team members</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setLastRefresh(Date.now())}
                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button 
                        onClick={() => {
                            setEditingMember(null);
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Team Member
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <p className="text-gray-400 text-sm">Managers</p>
                    <p className="text-2xl font-bold text-purple-400 mt-2">
                        {team.filter(m => m.role === 'manager').length}
                    </p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <p className="text-gray-400 text-sm">Support Staff</p>
                    <p className="text-2xl font-bold text-blue-400 mt-2">
                        {team.filter(m => m.role === 'support').length}
                    </p>
                </div>
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                    <p className="text-gray-400 text-sm">Tour Guides</p>
                    <p className="text-2xl font-bold text-green-400 mt-2">
                        {team.filter(m => m.role === 'guide').length}
                    </p>
                </div>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.map((member) => (
                    <div 
                        key={member.id} 
                        className="bg-slate-800 rounded-xl border border-slate-700 p-6 hover:border-green-500/50 transition-all"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-slate-700 p-3 rounded-full text-2xl">
                                    {getRoleIcon(member.role)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{member.name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(member.role)}`}>
                                        {member.role}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Mail className="w-4 h-4" />
                                <span>{member.email}</span>
                            </div>
                            {member.phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <Phone className="w-4 h-4" />
                                    <span>{member.phone}</span>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t border-slate-700">
                            <button
                                onClick={() => handleEdit(member)}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
                            >
                                <Edit className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(member.id)}
                                className="px-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {team.length === 0 && (
                    <div className="col-span-full bg-slate-800 rounded-xl p-12 border border-slate-700 text-center">
                        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No team members yet</p>
                        <button 
                            onClick={() => setShowModal(true)}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Your First Team Member
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div 
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div 
                        className="bg-slate-800 rounded-xl max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Role *
                                    </label>
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                                        className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    >
                                        <option value="manager">Manager</option>
                                        <option value="support">Support</option>
                                        <option value="guide">Tour Guide</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="+92 300 1234567"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Password {!editingMember && '*'}
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder={editingMember ? 'Leave blank to keep current' : 'Enter password'}
                                        required={!editingMember}
                                    />
                                    {editingMember && (
                                        <p className="text-xs text-gray-400 mt-1">Leave blank to keep current password</p>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                                    >
                                        <Shield className="w-4 h-4" />
                                        {editingMember ? 'Update' : 'Add Member'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            <ConfirmModalComponent />
        </div>
    );
}
