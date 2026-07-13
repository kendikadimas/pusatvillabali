import React, { useState, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronLeft, X, Search, User } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { id } from 'date-fns/locale';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import type { AppSettings } from '@/types';
import 'react-day-picker/style.css';

interface PublicHeaderProps {
    headerSolid?: boolean;
    fixed?: boolean;
    showBackButton?: boolean;
    onBackClick?: () => void;
    children?: React.ReactNode;
}

export default function PublicHeader({
    headerSolid = true,
    fixed = false,
    showBackButton = false,
    onBackClick,
    children,
}: PublicHeaderProps) {
    const { auth, settings } = usePage<{
        auth: { user: { name: string } | null };
        settings: AppSettings;
    }>().props;

    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [activeSegment, setActiveSegment] = useState<'where' | 'dates' | 'guests' | null>(null);
    const [searchWhere, setSearchWhere] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [searchGuests, setSearchGuests] = useState(2);
    const pillRef = useRef<HTMLDivElement>(null);
    const appName = settings?.settings_prop_name ?? 'PusatVilla.id';
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';
    const isHome = currentUrl === '/';

    const searchCheckIn = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : '';
    const searchCheckOut = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : '';
    const positionClass = fixed ? 'fixed top-0 left-0 right-0' : 'sticky top-0';

    // Close expanded search on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
                setSearchExpanded(false);
                setActiveSegment(null);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') { setSearchExpanded(false); setActiveSegment(null); }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};
        if (searchWhere.trim()) params.search = searchWhere.trim();
        if (searchCheckIn) params.checkIn = searchCheckIn;
        if (searchCheckOut) params.checkOut = searchCheckOut;
        if (searchGuests > 0) params.guests = String(searchGuests);
        router.get('/villas', params);
        setSearchExpanded(false);
        setActiveSegment(null);
    };

    const segmentBase = 'relative flex flex-col justify-center px-6 py-3 cursor-pointer transition-colors rounded-full';
    const segmentActive = 'bg-white shadow-md';
    const segmentHover = 'hover:bg-slate-100';

    const whereLabel = searchWhere || 'Ke mana saja';
    const checkInLabel = dateRange?.from
        ? format(dateRange.from, 'd MMM', { locale: id })
        : 'Check-in';
    const checkOutLabel = dateRange?.to
        ? format(dateRange.to, 'd MMM', { locale: id })
        : 'Check-out';
    const dateLabel = dateRange?.from
        ? `${format(dateRange.from, 'd MMM', { locale: id })}${dateRange.to ? ` – ${format(dateRange.to, 'd MMM', { locale: id })}` : ''}`
        : 'Kapan saja';
    const guestsLabel = searchGuests > 0 ? `${searchGuests} Tamu` : 'Tambahkan tamu';

    return (
        <header className={`${positionClass} z-50 bg-white border-b border-slate-100`}>
            {/* Overlay when search expanded */}
            {searchExpanded && (
                <div
                    className="fixed inset-0 bg-black/20 z-40"
                    onClick={() => { setSearchExpanded(false); setActiveSegment(null); }}
                />
            )}

            <div className="relative z-50 max-w-[1400px] mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

                    {/* ── LEFT: Logo ── */}
                    <div className="flex items-center gap-3 shrink-0">
                        {showBackButton && (
                            <button
                                onClick={onBackClick}
                                className="p-2 rounded-full hover:bg-slate-100 transition-colors mr-1"
                            >
                                <ChevronLeft className="w-5 h-5 text-slate-700" />
                            </button>
                        )}
                        <Link href="/" className="flex items-center gap-2 group">
                            <svg viewBox="0 0 32 32" fill="currentColor" className="w-7 h-7 text-[#00A86B]">
                                <path d="M16 1c-2.008 0-3.92.518-5.59 1.432A15.011 15.011 0 0 0 .91 18.066c1.196 4.398 4.73 7.828 9.098 9.098C11.954 27.674 13.914 28 16 28c2.086 0 4.046-.326 5.992-.836 4.368-1.27 7.902-4.7 9.098-9.098A15.01 15.01 0 0 0 16 1zm0 25c-1.748 0-3.388-.274-5.012-.702A12.012 12.012 0 0 1 3.702 11.23C4.898 6.832 8.432 3.4 12.8 2.13A12.01 12.01 0 0 1 16 2a11.983 11.983 0 0 1 12.298 9.23c1.196 4.398-2.336 7.828-6.702 9.098C19.966 25.666 18.066 26 16 26z"/>
                                <path d="M16 7.5L7.5 14.5h3.5v9h10v-9h3.5zM18 21.5h-4v-7.5h4z"/>
                            </svg>
                            <span className="font-black italic text-slate-900 text-[15px] leading-tight hidden sm:block">
                                {appName}
                            </span>
                        </Link>
                    </div>

                    {/* ── CENTER: Search pill ── */}
                    <div ref={pillRef} className="flex-1 max-w-xl mx-auto hidden sm:block">
                        {/* Collapsed pill */}
                        {!searchExpanded ? (
                            <button
                                onClick={() => { setSearchExpanded(true); setActiveSegment('where'); }}
                                className="w-full flex items-center border border-slate-200 rounded-full shadow-sm hover:shadow-md transition-shadow bg-white group overflow-hidden"
                            >
                                {/* Ke mana saja */}
                                <div className="flex-1 flex items-center justify-center px-4 py-2.5 min-w-0">
                                    <span className="text-sm font-semibold text-slate-800 truncate">
                                        {searchWhere || 'Ke mana saja'}
                                    </span>
                                </div>
                                <span className="w-px h-4 bg-slate-200 shrink-0" />
                                {/* Tanggal */}
                                <div className="flex-1 flex items-center justify-center px-4 py-2.5 min-w-0">
                                    <span className="text-sm text-slate-500 truncate">{dateLabel}</span>
                                </div>
                                <span className="w-px h-4 bg-slate-200 shrink-0" />
                                {/* Tamu */}
                                <div className="flex-1 flex items-center justify-center px-4 py-2.5 min-w-0">
                                    <span className="text-sm text-slate-500 truncate">{guestsLabel}</span>
                                </div>
                                {/* Search icon */}
                                <div className="px-2 pr-2">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: '#00A86B' }}
                                    >
                                        <Search className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                                    </div>
                                </div>
                            </button>
                        ) : (
                            /* Expanded pill */
                            <form
                                onSubmit={handleSearch}
                                className="flex items-stretch bg-white border border-slate-200 rounded-full shadow-xl overflow-hidden"
                                style={{ minHeight: '56px' }}
                            >
                                {/* Ke mana saja */}
                                <div
                                    className={`${segmentBase} flex-1 min-w-0 ${activeSegment === 'where' ? segmentActive : segmentHover}`}
                                    onClick={() => setActiveSegment('where')}
                                >
                                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wide mb-0.5">Ke mana</span>
                                    <input
                                        autoFocus={activeSegment === 'where'}
                                        type="text"
                                        value={searchWhere}
                                        onChange={e => setSearchWhere(e.target.value)}
                                        placeholder="Cari destinasi"
                                        className="text-sm text-slate-700 outline-none bg-transparent w-full placeholder:text-slate-400 font-medium"
                                    />
                                </div>

                                <span className="w-px bg-slate-200 self-stretch my-3" />

                                {/* Tanggal — range picker */}
                                <div
                                    className={`${segmentBase} flex-1 min-w-0 relative ${activeSegment === 'dates' ? segmentActive : segmentHover}`}
                                    onClick={() => setActiveSegment('dates')}
                                >
                                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wide mb-0.5">Tanggal</span>
                                    <span className="text-sm text-slate-700 font-medium whitespace-nowrap">
                                        {dateLabel}
                                    </span>

                                    {/* DayPicker dropdown */}
                                    {activeSegment === 'dates' && (
                                        <div
                                            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 max-w-[calc(100vw-2rem)] overflow-x-hidden"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <DayPicker
                                                mode="range"
                                                selected={dateRange}
                                                onSelect={(range) => {
                                                    setDateRange(range);
                                                    if (range?.from && range?.to) {
                                                        setActiveSegment('guests');
                                                    }
                                                }}
                                                numberOfMonths={typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 2}
                                                locale={id}
                                                disabled={{ before: new Date() }}
                                                showOutsideDays={false}
                                                classNames={{
                                                    today: 'font-bold text-[#00A86B]',
                                                    selected: 'bg-[#00A86B] text-white rounded-full',
                                                    range_start: 'bg-[#00A86B] text-white rounded-full',
                                                    range_end: 'bg-[#00A86B] text-white rounded-full',
                                                    range_middle: 'bg-[#00A86B]/10 text-slate-800 rounded-none',
                                                }}
                                            />
                                            {dateRange?.from && (
                                                <div className="flex justify-end px-2 pb-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => setDateRange(undefined)}
                                                        className="text-xs text-slate-500 hover:text-slate-700 underline"
                                                    >
                                                        Reset tanggal
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <span className="w-px bg-slate-200 self-stretch my-3" />

                                {/* Tamu + Search button */}
                                <div
                                    className={`${segmentBase} flex-1 min-w-0 flex-row items-center gap-2 pr-2 ${activeSegment === 'guests' ? segmentActive : segmentHover}`}
                                    onClick={() => setActiveSegment('guests')}
                                >
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wide mb-0.5 block">Tamu</span>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={e => { e.stopPropagation(); setSearchGuests(g => Math.max(1, g - 1)); }}
                                                className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-500 text-xs font-bold"
                                            >−</button>
                                            <span className="text-sm font-semibold text-slate-800 w-4 text-center">{searchGuests}</span>
                                            <button
                                                type="button"
                                                onClick={e => { e.stopPropagation(); setSearchGuests(g => Math.min(20, g + 1)); }}
                                                className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 hover:border-slate-500 text-xs font-bold"
                                            >+</button>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95"
                                        style={{ backgroundColor: '#00A86B' }}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <Search className="w-4 h-4 text-white" strokeWidth={2.5} />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* ── RIGHT: Nav + Hamburger ── */}
                    <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label="Buka menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="hidden md:flex items-center gap-2 shrink-0">
                        {auth?.user ? (
                            <Link
                                href="/profile"
                                className="text-xs font-bold px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-700 transition-colors active:scale-95"
                            >
                                Profil Saya
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/register"
                                    className="text-xs font-semibold px-4 py-2 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors active:scale-95"
                                >
                                    Daftar
                                </Link>
                                <Link
                                    href="/login"
                                    className="text-xs font-bold px-4 py-2 rounded-full text-white transition-colors active:scale-95"
                                    style={{ backgroundColor: '#00A86B' }}
                                >
                                    Masuk
                                </Link>
                            </>
                        )}
                    </div>
                    </div>
                </div>

                {/* Mobile search bar (below header row) */}
                <div className="sm:hidden pb-3">
                    <button
                        onClick={() => router.get('/villas')}
                        className="w-full flex items-center gap-3 border border-slate-200 rounded-full px-4 py-2.5 shadow-sm bg-white"
                    >
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: '#00A86B' }}
                        >
                            <Search className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col items-start min-w-0">
                            <span className="text-sm font-semibold text-slate-800 leading-tight">Ke mana saja</span>
                            <span className="text-xs text-slate-400 leading-tight">Kapan saja · Berapa saja tamu</span>
                        </div>
                    </button>
                </div>
            </div>

            {/* ── Mobile drawer ── */}
            {mobileOpen && (
                <div className="fixed inset-0 z-[60] flex">
                    <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
                    <div className="relative ml-auto w-72 max-w-full h-full bg-white shadow-2xl flex flex-col">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <span className="font-bold text-slate-900">{appName}</span>
                            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-slate-100">
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>
                        <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
                            <Link href="/" onClick={() => setMobileOpen(false)}
                                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${currentUrl === '/' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                                Beranda
                            </Link>
                            <Link href="/villas" onClick={() => setMobileOpen(false)}
                                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${currentUrl === '/villas' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                                Daftar Villa
                            </Link>
                            <Link href="/wishlist" onClick={() => setMobileOpen(false)}
                                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${currentUrl === '/wishlist' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                                Wishlist
                            </Link>
                            <Link href="/booking/status" onClick={() => setMobileOpen(false)}
                                className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${currentUrl === '/booking/status' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                                Cek Status Booking
                            </Link>
                        </nav>
                        <div className="px-4 py-5 border-t border-slate-100 flex flex-col gap-2">
                            {auth?.user ? (
                                <Link href="/profile" onClick={() => setMobileOpen(false)}
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold">
                                    <User className="w-4 h-4" />
                                    Profil Saya
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setMobileOpen(false)}
                                        className="flex-1 text-center py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                                        Masuk
                                    </Link>
                                    <Link href="/register" onClick={() => setMobileOpen(false)}
                                        className="flex-1 text-center py-3 rounded-xl text-white text-sm font-bold transition-colors"
                                        style={{ backgroundColor: '#00A86B' }}>
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {children}
        </header>
    );
}
