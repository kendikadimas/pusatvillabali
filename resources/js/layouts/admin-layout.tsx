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

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { href: '/admin/analytics', label: 'Analitik', icon: <BarChart2 className="w-4 h-4" /> },
        { href: '/admin/villas', label: 'Villa', icon: <Home className="w-4 h-4" /> },
        { href: '/admin/bookings', label: 'Pemesanan', icon: <ClipboardList className="w-4 h-4" /> },
        { href: '/admin/reviews', label: 'Ulasan', icon: <Star className="w-4 h-4" /> },
        { href: '/admin/vouchers', label: 'Voucher', icon: <Tag className="w-4 h-4" /> },
        { href: '/admin/destinations', label: 'Destinasi', icon: <MapPin className="w-4 h-4" /> },
        { href: '/admin/calendar', label: 'Kalender', icon: <Calendar className="w-4 h-4" /> },
        { href: '/admin/settings', label: 'Pengaturan', icon: <Settings className="w-4 h-4" /> },
        { href: '/admin/users', label: 'Pengguna', icon: <Users className="w-4 h-4" /> },
    ];

    const sidebarContent = (
        <>
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AppLogoIcon className="size-8" />
                </div>
                {sidebarOpen && (
                    <span className="font-semibold text-white truncate">Admin Panel</span>
                )}
                {/* Mobile close button */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="ml-auto p-1 rounded-md text-slate-400 hover:text-white lg:hidden"
                    aria-label="Tutup sidebar"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = currentUrl.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                                isActive
                                    ? 'bg-slate-700 text-white'
                                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <span className="flex-shrink-0">{item.icon}</span>
                            {sidebarOpen && <span className="truncate">{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div className="border-t border-slate-700 p-3">
                <Link
                    href={home()}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm"
                >
                    <Globe className="w-4 h-4 flex-shrink-0" />
                    {sidebarOpen && <span>Lihat Website</span>}
                </Link>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
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
                    lg:relative lg:translate-x-0 lg:z-auto
                    ${sidebarOpen ? 'lg:w-64' : 'lg:w-16'}
                    w-64
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {sidebarContent}
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                    <button
                        onClick={() => {
                            // On mobile: toggle drawer; on desktop: toggle collapsed width
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
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-700">{auth?.user?.name ?? 'Admin'}</div>
                            <div className="text-xs text-slate-400 capitalize">{auth?.user?.role ?? 'admin'}</div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                            Keluar
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
