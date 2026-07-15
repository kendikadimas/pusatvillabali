import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import type { Destination } from '@/types';

interface Props {
    destinations: (Destination & { villas_count?: number })[];
}

export default function AdminDestinationsPage({ destinations }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Destination | null>(null);
    const [form, setForm] = useState({ name: '', city: '', query: '', image: '', count_fallback: '' });
    const [saving, setSaving] = useState(false);

    const openNew = () => {
 setEditing(null); setForm({ name: '', city: '', query: '', image: '', count_fallback: '' }); setShowForm(true); 
};
    const openEdit = (d: Destination) => {
 setEditing(d); setForm({ name: d.name, city: d.city, query: d.query, image: d.image, count_fallback: d.count_fallback ?? '' }); setShowForm(true); 
};

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (editing) {
                await axios.put(`/api/v1/admin/destinations/${editing.id}`, form);
                toast.success('Destinasi diperbarui');
            } else {
                await axios.post('/api/v1/admin/destinations', form);
                toast.success('Destinasi ditambahkan');
            }

            setShowForm(false);
            router.reload();
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Gagal menyimpan');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Hapus destinasi "${name}"?`)) {
return;
}

        try {
            await axios.delete(`/api/v1/admin/destinations/${id}`);
            toast.success('Destinasi dihapus');
            router.reload();
        } catch {
 toast.error('Gagal menghapus'); 
}
    };

    return (
        <>
            <Head title="Kelola Destinasi" />
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Destinasi</h1>
                        <p className="text-sm text-slate-500">{destinations.length} destinasi</p>
                    </div>
                    <button onClick={openNew} className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4" /> Tambah Destinasi
                    </button>
                </div>

                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                            <h2 className="font-bold text-slate-800 mb-5">{editing ? 'Edit Destinasi' : 'Tambah Destinasi'}</h2>
                            <form onSubmit={handleSave} className="space-y-4">
                                {[
                                    { key: 'name', label: 'Nama', placeholder: 'Ubud, Gianyar' },
                                    { key: 'city', label: 'Kota', placeholder: 'Ubud, Gianyar' },
                                    { key: 'query', label: 'Query Pencarian', placeholder: 'Ubud' },
                                    { key: 'image', label: 'URL Foto', placeholder: 'https://...' },
                                    { key: 'count_fallback', label: 'Label Villa', placeholder: '8+ Villa' },
                                ].map(({ key, label, placeholder }) => (
                                    <div key={key}>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
                                        <input
                                            type="text"
                                            value={(form as any)[key]}
                                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                            placeholder={placeholder}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                ))}
                                <div className="flex gap-3 pt-2">
                                    <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60">
                                        {saving ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50">
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {destinations.map((d) => (
                        <div key={d.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                            <div className="h-36 bg-slate-100 overflow-hidden">
                                <img src={d.image} alt={d.name} className="w-full h-full object-cover" onError={(e) => {
 (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80'; 
}} />
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-slate-800">{d.name}</h3>
                                        <p className="text-xs text-slate-500">{d.count_fallback} · Query: {d.query}</p>
                                        {d.villas_count !== undefined && <p className="text-xs text-blue-600 mt-0.5">{d.villas_count} villa</p>}
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => openEdit(d)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(d.id, d.name)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {destinations.length === 0 && (
                        <div className="col-span-full text-center py-12 text-slate-400">Belum ada destinasi</div>
                    )}
                </div>
            </div>
        </>
    );
}
