import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
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
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState<string>('');

    const openNew = () => {
        setEditing(null);
        setForm({ name: '', city: '', query: '', image: '', count_fallback: '' });
        setImagePreview('');
        setShowForm(true);
    };

    const openEdit = (d: Destination) => {
        setEditing(d);
        setForm({ name: d.name, city: d.city, query: d.query, image: d.image, count_fallback: d.count_fallback ?? '' });
        setImagePreview(d.image ?? '');
        setShowForm(true);
    };

    const handleImageUpload = async (file: File) => {
        setUploadingImage(true);

        try {
            const fd = new FormData();
            fd.append('image', file);
            const res = await axios.post('/api/v1/admin/destinations/upload-image', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const url: string = res.data.image_url;
            setForm((f) => ({ ...f, image: url }));
            setImagePreview(url);
            toast.success('Foto berhasil diunggah');
        } catch {
            toast.error('Gagal mengunggah foto');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.image) {
            toast.error('Foto destinasi wajib diunggah.');

            return;
        }

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
                    <button onClick={openNew} className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
                        <Plus className="w-4 h-4" /> Tambah Destinasi
                    </button>
                </div>

                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="font-bold text-slate-800">{editing ? 'Edit Destinasi' : 'Tambah Destinasi'}</h2>
                                <button type="button" onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                                    <X className="w-4 h-4 text-slate-500" />
                                </button>
                            </div>
                            <form onSubmit={handleSave} className="space-y-4">
                                {/* Foto upload */}
                                <div>
                                    <label className="block text-xs font-medium text-slate-600 mb-1">Foto Destinasi *</label>
                                    <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl p-5 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
                                        {imagePreview ? (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-36 object-cover rounded-lg"
                                            />
                                        ) : (
                                            <>
                                                <Upload className="w-6 h-6 text-slate-400" />
                                                <span className="text-xs text-slate-500 text-center">
                                                    {uploadingImage ? 'Mengunggah...' : 'Klik untuk pilih foto (JPG, PNG, WebP)'}
                                                </span>
                                            </>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                            className="hidden"
                                            disabled={uploadingImage}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];

                                                if (file) {
handleImageUpload(file);
}
                                            }}
                                        />
                                    </label>
                                    {imagePreview && (
                                        <button
                                            type="button"
                                            onClick={() => {
 setImagePreview(''); setForm((f) => ({ ...f, image: '' })); 
}}
                                            className="mt-1 text-xs text-red-500 hover:text-red-700 cursor-pointer"
                                        >
                                            Hapus foto
                                        </button>
                                    )}
                                </div>

                                {[
                                    { key: 'name', label: 'Nama *', placeholder: 'Ubud' },
                                    { key: 'city', label: 'Kota', placeholder: 'Ubud, Gianyar' },
                                    { key: 'query', label: 'Query Pencarian', placeholder: 'Ubud (kosongkan = sama dengan nama)' },
                                ].map(({ key, label, placeholder }) => (
                                    <div key={key}>
                                        <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
                                        <input
                                            type="text"
                                            value={(form as any)[key]}
                                            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                            placeholder={placeholder}
                                            required={key === 'name'}
                                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                ))}

                                <div className="flex gap-3 pt-2">
                                    <button type="submit" disabled={saving || uploadingImage} className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-60 text-sm cursor-pointer">
                                        {saving ? 'Menyimpan...' : editing ? 'Simpan' : 'Tambah'}
                                    </button>
                                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50 text-sm cursor-pointer">
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
                            <div className="h-36 bg-slate-100 overflow-hidden relative">
                                <img
                                    src={d.image}
                                    alt={d.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
 (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80'; 
}}
                                />
                            </div>
                            <div className="p-4">
                                <p className="font-bold text-slate-800">{d.name}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{d.city}</p>
                                <div className="flex items-center justify-end gap-1 mt-3">
                                    <button onClick={() => openEdit(d)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(d.id, d.name)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
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
