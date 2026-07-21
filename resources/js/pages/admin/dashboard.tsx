import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { BookOpen, Star, TrendingUp, Percent, Clock, ArrowUpRight, UserCheck, UserMinus, Activity } from 'lucide-react';
import React from 'react';
import { formatPrice } from '@/lib/format';
import type { AdminStats, Booking } from '@/types';

interface ActivityLogEntry {
    id: number;
    actor: string;
    action: string;
    module: string;
    subject: string;
    description: string;
    created_at: string;
}

interface Props {
    stats: AdminStats;
    recentBookings: Booking[];
    todayCheckins: Booking[];
    todayCheckouts: Booking[];
    activityLogs: ActivityLogEntry[];
}

function StatCard({ label, value, icon, color = 'blue', href }: { label: string; value: string | number; icon: React.ReactNode; color?: string; href?: string }) {
    const colors: Record<string, { card: string; icon: string }> = {
        blue:   { card: 'bg-blue-600',   icon: 'bg-blue-500' },
        green:  { card: 'bg-green-600',  icon: 'bg-green-500' },
        amber:  { card: 'bg-amber-500',  icon: 'bg-amber-400' },
        purple: { card: 'bg-purple-600', icon: 'bg-purple-500' },
        red:    { card: 'bg-red-600',    icon: 'bg-red-500' },
        indigo: { card: 'bg-indigo-600', icon: 'bg-indigo-500' },
    };
    const c = colors[color] ?? colors.blue;

    const inner = (
        <div className={`rounded-2xl p-5 ${c.card} ${href ? 'cursor-pointer hover:brightness-110 transition-all' : ''}`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-white/70 uppercase tracking-wide">{label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${c.icon}`}>{icon}</div>
            </div>
            <div className="flex items-end justify-between">
                <p className="text-2xl font-black text-white break-all leading-tight">{value}</p>
                {href && <ArrowUpRight className="w-4 h-4 text-white/60 shrink-0 mb-0.5" />}
            </div>
        </div>
    );

    if (href) return <Link href={href}>{inner}</Link>;
    return inner;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
};

const statusLabels: Record<string, string> = {
    pending: 'Menunggu', confirmed: 'Konfirmasi', cancelled: 'Batal', completed: 'Selesai',
};

export default function AdminDashboardPage({ stats, recentBookings, todayCheckins, todayCheckouts, activityLogs }: Props) {
    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Dashboard</h1>
                    <p className="text-sm text-slate-500">{format(new Date(), 'EEEE, dd MMMM yyyy', { locale: localeID })}</p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    <StatCard label="Check-in Hari Ini" value={stats.checkins_today} icon={<UserCheck className="w-4 h-4" />} color="green" href="/admin/bookings?status=confirmed" />
                    <StatCard label="Booking Bulan Ini" value={stats.bookings_this_month} icon={<BookOpen className="w-4 h-4" />} color="blue" href="/admin/bookings" />
                    <StatCard label="Pendapatan Bulan Ini" value={formatPrice(stats.revenue_this_month)} icon={<TrendingUp className="w-4 h-4" />} color="purple" href="/admin/analytics" />
                    <StatCard label="Pembayaran Pending" value={stats.pending_payments} icon={<Clock className="w-4 h-4" />} color="amber" href="/admin/bookings?status=pending_payment" />
                    <StatCard label="Ulasan Pending" value={stats.pending_reviews} icon={<Star className="w-4 h-4" />} color="indigo" href="/admin/reviews?filter=pending" />
                    <StatCard label="Tingkat Hunian" value={`${Math.round(stats.occupancy_rate)}%`} icon={<Percent className="w-4 h-4" />} color="red" href="/admin/analytics" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent bookings */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <h2 className="font-bold text-slate-800">Pemesanan Terbaru</h2>
                            <Link href="/admin/bookings" className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                Lihat semua <ArrowUpRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {recentBookings.slice(0, 8).map((b) => (
                                <div key={b.id} className="flex items-center gap-3 px-5 py-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{b.guest_name}</p>
                                        <p className="text-xs text-slate-500 truncate">{b.villa?.name} · #{b.booking_code}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[b.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                            {statusLabels[b.status] ?? b.status}
                                        </span>
                                        <p className="text-xs text-slate-500 mt-0.5">{formatPrice(b.total_amount)}</p>
                                    </div>
                                </div>
                            ))}
                            {recentBookings.length === 0 && (
                                <div className="px-5 py-8 text-center text-sm text-slate-400">Belum ada pemesanan</div>
                            )}
                        </div>
                    </div>

                    {/* Today's check-ins/outs */}
                    <div className="space-y-4">
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                    <UserCheck className="w-4 h-4 text-green-500" /> Check-in Hari Ini ({todayCheckins.length})
                                </h2>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {todayCheckins.slice(0, 5).map((b) => (
                                    <div key={b.id} className="px-5 py-3">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{b.guest_name}</p>
                                        <p className="text-xs text-slate-500">{b.villa?.name}</p>
                                    </div>
                                ))}
                                {todayCheckins.length === 0 && (
                                    <div className="px-5 py-4 text-center text-xs text-slate-400">Tidak ada check-in hari ini</div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-100">
                                <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                    <UserMinus className="w-4 h-4 text-amber-500" /> Check-out Hari Ini ({todayCheckouts.length})
                                </h2>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {todayCheckouts.slice(0, 5).map((b) => (
                                    <div key={b.id} className="px-5 py-3">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{b.guest_name}</p>
                                        <p className="text-xs text-slate-500">{b.villa?.name}</p>
                                    </div>
                                ))}
                                {todayCheckouts.length === 0 && (
                                    <div className="px-5 py-4 text-center text-xs text-slate-400">Tidak ada check-out hari ini</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Activity Log */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                        <h2 className="font-bold text-slate-800 flex items-center gap-2">
                            <Activity className="w-4 h-4 text-slate-500" /> Log Aktivitas Admin
                        </h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {(activityLogs ?? []).slice(0, 15).map((log) => (
                            <div key={log.id} className="px-5 py-3 flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-sm text-slate-800 truncate">
                                        <span className="font-semibold">{log.actor}</span>
                                        {' '}
                                        <span className="text-slate-500">{log.description}</span>
                                    </p>
                                    <p className="text-xs text-slate-400 mt-0.5">{log.module} &middot; {log.subject}</p>
                                </div>
                                <span className="text-xs text-slate-400 shrink-0 whitespace-nowrap">{log.created_at}</span>
                            </div>
                        ))}
                        {(activityLogs ?? []).length === 0 && (
                            <div className="px-5 py-6 text-center text-sm text-slate-400">Belum ada aktivitas tercatat</div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
