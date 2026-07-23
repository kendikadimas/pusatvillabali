import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import {
    Calendar, MapPin, Users, CheckCircle, XCircle, AlertCircle,
    Download, CreditCard, KeyRound, Eye, EyeOff,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';
import { generateInvoicePDF } from '@/lib/generateInvoicePDF';
import { getMainPhoto } from '@/lib/villaUtils';
import type { Booking, AppSettings } from '@/types';

interface Props {
    userBookings: Booking[];
    settings: AppSettings;
    hasPassword?: boolean;
    isGoogleAccount?: boolean;
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

export default function ProfilePage({
    userBookings,
    settings,
    hasPassword = true,
    isGoogleAccount = false,
}: Props) {
    const { auth } = usePage<{ auth: { user: { name: string; email: string; avatar?: string | null } } }>().props;
    const [tab, setTab] = useState<'all' | 'active' | 'past'>('all');
    const [passwordFormOpen, setPasswordFormOpen] = useState(!hasPassword);
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [userHasPassword, setUserHasPassword] = useState(hasPassword);
    const [resetLinkSent, setResetLinkSent] = useState(false);
    const [sendingReset, setSendingReset] = useState(false);

    const handleSendResetLink = async () => {
        if (!auth?.user?.email || sendingReset) {
return;
}

        setSendingReset(true);

        try {
            await axios.post('/api/v1/forgot-password', { email: auth.user.email });
            setResetLinkSent(true);
            toast.success('Link reset password sudah dikirim ke email kamu.');
        } catch {
            toast.error('Gagal mengirim link reset. Coba lagi.');
        } finally {
            setSendingReset(false);
        }
    };

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

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setFormErrors({});

        const data: Record<string, string> = {
            password,
            password_confirmation: passwordConfirmation,
        };

        if (userHasPassword) {
            data.current_password = currentPassword;
        }

        router.put('/settings/password', data, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(
                    userHasPassword
                        ? 'Password berhasil diperbarui.'
                        : 'Password berhasil dibuat. Anda bisa login dengan email & password.',
                );
                setCurrentPassword('');
                setPassword('');
                setPasswordConfirmation('');
                setUserHasPassword(true);
                setPasswordFormOpen(false);
            },
            onError: (errors) => {
                setFormErrors(errors as Record<string, string>);
            },
            onFinish: () => setProcessing(false),
        });
    };

    const tabs: { key: 'all' | 'active' | 'past'; label: string }[] = [
        { key: 'all', label: `Semua (${userBookings.length})` },
        { key: 'active', label: `Aktif (${userBookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length})` },
        { key: 'past', label: `Selesai (${userBookings.filter(b => ['completed', 'cancelled'].includes(b.status)).length})` },
    ];

    const inputClass =
        'w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#00A86B]/30 focus:border-[#00A86B] transition pr-10';

    return (
        <>
            <Head title="Profil Saya" />

            <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
                {/* User info */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-5">
                        {auth?.user?.avatar ? (
                            <img
                                src={auth.user.avatar}
                                alt={auth.user.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 flex-shrink-0"
                            />
                        ) : (
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xl font-bold">
                                    {auth?.user?.name?.[0]?.toUpperCase() ?? 'U'}
                                </span>
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h1 className="text-xl font-black text-slate-800 truncate font-heading">{auth?.user?.name}</h1>
                            <p className="text-sm text-slate-500 truncate">{auth?.user?.email}</p>
                            {isGoogleAccount && (
                                <p className="text-xs text-slate-400 mt-1">Login dengan Google</p>
                            )}
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

                {/* Password / security */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-8">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                                <KeyRound className="w-5 h-5 text-slate-600" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-base font-bold text-slate-800">
                                    {userHasPassword ? 'Password & Keamanan' : 'Buat Password'}
                                </h2>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    {userHasPassword
                                        ? 'Ubah password login email, atau reset lewat email jika lupa.'
                                        : isGoogleAccount
                                            ? 'Akun Google Anda belum punya password. Buat password agar bisa login tanpa Google.'
                                            : 'Buat password untuk login dengan email.'}
                                </p>
                            </div>
                        </div>
                        {userHasPassword && !passwordFormOpen && (
                            <button
                                type="button"
                                onClick={() => setPasswordFormOpen(true)}
                                className="shrink-0 text-sm font-semibold text-[#00A86B] hover:text-[#008f5a] px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                            >
                                Ubah
                            </button>
                        )}
                    </div>

                    {userHasPassword && !passwordFormOpen && (
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Password sudah diatur
                            </span>
                            <button
                                type="button"
                                onClick={handleSendResetLink}
                                disabled={sendingReset || resetLinkSent}
                                className="text-xs font-semibold text-slate-600 underline underline-offset-2 hover:text-slate-900 disabled:opacity-50"
                            >
                                {resetLinkSent ? 'Link terkirim' : sendingReset ? 'Mengirim...' : 'Lupa password?'}
                            </button>
                        </div>
                    )}

                    {passwordFormOpen && (
                        <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                            {userHasPassword && (
                                <div>
                                    <label htmlFor="current_password" className="block text-xs font-semibold text-slate-600 mb-1.5">
                                        Password saat ini
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="current_password"
                                            type={showCurrent ? 'text' : 'password'}
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            autoComplete="current-password"
                                            className={inputClass}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrent((v) => !v)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            aria-label={showCurrent ? 'Sembunyikan' : 'Tampilkan'}
                                        >
                                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {formErrors.current_password && (
                                        <p className="text-xs text-red-600 mt-1">{formErrors.current_password}</p>
                                    )}
                                    <p className="text-xs text-slate-400 mt-1.5">
                                        Lupa password?{' '}
                                        <button
                                            type="button"
                                            onClick={handleSendResetLink}
                                            disabled={sendingReset || resetLinkSent}
                                            className="font-semibold text-slate-600 underline underline-offset-2 hover:text-slate-900 disabled:opacity-50"
                                        >
                                            {resetLinkSent ? 'Link terkirim' : sendingReset ? 'Mengirim...' : 'Reset lewat email'}
                                        </button>
                                    </p>
                                </div>
                            )}

                            <div>
                                <label htmlFor="password" className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    {userHasPassword ? 'Password baru' : 'Password baru'}
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showNew ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="new-password"
                                        className={inputClass}
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNew((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        aria-label={showNew ? 'Sembunyikan' : 'Tampilkan'}
                                    >
                                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {formErrors.password && (
                                    <p className="text-xs text-red-600 mt-1">{formErrors.password}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    Konfirmasi password
                                </label>
                                <input
                                    id="password_confirmation"
                                    type={showNew ? 'text' : 'password'}
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    autoComplete="new-password"
                                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#00A86B]/30 focus:border-[#00A86B] transition"
                                    required
                                    minLength={8}
                                />
                                {formErrors.password_confirmation && (
                                    <p className="text-xs text-red-600 mt-1">{formErrors.password_confirmation}</p>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50 transition-transform active:scale-[0.98]"
                                    style={{ backgroundColor: '#00A86B' }}
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : userHasPassword
                                            ? 'Simpan password'
                                            : 'Buat password'}
                                </button>
                                {userHasPassword && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPasswordFormOpen(false);
                                            setFormErrors({});
                                            setCurrentPassword('');
                                            setPassword('');
                                            setPasswordConfirmation('');
                                        }}
                                        className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
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
