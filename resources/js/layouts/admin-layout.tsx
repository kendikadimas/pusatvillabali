import { Link, router, usePage } from '@inertiajs/react';
import { BarChart2, Calendar, ClipboardList, Globe, Home, LayoutDashboard, MapPin, Settings, Star, Tag, Users } from 'lucide-react';
import React, { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { useAuthTokenSync } from '@/hooks/use-auth-token-sync';
import { home } from '@/routes';
import type { Auth } from '@/types/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    useAuthTokenSync();
    const { auth, flash } = usePage<{ auth: Auth; flash?: { success?: string; error?: string } }>().props;
    const { url: currentUrl } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('sanctum_token');
        localStorage.removeItem('auth_user');
        router.post('/admin/logout');
    };

    const navGroups = [
        {
            label: 'Utama',
            items: [
                { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
                { href: '/admin/analytics', label: 'Analitik', icon: <BarChart2 className="w-4 h-4" /> },
            ],
        },
        {
            label: 'Properti',
            items: [
                { href: '/admin/villas', label: 'Villa', icon: <Home className="w-4 h-4" /> },
                { href: '/admin/destinations', label: 'Destinasi', icon: <MapPin className="w-4 h-4" /> },
                { href: '/admin/calendar', label: 'Kalender', icon: <Calendar className="w-4 h-4" /> },
            ],
        },
        {
            label: 'Transaksi',
            items: [
                { href: '/admin/bookings', label: 'Pemesanan', icon: <ClipboardList className="w-4 h-4" /> },
                { href: '/admin/vouchers', label: 'Voucher', icon: <Tag className="w-4 h-4" /> },
            ],
        },
        {
            label: 'Konten',
            items: [
                { href: '/admin/reviews', label: 'Ulasan', icon: <Star className="w-4 h-4" /> },
            ],
        },
        {
            label: 'Sistem',
            items: [
                { href: '/admin/users', label: 'Pengguna', icon: <Users className="w-4 h-4" /> },
                { href: '/admin/settings', label: 'Pengaturan', icon: <Settings className="w-4 h-4" /> },
            ],
        },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className={`flex items-center gap-3 px-4 py-4 border-b border-white/10 flex-shrink-0 ${sidebarOpen ? '' : 'justify-center'}`}>
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <AppLogoIcon className="size-5 text-white" />
                </div>
                {sidebarOpen && (
                    <div className="min-w-0">
                        <p className="font-bold text-white text-sm leading-tight truncate">PusatVilla</p>
                        <p className="text-[10px] text-slate-400 leading-tight uppercase tracking-wider">Admin Panel</p>
                    </div>
                )}
                {/* Mobile close */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="ml-auto p-1 rounded-md text-slate-400 hover:text-white lg:hidden"
                    aria-label="Tutup sidebar"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Nav groups */}
            <nav className="flex-1 py-3 overflow-y-auto">
                {navGroups.map((group) => (
                    <div key={group.label} className="mb-1">
                        {sidebarOpen && (
                            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest px-4 py-2">
                                {group.label}
                            </p>
                        )}
                        {!sidebarOpen && <div className="mx-3 my-1 border-t border-white/10" />}
                        <div className="space-y-0.5 px-2">
                            {group.items.map((item) => {
                                const isActive = currentUrl.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        title={!sidebarOpen ? item.label : undefined}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm group relative ${
                                            isActive
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                                                : 'text-slate-400 hover:bg-white/10 hover:text-white'
                                        } ${!sidebarOpen ? 'justify-center' : ''}`}
                                    >
                                        {/* Active indicator bar */}
                                        {isActive && sidebarOpen && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-300 rounded-full" />
                                        )}
                                        <span className="flex-shrink-0">{item.icon}</span>
                                        {sidebarOpen && <span className="truncate font-medium">{item.label}</span>}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Bottom — view website + user info */}
            <div className="border-t border-white/10 flex-shrink-0">
                <div className={`px-3 py-3 ${sidebarOpen ? '' : 'flex justify-center'}`}>
                    <Link
                        href={home()}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm ${!sidebarOpen ? 'justify-center' : ''}`}
                        title={!sidebarOpen ? 'Lihat Website' : undefined}
                    >
                        <Globe className="w-4 h-4 flex-shrink-0" />
                        {sidebarOpen && <span className="font-medium">Lihat Website</span>}
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar — drawer on mobile, static on desktop */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50 flex flex-col bg-slate-900 text-white transition-transform duration-200
                    lg:relative lg:translate-x-0 lg:z-auto lg:flex-shrink-0
                    ${sidebarOpen ? 'lg:w-64' : 'lg:w-16'}
                    w-64
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {sidebarContent}
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0">
                    <button
                        onClick={() => {
                            if (window.innerWidth < 1024) {
                                setMobileOpen(!mobileOpen);
                            } else {
                                setSidebarOpen(!sidebarOpen);
                            }
                        }}
                        className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
                        aria-label="Toggle sidebar"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Profile section */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex flex-col text-right">
                            <span className="text-sm font-semibold text-slate-800 leading-tight">{auth?.user?.name ?? 'Admin'}</span>
                            <span className="text-xs text-slate-400 capitalize leading-tight">{auth?.user?.role ?? 'admin'}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {(auth?.user?.name ?? 'A').charAt(0).toUpperCase()}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-xs font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Keluar
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}
