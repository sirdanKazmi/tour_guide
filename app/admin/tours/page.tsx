'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, X, Upload, Star, Plane, Bus, GripVertical, Package, Youtube } from 'lucide-react';

interface Tier { name: string; blurb: string; price: string; is_popular: boolean }
interface Day { title: string; description: string }

interface Tour {
    id: number;
    tour_name: string;
    slug?: string;
    destination: string;
    category: string;
    travel_mode?: string;
    duration: string;
    duration_days?: number;
    duration_nights?: number;
    price_per_person: number;
    max_seats: number;
    available_seats: number;
    departure_city: string;
    rating?: number;
    is_featured?: boolean;
    urgency_badge?: string;
    group_size?: string;
    accommodation_summary?: string;
    meals_summary?: string;
    status: string;
    cover_image?: string;
    description?: string;
    inclusions?: string;
    exclusions?: string;
    pricing_tiers?: string;
    itinerary_json?: string;
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    sort_order?: number;
    itinerary_code?: string;
    transport_label?: string;
    availability?: string;
    highlights?: string;
    videos?: string;
    tags?: string;
    map_lat?: number;
    map_lng?: number;
    map_embed_url?: string;
}

interface VideoRow { title: string; youtube_id: string }

const CATEGORIES = ['Luxury', 'Family', 'Honeymoon', 'By Air', 'Trekking', 'Corporate', 'Group', 'Customized', 'Adventure', 'Religious'];

const jsonToLines = (s?: string) => { try { const a = JSON.parse(s || '[]'); return Array.isArray(a) ? a.join('\n') : ''; } catch { return ''; } };
const jsonToCsv = (s?: string) => { try { const a = JSON.parse(s || '[]'); return Array.isArray(a) ? a.join(', ') : ''; } catch { return ''; } };

const emptyForm = {
    tour_name: '', destination: '', category: 'Luxury', travel_mode: 'By Road', description: '',
    duration: '', duration_days: '', duration_nights: '', price_per_person: '', max_seats: '', available_seats: '',
    departure_city: '', rating: '4.7', is_featured: false, urgency_badge: '', group_size: '',
    accommodation_summary: '', meals_summary: '', inclusions: '', exclusions: '', cover_image: '',
    status: 'active', sort_order: '0', meta_title: '', meta_description: '', meta_keywords: '',
    itinerary_code: '', transport_label: '', availability: '', highlights: '', tags: '',
    map_lat: '', map_lng: '', map_embed_url: '',
};

export default function ToursPage() {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({ ...emptyForm });
    const [tiers, setTiers] = useState<Tier[]>([]);
    const [itinerary, setItinerary] = useState<Day[]>([]);
    const [videos, setVideos] = useState<VideoRow[]>([]);

    useEffect(() => { fetchTours(); }, []);

    const fetchTours = async () => {
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            const response = await fetch(`/api/admin/tours?${params}`);
            if (response.status === 401) { window.location.href = '/admin/login'; return; }
            if (response.ok) setTours(await response.json());
        } catch (error) {
            console.error('Error fetching tours:', error);
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
        const payload: any = {
            ...formData,
            highlights: JSON.stringify(formData.highlights.split('\n').map((s) => s.trim()).filter(Boolean)),
            tags: JSON.stringify(formData.tags.split(',').map((s) => s.trim()).filter(Boolean)),
            videos: JSON.stringify(videos.filter((v) => v.youtube_id).map((v) => ({ title: v.title, youtube_id: v.youtube_id }))),
            pricing_tiers: JSON.stringify(
                tiers.filter((t) => t.name).map((t) => ({ name: t.name, blurb: t.blurb, price: parseFloat(t.price) || 0, is_popular: t.is_popular }))
            ),
            itinerary_json: JSON.stringify(
                itinerary.filter((d) => d.title || d.description).map((d, i) => ({ day_no: i + 1, title: d.title, description: d.description }))
            ),
        };
        try {
            const url = isEditing && selectedTour ? `/api/admin/tours?id=${selectedTour.id}` : '/api/admin/tours';
            const res = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.ok) {
                alert(`Tour ${isEditing ? 'updated' : 'created'} successfully`);
                setShowModal(false);
                resetForm();
                fetchTours();
            } else {
                alert(data.error || 'Failed to save tour');
            }
        } catch (error) {
            console.error('Error saving tour:', error);
            alert('Failed to save tour');
        }
    };

    const handleEdit = (tour: Tour) => {
        setSelectedTour(tour);
        setIsEditing(true);
        setFormData({
            tour_name: tour.tour_name, destination: tour.destination, category: tour.category,
            travel_mode: tour.travel_mode || 'By Road', description: tour.description || '',
            duration: tour.duration, duration_days: tour.duration_days?.toString() || '',
            duration_nights: tour.duration_nights?.toString() || '', price_per_person: tour.price_per_person?.toString() || '',
            max_seats: tour.max_seats?.toString() || '', available_seats: tour.available_seats?.toString() || '',
            departure_city: tour.departure_city, rating: tour.rating?.toString() || '4.7',
            is_featured: !!tour.is_featured, urgency_badge: tour.urgency_badge || '', group_size: tour.group_size || '',
            accommodation_summary: tour.accommodation_summary || '', meals_summary: tour.meals_summary || '',
            inclusions: tour.inclusions || '', exclusions: tour.exclusions || '', cover_image: tour.cover_image || '',
            status: tour.status, sort_order: tour.sort_order?.toString() || '0',
            meta_title: tour.meta_title || '', meta_description: tour.meta_description || '', meta_keywords: tour.meta_keywords || '',
            itinerary_code: tour.itinerary_code || '', transport_label: tour.transport_label || '', availability: tour.availability || '',
            highlights: jsonToLines(tour.highlights), tags: jsonToCsv(tour.tags),
            map_lat: tour.map_lat?.toString() || '', map_lng: tour.map_lng?.toString() || '', map_embed_url: tour.map_embed_url || '',
        });
        try {
            const parsedTiers = tour.pricing_tiers ? JSON.parse(tour.pricing_tiers) : [];
            setTiers(Array.isArray(parsedTiers) ? parsedTiers.map((t: any) => ({ name: t.name || '', blurb: t.blurb || '', price: String(t.price ?? ''), is_popular: !!t.is_popular })) : []);
        } catch { setTiers([]); }
        try {
            const parsedDays = tour.itinerary_json ? JSON.parse(tour.itinerary_json) : [];
            setItinerary(Array.isArray(parsedDays) ? parsedDays.map((d: any) => ({ title: d.title || '', description: d.description || (Array.isArray(d.activities) ? d.activities.join('\n') : '') })) : []);
        } catch { setItinerary([]); }
        try {
            const parsedVideos = tour.videos ? JSON.parse(tour.videos) : [];
            setVideos(Array.isArray(parsedVideos) ? parsedVideos.map((v: any) => ({ title: v.title || '', youtube_id: v.youtube_id || '' })) : []);
        } catch { setVideos([]); }
        setShowModal(true);
    };

    const resetForm = () => {
        setFormData({ ...emptyForm });
        setTiers([]);
        setItinerary([]);
        setVideos([]);
        setSelectedTour(null);
        setIsEditing(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this tour?')) return;
        try {
            const response = await fetch(`/api/admin/tours?id=${id}`, { method: 'DELETE' });
            if (response.ok) setTours(tours.filter(t => t.id !== id));
        } catch (error) {
            console.error('Error deleting tour:', error);
        }
    };

    const formatCurrency = (amount: number) => `PKR ${(Number(amount) || 0).toLocaleString()}`;
    const getStatusColor = (status: string) => ({
        active: 'bg-green-500/20 text-green-400', inactive: 'bg-gray-500/20 text-gray-400', coming_soon: 'bg-yellow-500/20 text-yellow-400',
    }[status] || 'bg-gray-500/20 text-gray-400');

    const filtered = tours.filter((t) => t.tour_name.toLowerCase().includes(search.toLowerCase()) || t.destination.toLowerCase().includes(search.toLowerCase()));

    // Tier + itinerary row helpers
    const addTier = () => setTiers([...tiers, { name: '', blurb: '', price: '', is_popular: false }]);
    const updateTier = (i: number, field: keyof Tier, val: any) => setTiers(tiers.map((t, idx) => idx === i ? { ...t, [field]: val } : t));
    const removeTier = (i: number) => setTiers(tiers.filter((_, idx) => idx !== i));
    const addDay = () => setItinerary([...itinerary, { title: '', description: '' }]);
    const updateDay = (i: number, field: keyof Day, val: string) => setItinerary(itinerary.map((d, idx) => idx === i ? { ...d, [field]: val } : d));
    const removeDay = (i: number) => setItinerary(itinerary.filter((_, idx) => idx !== i));
    const addVideo = () => setVideos([...videos, { title: '', youtube_id: '' }]);
    const updateVideo = (i: number, field: keyof VideoRow, val: string) => setVideos(videos.map((v, idx) => idx === i ? { ...v, [field]: val } : v));
    const removeVideo = (i: number) => setVideos(videos.filter((_, idx) => idx !== i));

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
            </div>
        );
    }

    const inputCls = 'w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500';
    const labelCls = 'block text-sm font-medium text-gray-300 mb-2';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tour Packages</h1>
                    <p className="text-gray-400 mt-1">{tours.length} total tours</p>
                </div>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add New Tour
                </button>
            </div>

            {/* Filters */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input type="text" placeholder="Search by name or destination..." value={search} onChange={(e) => setSearch(e.target.value)} className={`${inputCls} pl-10`} />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputCls}>
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="coming_soon">Coming Soon</option>
                    </select>
                    <button onClick={fetchTours} className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2">
                        <Filter className="w-4 h-4" /> Apply Filters
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((tour) => (
                    <div key={tour.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-green-500/50 transition-all">
                        <div className="h-44 bg-gradient-to-br from-sky-600 to-blue-700 flex items-center justify-center overflow-hidden relative">
                            {tour.cover_image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={tour.cover_image} alt={tour.tour_name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-white/70 text-sm">No image</span>
                            )}
                            {tour.is_featured && <span className="absolute top-2 right-2 bg-sky-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"><Star className="w-3 h-3" />Featured</span>}
                        </div>
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{tour.tour_name}</h3>
                                    <p className="text-gray-400 text-sm">{tour.destination} · {tour.category}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(tour.status)}`}>{tour.status}</span>
                            </div>
                            <p className="text-xs text-gray-300 my-2 flex items-center gap-2">
                                {(tour.travel_mode || '').toLowerCase().includes('air') ? <Plane className="w-3.5 h-3.5" /> : <Bus className="w-3.5 h-3.5" />}
                                {tour.travel_mode || 'By Road'} · {tour.duration}
                            </p>
                            {tour.urgency_badge && <p className="text-amber-400 text-xs mb-2">🔥 {tour.urgency_badge}</p>}
                            <div className="border-t border-slate-700 pt-3 flex items-center justify-between">
                                <p className="text-xl font-bold text-green-400">{formatCurrency(tour.price_per_person)}<span className="text-xs text-gray-400 font-normal">/person</span></p>
                                <div className="flex gap-2">
                                    <a href={`/tours/${tour.slug}`} target="_blank" rel="noopener noreferrer" className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-xs">View</a>
                                    <a href={`/admin/tours/${tour.id}/packages`} title="Package options" className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg"><Package className="w-4 h-4" /></a>
                                    <button onClick={() => handleEdit(tour)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(tour.id)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400">No tours found. Click "Add New Tour" to create one.</div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => { setShowModal(false); resetForm(); }}>
                    <div className="bg-slate-800 rounded-xl max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-white">{isEditing ? 'Edit Tour' : 'Add New Tour'}</h2>
                                <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basics */}
                                <div>
                                    <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wide mb-3">Basics</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className={labelCls}>Tour Name *</label>
                                            <input value={formData.tour_name} onChange={(e) => setFormData({ ...formData, tour_name: e.target.value })} required className={inputCls} placeholder="e.g., Skardu Luxury Escape" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Destination *</label>
                                            <input value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} required className={inputCls} placeholder="e.g., Skardu" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Category *</label>
                                            <input list="tour-categories" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required className={inputCls} />
                                            <datalist id="tour-categories">{CATEGORIES.map((c) => <option key={c} value={c} />)}</datalist>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Travel Mode</label>
                                            <select value={formData.travel_mode} onChange={(e) => setFormData({ ...formData, travel_mode: e.target.value })} className={inputCls}>
                                                <option value="By Road">By Road</option>
                                                <option value="By Air">By Air</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Duration (label) *</label>
                                            <input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required className={inputCls} placeholder="e.g., 5 Days / 4 Nights" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className={labelCls}>Days</label>
                                                <input type="number" min="1" value={formData.duration_days} onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })} className={inputCls} />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Nights</label>
                                                <input type="number" min="0" value={formData.duration_nights} onChange={(e) => setFormData({ ...formData, duration_nights: e.target.value })} className={inputCls} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Starting Price (PKR) *</label>
                                            <input type="number" min="0" value={formData.price_per_person} onChange={(e) => setFormData({ ...formData, price_per_person: e.target.value })} required className={inputCls} placeholder="e.g., 65000" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Departure City *</label>
                                            <input value={formData.departure_city} onChange={(e) => setFormData({ ...formData, departure_city: e.target.value })} required className={inputCls} placeholder="e.g., Islamabad" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Max Seats *</label>
                                            <input type="number" min="1" value={formData.max_seats} onChange={(e) => setFormData({ ...formData, max_seats: e.target.value })} required className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Available Seats</label>
                                            <input type="number" value={formData.available_seats} onChange={(e) => setFormData({ ...formData, available_seats: e.target.value })} className={inputCls} placeholder="defaults to max" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Rating</label>
                                            <input type="number" step="0.1" min="0" max="5" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Group Size</label>
                                            <input value={formData.group_size} onChange={(e) => setFormData({ ...formData, group_size: e.target.value })} className={inputCls} placeholder="e.g., 2–14 travellers" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Status</label>
                                            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={inputCls}>
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="coming_soon">Coming Soon</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-6 md:col-span-2">
                                            <label className="flex items-center gap-2 text-gray-300">
                                                <input type="checkbox" checked={formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })} className="w-4 h-4 accent-green-500" />
                                                Featured (shows on home)
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <label className="text-sm text-gray-300">Sort order</label>
                                                <input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })} className="w-20 bg-slate-700 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500" />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={labelCls}>Urgency badge (optional)</label>
                                            <input value={formData.urgency_badge} onChange={(e) => setFormData({ ...formData, urgency_badge: e.target.value })} className={inputCls} placeholder="e.g., Only 3 slots left this month" />
                                        </div>
                                    </div>
                                </div>

                                {/* Overview & summaries */}
                                <div>
                                    <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wide mb-3">Overview &amp; summaries</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className={labelCls}>Trip Overview</label>
                                            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Accommodation summary</label>
                                            <input value={formData.accommodation_summary} onChange={(e) => setFormData({ ...formData, accommodation_summary: e.target.value })} className={inputCls} placeholder="e.g., 3★–5★ hotels (by tier)" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Meals summary</label>
                                            <input value={formData.meals_summary} onChange={(e) => setFormData({ ...formData, meals_summary: e.target.value })} className={inputCls} placeholder="e.g., Daily breakfast" />
                                        </div>
                                    </div>
                                </div>

                                {/* Details & media */}
                                <div>
                                    <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wide mb-3">Details &amp; media</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className={labelCls}>Itinerary code</label>
                                            <input value={formData.itinerary_code} onChange={(e) => setFormData({ ...formData, itinerary_code: e.target.value })} className={inputCls} placeholder="AT 185" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Transport label</label>
                                            <input value={formData.transport_label} onChange={(e) => setFormData({ ...formData, transport_label: e.target.value })} className={inputCls} placeholder="Land Travel" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Availability</label>
                                            <input value={formData.availability} onChange={(e) => setFormData({ ...formData, availability: e.target.value })} className={inputCls} placeholder="Available in Stock" />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className={labelCls}>Tags (comma-separated)</label>
                                            <input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} className={inputCls} placeholder="Cultural, Family, Honeymoon, Road Trips" />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className={labelCls}>Highlights (one per line)</label>
                                            <textarea rows={3} value={formData.highlights} onChange={(e) => setFormData({ ...formData, highlights: e.target.value })} className={inputCls} placeholder={'Attabad Lake boating\nKhunjerab Pass'} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Map latitude</label>
                                            <input value={formData.map_lat} onChange={(e) => setFormData({ ...formData, map_lat: e.target.value })} className={inputCls} placeholder="35.32" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Map longitude</label>
                                            <input value={formData.map_lng} onChange={(e) => setFormData({ ...formData, map_lng: e.target.value })} className={inputCls} placeholder="75.55" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Map embed URL</label>
                                            <input value={formData.map_embed_url} onChange={(e) => setFormData({ ...formData, map_embed_url: e.target.value })} className={inputCls} placeholder="https://www.google.com/maps?q=Skardu&output=embed" />
                                        </div>
                                    </div>
                                    {/* Videos repeater */}
                                    <div className="mt-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-sm font-medium text-gray-300 flex items-center gap-1"><Youtube className="w-4 h-4 text-red-400" /> YouTube videos</label>
                                            <button type="button" onClick={addVideo} className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add video</button>
                                        </div>
                                        <div className="space-y-2">
                                            {videos.map((v, i) => (
                                                <div key={i} className="grid grid-cols-12 gap-2 items-center bg-slate-700/40 rounded-lg p-2">
                                                    <input value={v.title} onChange={(e) => updateVideo(i, 'title', e.target.value)} className={`${inputCls} col-span-6`} placeholder="Video title" />
                                                    <input value={v.youtube_id} onChange={(e) => updateVideo(i, 'youtube_id', e.target.value)} className={`${inputCls} col-span-5`} placeholder="YouTube ID (e.g. dQw4w9WgXcQ)" />
                                                    <button type="button" onClick={() => removeVideo(i)} className="col-span-1 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4 mx-auto" /></button>
                                                </div>
                                            ))}
                                            {videos.length === 0 && <p className="text-gray-500 text-sm">No videos added.</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Itinerary builder */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wide">Day-by-day itinerary</h3>
                                        <button type="button" onClick={addDay} className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add day</button>
                                    </div>
                                    <div className="space-y-2">
                                        {itinerary.map((d, i) => (
                                            <div key={i} className="flex gap-2 items-start bg-slate-700/40 rounded-lg p-2">
                                                <span className="mt-2 text-gray-500 flex items-center gap-1 text-xs w-12 shrink-0"><GripVertical className="w-3.5 h-3.5" />D{i + 1}</span>
                                                <div className="flex-1 space-y-2">
                                                    <input value={d.title} onChange={(e) => updateDay(i, 'title', e.target.value)} className={inputCls} placeholder="Day title (e.g., Islamabad to Skardu)" />
                                                    <textarea rows={2} value={d.description} onChange={(e) => updateDay(i, 'description', e.target.value)} className={inputCls} placeholder="What happens this day" />
                                                </div>
                                                <button type="button" onClick={() => removeDay(i)} className="mt-1 text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                        {itinerary.length === 0 && <p className="text-gray-500 text-sm">No days yet. Click "Add day".</p>}
                                    </div>
                                </div>

                                {/* Pricing tiers builder */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wide">Hotel tiers &amp; pricing</h3>
                                        <button type="button" onClick={addTier} className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add tier</button>
                                    </div>
                                    <div className="space-y-2">
                                        {tiers.map((t, i) => (
                                            <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-start bg-slate-700/40 rounded-lg p-2">
                                                <input value={t.name} onChange={(e) => updateTier(i, 'name', e.target.value)} className={`${inputCls} sm:col-span-3`} placeholder="Standard (3★)" />
                                                <input value={t.blurb} onChange={(e) => updateTier(i, 'blurb', e.target.value)} className={`${inputCls} sm:col-span-5`} placeholder="Short blurb" />
                                                <input type="number" value={t.price} onChange={(e) => updateTier(i, 'price', e.target.value)} className={`${inputCls} sm:col-span-2`} placeholder="Price" />
                                                <label className="sm:col-span-1 flex items-center gap-1 text-xs text-gray-300 mt-2 justify-center" title="Most popular">
                                                    <input type="checkbox" checked={t.is_popular} onChange={(e) => updateTier(i, 'is_popular', e.target.checked)} className="w-4 h-4 accent-green-500" />★
                                                </label>
                                                <button type="button" onClick={() => removeTier(i)} className="sm:col-span-1 text-red-400 hover:text-red-300 p-1 mt-1 justify-self-center"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                        {tiers.length === 0 && <p className="text-gray-500 text-sm">No tiers yet. Add Standard / Executive / Luxury.</p>}
                                    </div>
                                </div>

                                {/* Inclusions */}
                                <div>
                                    <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wide mb-3">Inclusions</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelCls}>Included (one per line)</label>
                                            <textarea rows={4} value={formData.inclusions} onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })} className={inputCls} placeholder={'Private vehicle with driver\nHotel accommodation\nDaily breakfast'} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Not included (one per line)</label>
                                            <textarea rows={4} value={formData.exclusions} onChange={(e) => setFormData({ ...formData, exclusions: e.target.value })} className={inputCls} placeholder={'Airfare\nLunch & dinner\nTips'} />
                                        </div>
                                    </div>
                                </div>

                                {/* Media */}
                                <div>
                                    <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wide mb-3">Media</h3>
                                    <label className={labelCls}>Cover image</label>
                                    <div className="flex items-center gap-4">
                                        {formData.cover_image && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={formData.cover_image} alt="cover" className="w-24 h-16 object-cover rounded-lg" />
                                        )}
                                        <label className="cursor-pointer bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                                            <Upload className="w-4 h-4" /> {uploading ? 'Uploading…' : 'Upload'}
                                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                        </label>
                                        <input value={formData.cover_image} onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })} className={`${inputCls} flex-1 text-sm`} placeholder="or paste image URL" />
                                    </div>
                                </div>

                                {/* SEO */}
                                <div>
                                    <h3 className="text-sm font-semibold text-sky-400 uppercase tracking-wide mb-3">SEO</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className={labelCls}>Meta title</label>
                                            <input value={formData.meta_title} onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Meta description</label>
                                            <textarea rows={2} value={formData.meta_description} onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })} className={inputCls} />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Meta keywords (comma-separated)</label>
                                            <input value={formData.meta_keywords} onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })} className={inputCls} />
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t border-slate-700">
                                    <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg">Cancel</button>
                                    <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                                        <Plus className="w-4 h-4" /> {isEditing ? 'Update Tour' : 'Create Tour'}
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
