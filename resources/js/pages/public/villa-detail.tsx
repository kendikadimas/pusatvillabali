import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import type { Villa, AppSettings } from '@/types';
import { getPhotoUrl, getPhotoCategory, getPhotoDesc } from '@/lib/villaUtils';
import { formatPrice } from '@/lib/format';
import { eachDayOfInterval, parseISO } from 'date-fns';
import { MapPin, BedDouble, Bath, Users, Star, Calendar, ChevronLeft, ChevronRight, Check, X, Grid3X3, Minus, Plus, LayoutGrid, SlidersHorizontal } from 'lucide-react';

// ─── Mobile Booking Bar ───────────────────────────────────────────────────────

interface MobileBookingBarProps {
    villa: Villa;
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
    totalPrice: number;
    onOpenSheet: () => void;
    onBook: (e: React.FormEvent) => void;
    formatDate: (d: string) => string | null;
}

function MobileBookingBar({ villa, checkIn, checkOut, nights, totalPrice, onOpenSheet, onBook, formatDate }: MobileBookingBarProps) {
    const hasSelection = checkIn && checkOut && nights > 0;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 min-w-0">
                    {hasSelection ? (
                        <>
                            <p className="text-[11px] text-slate-400 font-medium leading-tight">
                                {formatDate(checkIn)} → {formatDate(checkOut)} · {nights} malam
                            </p>
                            <p className="text-lg font-black text-slate-900 leading-tight font-heading">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPrice)}
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-[11px] text-slate-400 font-medium leading-tight">mulai dari</p>
                            <div className="flex items-baseline gap-1">
                                <p className="text-lg font-black text-slate-900 leading-tight font-heading">
                                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(villa.price_per_night)}
                                </p>
                                <span className="text-xs text-slate-400 font-medium">/malam</span>
                            </div>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={onOpenSheet}
                        className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm font-semibold transition-colors hover:bg-blue-100 cursor-pointer"
                    >
                        <Calendar className="w-4 h-4" />
                        {hasSelection ? 'Ubah' : 'Pilih Tanggal'}
                    </button>
                    {hasSelection && (
                        <button
                            type="button"
                            onClick={onBook as unknown as React.MouseEventHandler}
                            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold transition-colors hover:bg-blue-700 cursor-pointer"
                        >
                            Pesan
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Mobile Booking Sheet ─────────────────────────────────────────────────────

interface MobileBookingSheetProps {
    villa: Villa;
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
    totalPrice: number;
    setCheckIn: (v: string) => void;
    setCheckOut: (v: string) => void;
    setGuests: (v: number) => void;
    checkInRef: React.RefObject<HTMLInputElement | null>;
    checkOutRef: React.RefObject<HTMLInputElement | null>;
    onClose: () => void;
    onBook: (e: React.FormEvent) => void;
    formatDate: (d: string) => string | null;
    settings: AppSettings;
}

function MobileBookingSheet({
    villa, checkIn, checkOut, guests, nights, totalPrice,
    setCheckIn, setCheckOut, setGuests,
    checkInRef, checkOutRef,
    onClose, onBook, settings,
}: MobileBookingSheetProps) {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const today = new Date().toISOString().split('T')[0];

    return (
        <>
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl">
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-slate-200" />
                </div>
                <div className="flex items-center justify-between px-5 pb-4 border-b border-slate-100">
                    <div>
                        <h3 className="text-base font-black text-slate-900 font-heading">Pilih Tanggal &amp; Tamu</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{villa.name}</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer" aria-label="Tutup">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
                <div className="px-5 pt-4 pb-2 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Check-in</label>
                            <input ref={checkInRef} type="date" value={checkIn} min={today}
                                onChange={e => { setCheckIn(e.target.value); if (checkOut && e.target.value >= checkOut) setCheckOut(''); }}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 cursor-pointer"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Check-out</label>
                            <input ref={checkOutRef} type="date" value={checkOut} min={checkIn || today}
                                onChange={e => setCheckOut(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50 cursor-pointer"
                            />
                        </div>
                    </div>
                    {nights > 0 && (
                        <div className="flex items-center justify-center py-1.5 bg-blue-50 rounded-xl">
                            <span className="text-sm font-semibold text-blue-700">{nights} malam dipilih</span>
                        </div>
                    )}
                    <div className="flex items-center justify-between py-3 border-t border-slate-100">
                        <div>
                            <p className="text-sm font-semibold text-slate-800">Jumlah Tamu</p>
                            <p className="text-xs text-slate-400">Maks. {villa.max_guests} tamu</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))}
                                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30 cursor-pointer"
                                disabled={guests <= 1}>
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center text-base font-bold text-slate-900">{guests}</span>
                            <button type="button" onClick={() => setGuests(Math.min(villa.max_guests, guests + 1))}
                                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30 cursor-pointer"
                                disabled={guests >= villa.max_guests}>
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="px-5 pt-3 pb-6 border-t border-slate-100 space-y-3">
                    {nights > 0 ? (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(villa.price_per_night)} × {nights} malam
                            </span>
                            <span className="text-base font-black text-slate-900 font-heading">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalPrice)}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-500">Harga per malam</span>
                            <span className="text-base font-black text-slate-900 font-heading">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(villa.price_per_night)}
                            </span>
                        </div>
                    )}
                    <button type="button" onClick={(e) => { onBook(e); onClose(); }}
                        disabled={!checkIn || !checkOut || nights <= 0}
                        className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-base transition-all hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">
                        {nights > 0 ? 'Pesan Sekarang' : 'Pilih tanggal terlebih dahulu'}
                    </button>
                    {settings?.settings_whatsapp && (
                        <a href={`https://wa.me/${settings.settings_whatsapp}?text=Halo, saya ingin menanyakan villa ${villa.name}`}
                            target="_blank" rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 border border-green-500 text-green-600 font-semibold py-3 rounded-2xl hover:bg-green-50 transition-colors text-sm">
                            Tanya via WhatsApp
                        </a>
                    )}
                </div>
            </div>
        </>
    );
}

// ─── Photo Tour Modal ────────────────────────────────────────────────────────

interface PhotoTourModalProps {
    photos: unknown[];
    initialIndex: number;
    villaName: string;
    onClose: () => void;
}

function PhotoTourModal({ photos, initialIndex, villaName, onClose }: PhotoTourModalProps) {
    const [current, setCurrent] = useState(initialIndex);
    const [view, setView] = useState<'slide' | 'grid'>('slide');
    const [activeCategory, setActiveCategory] = useState<string>('Semua');
    const thumbRef = useRef<HTMLDivElement>(null);

    const categories = ['Semua', ...Array.from(new Set(photos.map(p => getPhotoCategory(p))))];
    const filtered = activeCategory === 'Semua' ? photos : photos.filter(p => getPhotoCategory(p) === activeCategory);

    const prev = useCallback(() => {
        setCurrent(c => (c > 0 ? c - 1 : filtered.length - 1));
    }, [filtered.length]);

    const next = useCallback(() => {
        setCurrent(c => (c < filtered.length - 1 ? c + 1 : 0));
    }, [filtered.length]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft' && view === 'slide') prev();
            if (e.key === 'ArrowRight' && view === 'slide') next();
            if (e.key === 'g') setView(v => v === 'slide' ? 'grid' : 'slide');
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose, prev, next, view]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    useEffect(() => {
        if (!thumbRef.current) return;
        const active = thumbRef.current.querySelector('[data-active="true"]') as HTMLElement | null;
        active?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }, [current]);

    useEffect(() => { setCurrent(0); }, [activeCategory]);

    const currentPhoto = filtered[current];
    const desc = getPhotoDesc(currentPhoto);

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col" role="dialog" aria-modal="true" aria-label={`Foto ${villaName}`}>
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 shrink-0 bg-black/80 border-b border-white/10">
                <div className="flex items-center gap-3 min-w-0">
                    <span className="text-white font-semibold text-sm sm:text-base truncate">{villaName}</span>
                    <span className="text-white/50 text-xs sm:text-sm shrink-0">{current + 1} / {filtered.length}</span>
                </div>
                <div className="hidden md:flex items-center gap-1 overflow-x-auto max-w-md">
                    {categories.map(cat => (
                        <button key={cat} type="button" onClick={() => setActiveCategory(cat)}
                            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${activeCategory === cat ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button type="button" onClick={() => setView(v => v === 'slide' ? 'grid' : 'slide')}
                        className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
                        {view === 'slide' ? <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" /> : <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                    <button type="button" onClick={onClose} className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer" aria-label="Tutup">
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>
            <div className="flex md:hidden items-center gap-1 px-4 py-2 overflow-x-auto shrink-0 border-b border-white/10 scrollbar-none">
                {categories.map(cat => (
                    <button key={cat} type="button" onClick={() => setActiveCategory(cat)}
                        className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${activeCategory === cat ? 'bg-blue-600 text-white' : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
                        {cat}
                    </button>
                ))}
            </div>
            {view === 'slide' ? (
                <>
                    <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                        <button type="button" onClick={prev} className="absolute left-3 sm:left-5 z-10 p-2.5 sm:p-3 bg-black/40 hover:bg-black/70 border border-white/10 rounded-full transition-all cursor-pointer" aria-label="Foto sebelumnya">
                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </button>
                        <div className="relative w-full h-full flex items-center justify-center px-14 sm:px-20">
                            <img key={current} src={getPhotoUrl(currentPhoto)} alt={desc || villaName}
                                className="max-w-full max-h-full object-contain rounded-lg select-none"
                                style={{ maxHeight: 'calc(100vh - 260px)' }} />
                            {desc && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 max-w-sm bg-black/70 backdrop-blur-sm text-white text-xs sm:text-sm px-4 py-2 rounded-full text-center">
                                    {desc}
                                </div>
                            )}
                        </div>
                        <button type="button" onClick={next} className="absolute right-3 sm:right-5 z-10 p-2.5 sm:p-3 bg-black/40 hover:bg-black/70 border border-white/10 rounded-full transition-all cursor-pointer" aria-label="Foto berikutnya">
                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </button>
                    </div>
                    <div ref={thumbRef} className="flex items-center gap-2 px-4 py-3 overflow-x-auto shrink-0 border-t border-white/10 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
                        {filtered.map((photo, i) => (
                            <button key={i} type="button" data-active={i === current ? 'true' : 'false'} onClick={() => setCurrent(i)}
                                className={`shrink-0 w-16 h-11 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${i === current ? 'border-blue-500 opacity-100 scale-105' : 'border-transparent opacity-40 hover:opacity-70'}`}>
                                <img src={getPhotoUrl(photo)} alt="" className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex-1 overflow-y-auto p-3 sm:p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                        {filtered.map((photo, i) => {
                            const d = getPhotoDesc(photo);
                            return (
                                <button key={i} type="button" onClick={() => { setCurrent(i); setView('slide'); }}
                                    className="relative group aspect-[4/3] overflow-hidden rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <img src={getPhotoUrl(photo)} alt={d || ''} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
                                    {d && (
                                        <div className="absolute bottom-0 inset-x-0 px-2 py-1.5 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="text-white text-[11px] leading-tight line-clamp-2">{d}</p>
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

interface Props {
    villa: Villa;
    settings: AppSettings;
}

export default function VillaDetailPage({ villa, settings }: Props) {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(2);
    const [currentPhoto, setCurrentPhoto] = useState(0);
    const [tourOpen, setTourOpen] = useState(false);
    const [bookingSheetOpen, setBookingSheetOpen] = useState(false);
    const checkInRef = useRef<HTMLInputElement>(null);
    const checkOutRef = useRef<HTMLInputElement>(null);

    const photos = villa.photos && villa.photos.length > 0 ? villa.photos : [];
    const ratingVal = villa.reviews_avg_rating && villa.reviews_count && villa.reviews_count > 0
        ? parseFloat(String(villa.reviews_avg_rating))
        : null;

    // Calculate nights between dates
    const nights = checkIn && checkOut
        ? Math.max(0, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
        : 0;

    const totalPrice = React.useMemo(() => {
        if (!checkIn || !checkOut || nights <= 0 || !villa) return 0;
        const days = eachDayOfInterval({
            start: parseISO(checkIn),
            end: new Date(parseISO(checkOut).getTime() - 86400000),
        });
        return days.reduce((sum: number, day: Date) => {
            const dow = day.getDay();
            const isWeekend = dow === 5 || dow === 6;
            return sum + (isWeekend && villa.weekend_price ? Number(villa.weekend_price) : Number(villa.price_per_night));
        }, 0);
    }, [checkIn, checkOut, nights, villa]);

    const formatDate = (d: string) => {
        if (!d) return null;
        const dt = new Date(d);
        return dt.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const { auth } = usePage<{ auth: { user: { name: string; email: string } | null } }>().props;

    const handleBook = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {
            villa_slug: villa.slug,
            guests: String(guests),
        };
        if (checkIn) params.checkIn = checkIn;
        if (checkOut) params.checkOut = checkOut;

        if (!auth?.user) {
            // Simpan booking intent ke sessionStorage
            sessionStorage.setItem('booking_intent', JSON.stringify(params));
            // Set redirect target setelah login
            const bookingUrl = '/booking/confirm?' + new URLSearchParams(params).toString();
            sessionStorage.setItem('oauth_redirect', bookingUrl);
            router.visit('/login');
            return;
        }

        router.get('/booking/confirm', params);
    };

    const prevPhoto = useCallback(() => {
        setCurrentPhoto(p => (p > 0 ? p - 1 : photos.length - 1));
    }, [photos.length]);

    const nextPhoto = useCallback(() => {
        setCurrentPhoto(p => (p < photos.length - 1 ? p + 1 : 0));
    }, [photos.length]);

    useEffect(() => {
        if (!tourOpen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setTourOpen(false);
            if (e.key === 'ArrowLeft') prevPhoto();
            if (e.key === 'ArrowRight') nextPhoto();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [tourOpen, prevPhoto, nextPhoto]);

    return (
        <>
            <Head title={villa.name} />

            {/* Photo Gallery */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
                {photos.length > 0 ? (
                    <>
                        {/* Desktop: Airbnb-style grid */}
                        <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-2 h-[420px] lg:h-[500px] rounded-2xl overflow-hidden">
                            {/* Main large photo */}
                            <button type="button" onClick={() => { setCurrentPhoto(0); setTourOpen(true); }} className="col-span-2 row-span-2 relative overflow-hidden group cursor-pointer">
                                <img src={getPhotoUrl(photos[0])} alt={villa.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                            </button>
                            {/* 4 smaller photos */}
                            {[1, 2, 3, 4].map(i => (
                                <button key={i} type="button" onClick={() => { setCurrentPhoto(i); setTourOpen(true); }} className="relative overflow-hidden group cursor-pointer">
                                    {photos[i] ? (
                                        <>
                                            <img src={getPhotoUrl(photos[i])} alt="" className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-slate-100" />
                                    )}
                                    {/* "Lihat semua foto" badge on last visible */}
                                    {i === 4 && photos.length > 5 && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="text-white text-sm font-bold flex items-center gap-1.5">
                                                <Grid3X3 className="w-4 h-4" /> +{photos.length - 4} foto
                                            </span>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Mobile: carousel */}
                        <div className="sm:hidden relative h-64 rounded-2xl overflow-hidden">
                            <img src={getPhotoUrl(photos[currentPhoto])} alt={villa.name} className="w-full h-full object-cover" />
                            {photos.length > 1 && (
                                <>
                                    <button type="button" onClick={prevPhoto} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full cursor-pointer">
                                        <ChevronLeft className="w-4 h-4 text-slate-800" />
                                    </button>
                                    <button type="button" onClick={nextPhoto} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full cursor-pointer">
                                        <ChevronRight className="w-4 h-4 text-slate-800" />
                                    </button>
                                </>
                            )}
                            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full">
                                {currentPhoto + 1} / {photos.length}
                            </div>
                            <button type="button" onClick={() => setTourOpen(true)} className="absolute bottom-3 left-3 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer">
                                <Grid3X3 className="w-3 h-3" /> Semua foto
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="h-64 sm:h-[420px] rounded-2xl bg-slate-100 flex items-center justify-center">
                        <span className="text-slate-400">Tidak ada foto</span>
                    </div>
                )}
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 lg:py-12 pb-28 lg:pb-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Details */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-black text-slate-900 leading-[1.08] tracking-[-0.02em] mb-4 font-heading">{villa.name}</h1>
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] text-slate-500">
                                <span className="flex items-center gap-1.5 font-medium text-slate-700"><MapPin className="w-[18px] h-[18px] text-slate-400" />{villa.location}</span>
                                <span className="w-[3px] h-[3px] rounded-full bg-slate-300 hidden sm:block" />
                                <span className="flex items-center gap-1.5"><BedDouble className="w-[18px] h-[18px] text-slate-400" />{villa.bedrooms} Kamar Tidur</span>
                                <span className="w-[3px] h-[3px] rounded-full bg-slate-300 hidden sm:block" />
                                <span className="flex items-center gap-1.5"><Bath className="w-[18px] h-[18px] text-slate-400" />{villa.bathrooms} Kamar Mandi</span>
                                <span className="w-[3px] h-[3px] rounded-full bg-slate-300 hidden sm:block" />
                                <span className="flex items-center gap-1.5"><Users className="w-[18px] h-[18px] text-slate-400" />{villa.max_guests} Tamu</span>
                                <span className="w-[3px] h-[3px] rounded-full bg-slate-300 hidden sm:block" />
                                {ratingVal !== null ? (
                                    <span className="flex items-center gap-1.5"><Star className="w-[18px] h-[18px] fill-amber-400 text-amber-400" /><span className="font-semibold text-slate-800">{ratingVal.toFixed(1)}</span><span className="text-slate-400">({villa.reviews_count ?? 0} ulasan)</span></span>
                                ) : (
                                    <span className="flex items-center gap-1.5 text-slate-400">Belum ada ulasan</span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        {villa.description && (
                            <div>
                                <h2 className="text-xl font-black text-slate-900 mb-4 font-heading tracking-[-0.01em]">Tentang Villa</h2>
                                <p className="text-[15px] text-slate-600 leading-[1.75]">{villa.description}</p>
                            </div>
                        )}

                        {/* Amenities */}
                        {villa.amenities && villa.amenities.length > 0 && (
                            <div>
                                <h2 className="text-xl font-black text-slate-900 mb-5 font-heading tracking-[-0.01em]">Fasilitas</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
                                    {villa.amenities.map((a, i) => (
                                        <div key={i} className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
                                            <span className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                                                <Check className="w-3.5 h-3.5 text-green-600" />
                                            </span>
                                            {typeof a === 'string' ? a : a.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rules */}
                        {villa.rules && (
                            <div>
                                <h2 className="text-xl font-black text-slate-900 mb-4 font-heading tracking-[-0.01em]">Peraturan Villa</h2>
                                <p className="text-[15px] text-slate-600 leading-[1.75] whitespace-pre-line">{villa.rules}</p>
                            </div>
                        )}

                        {/* Check-in info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 p-5">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Check-in</p>
                                <p className="text-lg font-bold text-slate-900 tracking-tight">{villa.check_in_time}</p>
                            </div>
                            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 p-5">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Check-out</p>
                                <p className="text-lg font-bold text-slate-900 tracking-tight">{villa.check_out_time}</p>
                            </div>
                        </div>

                        {/* Map */}
                        {villa.maps_url && (
                            <div>
                                <h2 className="text-xl font-black text-slate-900 mb-4 font-heading tracking-[-0.01em]">Lokasi</h2>
                                <a href={villa.maps_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors">
                                    <span className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center"><MapPin className="w-4 h-4" /></span>
                                    Lihat di Google Maps
                                </a>
                            </div>
                        )}

                        {/* Reviews */}
                        {villa.reviews && villa.reviews.length > 0 && (
                            <div>
                                <h2 className="text-xl font-black text-slate-900 mb-5 font-heading tracking-[-0.01em]">Ulasan Tamu <span className="text-slate-400 font-bold">({villa.reviews_count ?? 0})</span></h2>
                                <div className="space-y-4">
                                    {villa.reviews.map((review) => (
                                        <div key={review.id} className="border border-slate-100 rounded-2xl p-5 hover:border-slate-200 transition-colors">
                                            <div className="flex items-center justify-between mb-2.5">
                                                <span className="font-bold text-sm text-slate-800">{review.guest_name}</span>
                                                <div className="flex items-center gap-0.5">
                                                    {Array.from({ length: review.rating }).map((_, i) => (
                                                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-[15px] text-slate-600 leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Booking Card (sticky) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-6">
                            <div className="mb-5">
                                <span className="text-3xl font-black text-slate-900 tracking-[-0.02em]">{formatPrice(villa.price_per_night)}</span>
                                <span className="text-slate-400 text-sm font-medium"> / malam</span>
                                {villa.weekend_price && villa.weekend_price !== villa.price_per_night && (
                                    <p className="text-xs text-slate-400 mt-1 font-medium">Weekend: <span className="font-semibold text-slate-600">{formatPrice(villa.weekend_price)}</span> / malam</p>
                                )}
                            </div>

                            <form onSubmit={handleBook} className="space-y-3">
                                {/* Date range block */}
                                <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-200">
                                    {/* Check-in row */}
                                    <div className="relative">
                                        <label className="absolute left-3.5 top-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">Check-in</label>
                                        <input
                                            ref={checkInRef}
                                            type="date"
                                            value={checkIn}
                                            onChange={e => setCheckIn(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full pt-7 pb-2.5 px-3.5 text-sm font-semibold text-slate-800 outline-none bg-white [color-scheme:light] [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:opacity-80"
                                        />
                                    </div>
                                    {/* Check-out row */}
                                    <div className="relative">
                                        <label className="absolute left-3.5 top-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">Check-out</label>
                                        <input
                                            ref={checkOutRef}
                                            type="date"
                                            value={checkOut}
                                            onChange={e => setCheckOut(e.target.value)}
                                            min={checkIn || new Date().toISOString().split('T')[0]}
                                            className="w-full pt-7 pb-2.5 px-3.5 text-sm font-semibold text-slate-800 outline-none bg-white [color-scheme:light] [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:hover:opacity-80"
                                        />
                                    </div>
                                    {/* Guest row */}
                                    <div className="flex items-center justify-between px-3.5 py-3">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tamu</p>
                                            <p className="text-sm font-semibold text-slate-800 mt-0.5">{guests} tamu</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button type="button" onClick={() => setGuests(g => Math.max(1, g - 1))} className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center hover:border-slate-400 transition-colors disabled:opacity-30 cursor-pointer" disabled={guests <= 1}>
                                                <Minus className="w-3.5 h-3.5 text-slate-600" />
                                            </button>
                                            <span className="w-5 text-center text-sm font-bold text-slate-800">{guests}</span>
                                            <button type="button" onClick={() => setGuests(g => Math.min(villa.max_guests, g + 1))} className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center hover:border-slate-400 transition-colors disabled:opacity-30 cursor-pointer" disabled={guests >= villa.max_guests}>
                                                <Plus className="w-3.5 h-3.5 text-slate-600" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Night price summary */}
                                {nights > 0 && (
                                    <div className="space-y-2 text-sm border-t border-slate-100 pt-3">
                                        <div className="flex justify-between text-slate-600">
                                            <span>{formatPrice(villa.price_per_night)} × {nights} malam</span>
                                            <span>{formatPrice(totalPrice)}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-slate-900 text-[15px] border-t border-slate-100 pt-2">
                                            <span>Total</span>
                                            <span>{formatPrice(totalPrice)}</span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-md shadow-blue-600/20 text-sm tracking-wide"
                                >
                                    Pesan Sekarang
                                </button>
                            </form>

                            {/* WhatsApp CTA */}
                            {settings?.settings_whatsapp && (
                                <a
                                    href={`https://wa.me/${settings.settings_whatsapp}?text=Halo, saya ingin menanyakan villa ${villa.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 w-full flex items-center justify-center gap-2 border border-green-500 text-green-600 font-semibold py-2.5 rounded-xl hover:bg-green-50 transition-colors text-sm"
                                >
                                    Tanya via WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Photo Tour Modal */}
            {tourOpen && photos.length > 0 && (
                <PhotoTourModal
                    photos={photos}
                    initialIndex={currentPhoto}
                    villaName={villa.name}
                    onClose={() => setTourOpen(false)}
                />
            )}

            {/* ── Mobile Sticky Bottom Bar ── */}
            <MobileBookingBar
                villa={villa}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                nights={nights}
                totalPrice={totalPrice}
                onOpenSheet={() => setBookingSheetOpen(true)}
                onBook={handleBook}
                formatDate={formatDate}
            />

            {/* ── Mobile Booking Sheet ── */}
            {bookingSheetOpen && (
                <MobileBookingSheet
                    villa={villa}
                    checkIn={checkIn}
                    checkOut={checkOut}
                    guests={guests}
                    nights={nights}
                    totalPrice={totalPrice}
                    setCheckIn={setCheckIn}
                    setCheckOut={setCheckOut}
                    setGuests={setGuests}
                    checkInRef={checkInRef}
                    checkOutRef={checkOutRef}
                    onClose={() => setBookingSheetOpen(false)}
                    onBook={handleBook}
                    formatDate={formatDate}
                    settings={settings}
                />
            )}
        </>
    );
}
