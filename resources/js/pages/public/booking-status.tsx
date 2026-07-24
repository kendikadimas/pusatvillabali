import { Head, Link, router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import {
    AlertCircle, Calendar, CheckCircle, CreditCard, Download, Home, MapPin, MessageCircle, RefreshCw, Search, Users, XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import { formatPrice } from '@/lib/format';
import { generateInvoicePDF } from '@/lib/generateInvoicePDF';
import { getMainPhoto } from '@/lib/villaUtils';
import type { Booking, AppSettings } from '@/types';

interface Props {
    booking: Booking | null;
    settings: AppSettings;
    code?: string;
}

const statusMap: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
    pending: {
        label: 'Menunggu Konfirmasi',
        color: 'text-yellow-700',
        bg: 'bg-yellow-50 border-yellow-200',
        icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
    },
    confirmed: {
        label: 'Dikonfirmasi',
        color: 'text-green-700',
        bg: 'bg-green-50 border-green-200',
        icon: <CheckCircle className="w-5 h-5 text-green-600" />,
    },
    cancelled: {
        label: 'Dibatalkan',
        color: 'text-red-700',
        bg: 'bg-red-50 border-red-200',
        icon: <XCircle className="w-5 h-5 text-red-600" />,
    },
    completed: {
        label: 'Selesai',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50 border-emerald-200',
        icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
    },
};

const paymentStatusMap: Record<string, { label: string; color: string }> = {
    unpaid: { label: 'Belum Dibayar', color: 'text-red-600' },
    pending: { label: 'Menunggu Verifikasi', color: 'text-yellow-600' },
    paid: { label: 'Lunas', color: 'text-green-600' },
    refunded: { label: 'Dikembalikan', color: 'text-emerald-600' },
    expired: { label: 'Kadaluarsa', color: 'text-slate-500' },
};

export default function BookingStatusPage({ booking, settings, code }: Props) {
    const [searchCode, setSearchCode] = useState(code ?? '');
    const [searching, setSearching] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchCode.trim()) {
return;
}

        setSearching(true);
        router.get('/booking/status', { code: searchCode.trim() }, {
            onFinish: () => setSearching(false),
        });
    };

    const handleDownloadPDF = () => {
        if (!booking) {
return;
}

        generateInvoicePDF(booking, booking.booking_code, {
            settings_prop_name: settings.settings_prop_name,
            settings_email: settings.settings_email,
            settings_wa: settings.settings_whatsapp,
        });
    };

    if (!booking) {
        return (
            <>
                <Head title="Status Pemesanan" />
                <div className="max-w-xl mx-auto px-4 py-16">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4">
                            <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Pemesanan tidak ditemukan</h2>
                        {code && (
                            <p className="text-slate-500 text-sm mb-6">
                                Kode booking "<span className="font-mono font-semibold">{code}</span>" tidak ditemukan dalam sistem kami.
                            </p>
                        )}
                    </div>

                    {/* Search form */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <p className="text-sm font-semibold text-slate-700 mb-3">Cari pemesanan lain</p>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                value={searchCode}
                                onChange={(e) => setSearchCode(e.target.value)}
                                placeholder="Masukkan kode booking..."
                                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                disabled={searching}
                                className="bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                            >
                                {searching ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Cari'}
                            </button>
                        </form>
                    </div>

                    <div className="text-center mt-6">
                        <Link href="/" className="text-sm text-emerald-600 hover:underline">Kembali ke beranda</Link>
                    </div>
                </div>
            </>
        );
    }

    const status = statusMap[booking.status] ?? statusMap.pending;
    const paymentStatus = paymentStatusMap[booking.payment_status] ?? paymentStatusMap.unpaid;
    const villaPhoto = booking.villa ? getMainPhoto(booking.villa) : null;

    return (
        <>
            <Head title={`Status Pemesanan #${booking.booking_code}`} />

            <div className="max-w-2xl mx-auto px-4 py-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 font-heading">Status Pemesanan</h1>
                        <p className="text-sm text-slate-500 font-mono mt-0.5">#{booking.booking_code}</p>
                    </div>
                    <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">← Beranda</Link>
                </div>

                {/* Status badge */}
                <div className={`border rounded-2xl p-4 mb-5 flex items-center gap-3 ${status.bg}`}>
                    {status.icon}
                    <div>
                        <p className={`font-bold text-sm ${status.color}`}>{status.label}</p>
                        {booking.status === 'pending' && (
                            <p className="text-xs text-yellow-600 mt-0.5">Pemesanan Anda sedang menunggu konfirmasi dari kami.</p>
                        )}
                        {booking.status === 'confirmed' && (
                            <p className="text-xs text-green-600 mt-0.5">Pemesanan Anda telah dikonfirmasi. Sampai jumpa saat check-in!</p>
                        )}
                        {booking.status === 'cancelled' && (
                            <p className="text-xs text-red-600 mt-0.5">
                                {booking.cancel_reason ? `Alasan: ${booking.cancel_reason}` : 'Pemesanan ini telah dibatalkan.'}
                            </p>
                        )}
                        {booking.status === 'completed' && (
                            <p className="text-xs text-emerald-600 mt-0.5">Terima kasih telah menginap bersama kami!</p>
                        )}
                    </div>
                </div>

                {/* Villa card */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-5">
                    {villaPhoto && (
                        <div className="h-44 overflow-hidden">
                            <img
                                src={villaPhoto}
                                alt={booking.villa?.name ?? 'Villa'}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="p-5 space-y-3">
                        <div className="flex items-start gap-2">
                            <Home className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-xs text-slate-500">Villa</p>
                                <p className="font-semibold text-slate-800">{booking.villa?.name}</p>
                            </div>
                        </div>
                        {booking.villa?.location && (
                            <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-slate-600">{booking.villa.location}</p>
                            </div>
                        )}
                        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
                            <div className="flex items-start gap-2">
                                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-slate-500">Check-in</p>
                                    <p className="text-sm font-semibold text-slate-700">
                                        {format(parseISO(booking.check_in), 'dd MMM yyyy', { locale: localeID })}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-slate-500">Check-out</p>
                                    <p className="text-sm font-semibold text-slate-700">
                                        {format(parseISO(booking.check_out), 'dd MMM yyyy', { locale: localeID })}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="text-sm text-slate-600">{booking.num_guests} tamu · {booking.total_nights} malam</span>
                        </div>
                    </div>
                </div>

                {/* Payment info */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
                    <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> Informasi Pembayaran
                    </p>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500">Status Pembayaran</span>
                            <span className={`text-sm font-semibold ${paymentStatus.color}`}>{paymentStatus.label}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500">Total</span>
                            <span className="text-sm font-black text-slate-800">{formatPrice(booking.total_amount)}</span>
                        </div>
                        {booking.payment?.payment_method && (
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Metode Bayar</span>
                                <span className="text-sm text-slate-700">{(booking.payment as any).payment_method?.name ?? '-'}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Search another booking */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5">
                    <p className="text-xs font-semibold text-slate-600 mb-2">Cek pemesanan lain</p>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                            placeholder="Kode booking..."
                            className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        />
                        <button
                            type="submit"
                            disabled={searching}
                            className="bg-emerald-600 text-white text-sm font-semibold px-3 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                        >
                            {searching ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Cari'}
                        </button>
                    </form>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    {booking.payment_status === 'unpaid' && booking.status !== 'cancelled' && (
                        <Link
                            href={`/booking/payment?code=${booking.booking_code}`}
                            className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-emerald-700 transition-colors text-sm text-center"
                        >
                            <CreditCard className="w-4 h-4" /> Lanjutkan Pembayaran
                        </Link>
                    )}
                    {booking.payment_status === 'pending' && (
                        <div className="flex items-center justify-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 font-semibold px-6 py-3 rounded-xl text-sm text-center">
                            <AlertCircle className="w-4 h-4" /> Bukti pembayaran sedang diverifikasi
                        </div>
                    )}
                    {booking.payment_status === 'expired' && (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                            <p className="font-semibold text-slate-700 text-sm mb-1">Booking Kadaluarsa</p>
                            <p className="text-xs text-slate-500 mb-3">Batas waktu pembayaran telah habis. Buat booking baru untuk melanjutkan.</p>
                            <Link
                                href={booking.villa ? `/villas/${booking.villa.slug}` : '/villas'}
                                className="inline-block bg-emerald-600 text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-emerald-700 transition-colors"
                            >
                                Pesan Lagi
                            </Link>
                        </div>
                    )}
                    <button
                        onClick={handleDownloadPDF}
                        className="w-full flex items-center justify-center gap-2 border border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm"
                    >
                        <Download className="w-4 h-4" /> Download Invoice
                    </button>
                    {settings?.settings_whatsapp && (
                        <a
                            href={`https://wa.me/${settings.settings_whatsapp}?text=Halo, saya ingin menanyakan pemesanan %23${booking.booking_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 border border-green-300 text-green-700 font-semibold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors text-sm text-center"
                        >
                            <MessageCircle className="w-4 h-4" /> Hubungi via WhatsApp
                        </a>
                    )}
                    <Link
                        href="/"
                        className="text-center text-sm text-slate-500 hover:text-slate-700 py-2"
                    >
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </>
    );
}
