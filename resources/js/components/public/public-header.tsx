import React, { useState, useRef, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronLeft, Menu, X, Search, Heart } from 'lucide-react';
import type { AppSettings } from '@/types';

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
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchVal, setSearchVal] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';

    const appName = settings?.settings_prop_name ?? 'PusatVillaBali';

    const positionClass = fixed ? 'fixed top-0 left-0 right-0' : 'sticky top-0';

    const navLinks = [
        { href: '/', label: 'Beranda' },
        { href: '/villas', label: 'Villa' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchVal.trim()) {
            router.get('/villas', { search: searchVal.trim() });
            setSearchOpen(false);
            setSearchVal('');
        }
    };

    // Focus search input when opened
    useEffect(() => {
        if (searchOpen) searchInputRef.current?.focus();
    }, [searchOpen]);

    // Close search on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const bg = headerSolid ? 'bg-white border-b border-slate-100' : 'bg-transparent';
    const logoText = headerSolid ? 'text-slate-900' : 'text-white';
    const navText = headerSolid ? 'text-slate-500' : 'text-white/75';
    const navActive = headerSolid ? 'text-slate-900 font-semibold' : 'text-white font-semibold';
    const navHover = headerSolid ? 'hover:text-slate-900' : 'hover:text-white';
    const iconColor = headerSolid ? 'text-slate-500 hover:text-slate-900' : 'text-white/75 hover:text-white';
    const iconBg = headerSolid ? 'hover:bg-slate-100' : 'hover:bg-white/10';

    return (
        <header className={`${positionClass} z-50 ${bg} backdrop-blur-md`}>
            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
                <div className="flex items-center justify-between h-[64px] sm:h-[68px]">

                    {/* ── Left ── */}
                    <div className="flex items-center gap-6 lg:gap-8">
                        {showBackButton ? (
                            <button onClick={onBackClick} className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${navText} ${navHover}`}>
                                <ChevronLeft className="w-4 h-4" />
                                Kembali
                            </button>
                        ) : (
                            <Link href="/" className="flex items-center gap-2 shrink-0 group">
                                {/* Logo icon — villa joglo + Bali motif */}
                                <svg
                                    width="34" height="34" viewBox="0 0 200 200" fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="shrink-0 transition-opacity group-hover:opacity-80"
                                    aria-hidden="true"
                                >
                                    {/* Background circle */}
                                    <circle cx="100" cy="100" r="96" fill={headerSolid ? '#15803d' : 'rgba(255,255,255,0.15)'}/>
                                    {/* Bottom/widest roof */}
                                    <polygon points="28,120 172,120 156,100 44,100" fill={headerSolid ? '#f0fdf4' : 'white'}/>
                                    {/* Middle roof */}
                                    <polygon points="50,100 150,100 137,82 63,82" fill={headerSolid ? '#bbf7d0' : 'rgba(255,255,255,0.8)'}/>
                                    {/* Top roof */}
                                    <polygon points="70,82 130,82 122,66 78,66" fill={headerSolid ? '#f0fdf4' : 'white'}/>
                                    {/* Villa walls */}
                                    <rect x="70" y="120" width="60" height="34" fill={headerSolid ? '#f0fdf4' : 'white'}/>
                                    {/* Door arch */}
                                    <path d="M90,154 L90,135 Q100,127 110,135 L110,154 Z" fill={headerSolid ? '#15803d' : '#166534'}/>
                                    {/* Window left */}
                                    <rect x="75" y="126" width="10" height="9" rx="1.5" fill={headerSolid ? '#86efac' : '#166534'}/>
                                    {/* Window right */}
                                    <rect x="115" y="126" width="10" height="9" rx="1.5" fill={headerSolid ? '#86efac' : '#166534'}/>
                                    {/* Ground */}
                                    <line x1="52" y1="154" x2="148" y2="154" stroke={headerSolid ? '#86efac' : 'rgba(255,255,255,0.5)'} strokeWidth="2.5" strokeLinecap="round"/>
                                    {/* Palm left */}
                                    <path d="M52,154 Q40,132 28,122" stroke={headerSolid ? '#4ade80' : 'rgba(255,255,255,0.6)'} strokeWidth="3" strokeLinecap="round" fill="none"/>
                                    <path d="M52,154 Q36,140 26,140" stroke={headerSolid ? '#4ade80' : 'rgba(255,255,255,0.5)'} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                                    {/* Palm right */}
                                    <path d="M148,154 Q160,132 172,122" stroke={headerSolid ? '#4ade80' : 'rgba(255,255,255,0.6)'} strokeWidth="3" strokeLinecap="round" fill="none"/>
                                    <path d="M148,154 Q164,140 174,140" stroke={headerSolid ? '#4ade80' : 'rgba(255,255,255,0.5)'} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                                    {/* Sun/star motif */}
                                    <circle cx="100" cy="46" r="5" fill={headerSolid ? '#86efac' : 'rgba(255,255,255,0.7)'}/>
                                    <line x1="100" y1="34" x2="100" y2="31" stroke={headerSolid ? '#86efac' : 'rgba(255,255,255,0.7)'} strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="100" y1="58" x2="100" y2="61" stroke={headerSolid ? '#86efac' : 'rgba(255,255,255,0.7)'} strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="88" y1="46" x2="85" y2="46" stroke={headerSolid ? '#86efac' : 'rgba(255,255,255,0.7)'} strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="112" y1="46" x2="115" y2="46" stroke={headerSolid ? '#86efac' : 'rgba(255,255,255,0.7)'} strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="92" y1="38" x2="90" y2="36" stroke={headerSolid ? '#86efac' : 'rgba(255,255,255,0.7)'} strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="108" y1="54" x2="110" y2="56" stroke={headerSolid ? '#86efac' : 'rgba(255,255,255,0.7)'} strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="108" y1="38" x2="110" y2="36" stroke={headerSolid ? '#86efac' : 'rgba(255,255,255,0.7)'} strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="92" y1="54" x2="90" y2="56" stroke={headerSolid ? '#86efac' : 'rgba(255,255,255,0.7)'} strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                {/* Wordmark — desktop only */}
                                <div className="hidden sm:flex items-baseline">
                                    <span className={`text-[19px] italic font-bold font-heading leading-none ${headerSolid ? 'text-green-700' : 'text-white'}`}>
                                        PusatVillaBali
                                    </span>
                                </div>
                            </Link>
                        )}

                        {/* Nav links */}
                        {!showBackButton && (
                            <nav className="hidden md:flex items-center gap-1">
                                {navLinks.map(link => {
                                    const isActive = link.href === '/' ? currentUrl === '/' : currentUrl.startsWith(link.href);
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`px-3.5 py-2 rounded-lg text-[13.5px] transition-colors ${isActive ? navActive : `${navText} ${navHover} ${iconBg}`}`}
                                        >
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                        )}
                    </div>

                    {children}

                    {/* ── Right ── */}
                    <div className="flex items-center gap-1.5">

                        {/* Wishlist icon */}
                        <Link
                            href="/wishlist"
                            className={`hidden sm:flex items-center p-2.5 rounded-xl transition-colors ${currentUrl === '/wishlist' ? (headerSolid ? 'text-green-700 bg-green-50' : 'text-white') : `${iconColor} ${iconBg}`}`}
                            title="Wishlist"
                        >
                            <Heart className={`w-4.5 h-4.5 ${currentUrl === '/wishlist' ? 'fill-current' : ''}`} />
                        </Link>

                        {/* Search — desktop: expand on click, mobile: always visible inline */}
                        {searchOpen ? (
                            <form onSubmit={handleSearch} className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 w-44 sm:w-56 transition-all">
                                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchVal}
                                    onChange={e => setSearchVal(e.target.value)}
                                    placeholder="Cari villa..."
                                    className="flex-1 text-sm text-slate-800 outline-none bg-transparent placeholder:text-slate-400 min-w-0"
                                />
                                <button type="button" onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setSearchOpen(true)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${navText} ${iconBg}`}
                            >
                                <Search className="w-4 h-4" />
                                <span className="hidden lg:inline">Cari Villa</span>
                            </button>
                        )}

                        {/* WhatsApp */}
                        {settings?.settings_whatsapp && (
                            <a
                                href={`https://wa.me/${settings.settings_whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all ${navText} ${iconBg}`}
                                title="Hubungi via WhatsApp"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                <span className="hidden lg:inline">WhatsApp</span>
                            </a>
                        )}

                        {/* Divider */}
                        {!auth?.user && <div className={`hidden sm:block w-px h-5 mx-1 ${headerSolid ? 'bg-slate-200' : 'bg-white/20'}`} />}

                        {/* Auth */}
                        <div className="hidden sm:flex items-center gap-1.5">
                            {auth?.user ? (
                                <Link href="/profile" className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all ${navText} ${iconBg}`}>
                                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden lg:inline">{auth.user.name.split(' ')[0]}</span>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className={`px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all ${navText} ${iconBg}`}>
                                        Masuk
                                    </Link>
                                    <Link href="/register" className="px-4 py-2 rounded-xl text-[13px] font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all active:scale-95">
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mobile toggle */}
                        <button
                            onClick={() => setMobileOpen(o => !o)}
                            aria-label="Menu"
                            className={`sm:hidden p-2.5 rounded-xl transition-colors cursor-pointer ${iconColor} ${iconBg}`}
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile menu ── */}
            {mobileOpen && (
                <div className="sm:hidden bg-white border-t border-slate-100 shadow-lg">

                    <div className="px-5 pb-3 space-y-0.5">
                        {navLinks.map(link => {
                            const isActive = link.href === '/' ? currentUrl === '/' : currentUrl.startsWith(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center justify-between px-3 py-3 rounded-xl text-[15px] transition-colors ${isActive ? 'bg-green-50 text-green-700 font-semibold' : 'text-slate-700 hover:bg-slate-50 font-medium'}`}
                                >
                                    {link.label}
                                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-green-600" />}
                                </Link>
                            );
                        })}
                        {/* Wishlist di mobile menu */}
                        <Link
                            href="/wishlist"
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center justify-between px-3 py-3 rounded-xl text-[15px] transition-colors ${currentUrl === '/wishlist' ? 'bg-green-50 text-green-700 font-semibold' : 'text-slate-700 hover:bg-slate-50 font-medium'}`}
                        >
                            <span className="flex items-center gap-2">
                                <Heart className="w-4 h-4" />
                                Wishlist
                            </span>
                            {currentUrl === '/wishlist' && <span className="w-1.5 h-1.5 rounded-full bg-green-600" />}
                        </Link>
                    </div>

                    <div className="px-5 py-4 border-t border-slate-100 flex gap-2">
                        {auth?.user ? (
                            <Link href="/profile" className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold">
                                <User className="w-4 h-4" />
                                Profil Saya
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="flex-1 text-center py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                                    Masuk
                                </Link>
                                <Link href="/register" className="flex-1 text-center py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
