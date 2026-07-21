import { Head, Link, usePage } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import {
    Calendar, MapPin, Users, CheckCircle, XCircle, AlertCircle,
    Download, CreditCard,
} from 'lucide-react';
import React, { useState } from 'react';
import { formatPrice } from '@/lib/format';
import { generateInvoicePDF } from '@/lib/generateInvoicePDF';
import { getMainPhoto } from '@/lib/villaUtils';
import type { Booking, AppSettings } from '@/types';

interface Props {
    userBookings: Booking[];
    settings: AppSettings;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending: {
        label: 'Menunggu',
        color: 'bg-yellow-100 text-yellow-700',
        icon: <AlertCircle className="w-3.5 h-3.5" />,
    },
    confirmed: {
        label: 'Dikonfirmasi',
        color: 'bg-green-100 text-green-700',
        icon: <CheckCircle className="w-3.5 h-3.5" />,
    },
    cancelled: {
        label: 'Dibatalkan',
        color: 'bg-red-100 text-red-700',
        icon: <XCircle className="w-3.5 h-3.5" />,
    },
    completed: {
        label: 'Selesai',
        color: 'bg-blue-100 text-blue-700',
        icon: <CheckCircle className="w-3.5 h-3.5" />,
    },
};

export default function ProfilePage({ userBookings, settings }: Props) {
    const { auth } = usePage<{ auth: { user: { name: string; email: string } } }>().props;
    const [tab, setTab] = useState<'all' | 'active' | 'past'>('all');

    const filtered = userBookings.filter((b) => {
        if (tab === 'active') {
return ['pending', 'confirmed'].includes(b.status);
}

        if (tab === 'past') {
return ['completed', 'cancelled'].includes(b.status);
}

        return true;
    });

    const handleDownload = (booking: Booking) => {
        generateInvoicePDF(booking, booking.booking_code, {
            settings_prop_name: settings.settings_prop_name,
            settings_email: settings.settings_email,
            settings_wa: settings.settings_whatsapp,
        });
    };

    const tabs: { key: 'all' | 'active' | 'past'; label: string }[] = [
        { key: 'all', label: `Semua (${userBookings.length})` },
        { key: 'active', label: `Aktif (${userBookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length})` },
        { key: 'past', label: `Selesai (${userBookings.filter(b => ['completed', 'cancelled'].includes(b.status)).length})` },
    ];

    return (
        <>
            <Head title="Profil Saya" />

            <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
                {/* User info */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xl font-bold">
                                {auth?.user?.name?.[0]?.toUpperCase() ?? 'U'}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-black text-slate-800 truncate font-heading">{auth?.user?.name}</h1>
                            <p className="text-sm text-slate-500 truncate">{auth?.user?.email}</p>
                        </div>

                    </div>

                    {/* Summary stats */}
                    <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100">
                        <div className="text-center">
                            <p className="text-2xl font-black text-slate-800">{userBookings.length}</p>
                            <p className="text-xs text-slate-500">Total Booking</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-green-600">
                                {userBookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length}
                            </p>
                            <p className="text-xs text-slate-500">Aktif</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-black text-blue-600">
                                {userBookings.filter(b => b.status === 'completed').length}
                            </p>
                            <p className="text-xs text-slate-500">Selesai</p>
                        </div>
                    </div>
                </div>

                {/* Bookings */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-black text-slate-800 font-heading">Riwayat Pemesanan</h2>
                    </div>

                    {/* Tab filter */}
                    <div className="flex gap-2 mb-5 border-b border-slate-200">
                        {tabs.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`text-sm font-semibold pb-2.5 px-1 border-b-2 transition-colors ${
                                    tab === t.key
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {filtered.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">
                            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">Belum ada pemesanan</p>
                            <Link
                                href="/villas"
                                className="inline-block mt-4 text-sm text-blue-600 hover:underline"
                            >
                                Jelajahi Villa
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map((booking) => {
                                const sc = statusConfig[booking.status] ?? statusConfig.pending;
                                const villaPhoto = booking.villa ? getMainPhoto(booking.villa) : null;
                                const isPendingPayment = booking.payment_status === 'unpaid' && booking.status !== 'cancelled';

                                return (
                                    <div
                                        key={booking.id}
                                        className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow"
                                    >
                                        <div className="flex gap-0">
                                            {/* Villa thumbnail */}
                                            <div className="w-28 sm:w-32 h-20 sm:h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center self-center ml-3 mt-3 mb-3">
                                                {villaPhoto
                                                    ? <img src={villaPhoto} alt={booking.villa?.name ?? 'Villa'} className="w-full h-full object-cover" />
                                                    : <span className="text-xs text-slate-400 text-center px-2">Tidak ada foto</span>
                                                }
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 p-4 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="min-w-0">
                                                        <p className="font-bold text-slate-800 truncate">{booking.villa?.name ?? '—'}</p>
                                                        <p className="text-xs text-slate-400 font-mono">#{booking.booking_code}</p>
                                                    </div>
                                                    <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${sc.color}`}>
                                                        {sc.icon} {sc.label}
                                                    </span>
                                                </div>

                                                {booking.villa?.location && (
                                                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                                        <span className="truncate">{booking.villa.location}</span>
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {format(parseISO(booking.check_in), 'dd MMM', { locale: localeID })}
                                                        {' → '}
                                                        {format(parseISO(booking.check_out), 'dd MMM yyyy', { locale: localeID })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3 h-3" />
                                                        {booking.num_guests} tamu
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
                                                    <span className="font-black text-slate-800 text-sm">{formatPrice(booking.total_amount)}</span>
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        {isPendingPayment && (
                                                            <Link
                                                                href={`/booking/payment?code=${booking.booking_code}`}
                                                                className="flex items-center gap-1 text-xs font-semibold text-white bg-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                                                            >
                                                                <CreditCard className="w-3 h-3" /> Bayar
                                                            </Link>
                                                        )}
                                                        <button
                                                            onClick={() => handleDownload(booking)}
                                                            className="flex items-center gap-1 text-xs font-semibold text-slate-600 border border-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                                                        >
                                                            <Download className="w-3 h-3" /> Invoice
                                                        </button>
                                                        <Link
                                                            href={`/booking/status?code=${booking.booking_code}`}
                                                            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                                                        >
                                                            Detail →
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
