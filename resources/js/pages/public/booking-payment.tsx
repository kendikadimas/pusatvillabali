import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import type { Booking, AppSettings } from '@/types';
import { formatPrice } from '@/lib/format';
import { format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { Upload, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Props {
    booking: Booking | null;
    settings: AppSettings;
    code?: string;
}

export default function BookingPaymentPage({ booking, settings, code }: Props) {
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    if (!booking) {
        return (
            <>
                <Head title="Pembayaran" />
                <div className="max-w-xl mx-auto px-4 py-20 text-center">
                    <div className="text-5xl mb-4">🔍</div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Pemesanan tidak ditemukan</h2>
                    <Link href="/" className="text-blue-600 hover:underline text-sm">Kembali ke beranda</Link>
                </div>
            </>
        );
    }

    const pm = booking.payment_method;

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!proofFile) return;
        setUploading(true);
        const form = new FormData();
        form.append('proof_image', proofFile);
        try {
            await axios.post(`/api/v1/bookings/${booking.booking_code}/confirm-manual-payment`, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Bukti pembayaran berhasil dikirim!');
            setUploaded(true);
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Gagal mengirim bukti pembayaran.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Head title={`Pembayaran #${booking.booking_code}`} />

            <div className="max-w-2xl mx-auto px-4 py-10">
                <h1 className="text-2xl font-black text-slate-800 mb-2 font-heading">Instruksi Pembayaran</h1>
                <p className="text-sm text-slate-500 mb-8 font-mono">#{booking.booking_code}</p>

                {/* Amount */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-6 text-center">
                    <p className="text-sm text-blue-600 mb-1">Total yang harus dibayar</p>
                    <p className="text-3xl font-black text-blue-700">{formatPrice(booking.total_amount)}</p>
                    <p className="text-xs text-blue-500 mt-1">
                        {booking.total_nights} malam · {format(parseISO(booking.check_in), 'dd MMM', { locale: localeID })} – {format(parseISO(booking.check_out), 'dd MMM yyyy', { locale: localeID })}
                    </p>
                </div>

                {/* Payment method instructions */}
                {pm && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
                        <h2 className="font-bold text-slate-800 mb-3">Transfer ke:</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Bank / E-Wallet</span>
                                <span className="font-bold text-slate-800">{pm.name}</span>
                            </div>
                            {pm.account_number && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Nomor Rekening</span>
                                    <span className="font-bold text-slate-800 font-mono">{pm.account_number}</span>
                                </div>
                            )}
                            {pm.account_name && (
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Atas Nama</span>
                                    <span className="font-bold text-slate-800">{pm.account_name}</span>
                                </div>
                            )}
                        </div>
                        {pm.instructions && (
                            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 whitespace-pre-line">
                                {pm.instructions}
                            </div>
                        )}
                    </div>
                )}

                {/* Upload proof */}
                {!uploaded ? (
                    <form onSubmit={handleUpload} className="bg-white border border-slate-200 rounded-2xl p-5 mb-6">
                        <h2 className="font-bold text-slate-800 mb-3">Upload Bukti Pembayaran</h2>
                        <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-slate-300 rounded-xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
                            <Upload className="w-8 h-8 text-slate-400" />
                            <span className="text-sm text-slate-500">
                                {proofFile ? proofFile.name : 'Pilih file gambar (JPG, PNG, PDF)'}
                            </span>
                            <input
                                type="file"
                                accept="image/*,.pdf"
                                className="hidden"
                                onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
                            />
                        </label>
                        <button
                            type="submit"
                            disabled={!proofFile || uploading}
                            className="mt-4 w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
                        >
                            {uploading ? 'Mengirim...' : 'Kirim Bukti Pembayaran'}
                        </button>
                    </form>
                ) : (
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-green-700">Bukti pembayaran diterima!</p>
                            <p className="text-sm text-green-600">Tim kami akan memverifikasi dalam 1×24 jam.</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={`/booking/status?code=${booking.booking_code}`} className="bg-slate-800 text-white font-semibold px-6 py-3 rounded-xl hover:bg-slate-900 transition-colors text-sm text-center">
                        Cek Status Pemesanan
                    </Link>
                    {settings?.settings_whatsapp && (
                        <a
                            href={`https://wa.me/${settings.settings_whatsapp}?text=Halo, saya sudah bayar untuk booking %23${booking.booking_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-green-500 text-green-600 font-semibold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors text-sm text-center"
                        >
                            Konfirmasi via WhatsApp
                        </a>
                    )}
                </div>
            </div>
        </>
    );
}
