import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Search, Star } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import type { Booking, Review, AppSettings } from '@/types';

interface Props {
    booking: Booking | null;
    existingReview: Review | null;
    token?: string;
    settings: AppSettings;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function BookingReviewPage({ booking, existingReview, token, settings: _settings }: Props) {
    const [rating, setRating] = useState(existingReview?.rating ?? 5);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState(existingReview?.comment ?? '');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(!!existingReview);

    if (!booking) {
        return (
            <>
                <Head title="Tulis Ulasan" />
                <div className="max-w-xl mx-auto px-4 py-20 text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Link tidak valid</h2>
                    <Link href="/" className="text-blue-600 hover:underline text-sm">Kembali ke beranda</Link>
                </div>
            </>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await axios.post(`/api/v1/reviews`, {
                booking_code: booking.booking_code,
                token,
                rating,
                comment,
            });
            toast.success('Terima kasih atas ulasan Anda!');
            setSubmitted(true);
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Gagal mengirim ulasan.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Head title="Tulis Ulasan" />
            <div className="max-w-lg mx-auto px-4 py-16">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center w-14 h-14 bg-amber-50 rounded-full mx-auto mb-3">
                        <Star className="w-7 h-7 text-amber-400 fill-amber-400" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 mb-1 font-heading">Bagaimana pengalaman Anda?</h1>
                    <p className="text-sm text-slate-500">{booking.villa?.name}</p>
                </div>

                {submitted ? (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Star className="w-8 h-8 fill-green-500 text-green-500" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Ulasan terkirim!</h2>
                        <p className="text-slate-500 text-sm mb-6">Terima kasih sudah berbagi pengalaman Anda.</p>
                        <Link href="/" className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm">
                            Kembali ke Beranda
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Star rating */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-3 text-center">Rating Anda</label>
                            <div className="flex items-center justify-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHovered(star)}
                                        onMouseLeave={() => setHovered(0)}
                                        onClick={() => setRating(star)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-10 h-10 transition-colors ${
                                                star <= (hovered || rating)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-slate-300'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-sm text-slate-500 mt-2">
                                {['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Bagus', 'Luar Biasa'][hovered || rating]}
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Cerita pengalaman Anda</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                                rows={5}
                                placeholder="Bagaimana fasilitas villa, kebersihan, lokasi, dan pelayanan host?"
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
                        >
                            {submitting ? 'Mengirim...' : 'Kirim Ulasan'}
                        </button>
                    </form>
                )}
            </div>
        </>
    );
}
