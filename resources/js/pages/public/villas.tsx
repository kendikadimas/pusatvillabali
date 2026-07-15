import { Head, router } from '@inertiajs/react';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import React, { useState } from 'react';
import VillaCard from '@/components/public/villa-card';
import type { Villa, AppSettings, PaginatedData } from '@/types';

interface Filters {
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    bedrooms?: string;
    min_price?: string;
    max_price?: string;
    sortBy?: string;
    sortOrder?: string;
    category?: string;
}

interface Props {
    villas: PaginatedData<Villa>;
    filters: Filters;
    settings: AppSettings;
}

export default function VillasPage({ villas, filters, settings: _settings }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [wishlist, setWishlist] = useState<number[]>(() => {
        try {
 return JSON.parse(localStorage.getItem('wishlist') ?? '[]'); 
} catch {
 return []; 
}
    });

    // Local filter state
    const [locationInput, setLocationInput] = useState(filters.location ?? '');
    const [bedrooms, setBedrooms] = useState(filters.bedrooms ?? '');
    const [guests, setGuests] = useState(filters.guests ?? '');
    const [minPrice, setMinPrice] = useState(filters.min_price ?? '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price ?? '');
    const [sortBy, setSortBy] = useState(filters.sortBy ?? 'created_at');
    const [sortOrder, setSortOrder] = useState(filters.sortOrder ?? 'desc');

    const toggleWishlist = (id: number, e: React.MouseEvent) => {
        e.preventDefault();
        setWishlist((prev) => {
            const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
            localStorage.setItem('wishlist', JSON.stringify(next));

            return next;
        });
    };

    const applyFilters = () => {
        const params: Record<string, string> = {};

        if (locationInput) {
params.location = locationInput;
}

        if (filters.checkIn) {
params.checkIn = filters.checkIn;
}

        if (filters.checkOut) {
params.checkOut = filters.checkOut;
}

        if (bedrooms) {
params.bedrooms = bedrooms;
}

        if (guests) {
params.guests = guests;
}

        if (minPrice) {
params.min_price = minPrice;
}

        if (maxPrice) {
params.max_price = maxPrice;
}

        params.sortBy = sortBy;
        params.sortOrder = sortOrder;
        router.get('/villas', params, { preserveScroll: true });
        setShowFilters(false);
    };

    const clearFilters = () => {
        router.get('/villas', {});
    };

    const hasActiveFilters = locationInput || bedrooms || guests || minPrice || maxPrice;

    return (
        <>
            <Head title={filters.location ? `Villa di ${filters.location}` : 'Daftar Villa di Bali'} />

            {/* Top bar */}
            <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center gap-3">
                    {/* Search input */}
                    <div className="flex items-center gap-2 flex-1 bg-slate-100 rounded-lg px-3 py-2 max-w-sm">
                        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Cari lokasi..."
                            value={locationInput}
                            onChange={(e) => setLocationInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            className="flex-1 text-sm outline-none bg-transparent text-slate-700 placeholder:text-slate-400"
                        />
                    </div>

                    {/* Sort */}
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [sb, so] = e.target.value.split('-');
                            setSortBy(sb);
                            setSortOrder(so);
                            router.get('/villas', { ...filters, sortBy: sb, sortOrder: so }, { preserveScroll: true });
                        }}
                        className="text-sm text-slate-700 bg-slate-100 rounded-lg px-3 py-2 outline-none"
                    >
                        <option value="created_at-desc">Terbaru</option>
                        <option value="price_per_night-asc">Harga Terendah</option>
                        <option value="price_per_night-desc">Harga Tertinggi</option>
                        <option value="name-asc">Nama A-Z</option>
                    </select>

                    {/* Filter toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                            showFilters ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filter
                        {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                    </button>

                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1">
                            <X className="w-3 h-3" /> Reset
                        </button>
                    )}

                    <span className="hidden sm:block text-xs text-slate-500 ml-auto">{villas.total} villa</span>
                </div>

                {/* Filters panel */}
                {showFilters && (
                    <div className="border-t border-slate-100 bg-white px-4 sm:px-8 py-4">
                        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-end">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Kamar tidur</label>
                                <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none">
                                    <option value="">Semua</option>
                                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}+</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Tamu</label>
                                <select value={guests} onChange={(e) => setGuests(e.target.value)} className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none">
                                    <option value="">Semua</option>
                                    {[2,4,6,8,10,12].map(n => <option key={n} value={n}>{n}+</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Harga min</label>
                                <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="0" className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none w-32" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Harga max</label>
                                <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="∞" className="text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none w-32" />
                            </div>
                            <button onClick={applyFilters} className="bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                Terapkan
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Results */}
            <div className="max-w-7xl mx-auto px-3 sm:px-8 lg:px-12 py-6 sm:py-8">
                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-[-0.02em] font-heading">
                        {filters.location
                            ? `Villa di ${filters.location}`
                            : 'Daftar Villa di Bali'}
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1.5">
                        {villas.total > 0
                            ? `Menampilkan ${villas.data.length} dari ${villas.total} villa${filters.location ? ` di ${filters.location}` : ' terbaik di Bali'}`
                            : 'Tidak ada villa ditemukan'}
                    </p>
                </div>

                {villas.data.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="text-5xl mb-4">🏡</div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2 font-heading">Villa tidak ditemukan</h3>
                        <p className="text-slate-500 mb-6">Coba ubah filter pencarian Anda</p>
                        <button onClick={clearFilters} className="text-blue-600 font-semibold hover:underline">Reset filter</button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                            {villas.data.map((villa) => (
                                <VillaCard
                                    key={villa.id}
                                    villa={villa}
                                    wishlist={wishlist}
                                    toggleWishlist={toggleWishlist}
                                    searchParams={{ checkIn: filters.checkIn, checkOut: filters.checkOut }}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {villas.last_page > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12">
                                {Array.from({ length: villas.last_page }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => router.get('/villas', { ...filters, page: String(page) })}
                                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                            page === villas.current_page
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}
