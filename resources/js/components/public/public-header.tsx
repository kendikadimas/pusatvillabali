import { Link, router, usePage } from '@inertiajs/react';
import { format, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, X, Search, User, LogOut } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import type { DateRange } from 'react-day-picker';
import AppLogoIcon from '@/components/app-logo-icon';
import { normaliseStorageUrl } from '@/lib/villaUtils';
import { logout } from '@/routes';
import type { AppSettings } from '@/types';
import 'react-day-picker/style.css';

interface PublicHeaderProps {
    headerSolid?: boolean;
    fixed?: boolean;
    showBackButton?: boolean;
    onBackClick?: () => void;
    children?: React.ReactNode;
}

function StepperRow({
    label,
    hint,
    value,
    min = 0,
    max = 16,
    onChange,
}: {
    label: string;
    hint?: string;
    value: number;
    min?: number;
    max?: number;
    onChange: (n: number) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-3 sm:gap-4 py-3.5 sm:py-4 border-b border-slate-100 last:border-0">
            <div className="min-w-0 pr-2">
                <p className="text-sm sm:text-[15px] font-medium text-slate-900">{label}</p>
                {hint && <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-snug">{hint}</p>}
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                <button
                    type="button"
                    disabled={value <= min}
                    onClick={() => onChange(Math.max(min, value - 1))}
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:border-slate-900 disabled:opacity-30 disabled:hover:border-slate-300 transition-colors text-lg leading-none touch-manipulation"
                    aria-label={`Kurangi ${label}`}
                >
                    −
                </button>
                <span className="w-6 text-center text-sm sm:text-[15px] font-medium text-slate-900 tabular-nums">{value}</span>
                <button
                    type="button"
                    disabled={value >= max}
                    onClick={() => onChange(Math.min(max, value + 1))}
                    className="w-9 h-9 sm:w-8 sm:h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700 hover:border-slate-900 disabled:opacity-30 disabled:hover:border-slate-300 transition-colors text-lg leading-none touch-manipulation"
                    aria-label={`Tambah ${label}`}
                >
                    +
                </button>
            </div>
        </div>
    );
}

export default function PublicHeader({
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
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [searchExpanded, setSearchExpanded] = useState(false);
    const [villaSearchOpen, setVillaSearchOpen] = useState(false);
    const [villaSearchQuery, setVillaSearchQuery] = useState('');
    const villaSearchRef = useRef<HTMLDivElement>(null);
    const villaSearchInputRef = useRef<HTMLInputElement>(null);
    const [activeSegment, setActiveSegment] = useState<'where' | 'dates' | 'bedrooms' | 'guests' | null>(null);
    const [searchWhere, setSearchWhere] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [searchBedrooms, setSearchBedrooms] = useState(0);
    const [searchAdults, setSearchAdults] = useState(2);
    const [searchChildren, setSearchChildren] = useState(0);
    const [searchInfants, setSearchInfants] = useState(0);
    const [searchPets, setSearchPets] = useState(0);
    const [destinations, setDestinations] = useState<Array<{ id: number; name: string; city: string; image: string }>>([]);
    const pillRef = useRef<HTMLDivElement>(null);
    const searchGuests = searchAdults + searchChildren;
    const appName = settings?.settings_prop_name ?? 'PusatVillaBali';
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';

    const searchCheckIn = dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : '';
    const searchCheckOut = dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : '';
    const positionClass = fixed ? 'fixed top-0 left-0 right-0' : 'sticky top-0';

    // Close expanded search on outside click (ignore clicks inside date/guest popovers)
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;

            if (pillRef.current?.contains(target)) {
                return;
            }

            // DayPicker portals / popover still under pillRef; also ignore if inside rdp
            if (target instanceof Element && target.closest('.rdp-root, .search-date-picker, [class*="rdp"]')) {
                return;
            }

            setSearchExpanded(false);
            setActiveSegment(null);
        };
        document.addEventListener('mousedown', handler);

        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setSearchExpanded(false);
                setActiveSegment(null);
            }
        };
        window.addEventListener('keydown', handler);

        return () => window.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        fetch('/api/v1/destinations')
            .then(r => r.json())
            .then(data => setDestinations(Array.isArray(data) ? data : (data.data ?? [])))
            .catch(() => {});
    }, []);

    // Close villa search on outside click
    useEffect(() => {
        if (!villaSearchOpen) {
return;
}

        const handler = (e: MouseEvent) => {
            if (villaSearchRef.current && !villaSearchRef.current.contains(e.target as Node)) {
                setVillaSearchOpen(false);
                setVillaSearchQuery('');
            }
        };
        document.addEventListener('mousedown', handler);

        return () => document.removeEventListener('mousedown', handler);
    }, [villaSearchOpen]);

    // Lock body scroll when mobile search sheet is open
    useEffect(() => {
        if (!mobileSearchOpen) {
            return;
        }

        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = prev;
        };
    }, [mobileSearchOpen]);

    const handleVillaSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!villaSearchQuery.trim()) {
return;
}

        router.get('/villas', { search: villaSearchQuery.trim() });
        setVillaSearchOpen(false);
        setVillaSearchQuery('');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params: Record<string, string> = {};

        if (searchWhere.trim()) {
params.search = searchWhere.trim();
}

        if (searchCheckIn) {
params.checkIn = searchCheckIn;
}

        if (searchCheckOut) {
params.checkOut = searchCheckOut;
}

        if (searchBedrooms > 0) {
params.bedrooms = String(searchBedrooms);
}

        if (searchGuests > 0) {
params.guests = String(searchGuests);
}

        router.get('/villas', params);
        setSearchExpanded(false);
        setActiveSegment(null);
        setMobileSearchOpen(false);
    };

    const segmentBase = 'relative flex flex-col justify-center px-6 py-3 cursor-pointer transition-colors rounded-full';
    const segmentActive = 'bg-white shadow-md';
    const segmentHover = 'hover:bg-slate-100';

    const dateLabel = dateRange?.from
        ? `${format(dateRange.from, 'd MMM', { locale: id })}${dateRange.to ? ` – ${format(dateRange.to, 'd MMM', { locale: id })}` : ''}`
        : 'Kapan saja';
    const bedroomsLabel = searchBedrooms > 0 ? `${searchBedrooms}+ kamar` : 'Kamar tidur';
    const guestsLabel = (() => {
        if (searchGuests <= 0 && searchInfants <= 0 && searchPets <= 0) {
return 'Tambahkan tamu';
}

        const parts: string[] = [];

        if (searchGuests > 0) {
parts.push(`${searchGuests} tamu`);
}

        if (searchInfants > 0) {
parts.push(`${searchInfants} bayi`);
}

        if (searchPets > 0) {
parts.push(`${searchPets} hewan`);
}

        return parts.join(', ');
    })();

    const filteredSuggestions = searchWhere.trim()
        ? destinations.filter(d => {
            const q = searchWhere.toLowerCase();

            return d.name?.toLowerCase().includes(q) || d.city?.toLowerCase().includes(q);
        })
        : destinations.slice(0, 8);
    const suggestionsTitle = searchWhere.trim() ? 'Hasil pencarian' : 'Destinasi populer';

    const selectDestination = (name: string) => {
        setSearchWhere(name);
        setActiveSegment('dates');
    };

    return (
        <header className={`${positionClass} z-50 bg-white border-b border-slate-100`}>
            {/* Overlay when search expanded */}
            {searchExpanded && (
                <div
                    className="fixed inset-0 bg-black/20 z-40"
                    onClick={() => {
 setSearchExpanded(false); setActiveSegment(null); 
}}
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
                            <AppLogoIcon className="w-7 h-7" />
                            <span className="font-heading font-bold text-slate-900 text-[16px] leading-tight hidden sm:block">
                                {appName}
                            </span>
                        </Link>
                    </div>

                    {/* ── CENTER: Search pill ── */}
                    <div ref={pillRef} className="flex-1 max-w-xl mx-auto hidden sm:block">
                        {/* Collapsed pill */}
                        {!searchExpanded ? (
                            <button
                                onClick={() => {
 setSearchExpanded(true); setActiveSegment('where'); 
}}
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
                                {/* Kamar */}
                                <div className="flex-1 flex items-center justify-center px-4 py-2.5 min-w-0">
                                    <span className="text-sm text-slate-500 truncate">{bedroomsLabel}</span>
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
                                className="flex items-stretch bg-white border border-slate-200 rounded-full shadow-xl"
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
                                        onKeyDown={e => {
 if (e.key === 'Enter') {
 e.preventDefault(); setActiveSegment('dates'); 
} 
}}
                                        placeholder="Cari destinasi"
                                        className="text-sm text-slate-700 outline-none bg-transparent w-full placeholder:text-slate-400 font-medium"
                                    />
                                    {/* Airbnb-style destination suggestions */}
                                    {activeSegment === 'where' && (
                                        <div
                                            className="absolute top-full left-0 mt-3 z-50 bg-white border border-slate-200 rounded-3xl shadow-2xl w-[min(420px,calc(100vw-2rem))] py-4"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <p className="px-6 pb-2 text-xs font-semibold text-slate-500 tracking-wide">
                                                {suggestionsTitle}
                                            </p>
                                            {filteredSuggestions.length > 0 ? (
                                                <div className="max-h-80 overflow-y-auto">
                                                    {filteredSuggestions.map(dest => (
                                                        <button
                                                            key={dest.id}
                                                            type="button"
                                                            onClick={() => selectDestination(dest.name)}
                                                            className="w-full flex items-center gap-4 px-4 py-2.5 mx-0 hover:bg-slate-50 transition-colors text-left rounded-xl"
                                                        >
                                                            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-100">
                                                                <img
                                                                    src={normaliseStorageUrl(dest.image)}
                                                                    alt={dest.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src =
                                                                            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200&q=80';
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <p className="text-[15px] font-medium text-slate-900 truncate">{dest.name}</p>
                                                                <p className="text-sm text-slate-500 truncate">
                                                                    {dest.city ? `Villa di ${dest.city}` : 'Destinasi di Bali'}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="px-6 py-6 text-sm text-slate-400">
                                                    Tidak ada destinasi yang cocok
                                                </p>
                                            )}
                                        </div>
                                    )}
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

                                    {/* Airbnb-style dual-month calendar */}
                                    {activeSegment === 'dates' && (
                                        <div
                                            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 w-[min(720px,calc(100vw-2rem))]"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <DayPicker
                                                mode="range"
                                                selected={dateRange}
                                                onSelect={(range) => {
                                                    // DayPicker may set from+to to the same day on first click.
                                                    // Keep the panel open until a real check-out day is chosen.
                                                    if (range?.from && range?.to && isSameDay(range.from, range.to)) {
                                                        setDateRange({ from: range.from, to: undefined });

                                                        return;
                                                    }

                                                    setDateRange(range);

                                                    if (range?.from && range?.to) {
                                                        setActiveSegment('bedrooms');
                                                    }
                                                }}
                                                numberOfMonths={2}
                                                locale={id}
                                                disabled={{ before: new Date() }}
                                                showOutsideDays={false}
                                                className="search-date-picker mx-auto"
                                                classNames={{
                                                    months: 'flex flex-col sm:flex-row gap-6 sm:gap-10',
                                                    month: 'space-y-4',
                                                    month_caption: 'flex justify-center items-center h-10 relative',
                                                    caption_label: 'text-[15px] font-semibold text-slate-900',
                                                    nav: 'absolute inset-x-0 top-0 flex items-center justify-between pointer-events-none',
                                                    button_previous: 'pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors',
                                                    button_next: 'pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors',
                                                    weekdays: 'flex',
                                                    weekday: 'w-10 text-center text-xs font-medium text-slate-400',
                                                    week: 'flex mt-1',
                                                    day: 'w-10 h-10 p-0 text-center text-sm relative',
                                                    day_button: 'w-10 h-10 rounded-full font-medium text-slate-800 hover:border hover:border-slate-900 transition-colors',
                                                    today: 'font-bold text-[#00A86B]',
                                                    selected: 'bg-[#00A86B] text-white hover:bg-[#00A86B]',
                                                    range_start: 'bg-[#00A86B] text-white rounded-full',
                                                    range_end: 'bg-[#00A86B] text-white rounded-full',
                                                    range_middle: 'bg-[#00A86B]/10 text-slate-800 rounded-none',
                                                    disabled: 'text-slate-300 opacity-50 pointer-events-none',
                                                    outside: 'invisible',
                                                    hidden: 'invisible',
                                                }}
                                            />
                                            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                                                <p className="text-sm text-slate-500">
                                                    {dateRange?.from
                                                        ? dateRange.to
                                                            ? `${format(dateRange.from, 'd MMM yyyy', { locale: id })} – ${format(dateRange.to, 'd MMM yyyy', { locale: id })}`
                                                            : `Check-in: ${format(dateRange.from, 'd MMM yyyy', { locale: id })}`
                                                        : 'Pilih tanggal check-in dan check-out'}
                                                </p>
                                                {dateRange?.from && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setDateRange(undefined)}
                                                        className="text-sm font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600"
                                                    >
                                                        Hapus tanggal
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <span className="w-px bg-slate-200 self-stretch my-3" />

                                {/* Kamar Tidur */}
                                <div
                                    className={`${segmentBase} flex-1 min-w-0 relative ${activeSegment === 'bedrooms' ? segmentActive : segmentHover}`}
                                    onClick={() => setActiveSegment('bedrooms')}
                                >
                                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wide mb-0.5">Kamar</span>
                                    <span className="text-sm text-slate-700 font-medium whitespace-nowrap truncate">{bedroomsLabel}</span>
                                    {activeSegment === 'bedrooms' && (
                                        <div
                                            className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-50 bg-white border border-slate-200 rounded-3xl shadow-2xl px-6 w-[min(360px,calc(100vw-2rem))]"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <StepperRow
                                                label="Kamar tidur"
                                                hint="Minimal jumlah kamar tidur"
                                                value={searchBedrooms}
                                                min={0}
                                                max={10}
                                                onChange={(n) => setSearchBedrooms(n)}
                                            />
                                            <div className="pb-4 flex justify-end">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveSegment('guests')}
                                                    className="text-sm font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600"
                                                >
                                                    Lanjut
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <span className="w-px bg-slate-200 self-stretch my-3" />

                                {/* Tamu + Search button */}
                                <div
                                    className={`${segmentBase} flex-1 min-w-0 flex-row items-center gap-2 pr-2 relative ${activeSegment === 'guests' ? segmentActive : segmentHover}`}
                                    onClick={() => setActiveSegment('guests')}
                                >
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wide mb-0.5 block">Tamu</span>
                                        <span className="text-sm text-slate-700 font-medium whitespace-nowrap truncate block">{guestsLabel}</span>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95"
                                        style={{ backgroundColor: '#00A86B' }}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        <Search className="w-4 h-4 text-white" strokeWidth={2.5} />
                                    </button>
                                    {activeSegment === 'guests' && (
                                        <div
                                            className="absolute top-full right-0 mt-3 z-50 bg-white border border-slate-200 rounded-3xl shadow-2xl px-6 w-[min(380px,calc(100vw-2rem))]"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <StepperRow
                                                label="Dewasa"
                                                hint="Umur 13+"
                                                value={searchAdults}
                                                min={1}
                                                max={16}
                                                onChange={setSearchAdults}
                                            />
                                            <StepperRow
                                                label="Anak-anak"
                                                hint="Umur 2–12"
                                                value={searchChildren}
                                                min={0}
                                                max={15}
                                                onChange={setSearchChildren}
                                            />
                                            <StepperRow
                                                label="Bayi"
                                                hint="Di bawah 2"
                                                value={searchInfants}
                                                min={0}
                                                max={5}
                                                onChange={setSearchInfants}
                                            />
                                            <StepperRow
                                                label="Hewan peliharaan"
                                                hint="Membawa hewan peliharaan?"
                                                value={searchPets}
                                                min={0}
                                                max={5}
                                                onChange={setSearchPets}
                                            />
                                        </div>
                                    )}
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
                        {/* Villa name quick-search */}
                        <div ref={villaSearchRef} className="relative">
                            {villaSearchOpen ? (
                                <form onSubmit={handleVillaSearch} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
                                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <input
                                        ref={villaSearchInputRef}
                                        type="text"
                                        value={villaSearchQuery}
                                        onChange={e => setVillaSearchQuery(e.target.value)}
                                        placeholder="Cari nama villa..."
                                        className="w-44 text-sm text-slate-800 placeholder:text-slate-400 bg-transparent outline-none"
                                        autoFocus
                                    />
                                    {villaSearchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setVillaSearchQuery('')}
                                            className="text-slate-400 hover:text-slate-600"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </form>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setVillaSearchOpen(true);
                                        setTimeout(() => villaSearchInputRef.current?.focus(), 50);
                                    }}
                                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors px-2 py-1.5 rounded-full hover:bg-slate-100"
                                >
                                    <Search className="w-3.5 h-3.5" />
                                    <span>Cari villa</span>
                                </button>
                            )}
                        </div>
                        {auth?.user ? (
                            <div className="relative group">
                                <button
                                    className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-100 transition-colors"
                                    title="Profil Saya"
                                >
                                    {auth.user.avatar ? (
                                        <img
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                            className="w-8 h-8 rounded-full object-cover border-2 border-slate-200"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                            <User className="w-4 h-4 text-slate-600" />
                                        </div>
                                    )}
                                    <span className="text-sm font-medium text-slate-700 hidden lg:block">
                                        {auth.user.name}
                                    </span>
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        Profil Saya
                                    </Link>
                                    <Link
                                        href={logout()}
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Keluar
                                    </Link>
                                </div>
                            </div>
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
                        type="button"
                        onClick={() => setMobileSearchOpen(true)}
                        className="w-full flex items-center gap-3 border border-slate-200 rounded-full px-4 py-2.5 shadow-sm bg-white active:scale-[0.99] transition-transform"
                    >
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: '#00A86B' }}
                        >
                            <Search className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col items-start min-w-0 flex-1">
                            <span className="text-sm font-semibold text-slate-800 leading-tight truncate w-full text-left">
                                {searchWhere.trim() ? searchWhere.trim() : 'Ke mana saja'}
                            </span>
                            <span className="text-xs text-slate-400 leading-tight truncate w-full text-left">
                                {dateLabel} · {bedroomsLabel} · {guestsLabel}
                            </span>
                        </div>
                    </button>
                </div>

                {/* Mobile Search Sheet */}
                {mobileSearchOpen && (
                    <>
                        <div
                            className="fixed inset-0 bg-black/50 z-[70] sm:hidden"
                            onClick={() => setMobileSearchOpen(false)}
                        />
                        <div
                            className="fixed inset-x-0 bottom-0 z-[80] bg-white rounded-t-3xl shadow-2xl flex flex-col sm:hidden"
                            style={{ maxHeight: 'min(94dvh, 100%)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
                            role="dialog"
                            aria-modal="true"
                            aria-label="Cari villa"
                        >
                            <div className="flex justify-center pt-3 pb-1 shrink-0">
                                <div className="w-10 h-1 rounded-full bg-slate-200" />
                            </div>
                            <div className="flex items-center justify-between px-4 pb-3 pt-1 border-b border-slate-100 shrink-0">
                                <h3 className="text-base font-black text-slate-900">Cari Villa</h3>
                                <button
                                    type="button"
                                    onClick={() => setMobileSearchOpen(false)}
                                    className="p-2.5 -mr-1 rounded-full hover:bg-slate-100 transition-colors touch-manipulation"
                                    aria-label="Tutup"
                                >
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            <form
                                onSubmit={(e) => {
 handleSearch(e); setMobileSearchOpen(false); 
}}
                                className="flex flex-col flex-1 min-h-0"
                            >
                                <div className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-3 space-y-4">
                                    {/* Where */}
                                    <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Ke mana</label>
                                        <div className="flex items-center gap-2 rounded-xl px-3 py-2.5 bg-slate-50 border border-slate-100">
                                            <Search className="w-4 h-4 text-slate-400 shrink-0" />
                                            <input
                                                type="text"
                                                placeholder="Canggu, Seminyak, Ubud..."
                                                value={searchWhere}
                                                onChange={(e) => setSearchWhere(e.target.value)}
                                                className="flex-1 min-w-0 text-sm outline-none bg-transparent text-slate-700 placeholder:text-slate-400"
                                                autoFocus
                                            />
                                            {searchWhere && (
                                                <button type="button" onClick={() => setSearchWhere('')} className="shrink-0 p-1 touch-manipulation" aria-label="Hapus lokasi">
                                                    <X className="w-4 h-4 text-slate-400" />
                                                </button>
                                            )}
                                        </div>
                                        {filteredSuggestions.length > 0 && (
                                            <div className="mt-3 max-h-48 overflow-y-auto overscroll-contain -mx-1">
                                                <p className="px-1 pb-1.5 text-xs font-semibold text-slate-500 sticky top-0 bg-white">
                                                    {suggestionsTitle}
                                                </p>
                                                {filteredSuggestions.map(dest => (
                                                    <button
                                                        key={dest.id}
                                                        type="button"
                                                        onClick={() => setSearchWhere(dest.name)}
                                                        className="w-full flex items-center gap-3 px-1 py-2 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left rounded-xl touch-manipulation"
                                                    >
                                                        <div className="w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                                                            <img
                                                                src={normaliseStorageUrl(dest.image)}
                                                                alt={dest.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src =
                                                                        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200&q=80';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-slate-900 truncate">{dest.name}</p>
                                                            <p className="text-xs text-slate-500 truncate">
                                                                {dest.city ? `Villa di ${dest.city}` : 'Destinasi di Bali'}
                                                            </p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </section>

                                    {/* Dates */}
                                    <section className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tanggal</label>
                                            {dateRange?.from && (
                                                <button
                                                    type="button"
                                                    onClick={() => setDateRange(undefined)}
                                                    className="text-xs font-semibold text-slate-600 underline underline-offset-2 touch-manipulation"
                                                >
                                                    Hapus
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-sm font-medium text-slate-800 mb-2">
                                            {dateRange?.from
                                                ? dateRange.to
                                                    ? `${format(dateRange.from, 'd MMM', { locale: id })} – ${format(dateRange.to, 'd MMM', { locale: id })}`
                                                    : `Check-in: ${format(dateRange.from, 'd MMM', { locale: id })}`
                                                : 'Pilih check-in & check-out'}
                                        </p>
                                        <div className="flex justify-center overflow-x-auto -mx-1">
                                            <DayPicker
                                                mode="range"
                                                selected={dateRange}
                                                onSelect={setDateRange}
                                                disabled={{ before: new Date() }}
                                                numberOfMonths={1}
                                                locale={id}
                                                showOutsideDays={false}
                                                className="mx-auto"
                                                classNames={{
                                                    month_caption: 'flex justify-center items-center h-9',
                                                    caption_label: 'text-sm font-semibold text-slate-900',
                                                    nav: 'absolute inset-x-0 top-0 flex items-center justify-between pointer-events-none px-1',
                                                    button_previous: 'pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100',
                                                    button_next: 'pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100',
                                                    weekday: 'w-9 text-center text-[11px] font-medium text-slate-400',
                                                    day: 'w-9 h-9 p-0 text-center text-sm',
                                                    day_button: 'w-9 h-9 rounded-full font-medium hover:border hover:border-slate-900 touch-manipulation',
                                                    today: 'font-bold text-[#00A86B]',
                                                    selected: 'bg-[#00A86B] text-white',
                                                    range_start: 'bg-[#00A86B] text-white rounded-full',
                                                    range_end: 'bg-[#00A86B] text-white rounded-full',
                                                    range_middle: 'bg-[#00A86B]/10 text-slate-800 rounded-none',
                                                    disabled: 'text-slate-300 opacity-50',
                                                }}
                                            />
                                        </div>
                                    </section>

                                    {/* Bedrooms */}
                                    <section className="rounded-2xl border border-slate-200 bg-white px-3.5 shadow-sm">
                                        <div className="pt-3.5 pb-0">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Kamar tidur</label>
                                        </div>
                                        <StepperRow
                                            label="Jumlah kamar"
                                            hint="Minimal kamar tidur"
                                            value={searchBedrooms}
                                            min={0}
                                            max={10}
                                            onChange={setSearchBedrooms}
                                        />
                                    </section>

                                    {/* Guests */}
                                    <section className="rounded-2xl border border-slate-200 bg-white px-3.5 shadow-sm">
                                        <div className="pt-3.5 pb-0">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Tamu</label>
                                        </div>
                                        <StepperRow
                                            label="Dewasa"
                                            hint="Umur 13+"
                                            value={searchAdults}
                                            min={1}
                                            max={16}
                                            onChange={setSearchAdults}
                                        />
                                        <StepperRow
                                            label="Anak-anak"
                                            hint="Umur 2–12"
                                            value={searchChildren}
                                            min={0}
                                            max={15}
                                            onChange={setSearchChildren}
                                        />
                                        <StepperRow
                                            label="Bayi"
                                            hint="Di bawah 2"
                                            value={searchInfants}
                                            min={0}
                                            max={5}
                                            onChange={setSearchInfants}
                                        />
                                        <StepperRow
                                            label="Hewan peliharaan"
                                            hint="Membawa hewan?"
                                            value={searchPets}
                                            min={0}
                                            max={5}
                                            onChange={setSearchPets}
                                        />
                                    </section>
                                </div>

                                <div className="shrink-0 border-t border-slate-100 px-4 pt-3 pb-4 bg-white">
                                    <button
                                        type="submit"
                                        className="w-full py-3.5 rounded-2xl text-white text-sm font-bold transition-transform active:scale-[0.98] touch-manipulation shadow-md"
                                        style={{ backgroundColor: '#00A86B' }}
                                    >
                                        Cari Villa
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
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
                                <>
                                    <Link href="/profile" onClick={() => setMobileOpen(false)}
                                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold">
                                        {auth.user.avatar ? (
                                            <img
                                                src={auth.user.avatar}
                                                alt={auth.user.name}
                                                className="w-6 h-6 rounded-full object-cover"
                                            />
                                        ) : (
                                            <User className="w-4 h-4" />
                                        )}
                                        {auth.user.name}
                                    </Link>
                                    <Link
                                        href={logout()}
                                        method="post"
                                        as="button"
                                        onClick={() => setMobileOpen(false)}
                                        className="flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors w-full"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Keluar
                                    </Link>
                                </>
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
