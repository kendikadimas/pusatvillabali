import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import type { Villa, AppSettings } from '@/types';
import VillaCard from '@/components/public/villa-card';
import { Heart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface Props {
    settings: AppSettings;
}

export default function WishlistPage({ settings }: Props) {
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

    const toggleWishlist = (id: number, e: React.MouseEvent) => {
        e.preventDefault();
        setWishlist((prev) => {
            const next = prev.filter((x) => x !== id);
            localStorage.setItem('wishlist', JSON.stringify(next));
            setVillas((v) => v.filter((villa) => villa.id !== id));
            toast.success('Dihapus dari wishlist');
            return next;
        });
    };

    return (
        <>
            <Head title="Wishlist Saya" />

            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/villas"
                        className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                        title="Kembali ke daftar villa"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
                        <div>
                            <h1 className="text-2xl font-black text-slate-800 font-heading">Wishlist Saya</h1>
                            <p className="text-sm text-slate-500">
                                {loading ? 'Memuat...' : `${wishlist.length} villa tersimpan`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="flex flex-col gap-2 animate-pulse">
                                <div className="aspect-[4/3] bg-slate-100 rounded-2xl" />
                                <div className="h-4 bg-slate-100 rounded w-3/4" />
                                <div className="h-3 bg-slate-100 rounded w-1/2" />
                                <div className="h-4 bg-slate-100 rounded w-1/3" />
                            </div>
                        ))}
                    </div>
                ) : wishlist.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-rose-300" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-700 mb-2 font-heading">Wishlist masih kosong</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Simpan villa favorit Anda dengan menekan ikon hati di kartu villa.
                        </p>
                        <Link
                            href="/villas"
                            className="inline-block bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Jelajahi Villa
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {villas.map((villa) => (
                                <VillaCard
                                    key={villa.id}
                                    villa={villa}
                                    wishlist={wishlist}
                                    toggleWishlist={toggleWishlist}
                                    searchParams={{}}
                                />
                            ))}
                        </div>

                        {/* Clear all hint */}
                        {villas.length > 0 && (
                            <div className="mt-8 text-center">
                                <button
                                    onClick={() => {
                                        localStorage.setItem('wishlist', '[]');
                                        setWishlist([]);
                                        setVillas([]);
                                        toast.success('Wishlist dikosongkan');
                                    }}
                                    className="text-sm text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    Kosongkan semua wishlist
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
