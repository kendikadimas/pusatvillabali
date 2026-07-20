import { Head, Link, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { Search, ExternalLink, Eye, CalendarCheck, CalendarX, Clock, CreditCard } from 'lucide-react';
import React, { useState } from 'react';
import { formatPrice } from '@/lib/format';
import type { Booking, PaginatedData } from '@/types';

interface BookingStats {
    total: number;
    today: number;
    pending: number;
    pending_payment: number;
    confirmed: number;
    checkin_today: Array<{ id: number; booking_code: string; guest_name: string; villa_id: number; check_in: string; check_out: string; villa?: { id: number; name: string } }>;
    checkout_today: Array<{ id: number; booking_code: string; guest_name: string; villa_id: number; check_in: string; check_out: string; villa?: { id: number; name: string } }>;
}

interface Props {
    bookings: PaginatedData<Booking>;
    villas: { id: number; name: string }[];
    filters: { search: string; status: string };
    stats: BookingStats;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
};

const paymentColors: Record<string, string> = {
    unpaid: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    refunded: 'bg-blue-100 text-blue-700',
    expired: 'bg-slate-100 text-slate-600',
};

const statusLabels: Record<string, string> = {
    pending: 'Menunggu',
    confirmed: 'Dikonfirmasi',
    cancelled: 'Dibatalkan',
    completed: 'Selesai',
};
const paymentLabels: Record<string, string> = {
    unpaid: 'Belum Dibayar',
    pending: 'Menunggu Verifikasi',
    paid: 'Lunas',
    refunded: 'Dikembalikan',
    expired: 'Kadaluarsa',
};

export default function AdminBookingsPage({ bookings, villas: _villas, filters, stats }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');

    const handleFilter = () => {
        const params: Record<string, string> = {};

        if (search) {
            params.search = search;
        }

        if (statusFilter) {
            params.status = statusFilter;
        }

        router.get('/admin/bookings', params, { preserveScroll: true });
    };

    const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });

    return (
        <>
            <Head title="Kelola Pemesanan" />

            <div className="space-y-5">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Pemesanan</h1>
                    <p className="text-sm text-slate-500">{bookings.total} total pemesanan</p>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">Masuk Hari Ini</p>
                        <p className="text-2xl font-black text-blue-600">{stats.today}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">Menunggu Konfirmasi</p>
                        <p className="text-2xl font-black text-yellow-600">{stats.pending}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">Menunggu Pembayaran</p>
                        <p className="text-2xl font-black text-orange-600">{stats.pending_payment}</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4">
                        <p className="text-xs text-slate-500 mb-1">Dikonfirmasi</p>
                        <p className="text-2xl font-black text-green-600">{stats.confirmed}</p>
                    </div>
                </div>

                {/* Check-in & Check-out today */}
                {(stats.checkin_today.length > 0 || stats.checkout_today.length > 0) && (
                    <div className="grid md:grid-cols-2 gap-3">
                        {/* Check-in today */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <CalendarCheck className="w-4 h-4 text-green-600" />
                                <h3 className="font-bold text-slate-800 text-sm">Check-in Hari Ini</h3>
                                <span className="ml-auto text-xs text-slate-400">{today}</span>
                            </div>
                            {stats.checkin_today.length === 0 ? (
                                <p className="text-xs text-slate-400">Tidak ada check-in hari ini</p>
                            ) : (
                                <div className="space-y-2">
                                    {stats.checkin_today.map((b) => (
                                        <Link
                                            key={b.id}
                                            href={`/admin/bookings/${b.id}`}
                                            className="flex items-center justify-between p-2.5 rounded-lg bg-green-50 hover:bg-green-100 transition-colors group"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">{b.guest_name}</p>
                                                <p className="text-xs text-slate-500">{b.villa?.name ?? '-'} · #{b.booking_code}</p>
                                            </div>
                                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-green-600 shrink-0" />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Check-out today */}
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <CalendarX className="w-4 h-4 text-red-500" />
                                <h3 className="font-bold text-slate-800 text-sm">Check-out Hari Ini</h3>
                                <span className="ml-auto text-xs text-slate-400">{today}</span>
                            </div>
                            {stats.checkout_today.length === 0 ? (
                                <p className="text-xs text-slate-400">Tidak ada check-out hari ini</p>
                            ) : (
                                <div className="space-y-2">
                                    {stats.checkout_today.map((b) => (
                                        <Link
                                            key={b.id}
                                            href={`/admin/bookings/${b.id}`}
                                            className="flex items-center justify-between p-2.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors group"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold text-slate-800">{b.guest_name}</p>
                                                <p className="text-xs text-slate-500">{b.villa?.name ?? '-'} · #{b.booking_code}</p>
                                            </div>
                                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-500 shrink-0" />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama, kode, email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleFilter()}
                            className="text-sm outline-none text-slate-700 w-52 placeholder:text-slate-400"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
 setStatusFilter(e.target.value); 
}}
                        className="text-sm border border-slate-200 bg-white rounded-lg px-3 py-2 outline-none text-slate-700"
                    >
                        <option value="">Semua Status</option>
                        <option value="pending">Menunggu</option>
                        <option value="confirmed">Dikonfirmasi</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                    </select>
                    <button onClick={handleFilter} className="text-sm bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900">
                        Filter
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    {/* Mobile card view */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {bookings.data.map((b) => (
                            <div key={b.id} className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{b.guest_name}</p>
                                        <p className="text-xs text-slate-400 font-mono">#{b.booking_code}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{b.villa?.name ?? '-'}</p>
                                    </div>
                                    <Link href={`/admin/bookings/${b.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg shrink-0">
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[b.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                        {statusLabels[b.status] ?? b.status}
                                    </span>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${paymentColors[b.payment_status] ?? 'bg-slate-100 text-slate-600'}`}>
                                        {paymentLabels[b.payment_status] ?? b.payment_status}
                                    </span>
                                    <span className="text-xs font-bold text-slate-700 ml-auto">{formatPrice(b.total_amount)}</span>
                                </div>
                            </div>
                        ))}
                        {bookings.data.length === 0 && (
                            <div className="p-8 text-center text-slate-400 text-sm">Belum ada pemesanan</div>
                        )}
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Pemesan</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Villa</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Tanggal</th>
                                    <th className="text-right px-4 py-3 font-semibold text-slate-600">Total</th>
                                    <th className="text-center px-4 py-3 font-semibold text-slate-600">Status</th>
                                    <th className="text-center px-4 py-3 font-semibold text-slate-600">Pembayaran</th>
                                    <th className="text-center px-4 py-3 font-semibold text-slate-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bookings.data.map((b) => (
                                    <tr key={b.id} className="hover:bg-slate-50">
                                        <td className="px-5 py-3">
                                            <p className="font-semibold text-slate-800">{b.guest_name}</p>
                                            <p className="text-xs text-slate-400 font-mono">#{b.booking_code}</p>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600 max-w-[140px] truncate">{b.villa?.name ?? '-'}</td>
                                        <td className="px-4 py-3 text-slate-600 text-xs">
                                            <p>{format(parseISO(b.check_in), 'dd MMM yy', { locale: localeID })}</p>
                                            <p className="text-slate-400">– {format(parseISO(b.check_out), 'dd MMM yy', { locale: localeID })}</p>
                                        </td>
                                        <td className="px-4 py-3 text-right font-bold text-slate-800">{formatPrice(b.total_amount)}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColors[b.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                                 {statusLabels[b.status] ?? b.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${paymentColors[b.payment_status] ?? 'bg-slate-100 text-slate-600'}`}>
                                                 {paymentLabels[b.payment_status] ?? b.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <Link
                                                    href={`/admin/bookings/${b.id}`}
                                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                                                    title="Lihat Detail Pemesanan"
                                                >
                                                    <Eye className="w-4.5 h-4.5" />
                                                </Link>
                                                <a
                                                    href={`/booking/status?code=${b.booking_code}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                                                    title="Lihat Halaman Publik"
                                                >
                                                    <ExternalLink className="w-4.5 h-4.5" />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {bookings.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-12 text-center text-slate-400">Belum ada pemesanan</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {bookings.last_page > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
                            <span className="text-xs text-slate-500">
                                {bookings.from}–{bookings.to} dari {bookings.total}
                            </span>
                            <div className="flex gap-1">
                                {Array.from({ length: bookings.last_page }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => {
                                            const params: Record<string, string> = { page: String(page) };

                                            if (search) {
params.search = search;
}

                                            if (statusFilter) {
params.status = statusFilter;
}

                                            router.get('/admin/bookings', params, { preserveScroll: true });
                                        }}
                                        className={`w-7 h-7 rounded text-xs font-medium ${
                                            page === bookings.current_page ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
