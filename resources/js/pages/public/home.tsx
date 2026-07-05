import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import type { Villa, Destination, AppSettings } from '@/types';
import VillaCard from '@/components/public/villa-card';
import { MapPin, ArrowRight, Star, Shield, Clock, HeadphonesIcon, Search, Calendar, Sparkles } from 'lucide-react';

interface Props {
    villas: Villa[];
    destinations: Destination[];
    settings: AppSettings;
}

const DEFAULT_DESTINATIONS: Destination[] = [
    { id: 1,  name: 'Seminyak',    city: 'Seminyak, Badung',      query: 'Seminyak',    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=600&q=80', count_fallback: '15+ Villa' },
    { id: 2,  name: 'Canggu',      city: 'Canggu, Badung',        query: 'Canggu',      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80', count_fallback: '21+ Villa' },
    { id: 3,  name: 'Ubud',        city: 'Ubud, Gianyar',         query: 'Ubud',        image: 'https://images.unsplash.com/photo-1549638441-b787d2e11f14?auto=format&fit=crop&w=600&q=80', count_fallback: '14+ Villa' },
    { id: 4,  name: 'Uluwatu',     city: 'Uluwatu, Badung',       query: 'Uluwatu',     image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=600&q=80', count_fallback: '11+ Villa' },
    { id: 5,  name: 'Jimbaran',    city: 'Jimbaran, Badung',      query: 'Jimbaran',    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80', count_fallback: '9+ Villa' },
    { id: 6,  name: 'Nusa Dua',    city: 'Nusa Dua, Badung',      query: 'Nusa Dua',    image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80', count_fallback: '8+ Villa' },
    { id: 7,  name: 'Kuta',        city: 'Kuta, Badung',          query: 'Kuta',        image: 'https://images.unsplash.com/photo-1520454974749-a795c5e0b8f0?auto=format&fit=crop&w=600&q=80', count_fallback: '12+ Villa' },
    { id: 8,  name: 'Legian',      city: 'Legian, Badung',        query: 'Legian',      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', count_fallback: '7+ Villa' },
    { id: 9,  name: 'Sanur',       city: 'Sanur, Denpasar',       query: 'Sanur',       image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=600&q=80', count_fallback: '10+ Villa' },
    { id: 10, name: 'Nusa Lembongan', city: 'Nusa Lembongan, Klungkung', query: 'Nusa Lembongan', image: 'https://images.unsplash.com/photo-1559628233-100c798642e7?auto=format&fit=crop&w=600&q=80', count_fallback: '6+ Villa' },
    { id: 11, name: 'Amed',        city: 'Amed, Karangasem',      query: 'Amed',        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', count_fallback: '5+ Villa' },
    { id: 12, name: 'Candidasa',   city: 'Candidasa, Karangasem', query: 'Candidasa',   image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=600&q=80', count_fallback: '4+ Villa' },
    { id: 13, name: 'Lovina',      city: 'Lovina, Buleleng',      query: 'Lovina',      image: 'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?auto=format&fit=crop&w=600&q=80', count_fallback: '5+ Villa' },
    { id: 14, name: 'Singaraja',   city: 'Singaraja, Buleleng',   query: 'Singaraja',   image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80', count_fallback: '3+ Villa' },
    { id: 15, name: 'Tabanan',     city: 'Tabanan, Tabanan',      query: 'Tabanan',     image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80', count_fallback: '6+ Villa' },
    { id: 16, name: 'Bedugul',     city: 'Bedugul, Tabanan',      query: 'Bedugul',     image: 'https://images.unsplash.com/photo-1589666564459-93cdd3ab856a?auto=format&fit=crop&w=600&q=80', count_fallback: '4+ Villa' },
    { id: 17, name: 'Munduk',      city: 'Munduk, Buleleng',      query: 'Munduk',      image: 'https://images.unsplash.com/photo-1590004953392-5aba2e72269a?auto=format&fit=crop&w=600&q=80', count_fallback: '3+ Villa' },
    { id: 18, name: 'Gianyar',     city: 'Gianyar, Gianyar',      query: 'Gianyar',     image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=600&q=80', count_fallback: '5+ Villa' },
    { id: 19, name: 'Klungkung',   city: 'Klungkung, Klungkung',  query: 'Klungkung',   image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80', count_fallback: '3+ Villa' },
    { id: 20, name: 'Bangli',      city: 'Bangli, Bangli',        query: 'Bangli',      image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80', count_fallback: '2+ Villa' },
];

const HERO_SLIDES = [
    { image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=1600&q=80', label: 'Pantai Jimbaran' },
    { image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1600&q=80', label: 'Seminyak Beach' },
    { image: 'https://images.unsplash.com/photo-1549638441-b787d2e11f14?auto=format&fit=crop&w=1600&q=80', label: 'Sawah Ubud' },
];

export default function HomePage({ villas, destinations, settings }: Props) {
    const [location, setLocation] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);
    const [heroIndex, setHeroIndex] = useState(0);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const [wishlist, setWishlist] = useState<number[]>(() => {
        try { return JSON.parse(localStorage.getItem('wishlist') ?? '[]'); } catch { return []; }
    });
    const [locationSearch, setLocationSearch] = useState('');

    useEffect(() => {
        const t = setInterval(() => setHeroIndex(i => (i + 1) % HERO_SLIDES.length), 4000);
        return () => clearInterval(t);
    }, []);

    const displayDestinations = destinations.length > 0 ? destinations : DEFAULT_DESTINATIONS;
    const appName = settings?.settings_prop_name ?? 'PusatVillaBali';

    // Autocomplete suggestions — combine destination names + villa names
    const allSuggestions = [
        ...displayDestinations.map(d => ({ label: d.name, sub: d.city, query: d.query })),
        ...villas.map(v => ({ label: v.name, sub: v.location ?? '', query: v.name })),
    ];

    const suggestions = location.trim().length > 0
        ? allSuggestions.filter(s =>
            s.label.toLowerCase().includes(location.toLowerCase()) ||
            s.sub.toLowerCase().includes(location.toLowerCase())
          ).slice(0, 6)
        : displayDestinations.slice(0, 5).map(d => ({ label: d.name, sub: d.city, query: d.query }));

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};
        if (location) params.search = location;
        if (checkIn) params.checkIn = checkIn;
        if (checkOut) params.checkOut = checkOut;
        if (guests > 0) params.guests = String(guests);
        router.get('/villas', params);
    };

    const toggleWishlist = (id: number, e: React.MouseEvent) => {
        e.preventDefault();
        setWishlist(prev => {
            const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
            localStorage.setItem('wishlist', JSON.stringify(next));
            return next;
        });
    };

    return (
        <>
            <Head title="Beranda" />

            {/* ── HERO ── full-bleed image with overlay */}
            <section className="px-5 sm:px-10 lg:px-16 xl:px-20 pt-6 sm:pt-8">
                <div className="relative rounded-3xl overflow-hidden min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh]">
                    {/* Background slideshow */}
                    {HERO_SLIDES.map((slide, i) => (
                        <div
                            key={i}
                            className="absolute inset-0 transition-opacity duration-700"
                            style={{ opacity: i === heroIndex ? 1 : 0 }}
                        >
                            <img src={slide.image} alt={slide.label} className="w-full h-full object-cover" />
                        </div>
                    ))}

                    {/* Overlay gradients — stronger for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

                    {/* Decorative pattern — very subtle */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #ffffff 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

                    {/* Slide badge */}
                    <div className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-white/80 text-xs font-medium">{HERO_SLIDES[heroIndex].label}</span>
                    </div>

                    {/* Dots */}
                    <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex gap-1.5">
                        {HERO_SLIDES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setHeroIndex(i)}
                                className={`w-2 h-2 rounded-full transition-all duration-500 cursor-pointer ${i === heroIndex ? 'bg-blue-500 w-6' : 'bg-white/40 hover:bg-white/60'}`}
                            />
                        ))}
                    </div>

                    {/* Content overlay */}
                    <div className="relative z-10 flex flex-col justify-end min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh] px-6 sm:px-10 lg:px-14 xl:px-16 pb-10 sm:pb-14 lg:pb-16">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 mb-5">
                                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                                <span className="text-white/90 text-xs font-semibold">Agen Villa Terpercaya di Bali</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl lg:text-[4.75rem] font-black text-white leading-[1.0] tracking-[-0.035em] mb-5 font-heading">
                                Cari & Sewa Villa<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400">Terbaik di Bali</span>
                            </h1>

                            <p className="text-base text-white/70 leading-relaxed max-w-lg mb-8">
                                Dari villa tepi sawah Ubud hingga kolam infinity Seminyak — kami bantu pilihkan yang paling pas untuk liburan Anda.
                            </p>

                            {/* Search card */}
                            <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] border border-white/20 overflow-visible">
                                {/* Location input — always visible */}
                                <div ref={searchRef} className="relative border-b border-zinc-200/60">
                                    <div className="flex items-center gap-3 px-4 py-3.5">
                                        <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={e => { setLocation(e.target.value); setShowSuggestions(true); }}
                                            onFocus={() => setShowSuggestions(true)}
                                            placeholder="Cari lokasi atau nama villa..."
                                            className="w-full text-sm text-zinc-800 outline-none bg-transparent placeholder:text-zinc-400 font-medium"
                                            autoComplete="off"
                                        />
                                        {location && (
                                            <button type="button" onClick={() => { setLocation(''); setShowSuggestions(false); }} className="text-zinc-300 hover:text-zinc-500 transition-colors cursor-pointer">
                                                <Search className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>
                                    {/* Autocomplete dropdown */}
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.14)] border border-slate-100 overflow-hidden z-50">
                                            {location.trim() === '' && (
                                                <div className="px-4 pt-3 pb-1">
                                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Destinasi Populer</p>
                                                </div>
                                            )}
                                            {suggestions.map((s, i) => (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    onMouseDown={() => {
                                                        setLocation(s.label);
                                                        setShowSuggestions(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors cursor-pointer text-left group"
                                                >
                                                    <span className="w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">
                                                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-slate-800 leading-tight truncate">{s.label}</p>
                                                        {s.sub && <p className="text-xs text-slate-400 leading-tight truncate">{s.sub}</p>}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {/* Dates + button row */}
                                <div className="flex items-stretch divide-x divide-zinc-200/60">
                                    <div className="flex-1 flex flex-col px-3 py-2.5">
                                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-0.5">Check-in</span>
                                        <input
                                            type="date"
                                            value={checkIn}
                                            onChange={e => setCheckIn(e.target.value)}
                                            className="text-xs sm:text-sm text-zinc-800 outline-none bg-transparent w-full"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col px-3 py-2.5">
                                        <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mb-0.5">Check-out</span>
                                        <input
                                            type="date"
                                            value={checkOut}
                                            onChange={e => setCheckOut(e.target.value)}
                                            className="text-xs sm:text-sm text-zinc-800 outline-none bg-transparent w-full"
                                        />
                                    </div>
                                    <div className="flex items-center px-3">
                                        <button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-center gap-2 transition-all duration-200 text-sm cursor-pointer shadow-lg shadow-blue-600/20"
                                        >
                                            <Search className="w-4 h-4" strokeWidth={2.5} />
                                            <span className="hidden sm:inline">Cari</span>
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Trust strip */}
                            <div className="flex items-center gap-5 mt-5">
                                <div className="flex items-center gap-1.5 text-white/60 text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    Konfirmasi instan
                                </div>
                                <div className="flex items-center gap-1.5 text-white/60 text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    Tanpa biaya perantara
                                </div>
                                <div className="flex items-center gap-1.5 text-white/60 text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    Dukungan WhatsApp
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── DESTINATIONS ── */}
            <section className="py-16 sm:py-20 px-5 sm:px-10 lg:px-16 xl:px-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-8 sm:mb-10">
                        <div>
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest mb-2">Pilih Area</p>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-[-0.02em] leading-[1.08] font-heading">
                                Destinasi Populer di Bali
                            </h2>
                        </div>
                        <Link href="/villas" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors shrink-0">
                            Lihat semua <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Desktop: asymmetric layout — 1 hero + 2×2 grid */}
                    <div className="hidden sm:grid grid-cols-5 grid-rows-2 gap-3 h-[480px]">
                        {/* Hero — spans 2 rows */}
                        {displayDestinations[0] && (
                            <Link href={`/villas?location=${encodeURIComponent(displayDestinations[0].query)}`}
                                className="col-span-2 row-span-2 group relative rounded-2xl overflow-hidden bg-slate-100">
                                <img src={displayDestinations[0].image} alt={displayDestinations[0].name}
                                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <p className="text-white font-black text-2xl leading-tight font-heading">{displayDestinations[0].name}</p>
                                    <p className="text-white/60 text-sm mt-1">{displayDestinations[0].count_fallback}</p>
                                </div>
                            </Link>
                        )}
                        {/* 4 smaller tiles */}
                        {displayDestinations.slice(1, 5).map((dest) => (
                            <Link key={dest.id} href={`/villas?location=${encodeURIComponent(dest.query)}`}
                                className="group relative rounded-2xl overflow-hidden bg-slate-100">
                                <img src={dest.image} alt={dest.name}
                                    className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-bold text-sm leading-tight font-heading">{dest.name}</p>
                                    <p className="text-white/55 text-xs mt-0.5">{dest.count_fallback}</p>
                                </div>
                            </Link>
                        ))}
                        {/* 6th tile — "Lihat semua" */}
                        <Link href="/villas"
                            className="group relative rounded-2xl overflow-hidden bg-blue-50 border-2 border-dashed border-blue-200 flex flex-col items-center justify-center gap-2 hover:bg-blue-100 hover:border-blue-300 transition-all">
                            <span className="w-10 h-10 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-colors">
                                <ArrowRight className="w-5 h-5 text-blue-700" />
                            </span>
                            <span className="text-sm font-semibold text-blue-700">Semua Area</span>
                        </Link>
                    </div>

                    {/* Mobile: horizontal scroll */}
                    <div className="sm:hidden -mx-5 px-5 overflow-x-auto snap-x snap-mandatory scrollbar-none">
                        <div className="flex gap-3 pb-2">
                            {displayDestinations.slice(0, 8).map((dest) => (
                                <Link key={dest.id} href={`/villas?location=${encodeURIComponent(dest.query)}`}
                                    className="snap-start shrink-0 w-[44vw] aspect-[3/4] group relative rounded-2xl overflow-hidden bg-slate-100">
                                    <img src={dest.image} alt={dest.name}
                                        className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <p className="text-white font-bold text-sm leading-tight font-heading">{dest.name}</p>
                                        <p className="text-white/60 text-[11px] mt-0.5">{dest.count_fallback}</p>
                                    </div>
                                </Link>
                            ))}
                            <Link href="/villas" className="snap-start shrink-0 w-[44vw] aspect-[3/4] rounded-2xl bg-blue-50 border-2 border-dashed border-blue-200 flex flex-col items-center justify-center gap-2">
                                <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <ArrowRight className="w-5 h-5 text-blue-700" />
                                </span>
                                <span className="text-xs font-semibold text-blue-700 text-center px-2">Semua Destinasi</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── VILLAS ── */}
            <section className="py-16 sm:py-20 px-5 sm:px-10 lg:px-16 xl:px-20 bg-zinc-50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest mb-2">Rekomendasi</p>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-[-0.02em] leading-[1.08] font-heading">
                                Villa Terpopuler
                            </h2>
                        </div>
                        <Link href="/villas" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors">
                            Lihat semua <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    {/* Mobile: carousel */}
                    <div className="sm:hidden -mx-5 px-5 overflow-x-auto snap-x snap-mandatory scrollbar-none">
                        <div className="flex gap-3">
                            {villas.map((villa) => (
                                <div key={villa.id} className="snap-start shrink-0 w-[72vw] max-w-[280px]">
                                    <VillaCard
                                        villa={villa}
                                        wishlist={wishlist}
                                        toggleWishlist={toggleWishlist}
                                        searchParams={{}}
                                    />
                                </div>
                            ))}
                            <div className="snap-start shrink-0 w-[72vw] max-w-[280px] flex items-center justify-center">
                                <Link href="/villas" className="flex flex-col items-center gap-2 text-blue-700 font-semibold text-sm">
                                    <span className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                        <ArrowRight className="w-5 h-5" />
                                    </span>
                                    Lihat semua villa
                                </Link>
                            </div>
                        </div>
                    </div>
                    {/* Desktop: grid */}
                    <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    {villas.length === 0 && (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                                <MapPin className="w-6 h-6 text-zinc-300" />
                            </div>
                            <p className="text-zinc-400 font-medium">Belum ada villa tersedia.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* ── LOCATION SEARCH ── */}
            <section className="py-20 sm:py-28 px-5 sm:px-10 lg:px-16 xl:px-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 min-h-[280px] flex flex-col items-center justify-center text-center px-6 py-16">
                        {/* No glow, no dot — clean solid green */}
                        <div className="relative z-10 max-w-2xl mx-auto">
                            <p className="text-xs font-semibold text-blue-300 uppercase tracking-widest mb-4">Cari Villa</p>
                            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-[-0.02em] leading-[1.1] mb-3 font-heading">
                                Mencari villa di lokasi tertentu?
                            </h2>
                            <p className="text-blue-200/70 text-[15px] leading-relaxed mb-8 max-w-md mx-auto">
                                Ketik nama area di Bali — Seminyak, Canggu, Ubud, Uluwatu, dan lainnya.
                            </p>
                            <form
                                onSubmit={(e) => { e.preventDefault(); const v = locationSearch.trim(); if (v) router.get('/villas', { location: v }); }}
                                className="flex items-center gap-3 max-w-lg mx-auto"
                            >
                                <div className="flex-1 flex items-center gap-3 bg-white/10 border border-blue-600/50 rounded-xl px-4 py-3.5 focus-within:border-white/40 focus-within:bg-white/15 transition-all">
                                    <MapPin className="w-4 h-4 text-blue-300 shrink-0" />
                                    <input
                                        type="text"
                                        value={locationSearch}
                                        onChange={e => setLocationSearch(e.target.value)}
                                        placeholder="Cari lokasi villa..."
                                        className="w-full text-sm text-white outline-none bg-transparent placeholder:text-blue-300/50 font-medium"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-white hover:bg-blue-50 active:scale-95 text-blue-800 font-bold rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 transition-all duration-200 text-sm cursor-pointer shrink-0 shadow-sm"
                                >
                                    <Search className="w-4 h-4" strokeWidth={2.5} />
                                    <span className="hidden sm:inline">Cari</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── WHY US ── */}
            <section className="py-16 sm:py-20 px-5 sm:px-10 lg:px-16 xl:px-20 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">
                        {/* Left: heading block */}
                        <div className="lg:w-72 xl:w-80 shrink-0">
                            <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest mb-3">Keunggulan</p>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-[-0.02em] leading-[1.08] mb-4 font-heading">
                                Kenapa Pakai Agen Kami?
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Kami kurasi villa terbaik di Bali — harga transparan, proses mudah, pengalaman terjamin.
                            </p>
                            <Link href="/villas" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors">
                                Lihat villa kami <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Right: bento grid */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Large card */}
                            <div className="sm:col-span-2 flex items-start gap-5 p-6 rounded-2xl bg-blue-50 border border-blue-100">
                                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-1.5 font-heading text-base">Villa Terverifikasi Langsung</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">Setiap villa kami survei langsung ke lokasi — foto asli, kondisi nyata, tidak ada villa abal-abal atau menyesatkan.</p>
                                </div>
                            </div>
                            {/* 3 smaller cards */}
                            {[
                                { icon: <Star className="w-5 h-5 text-blue-700" />, title: 'Kurasi Terbaik', desc: 'Villa premium dipilih sesuai kebutuhan dan budget Anda.' },
                                { icon: <Clock className="w-5 h-5 text-blue-700" />, title: 'Proses Cepat', desc: 'Dari konsultasi hingga konfirmasi — selesai dalam hitungan jam.' },
                                { icon: <HeadphonesIcon className="w-5 h-5 text-blue-700" />, title: 'Pendampingan Penuh', desc: 'Agen kami siap via WhatsApp dari tanya-tanya hingga check-in.' },
                            ].map((item) => (
                                <div key={item.title} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/40 transition-colors">
                                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 mb-1 text-sm font-heading">{item.title}</h3>
                                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-16 sm:py-20 px-5 sm:px-10 lg:px-16 xl:px-20">
                <div className="max-w-7xl mx-auto">
                    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 min-h-[320px] grid grid-cols-1 lg:grid-cols-2">
                        <div className="relative z-10 flex flex-col justify-center p-10 sm:p-14 lg:p-16">
                            <p className="text-xs font-semibold text-blue-200 uppercase tracking-widest mb-4">
                                Konsultasi Gratis
                            </p>
                            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-[-0.02em] leading-[1.08] mb-5 max-w-sm font-heading">
                                Butuh bantuan pilih villa di Bali?
                            </h2>
                            <p className="text-blue-100/80 text-[15px] leading-relaxed max-w-sm mb-8">
                                Ceritakan kebutuhan Anda — jumlah tamu, budget, dan area. Tim agen kami siap carikan villa yang paling pas.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href={`https://api.whatsapp.com/send?phone=${settings?.settings_phone ?? '6281234567890'}&text=Halo, saya ingin bertanya tentang villa di Bali`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-blue-50 text-blue-700 font-bold px-6 py-3.5 rounded-xl text-sm transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
                                >
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                    Chat WhatsApp
                                </a>
                                <Link
                                    href="/villas"
                                    className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white/60 text-white/80 hover:text-white font-medium px-6 py-3.5 rounded-xl text-sm transition-all duration-200 active:scale-95"
                                >
                                    Jelajahi Villa
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                        <div className="relative hidden lg:block">
                            <img
                                src="https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80"
                                alt="Bali villa sunset"
                                className="absolute inset-0 z-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 z-10 bg-gradient-to-l from-transparent via-blue-900/20 to-blue-900/90" />
                        </div>
                        {/* No dot pattern — cleaner */}
                    </div>
                </div>
            </section>
        </>
    );
}