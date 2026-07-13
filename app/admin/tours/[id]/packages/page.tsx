'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, X, Hotel, Users } from 'lucide-react';

interface HotelRow { area: string; nights: string; hotel: string; room_type: string }
interface Option {
    id: number;
    code?: string;
    tier?: string;
    transport_mode?: string;
    price_unit?: string;
    min_persons?: number | null;
    max_persons?: number | null;
    rooms?: number | null;
    price: number;
    vehicle_text?: string;
    hotels?: string;
    included?: string;
    not_included?: string;
    extras?: string;
    sort_order?: number;
    is_active?: boolean;
}

const emptyForm = {
    code: '', tier: 'Standard', transport_mode: 'By road', price_unit: 'per_person',
    min_persons: '', max_persons: '', rooms: '', price: '', vehicle_text: '',
    included: '', not_included: '', extras: '', sort_order: '0', is_active: true,
};

const linesToJson = (s: string) => JSON.stringify(s.split('\n').map((x) => x.trim()).filter(Boolean));
const jsonToLines = (s?: string) => { try { const a = JSON.parse(s || '[]'); return Array.isArray(a) ? a.join('\n') : ''; } catch { return ''; } };

export default function PackageOptionsPage() {
    const params = useParams();
    const tourId = params.id as string;

    const [tourName, setTourName] = useState('');
    const [options, setOptions] = useState<Option[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({ ...emptyForm });
    const [hotels, setHotels] = useState<HotelRow[]>([]);

    const fetchOptions = useCallback(async () => {
        try {
            const res = await fetch(`/api/admin/package-options?tourId=${tourId}`);
            if (res.status === 401) { window.location.href = '/admin/login'; return; }
            if (res.ok) setOptions(await res.json());
        } catch (e) {
            console.error('Error fetching options:', e);
        } finally {
            setLoading(false);
        }
    }, [tourId]);

    useEffect(() => {
        fetchOptions();
        // Look up the tour name for the header
        fetch('/api/admin/tours').then((r) => r.ok ? r.json() : []).then((tours) => {
            const t = Array.isArray(tours) ? tours.find((x: any) => String(x.id) === String(tourId)) : null;
            if (t) setTourName(t.tour_name);
        }).catch(() => {});
    }, [fetchOptions, tourId]);

    const resetForm = () => { setFormData({ ...emptyForm }); setHotels([]); setEditingId(null); };

    const handleEdit = (o: Option) => {
        setEditingId(o.id);
        setFormData({
            code: o.code || '', tier: o.tier || 'Standard', transport_mode: o.transport_mode || 'By road',
            price_unit: o.price_unit || 'per_person', min_persons: o.min_persons?.toString() || '',
            max_persons: o.max_persons?.toString() || '', rooms: o.rooms?.toString() || '', price: o.price?.toString() || '',
            vehicle_text: o.vehicle_text || '', included: jsonToLines(o.included), not_included: jsonToLines(o.not_included),
            extras: jsonToLines(o.extras), sort_order: o.sort_order?.toString() || '0', is_active: o.is_active !== false,
        });
        try {
            const h = JSON.parse(o.hotels || '[]');
            setHotels(Array.isArray(h) ? h.map((x: any) => ({ area: x.area || '', nights: String(x.nights ?? ''), hotel: x.hotel || '', room_type: x.room_type || '' })) : []);
        } catch { setHotels([]); }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload: any = {
            tour_id: parseInt(tourId),
            code: formData.code || null,
            tier: formData.tier || null,
            transport_mode: formData.transport_mode || null,
            price_unit: formData.price_unit,
            min_persons: formData.min_persons || null,
            max_persons: formData.max_persons || null,
            rooms: formData.rooms || null,
            price: formData.price || 0,
            vehicle_text: formData.vehicle_text || null,
            hotels: JSON.stringify(hotels.filter((h) => h.area || h.hotel).map((h) => ({ area: h.area, nights: parseInt(h.nights) || undefined, hotel: h.hotel, room_type: h.room_type || undefined }))),
            included: linesToJson(formData.included),
            not_included: linesToJson(formData.not_included),
            extras: linesToJson(formData.extras),
            sort_order: formData.sort_order || 0,
            is_active: formData.is_active,
        };
        try {
            const url = editingId ? `/api/admin/package-options?id=${editingId}` : '/api/admin/package-options';
            const res = await fetch(url, { method: editingId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            const data = await res.json();
            if (res.ok) { setShowModal(false); resetForm(); fetchOptions(); }
            else alert(data.error || 'Failed to save option');
        } catch (e) {
            console.error(e); alert('Failed to save option');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this package option?')) return;
        const res = await fetch(`/api/admin/package-options?id=${id}`, { method: 'DELETE' });
        if (res.ok) setOptions(options.filter((o) => o.id !== id));
    };

    const fmt = (n: number) => `PKR ${(Number(n) || 0).toLocaleString()}`;
    const bandLabel = (o: Option) => (o.min_persons || o.max_persons) ? `${o.min_persons ?? '?'}–${o.max_persons ?? '?'} pax` : 'Per person (tier)';

    const inputCls = 'w-full bg-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500';
    const labelCls = 'block text-sm font-medium text-gray-300 mb-2';

    const addHotel = () => setHotels([...hotels, { area: '', nights: '', hotel: '', room_type: '' }]);
    const updateHotel = (i: number, f: keyof HotelRow, v: string) => setHotels(hotels.map((h, idx) => idx === i ? { ...h, [f]: v } : h));
    const removeHotel = (i: number) => setHotels(hotels.filter((_, idx) => idx !== i));

    if (loading) {
        return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/admin/tours" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-2"><ArrowLeft className="w-4 h-4" /> Back to tours</Link>
                    <h1 className="text-2xl font-bold text-white">Package Options</h1>
                    <p className="text-gray-400 mt-1">{tourName || `Tour #${tourId}`} · {options.length} option{options.length === 1 ? '' : 's'}</p>
                </div>
                <button onClick={() => { resetForm(); setShowModal(true); }} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Option
                </button>
            </div>

            <p className="text-sm text-gray-400 bg-slate-800 border border-slate-700 rounded-lg p-3">
                Leave <span className="text-white">persons empty</span> for a <span className="text-white">tier</span> (Budget/Standard/Luxury per person). Fill persons for a <span className="text-white">price-grid row</span> (e.g. TRAVEL-157 · 4–6 pax · group price).
            </p>

            {/* Options table */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px]">
                        <thead className="bg-slate-700/50 text-gray-400 text-xs uppercase">
                            <tr>
                                <th className="text-left py-3 px-4">Code</th>
                                <th className="text-left py-3 px-4">Tier</th>
                                <th className="text-left py-3 px-4">Party</th>
                                <th className="text-left py-3 px-4">Rooms</th>
                                <th className="text-left py-3 px-4">Price</th>
                                <th className="text-left py-3 px-4">Unit</th>
                                <th className="text-left py-3 px-4">Active</th>
                                <th className="text-left py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {options.map((o) => (
                                <tr key={o.id} className="border-t border-slate-700/50 hover:bg-slate-700/30 text-sm">
                                    <td className="py-3 px-4 text-white font-medium">{o.code || '—'}</td>
                                    <td className="py-3 px-4 text-gray-300">{o.tier || '—'}</td>
                                    <td className="py-3 px-4 text-gray-300">{bandLabel(o)}</td>
                                    <td className="py-3 px-4 text-gray-300">{o.rooms ?? '—'}</td>
                                    <td className="py-3 px-4 text-green-400 font-semibold">{fmt(o.price)}</td>
                                    <td className="py-3 px-4 text-gray-400 text-xs">{o.price_unit === 'per_group' ? 'group' : 'person'}</td>
                                    <td className="py-3 px-4">{o.is_active !== false ? <span className="text-green-400">●</span> : <span className="text-gray-500">○</span>}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex gap-2">
                                            <button onClick={() => handleEdit(o)} className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(o.id)} className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {options.length === 0 && <tr><td colSpan={8} className="py-12 text-center text-gray-400">No options yet. Click "Add Option".</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => { setShowModal(false); resetForm(); }}>
                    <div className="bg-slate-800 rounded-xl max-w-3xl w-full my-8" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-6">
                                <h2 className="text-2xl font-bold text-white">{editingId ? 'Edit Option' : 'Add Package Option'}</h2>
                                <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelCls}>Code</label>
                                        <input value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className={inputCls} placeholder="TRAVEL-157 (blank = tier)" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Tier</label>
                                        <input list="tier-list" value={formData.tier} onChange={(e) => setFormData({ ...formData, tier: e.target.value })} className={inputCls} />
                                        <datalist id="tier-list"><option value="Budget" /><option value="Standard" /><option value="Luxury" /></datalist>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Transport mode</label>
                                        <input value={formData.transport_mode} onChange={(e) => setFormData({ ...formData, transport_mode: e.target.value })} className={inputCls} placeholder="By road" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Price *</label>
                                        <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className={inputCls} placeholder="389500" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Price unit</label>
                                        <select value={formData.price_unit} onChange={(e) => setFormData({ ...formData, price_unit: e.target.value })} className={inputCls}>
                                            <option value="per_person">Per person</option>
                                            <option value="per_group">Per group (fixed)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Rooms</label>
                                        <input type="number" value={formData.rooms} onChange={(e) => setFormData({ ...formData, rooms: e.target.value })} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Min persons</label>
                                        <input type="number" value={formData.min_persons} onChange={(e) => setFormData({ ...formData, min_persons: e.target.value })} className={inputCls} placeholder="blank = tier" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Max persons</label>
                                        <input type="number" value={formData.max_persons} onChange={(e) => setFormData({ ...formData, max_persons: e.target.value })} className={inputCls} placeholder="blank = tier" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Sort order</label>
                                        <input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: e.target.value })} className={inputCls} />
                                    </div>
                                    <div className="md:col-span-3">
                                        <label className={labelCls}>Vehicle</label>
                                        <input value={formData.vehicle_text} onChange={(e) => setFormData({ ...formData, vehicle_text: e.target.value })} className={inputCls} placeholder="Toyota Prado with fuel & local driver" />
                                    </div>
                                </div>

                                {/* Hotels repeater */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-semibold text-sky-400 uppercase tracking-wide flex items-center gap-1"><Hotel className="w-4 h-4" /> Per-night hotels</label>
                                        <button type="button" onClick={addHotel} className="text-sm bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"><Plus className="w-3.5 h-3.5" /> Add hotel</button>
                                    </div>
                                    <div className="space-y-2">
                                        {hotels.map((h, i) => (
                                            <div key={i} className="grid grid-cols-12 gap-2 items-center bg-slate-700/40 rounded-lg p-2">
                                                <input value={h.area} onChange={(e) => updateHotel(i, 'area', e.target.value)} className={`${inputCls} col-span-3`} placeholder="Area" />
                                                <input type="number" value={h.nights} onChange={(e) => updateHotel(i, 'nights', e.target.value)} className={`${inputCls} col-span-2`} placeholder="Nights" />
                                                <input value={h.hotel} onChange={(e) => updateHotel(i, 'hotel', e.target.value)} className={`${inputCls} col-span-4`} placeholder="Hotel" />
                                                <input value={h.room_type} onChange={(e) => updateHotel(i, 'room_type', e.target.value)} className={`${inputCls} col-span-2`} placeholder="Room" />
                                                <button type="button" onClick={() => removeHotel(i)} className="col-span-1 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4 mx-auto" /></button>
                                            </div>
                                        ))}
                                        {hotels.length === 0 && <p className="text-gray-500 text-sm">No hotels added.</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelCls}>Included (per line)</label>
                                        <textarea rows={3} value={formData.included} onChange={(e) => setFormData({ ...formData, included: e.target.value })} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Not included (per line)</label>
                                        <textarea rows={3} value={formData.not_included} onChange={(e) => setFormData({ ...formData, not_included: e.target.value })} className={inputCls} />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Extras (per line)</label>
                                        <textarea rows={3} value={formData.extras} onChange={(e) => setFormData({ ...formData, extras: e.target.value })} className={inputCls} placeholder="Local music program" />
                                    </div>
                                </div>

                                <label className="flex items-center gap-2 text-gray-300">
                                    <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="w-4 h-4 accent-green-500" />
                                    Active (shown on the site)
                                </label>

                                <div className="flex gap-2 pt-4 border-t border-slate-700">
                                    <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg">Cancel</button>
                                    <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                                        <Plus className="w-4 h-4" /> {editingId ? 'Update Option' : 'Create Option'}
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
