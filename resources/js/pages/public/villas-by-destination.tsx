import { Head, router } from '@inertiajs/react';
import { Home, MapPin, Search, SlidersHorizontal, X } from 'lucide-react';
import React, { useState } from 'react';
import VillaCarousel from '@/components/public/villa-carousel';
import type { Villa, AppSettings } from '@/types';

interface Filters {
    location?: string;
    bedrooms?: string;
    guests?: string;
    min_price?: string;
    max_price?: string;
}

interface Props {
    villasByDestination: Record<string, Villa[]>;
    filters: Filters;
    settings: AppSettings;
}

export default function VillasByDestinationPage({ villasByDestination, filters, settings: _settings }: Props) {
    const [showFilters, setShowFilters] = useState(false);
    const [wishlist, setWishlist] = useState<number[]>(() => {
        try {
            return JSON.parse(localStorage.getItem('wishlist') ?? '[]');
        } catch {
            return [];
        }
    });

    const [locationInput, setLocationInput] = useState(filters.location ?? '');
    const [bedrooms, setBedrooms] = useState(filters.bedrooms ?? '');
    const [guests, setGuests] = useState(filters.guests ?? '');
    const [minPrice, setMinPrice] = useState(filters.min_price ?? '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price ?? '');

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

        router.get('/villas/explore', params, { preserveScroll: true });
        setShowFilters(false);
    };

    const clearFilters = () => {
        router.get('/villas/explore', {});
    };

    const hasActiveFilters = locationInput || bedrooms || guests || minPrice || maxPrice;
    const destinations = Object.keys(villasByDestination);
    const totalVillas = Object.values(villasByDestination).reduce((sum, v) => sum + v.length, 0);

    return (
        <>
            <Head title="Jelajahi Villa per Destinasi di Bali" />

            {/* Top bar */}
            <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center gap-3">
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

                    <span className="hidden sm:block text-xs text-slate-500 ml-auto">{totalVillas} villa</span>
                </div>

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

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-8">
                <div className="mb-10">
                    <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-[-0.02em] font-heading">
                        Jelajahi Villa per Destinasi
                    </h1>
                    <p className="text-sm text-zinc-500 mt-1.5">
                        {destinations.length} destinasi, {totalVillas} villa tersedia
                    </p>
                </div>

                {destinations.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4">
                            <Home className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2 font-heading">Villa tidak ditemukan</h3>
                        <p className="text-slate-500 mb-6">Coba ubah filter pencarian Anda</p>
                        <button onClick={clearFilters} className="text-blue-600 font-semibold hover:underline">Reset filter</button>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {destinations.map((destination) => {
                            const villas = villasByDestination[destination];

                            if (!villas || villas.length === 0) {
return null;
}

                            return (
                                <section key={destination}>
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg sm:text-xl font-bold text-zinc-900 font-heading">{destination}</h2>
                                            <p className="text-xs text-zinc-500">{villas.length} villa</p>
                                        </div>
                                    </div>
                                    <VillaCarousel
                                        villas={villas}
                                        wishlist={wishlist}
                                        toggleWishlist={toggleWishlist}
                                    />
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
