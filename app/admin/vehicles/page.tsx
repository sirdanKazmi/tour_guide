'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, X, Car, Upload, Users, Snowflake, Fuel, ShieldCheck } from 'lucide-react';

interface Vehicle {
    id: number;
    name: string;
    slug?: string;
    type: string;
    seats: number;
    has_ac: boolean;
    fuel: string;
    with_driver: boolean;
    price_per_day: number;
    description?: string;
    cover_image?: string;
    urgency_badge?: string;
    status: string;
    sort_order?: number;
    meta_title?: string;
    meta_description?: string;
}

const VEHICLE_TYPES = ['SUV', 'Van', 'Bus', 'Sedan', 'Jeep', 'Coaster', 'Hiace', 'Prado', 'Land Cruiser'];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];

const emptyForm = {
    name: '', type: 'SUV', seats: '4', has_ac: true, fuel: 'Petrol', with_driver: true,
    price_per_day: '', description: '', cover_image: '', urgency_badge: '', status: 'active',
    sort_order: '0', meta_title: '', meta_description: '',
};

export default function VehiclesAdminPage() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<Vehicle | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({ ...emptyForm });

    useEffect(() => { fetchVehicles(); }, []);

    const fetchVehicles = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            const res = await fetch(`/api/admin/vehicles?${params}`);
            if (res.status === 401) { window.location.href = '/admin/login'; return; }
            if (res.ok) setVehicles(await res.json());
        } catch (e) {
            console.error('Error fetching vehicles:', e);
        } finally {
            setLoading(false);
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('type', 'image');
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        return data.url;
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const url = await uploadImage(file);
            setFormData((f) => ({ ...f, cover_image: url }));
        } catch (err: any) {
            alert(err.message || 'Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = isEditing && selected ? `/api/admin/vehicles?id=${selected.id}` : '/api/admin/vehicles';
            const res = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Vehicle ${isEditing ? 'updated' : 'created'} successfully`);
                setShowModal(false);
                resetForm();
                fetchVehicles();
            } else {
                alert(data.error || 'Failed to save vehicle');
            }
        } catch (e) {
            console.error('Error saving vehicle:', e);
            alert('Failed to save vehicle');
        }
    };

    const handleEdit = (v: Vehicle) => {
        setSelected(v);
        setIsEditing(true);
        setFormData({
            name: v.name, type: v.type, seats: String(v.seats), has_ac: v.has_ac, fuel: v.fuel,
            with_driver: v.with_driver, price_per_day: String(v.price_per_day), description: v.description || '',
            cover_image: v.cover_image || '', urgency_badge: v.urgency_badge || '', status: v.status,
            sort_order: String(v.sort_order ?? 0), meta_title: v.meta_title || '', meta_description: v.meta_description || '',
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ ...emptyForm });
        setSelected(null);
        setIsEditing(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this vehicle?')) return;
        try {
            const res = await fetch(`/api/admin/vehicles?id=${id}`, { method: 'DELETE' });
            if (res.ok) setVehicles(vehicles.filter((v) => v.id !== id));
        } catch (e) {
            console.error('Error deleting vehicle:', e);
        }
    };

    const formatCurrency = (n: number) => `PKR ${(Number(n) || 0).toLocaleString()}`;
    const statusColor = (s: string) => (s === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400');

    const filtered = vehicles.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Car Rental Fleet</h1>
                    <p className="text-gray-400 mt-1">{vehicles.length} vehicles</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Vehicle
                </button>
            </div>

            {/* Filters */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name..."
                            className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <button onClick={fetchVehicles} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
                        <Filter className="w-4 h-4" /> Apply
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((v) => (
                    <div key={v.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-green-500/50 transition-all">
                        <div className="h-40 bg-gradient-to-br from-sky-600 to-blue-700 flex items-center justify-center overflow-hidden">
                            {v.cover_image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={v.cover_image} alt={v.name} className="w-full h-full object-cover" />
                            ) : (
                                <Car className="w-14 h-14 text-white/70" />
                            )}
                        </div>
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{v.name}</h3>
                                    <p className="text-gray-400 text-sm">{v.type}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor(v.status)}`}>{v.status}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-300 my-3">
                                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{v.seats}</span>
                                {v.has_ac && <span className="flex items-center gap-1"><Snowflake className="w-3.5 h-3.5" />AC</span>}
                                <span className="flex items-center gap-1"><Fuel className="w-3.5 h-3.5" />{v.fuel}</span>
                                {v.with_driver && <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" />Driver</span>}
                            </div>
                            {v.urgency_badge && <p className="text-amber-400 text-xs mb-2">🔥 {v.urgency_badge}</p>}
                            <div className="border-t border-slate-700 pt-3 flex items-center justify-between">
                                <p className="text-xl font-bold text-green-400">{formatCurrency(v.price_per_day)}<span className="text-xs text-gray-400 font-normal">/day</span></p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(v)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(v.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400">No vehicles found. Click "Add Vehicle" to create one.</div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => { setShowModal(false); resetForm(); }}>
                    <div className="bg-slate-800 rounded-xl max-w-3xl w-full my-8" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-white">{isEditing ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
                                <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                                        <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., Toyota Land Cruiser V8" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Type *</label>
                                        <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                                            {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Seats *</label>
                                        <input type="number" min="1" value={formData.seats} onChange={(e) => setFormData({ ...formData, seats: e.target.value })} required
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Fuel</label>
                                        <select value={formData.fuel} onChange={(e) => setFormData({ ...formData, fuel: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                                            {FUEL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Price per day (PKR) *</label>
                                        <input type="number" min="0" value={formData.price_per_day} onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })} required
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., 35000" />
                                    </div>

                                    <div className="flex items-center gap-6 md:col-span-2">
                                        <label className="flex items-center gap-2 text-gray-300">
                                            <input type="checkbox" checked={formData.has_ac} onChange={(e) => setFormData({ ...formData, has_ac: e.target.checked })} className="w-4 h-4 accent-green-500" />
                                            Air conditioning
                                        </label>
                                        <label className="flex items-center gap-2 text-gray-300">
                                            <input type="checkbox" checked={formData.with_driver} onChange={(e) => setFormData({ ...formData, with_driver: e.target.checked })} className="w-4 h-4 accent-green-500" />
                                            With driver
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Sort order</label>
                                        <input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Urgency badge (optional)</label>
                                        <input value={formData.urgency_badge} onChange={(e) => setFormData({ ...formData, urgency_badge: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., Only 2 left this month" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                        <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Short description shown on the fleet page" />
                                    </div>

                                    {/* Cover image */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Cover image</label>
                                        <div className="flex items-center gap-4">
                                            {formData.cover_image && (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={formData.cover_image} alt="cover" className="w-24 h-16 object-cover rounded-lg" />
                                            )}
                                            <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                                                <Upload className="w-4 h-4" /> {uploading ? 'Uploading…' : 'Upload'}
                                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                            </label>
                                            <input value={formData.cover_image} onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                                                className="flex-1 bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" placeholder="or paste image URL" />
                                        </div>
                                    </div>

                                    {/* SEO */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">SEO title (optional)</label>
                                        <input value={formData.meta_title} onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">SEO description (optional)</label>
                                        <textarea rows={2} value={formData.meta_description} onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-slate-700">
                                    <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg">Cancel</button>
                                    <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                                        <Plus className="w-4 h-4" /> {isEditing ? 'Update Vehicle' : 'Create Vehicle'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
