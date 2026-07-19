import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { Star, Check, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import type { Review, PaginatedData } from '@/types';

interface Props {
    reviews: PaginatedData<Review>;
    filters: { filter: string };
}

export default function AdminReviewsPage({ reviews, filters }: Props) {
    const [filter, setFilter] = useState(filters.filter ?? 'pending');

    const handleApprove = async (id: number) => {
        try {
            await axios.patch(`/api/v1/admin/reviews/${id}/approve`);
            toast.success('Ulasan disetujui');
            router.reload();
        } catch {
            toast.error('Gagal menyetujui ulasan');
        }
    };

    const handleReject = async (id: number) => {
        if (!confirm('Hapus ulasan ini?')) {
return;
}

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
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Ulasan</h1>
                    <p className="text-sm text-slate-500">{reviews.total} ulasan</p>
                </div>

                <div className="flex gap-2">
                    {['all', 'pending', 'approved'].map((f) => (
                        <button
                            key={f}
                            onClick={() => {
                                setFilter(f);
                                router.get('/admin/reviews', { filter: f === 'all' ? '' : f }, { preserveScroll: true });
                            }}
                            className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                        >
                            {f === 'all' ? 'Semua' : f === 'pending' ? 'Menunggu' : 'Disetujui'}
                        </button>
                    ))}
                </div>

                <div className="space-y-3">
                    {reviews.data.map((review) => (
                        <div key={review.id} className="bg-white border border-slate-200 rounded-2xl p-5">
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-slate-800">{review.guest_name}</span>
                                        <span className="text-xs text-slate-400">·</span>
                                        <span className="text-xs text-slate-500">{review.villa?.name}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                        ))}
                                        <span className="text-xs text-slate-400 ml-1">{format(parseISO(review.created_at), 'dd MMM yyyy', { locale: localeID })}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${review.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {review.is_approved ? 'Disetujui' : 'Menunggu'}
                                    </span>
                                    {!review.is_approved && (
                                        <>
                                            <button onClick={() => handleApprove(review.id)} className="p-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleReject(review.id)} className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                        </div>
                    ))}
                    {reviews.data.length === 0 && (
                        <div className="text-center py-12 text-slate-400">Tidak ada ulasan</div>
                    )}
                </div>

                {/* Pagination */}
                {reviews.last_page > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border border-slate-100 rounded-2xl bg-slate-50">
                        <span className="text-xs text-slate-500">
                            {reviews.from}–{reviews.to} dari {reviews.total}
                        </span>
                        <div className="flex gap-1">
                            {Array.from({ length: reviews.last_page }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => {
                                        const params: Record<string, string> = { page: String(page) };

                                        if (filter && filter !== 'all') {
params.filter = filter;
}

                                        router.get('/admin/reviews', params, { preserveScroll: true });
                                    }}
                                    className={`w-7 h-7 rounded text-xs font-medium ${
                                        page === reviews.current_page ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
