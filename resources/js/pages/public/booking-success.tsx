import { Head, Link } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import {
    CheckCircle, Calendar, Users, Home, Copy, Download,
    MessageCircle, Printer, MapPin, Clock, Search,
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

export default function BookingSuccessPage({ booking, settings, code }: Props) {
    const [copied, setCopied] = useState(false);

    if (!booking) {
        return (
            <>
                <Head title="Pemesanan Berhasil" />
                <div className="max-w-xl mx-auto px-4 py-20 text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Data pemesanan tidak ditemukan</h2>
                    <p className="text-slate-500 text-sm mb-6">
                        Kode booking "{code}" tidak ditemukan.
                    </p>
                    <Link href="/" className="text-blue-600 hover:underline text-sm">Kembali ke beranda</Link>
                </div>
            </>
        );
    }

    const copyCode = () => {
        navigator.clipboard.writeText(booking.booking_code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleDownloadPDF = () => {
        generateInvoicePDF(booking, booking.booking_code, {
            settings_prop_name: settings.settings_prop_name,
            settings_email: settings.settings_email,
            settings_wa: settings.settings_whatsapp,
        });
    };

    const handlePrint = () => window.print();

    const villaPhoto = booking.villa ? getMainPhoto(booking.villa) : null;

    const checkIn = format(parseISO(booking.check_in), 'EEEE, dd MMMM yyyy', { locale: localeID });
    const checkOut = format(parseISO(booking.check_out), 'EEEE, dd MMMM yyyy', { locale: localeID });

    return (
        <>
            <Head title="Pemesanan Berhasil" />

            <div className="max-w-xl mx-auto px-4 py-16">
                {/* Success header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 mb-2 font-heading">Pemesanan Berhasil!</h1>
                    <p className="text-slate-500 text-sm">
                        Terima kasih, <span className="font-semibold text-slate-700">{booking.guest_name}</span>. Pemesanan Anda telah diterima dan sedang diproses.
                    </p>
                </div>

                {/* Booking code highlight */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6 text-center">
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wider mb-1">Kode Pemesanan Anda</p>
                    <div className="flex items-center justify-center gap-3 mt-2">
                        <span className="text-2xl font-black text-blue-800 font-mono tracking-widest">
                            #{booking.booking_code}
                        </span>
                        <button
                            onClick={copyCode}
                            className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors"
                            title="Salin kode"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                    {copied && (
                        <p className="text-xs text-green-600 mt-2 font-medium">Kode disalin!</p>
                    )}
                    <p className="text-xs text-blue-500 mt-2">Simpan kode ini untuk cek status pemesanan</p>
                </div>

                {/* Villa photo + details */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6">
                    {villaPhoto && (
                        <div className="h-40 overflow-hidden">
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
                                <div>
                                    <p className="text-xs text-slate-500">Lokasi</p>
                                    <p className="text-sm text-slate-700">{booking.villa.location}</p>
                                </div>
                            </div>
                        )}
                        <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
                            <div className="flex items-start gap-2">
                                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-slate-500">Check-in</p>
                                    <p className="text-sm font-semibold text-slate-700">{checkIn}</p>
                                    {booking.villa?.check_in_time && (
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {booking.villa.check_in_time}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-xs text-slate-500">Check-out</p>
                                    <p className="text-sm font-semibold text-slate-700">{checkOut}</p>
                                    {booking.villa?.check_out_time && (
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {booking.villa.check_out_time}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <div>
                                <span className="text-xs text-slate-500">Tamu: </span>
                                <span className="text-sm text-slate-700">{booking.num_guests} orang</span>
                                <span className="text-xs text-slate-400 ml-2">· {booking.total_nights} malam</span>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 px-5 py-4 bg-slate-50 flex items-center justify-between">
                        <span className="text-sm text-slate-500">Total Pembayaran</span>
                        <span className="text-lg font-black text-slate-800">{formatPrice(booking.total_amount)}</span>
                    </div>
                </div>

                {/* Payment notice */}
                {booking.payment_status === 'unpaid' && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-5 flex items-center justify-between gap-3">
                        <div>
                            <p className="font-semibold text-yellow-800 text-sm">Pembayaran Belum Diterima</p>
                            <p className="text-xs text-yellow-600">Segera lakukan pembayaran untuk mengkonfirmasi booking.</p>
                        </div>
                        <Link
                            href={`/booking/payment?code=${booking.booking_code}`}
                            className="shrink-0 bg-yellow-500 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-yellow-600 transition-colors"
                        >
                            Bayar Sekarang
                        </Link>
                    </div>
                )}

                {/* Action buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        <Download className="w-4 h-4" /> Download Invoice
                    </button>
                    <button
                        onClick={handlePrint}
                        className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 text-sm font-semibold px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        <Printer className="w-4 h-4" /> Print
                    </button>
                </div>

                <div className="flex flex-col gap-3">
                    <Link
                        href={`/booking/status?code=${booking.booking_code}`}
                        className="flex items-center justify-center gap-2 border border-blue-200 text-blue-600 text-sm font-semibold px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors text-center"
                    >
                        Lihat Status Pemesanan
                    </Link>

                    {settings?.settings_whatsapp && (
                        <a
                            href={`https://wa.me/${settings.settings_whatsapp}?text=Halo, saya ingin konfirmasi pemesanan %23${booking.booking_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 border border-green-300 text-green-700 text-sm font-semibold px-4 py-3 rounded-xl hover:bg-green-50 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" /> Konfirmasi via WhatsApp
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
