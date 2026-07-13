'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, X, Plane, Upload, Star } from 'lucide-react';

interface ByAir {
    id: number;
    title: string;
    slug?: string;
    destination: string;
    airline?: string;
    flight_duration?: string;
    road_duration?: string;
    duration_days: number;
    duration_nights: number;
    price_per_person: number;
    description?: string;
    highlights?: string;
    inclusions?: string;
    exclusions?: string;
    itinerary?: string;
    cover_image?: string;
    urgency_badge?: string;
    is_featured: boolean;
    status: string;
    sort_order?: number;
    meta_title?: string;
    meta_description?: string;
}

const emptyForm = {
    title: '', destination: '', airline: '', flight_duration: '', road_duration: '',
    duration_days: '4', duration_nights: '3', price_per_person: '', description: '',
    highlights: '', inclusions: '', exclusions: '', itinerary: '', cover_image: '',
    urgency_badge: '', is_featured: false, status: 'active', sort_order: '0',
    meta_title: '', meta_description: '',
};

export default function ByAirAdminPage() {
    const [packages, setPackages] = useState<ByAir[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState<ByAir | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({ ...emptyForm });

    useEffect(() => { fetchPackages(); }, []);

    const fetchPackages = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            const res = await fetch(`/api/admin/by-air?${params}`);
            if (res.status === 401) { window.location.href = '/admin/login'; return; }
            if (res.ok) setPackages(await res.json());
        } catch (e) {
            console.error('Error fetching by-air packages:', e);
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
            const url = isEditing && selected ? `/api/admin/by-air?id=${selected.id}` : '/api/admin/by-air';
            const res = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Package ${isEditing ? 'updated' : 'created'} successfully`);
                setShowModal(false);
                resetForm();
                fetchPackages();
            } else {
                alert(data.error || 'Failed to save package');
            }
        } catch (e) {
            console.error('Error saving package:', e);
            alert('Failed to save package');
        }
    };

    const handleEdit = (p: ByAir) => {
        setSelected(p);
        setIsEditing(true);
        setFormData({
            title: p.title, destination: p.destination, airline: p.airline || '',
            flight_duration: p.flight_duration || '', road_duration: p.road_duration || '',
            duration_days: String(p.duration_days), duration_nights: String(p.duration_nights),
            price_per_person: String(p.price_per_person), description: p.description || '',
            highlights: p.highlights || '', inclusions: p.inclusions || '', exclusions: p.exclusions || '',
            itinerary: p.itinerary || '', cover_image: p.cover_image || '', urgency_badge: p.urgency_badge || '',
            is_featured: p.is_featured, status: p.status, sort_order: String(p.sort_order ?? 0),
            meta_title: p.meta_title || '', meta_description: p.meta_description || '',
        });
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ ...emptyForm });
        setSelected(null);
        setIsEditing(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this package?')) return;
        try {
            const res = await fetch(`/api/admin/by-air?id=${id}`, { method: 'DELETE' });
            if (res.ok) setPackages(packages.filter((p) => p.id !== id));
        } catch (e) {
            console.error('Error deleting package:', e);
        }
    };

    const formatCurrency = (n: number) => `PKR ${(Number(n) || 0).toLocaleString()}`;
    const statusColor = (s: string) => (s === 'active' ? 'bg-green-500/20 text-green-400' : s === 'coming_soon' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400');

    const filtered = packages.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.destination.toLowerCase().includes(search.toLowerCase()));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">By-Air Packages</h1>
                    <p className="text-gray-400 mt-1">{packages.length} packages</p>
                </div>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Package
                </button>
            </div>

            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or destination..."
                            className="w-full bg-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="coming_soon">Coming Soon</option>
                    </select>
                    <button onClick={fetchPackages} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
                        <Filter className="w-4 h-4" /> Apply
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p) => (
                    <div key={p.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-green-500/50 transition-all">
                        <div className="h-40 bg-gradient-to-br from-sky-600 to-indigo-700 flex items-center justify-center overflow-hidden relative">
                            {p.cover_image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.cover_image} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                                <Plane className="w-14 h-14 text-white/70" />
                            )}
                            {p.is_featured && <span className="absolute top-2 right-2 bg-sky-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"><Star className="w-3 h-3" />Featured</span>}
                        </div>
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{p.title}</h3>
                                    <p className="text-gray-400 text-sm">{p.destination} · {p.duration_days}D/{p.duration_nights}N</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor(p.status)}`}>{p.status}</span>
                            </div>
                            {(p.flight_duration || p.road_duration) && (
                                <p className="text-xs text-gray-300 my-2">
                                    {p.flight_duration && <span className="text-sky-400">✈ {p.flight_duration}</span>}
                                    {p.road_duration && <span className="text-gray-500 line-through ml-2">🚗 {p.road_duration}</span>}
                                </p>
                            )}
                            {p.urgency_badge && <p className="text-amber-400 text-xs mb-2">🔥 {p.urgency_badge}</p>}
                            <div className="border-t border-slate-700 pt-3 flex items-center justify-between">
                                <p className="text-xl font-bold text-green-400">{formatCurrency(p.price_per_person)}<span className="text-xs text-gray-400 font-normal">/person</span></p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(p)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(p.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400">No packages found. Click "Add Package" to create one.</div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => { setShowModal(false); resetForm(); }}>
                    <div className="bg-slate-800 rounded-xl max-w-3xl w-full my-8" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-white">{isEditing ? 'Edit Package' : 'Add By-Air Package'}</h2>
                                <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                                        <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., Skardu by Air — 4 Days Express" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Destination *</label>
                                        <input value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} required
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., Skardu" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Airline (optional)</label>
                                        <input value={formData.airline} onChange={(e) => setFormData({ ...formData, airline: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., PIA" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Flight duration</label>
                                        <input value={formData.flight_duration} onChange={(e) => setFormData({ ...formData, flight_duration: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., 50 min" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Road duration (for comparison)</label>
                                        <input value={formData.road_duration} onChange={(e) => setFormData({ ...formData, road_duration: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., 18 hrs" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Days *</label>
                                        <input type="number" min="1" value={formData.duration_days} onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })} required
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Nights</label>
                                        <input type="number" min="0" value={formData.duration_nights} onChange={(e) => setFormData({ ...formData, duration_nights: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Price per person (PKR) *</label>
                                        <input type="number" min="0" value={formData.price_per_person} onChange={(e) => setFormData({ ...formData, price_per_person: e.target.value })} required
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., 89000" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                            <option value="coming_soon">Coming Soon</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-6 md:col-span-2">
                                        <label className="flex items-center gap-2 text-gray-300">
                                            <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-4 h-4 accent-green-500" />
                                            Featured
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <label className="text-sm text-gray-300">Sort order</label>
                                            <input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })}
                                                className="w-20 bg-slate-700 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Urgency badge (optional)</label>
                                        <input value={formData.urgency_badge} onChange={(e) => setFormData({ ...formData, urgency_badge: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="e.g., Only 3 slots left this month" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                        <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Highlights (one per line)</label>
                                        <textarea rows={4} value={formData.highlights} onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder={'Shangrila Resort\nShigar Fort\nDeosai Plains'} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Itinerary (JSON, optional)</label>
                                        <textarea rows={4} value={formData.itinerary} onChange={(e) => setFormData({ ...formData, itinerary: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 font-mono text-xs" placeholder='[{"day_no":1,"title":"Arrival","description":"Fly to Skardu"}]' />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Inclusions (one per line)</label>
                                        <textarea rows={3} value={formData.inclusions} onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder={'Return flights\nHotel\nTransfers'} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">Exclusions (one per line)</label>
                                        <textarea rows={3} value={formData.exclusions} onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })}
                                            className="w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500" placeholder={'Personal expenses\nTips'} />
                                    </div>

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
                                        <Plus className="w-4 h-4" /> {isEditing ? 'Update Package' : 'Create Package'}
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
