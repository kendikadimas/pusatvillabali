import React from 'react';
import { Head, Link } from '@inertiajs/react';
import type { Booking, AppSettings } from '@/types';
import { XCircle } from 'lucide-react';

interface Props {
    booking: Booking | null;
    settings: AppSettings;
}

export default function BookingFailedPage({ booking, settings }: Props) {
    return (
        <>
            <Head title="Pembayaran Gagal" />
            <div className="max-w-xl mx-auto px-4 py-16 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-10 h-10 text-red-600" />
                </div>
                <h1 className="text-2xl font-black text-slate-800 mb-2 font-heading">Pembayaran Gagal</h1>
                <p className="text-slate-500 mb-8">
                    Maaf, pembayaran Anda tidak dapat diproses. Silakan coba kembali atau hubungi kami.
                </p>

                {booking && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 text-left mb-8">
                        <div className="flex justify-between mb-2">
                            <span className="text-sm text-slate-500">Kode Booking</span>
                            <span className="font-bold text-slate-800 font-mono">#{booking.booking_code}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-slate-500">Villa</span>
                            <span className="font-semibold text-slate-800">{booking.villa?.name}</span>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {booking && (
                        <Link href={`/booking/payment?code=${booking.booking_code}`} className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm">
                            Coba Bayar Lagi
                        </Link>
                    )}
                    {settings?.settings_whatsapp && (
                        <a
                            href={`https://wa.me/${settings.settings_whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-green-500 text-green-600 font-semibold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors text-sm"
                        >
                            Hubungi Kami
                        </a>
                    )}
                    <Link href="/" className="border border-slate-200 text-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm">
                        Kembali ke Beranda
                    </Link>
                </div>
            </div>
        </>
    );
}
