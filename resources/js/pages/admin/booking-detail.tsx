import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import type { Booking, AppSettings } from '@/types';
import { formatPrice } from '@/lib/format';
import { getMainPhoto } from '@/lib/villaUtils';
import { generateInvoicePDF } from '@/lib/generateInvoicePDF';
import { format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import axios from 'axios';
import { toast } from 'sonner';
import {
    ArrowLeft, Calendar, Users, Home, MapPin, Phone, Mail,
    CreditCard, Download, CheckCircle, XCircle, AlertCircle,
    Clock, FileText, Edit,
} from 'lucide-react';

interface Props {
    booking: Booking;
    settings: AppSettings;
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

export default function AdminBookingDetailPage({ booking, settings }: Props) {
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [updatingPayment, setUpdatingPayment] = useState(false);

    const villaPhoto = booking.villa ? getMainPhoto(booking.villa) : null;

    const handleStatusChange = async (status: string) => {
        if (!confirm(`Ubah status menjadi "${statusLabels[status] ?? status}"?`)) return;
        setUpdatingStatus(true);
        try {
            await axios.patch(`/api/v1/admin/bookings/${booking.id}/status`, {
                status,
                payment_status: booking.payment_status,
            });
            toast.success('Status pemesanan diperbarui');
            router.reload();
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Gagal mengubah status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handlePaymentStatusChange = async (payment_status: string) => {
        if (!confirm(`Ubah status pembayaran menjadi "${paymentLabels[payment_status] ?? payment_status}"?`)) return;
        setUpdatingPayment(true);
        try {
            await axios.patch(`/api/v1/admin/bookings/${booking.id}/status`, {
                status: booking.status,
                payment_status,
            });
            toast.success('Status pembayaran diperbarui');
            router.reload();
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Gagal mengubah status pembayaran');
        } finally {
            setUpdatingPayment(false);
        }
    };

    const handleDownloadPDF = () => {
        generateInvoicePDF(booking, booking.booking_code, {
            settings_prop_name: settings.settings_prop_name,
            settings_email: settings.settings_email,
            settings_wa: settings.settings_whatsapp,
        });
    };

    return (
        <>
            <Head title={`Pemesanan #${booking.booking_code}`} />

            <div className="space-y-5">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/bookings"
                        className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-2xl font-black text-slate-800">Detail Pemesanan</h1>
                        <p className="text-sm text-slate-500 font-mono">#{booking.booking_code}</p>
                    </div>
                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 border border-slate-200 text-slate-600 text-sm font-semibold px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                        <Download className="w-4 h-4" /> Invoice
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {/* Left: main info */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Villa info */}
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                            {villaPhoto && (
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={villaPhoto}
                                        alt={booking.villa?.name ?? 'Villa'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div>
                                        <p className="font-black text-slate-800 text-lg">{booking.villa?.name ?? '—'}</p>
                                        {booking.villa?.location && (
                                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                                                <MapPin className="w-3.5 h-3.5" /> {booking.villa.location}
                                            </p>
                                        )}
                                    </div>
                                    {booking.villa && (
                                        <Link
                                            href={`/admin/villas/${booking.villa_id}/edit`}
                                            className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600 border border-slate-200 px-2 py-1 rounded-lg"
                                        >
                                            <Edit className="w-3 h-3" /> Edit Villa
                                        </Link>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                                    <div className="flex items-start gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-slate-500">Check-in</p>
                                            <p className="text-sm font-semibold text-slate-700">
                                                {format(parseISO(booking.check_in), 'dd MMM yyyy', { locale: localeID })}
                                            </p>
                                            {booking.villa?.check_in_time && (
                                                <p className="text-xs text-slate-400">{booking.villa.check_in_time}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-slate-500">Check-out</p>
                                            <p className="text-sm font-semibold text-slate-700">
                                                {format(parseISO(booking.check_out), 'dd MMM yyyy', { locale: localeID })}
                                            </p>
                                            {booking.villa?.check_out_time && (
                                                <p className="text-xs text-slate-400">{booking.villa.check_out_time}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-slate-500">Tamu</p>
                                            <p className="text-sm font-semibold text-slate-700">{booking.num_guests} orang</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-xs text-slate-500">Durasi</p>
                                            <p className="text-sm font-semibold text-slate-700">{booking.total_nights} malam</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Guest info */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5">
                            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4" /> Informasi Tamu
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-blue-600 font-bold text-sm">
                                            {booking.guest_name?.[0]?.toUpperCase() ?? 'G'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{booking.guest_name}</p>
                                        <p className="text-xs text-slate-500">Nama Tamu</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <a href={`mailto:${booking.guest_email}`} className="hover:text-blue-600">
                                        {booking.guest_email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <a href={`tel:${booking.guest_phone}`} className="hover:text-blue-600">
                                        {booking.guest_phone}
                                    </a>
                                </div>
                                {booking.notes && (
                                    <div className="flex items-start gap-2 text-sm text-slate-600 pt-2 border-t border-slate-100">
                                        <FileText className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-slate-600 italic">{booking.notes}</p>
                                    </div>
                                )}
                                {booking.ktp_image && (
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <p className="text-xs font-semibold text-slate-500 mb-2">Foto KTP</p>
                                        <a
                                            href={`/api/v1/bookings/${booking.booking_code}/ktp`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                        >
                                            <FileText className="w-4 h-4" /> Lihat Foto KTP
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payment info */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5">
                            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <CreditCard className="w-4 h-4" /> Pembayaran
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Harga dasar</span>
                                    <span className="text-slate-700">{formatPrice(booking.base_price)}</span>
                                </div>
                                {booking.tax_amount != null && booking.tax_amount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Pajak</span>
                                        <span>{formatPrice(booking.tax_amount)}</span>
                                    </div>
                                )}
                                {booking.admin_fee != null && booking.admin_fee > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Biaya Admin</span>
                                        <span>{formatPrice(booking.admin_fee)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm border-t border-slate-100 pt-2 mt-2">
                                    <span className="font-bold text-slate-800">Total</span>
                                    <span className="font-black text-slate-800 text-base">{formatPrice(booking.total_amount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: status controls */}
                    <div className="space-y-5">
                        {/* Booking status */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5">
                            <h3 className="font-bold text-slate-700 mb-3">Status Pemesanan</h3>
                            <div className="mb-4">
                                <span className={`inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full ${statusColors[booking.status] ?? 'bg-slate-100 text-slate-600'}`}>
                                    {booking.status === 'confirmed' && <CheckCircle className="w-3.5 h-3.5" />}
                                    {booking.status === 'cancelled' && <XCircle className="w-3.5 h-3.5" />}
                                    {booking.status === 'pending' && <AlertCircle className="w-3.5 h-3.5" />}
                                    {booking.status === 'completed' && <CheckCircle className="w-3.5 h-3.5" />}
                                    {statusLabels[booking.status] ?? booking.status}
                                </span>
                            </div>
                            <div className="space-y-2">
                                {['pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => handleStatusChange(s)}
                                        disabled={updatingStatus || booking.status === s}
                                        className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition-colors ${
                                            booking.status === s
                                                ? 'border-blue-300 bg-blue-50 text-blue-700 font-semibold cursor-default'
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50'
                                        }`}
                                    >
                                        {statusLabels[s]}
                                        {booking.status === s && ' (sekarang)'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Payment status */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5">
                            <h3 className="font-bold text-slate-700 mb-3">Status Pembayaran</h3>
                            <div className="mb-4">
                                <span className={`inline-flex text-sm font-semibold px-3 py-1.5 rounded-full ${paymentColors[booking.payment_status] ?? 'bg-slate-100 text-slate-600'}`}>
                                    {paymentLabels[booking.payment_status] ?? booking.payment_status}
                                </span>
                            </div>
                            <div className="space-y-2">
                                {['unpaid', 'pending', 'paid', 'refunded', 'expired'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => handlePaymentStatusChange(s)}
                                        disabled={updatingPayment || booking.payment_status === s}
                                        className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition-colors ${
                                            booking.payment_status === s
                                                ? 'border-blue-300 bg-blue-50 text-blue-700 font-semibold cursor-default'
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50'
                                        }`}
                                    >
                                        {paymentLabels[s]}
                                        {booking.payment_status === s && ' (sekarang)'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Meta */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 text-xs text-slate-500 space-y-1.5">
                            <p>Dibuat: {format(parseISO(booking.created_at), 'dd MMM yyyy HH:mm', { locale: localeID })}</p>
                            <p>Diperbarui: {format(parseISO(booking.updated_at), 'dd MMM yyyy HH:mm', { locale: localeID })}</p>
                            {booking.utm_source && <p>Sumber: {booking.utm_source}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
