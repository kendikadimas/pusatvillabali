import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { Star, Check, X, Plus, Pencil, Trash2, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import type { Review, PaginatedData, Villa } from '@/types';

interface Props {
    reviews: PaginatedData<Review>;
    filters: { filter: string };
    villas: Pick<Villa, 'id' | 'name'>[];
}

interface ReviewForm {
    villa_id: number | '';
    guest_name: string;
    guest_subtitle: string;
    guest_avatar: string;
    rating: number;
    comment: string;
    is_approved: boolean;
}

const emptyForm: ReviewForm = {
    villa_id: '',
    guest_name: '',
    guest_subtitle: '',
    guest_avatar: '',
    rating: 5,
    comment: '',
    is_approved: true,
};

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
                <button
                    key={n}
                    type="button"
                    onClick={() => onChange(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    className="p-0.5 cursor-pointer"
                >
                    <Star
                        className={`w-6 h-6 transition-colors ${n <= (hovered || value) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                    />
                </button>
            ))}
        </div>
    );
}

export default function AdminReviewsPage({ reviews, filters, villas }: Props) {
    const filter = filters.filter ?? 'pending';

    const [modalOpen, setModalOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [form, setForm] = useState<ReviewForm>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [uploadingAvatar, setUploadingAvatar] = useState(false);

    const handleAvatarUpload = async (file: File) => {
        setUploadingAvatar(true);
        try {
            const fd = new FormData();
            fd.append('avatar', file);
            const res = await axios.post('/api/v1/admin/reviews/upload-avatar', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setForm((f) => ({ ...f, guest_avatar: res.data.avatar_url }));
            toast.success('Avatar berhasil diunggah');
        } catch {
            toast.error('Gagal mengunggah avatar');
        } finally {
            setUploadingAvatar(false);
        }
    };

    const openCreate = () => {
        setEditingReview(null);
        setForm(emptyForm);
        setErrors({});
        setModalOpen(true);
    };

    const openEdit = (review: Review) => {
        setEditingReview(review);
        setForm({
            villa_id: review.villa_id,
            guest_name: review.guest_name,
            guest_subtitle: review.guest_subtitle ?? '',
            guest_avatar: review.guest_avatar ?? '',
            rating: review.rating,
            comment: review.comment,
            is_approved: review.is_approved,
        });
        setErrors({});
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingReview(null);
        setForm(emptyForm);
        setErrors({});
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            const payload = {
                villa_id: form.villa_id,
                guest_name: form.guest_name,
                guest_subtitle: form.guest_subtitle || null,
                guest_avatar: form.guest_avatar || null,
                rating: form.rating,
                comment: form.comment,
                is_approved: form.is_approved,
            };
            if (editingReview) {
                await axios.put(`/api/v1/admin/reviews/${editingReview.id}`, payload);
                toast.success('Ulasan diperbarui');
            } else {
                await axios.post('/api/v1/admin/reviews', payload);
                toast.success('Ulasan ditambahkan');
            }
            closeModal();
            router.reload();
        } catch (err: any) {
            if (err.response?.data?.errors) {
                const raw = err.response.data.errors as Record<string, string[]>;
                setErrors(Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, v[0]])));
            } else {
                toast.error(err.response?.data?.message ?? 'Terjadi kesalahan.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await axios.patch(`/api/v1/admin/reviews/${id}/approve`);
            toast.success('Ulasan disetujui');
            router.reload();
        } catch {
            toast.error('Gagal menyetujui ulasan');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Hapus ulasan ini?')) return;
        try {
            await axios.delete(`/api/v1/admin/reviews/${id}`);
            toast.success('Ulasan dihapus');
            router.reload();
        } catch {
            toast.error('Gagal menghapus ulasan');
        }
    };

    return (
        <>
            <Head title="Kelola Ulasan" />

            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Ulasan</h1>
                        <p className="text-sm text-slate-500">{reviews.total} ulasan</p>
                    </div>
                    <button
                        type="button"
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Ulasan
                    </button>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2">
                    {['all', 'pending', 'approved'].map((f) => (
                        <button
                            key={f}
                            onClick={() => router.get('/admin/reviews', { filter: f }, { preserveScroll: true })}
                            className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                        >
                            {f === 'all' ? 'Semua' : f === 'pending' ? 'Menunggu' : 'Disetujui'}
                        </button>
                    ))}
                </div>

                {/* Review list */}
                <div className="space-y-3">
                    {reviews.data.length === 0 && (
                        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
                            Tidak ada ulasan.
                        </div>
                    )}
                    {reviews.data.map((review) => (
                        <div key={review.id} className="bg-white border border-slate-200 rounded-xl p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span className="font-semibold text-slate-800 text-sm">{review.guest_name}</span>
                                        {review.guest_subtitle && (
                                            <span className="text-xs text-slate-400">{review.guest_subtitle}</span>
                                        )}
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${review.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {review.is_approved ? 'Disetujui' : 'Menunggu'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`} />
                                        ))}
                                        <span className="text-xs text-slate-400 ml-1">{review.rating}/5</span>
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-2">{review.comment}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                                        {review.villa && <span>{review.villa.name}</span>}
                                        <span>{format(parseISO(review.created_at), 'd MMM yyyy', { locale: localeID })}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    {!review.is_approved && (
                                        <button
                                            type="button"
                                            onClick={() => handleApprove(review.id)}
                                            title="Setujui"
                                            className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors cursor-pointer"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => openEdit(review)}
                                        title="Edit"
                                        className="p-1.5 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(review.id)}
                                        title="Hapus"
                                        className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {reviews.last_page > 1 && (
                    <div className="flex justify-center">
                        <div className="flex gap-1">
                            {Array.from({ length: reviews.last_page }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => router.get('/admin/reviews', { page: String(page), filter }, { preserveScroll: true })}
                                    className={`w-7 h-7 rounded text-xs font-medium ${page === reviews.current_page ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'}`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Create / Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <h2 className="font-bold text-slate-800">
                                {editingReview ? 'Edit Ulasan' : 'Tambah Ulasan Manual'}
                            </h2>
                            <button type="button" onClick={closeModal} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                                <X className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-5 space-y-4">
                            {/* Avatar upload */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Avatar Tamu</label>
                                <div className="flex items-center gap-3">
                                    {form.guest_avatar ? (
                                        <img src={form.guest_avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Upload className="w-5 h-5 text-slate-400" />
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-1">
                                        <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700">
                                            {uploadingAvatar ? 'Mengunggah...' : form.guest_avatar ? 'Ganti foto' : 'Pilih foto'}
                                            <input
                                                type="file"
                                                accept="image/jpeg,image/png,image/webp"
                                                className="hidden"
                                                disabled={uploadingAvatar}
                                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleAvatarUpload(f); }}
                                            />
                                        </label>
                                        {form.guest_avatar && (
                                            <button type="button" onClick={() => setForm((f) => ({ ...f, guest_avatar: '' }))} className="text-xs text-red-500 hover:text-red-700 text-left cursor-pointer">
                                                Hapus foto
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Villa */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Villa *</label>
                                <select
                                    required
                                    value={form.villa_id}
                                    onChange={(e) => setForm((f) => ({ ...f, villa_id: Number(e.target.value) }))}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Pilih villa</option>
                                    {villas.map((v) => (
                                        <option key={v.id} value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                                {errors.villa_id && <p className="text-xs text-red-500 mt-1">{errors.villa_id}</p>}
                            </div>

                            {/* Guest name */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Nama Tamu *</label>
                                <input
                                    type="text"
                                    required
                                    value={form.guest_name}
                                    onChange={(e) => setForm((f) => ({ ...f, guest_name: e.target.value }))}
                                    placeholder="Nama tamu"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.guest_name && <p className="text-xs text-red-500 mt-1">{errors.guest_name}</p>}
                            </div>

                            {/* Guest subtitle */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Keterangan Tamu</label>
                                <input
                                    type="text"
                                    value={form.guest_subtitle}
                                    onChange={(e) => setForm((f) => ({ ...f, guest_subtitle: e.target.value }))}
                                    placeholder="Contoh: Tamu dari Jakarta"
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.guest_subtitle && <p className="text-xs text-red-500 mt-1">{errors.guest_subtitle}</p>}
                            </div>

                            {/* Rating */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-2">Rating *</label>
                                <StarPicker value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />
                                {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Ulasan *</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={form.comment}
                                    onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                                    placeholder="Tulis ulasan tamu..."
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                                {errors.comment && <p className="text-xs text-red-500 mt-1">{errors.comment}</p>}
                            </div>

                            {/* Approved toggle */}
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    role="switch"
                                    aria-checked={form.is_approved}
                                    onClick={() => setForm((f) => ({ ...f, is_approved: !f.is_approved }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${form.is_approved ? 'bg-green-500' : 'bg-slate-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.is_approved ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <span className="text-sm text-slate-700">Tampilkan langsung (disetujui)</span>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 text-sm"
                                >
                                    {saving ? 'Menyimpan...' : editingReview ? 'Simpan Perubahan' : 'Tambah Ulasan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
