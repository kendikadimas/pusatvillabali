import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Heart, ArrowLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import VillaCard from '@/components/public/villa-card';
import type { Villa, AppSettings } from '@/types';

interface Props {
    settings: AppSettings;
}

export default function WishlistPage({ settings: _settings }: Props) {
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [villas, setVillas] = useState<Villa[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('wishlist') ?? '[]') as number[];
            setWishlist(stored);

            if (stored.length === 0) {
                setLoading(false);

                return;
            }

            axios.get('/api/v1/villas', { params: { ids: stored.join(','), per_page: 50 } })
                .then((res) => {
                    const all: Villa[] = res.data.data ?? res.data;
                    setVillas(all.filter((v) => stored.includes(v.id)));
                })
                .catch(() => {
                    toast.error('Gagal memuat data wishlist');
                    setVillas([]);
                })
                .finally(() => setLoading(false));
        } catch {
            setLoading(false);
        }
    }, []);

    const removeFromWishlist = (id: number) => {
        const updated = wishlist.filter((x) => x !== id);
        setWishlist(updated);
        localStorage.setItem('wishlist', JSON.stringify(updated));
        setVillas((prev) => prev.filter((v) => v.id !== id));
    };

    return (
        <>
            <Head title="Wishlist" />
            <div className="min-h-dvh bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center gap-4 mb-8">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="text-sm font-medium">Kembali</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-900">Wishlist</h1>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto"></div>
                            <p className="mt-4 text-slate-500">Memuat wishlist...</p>
                        </div>
                    ) : villas.length === 0 ? (
                        <div className="text-center py-20">
                            <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-slate-900 mb-2">Wishlist kosong</h2>
                            <p className="text-slate-500 mb-6">Simpan villa favoritmu di sini</p>
                            <Link
                                href="/villas"
                                className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                Jelajahi Villa
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {villas.map((villa) => (
                                <VillaCard
                                    key={villa.id}
                                    villa={villa}
                                    wishlist={wishlist}
                                    toggleWishlist={(id, e) => {
                                        e.preventDefault();
                                        removeFromWishlist(id);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
