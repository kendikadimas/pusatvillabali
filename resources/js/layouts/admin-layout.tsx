import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { home } from '@/routes';
import type { Auth } from '@/types/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navItems = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: '⊞' },
        { href: '/admin/analytics', label: 'Analitik', icon: '📊' },
        { href: '/admin/villas', label: 'Villa', icon: '🏠' },
        { href: '/admin/bookings', label: 'Pemesanan', icon: '📋' },
        { href: '/admin/reviews', label: 'Ulasan', icon: '⭐' },
        { href: '/admin/destinations', label: 'Destinasi', icon: '📍' },
        { href: '/admin/calendar', label: 'Kalender', icon: '📅' },
        { href: '/admin/settings', label: 'Pengaturan', icon: '⚙️' },
        { href: '/admin/users', label: 'Pengguna', icon: '👥' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-16'} flex-shrink-0 bg-slate-900 text-white flex flex-col transition-all duration-200`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">PVB</span>
                    </div>
                    {sidebarOpen && (
                        <span className="font-semibold text-white truncate">Admin Panel</span>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-sm"
                        >
                            <span className="text-base flex-shrink-0">{item.icon}</span>
                            {sidebarOpen && <span className="truncate">{item.label}</span>}
                        </Link>
                    ))}
                </nav>

                {/* Bottom */}
                <div className="border-t border-slate-700 p-3">
                    <Link
                        href={home()}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm"
                    >
                        <span className="flex-shrink-0">🌐</span>
                        {sidebarOpen && <span>Lihat Website</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                            {auth?.user?.name ?? 'Admin'}
                        </span>
                        <Link
                            href="/api/v1/admin/logout"
                            method="post"
                            as="button"
                            className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                            Keluar
                        </Link>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
