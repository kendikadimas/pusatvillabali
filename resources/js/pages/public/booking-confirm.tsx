import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import { differenceInDays, parseISO, format, eachDayOfInterval } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { BedDouble, Calendar, CheckCircle, Clock, Copy, Home, MapPin, MessageCircle, Tag, Upload, Users, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { DatePicker } from '@/components/ui/date-picker';
import { formatPrice } from '@/lib/format';
import { getPhotoUrl } from '@/lib/villaUtils';
import type { Villa, PaymentMethod, AppSettings } from '@/types';

interface Props {
    villa: Villa | null;
    paymentMethods: PaymentMethod[];
    settings: AppSettings;
    query: { villa_slug?: string; checkIn?: string; checkOut?: string; guests?: string };
}

export default function BookingConfirmPage({ villa: initialVilla, paymentMethods, settings, query }: Props) {
    const { auth } = usePage<{ auth: { user: { name: string; email: string } | null } }>().props;

    const [villa] = useState<Villa | null>(initialVilla);
    const [checkIn, setCheckIn] = useState(query.checkIn ?? '');
    const [checkOut, setCheckOut] = useState(query.checkOut ?? '');
    const [guests, setGuests] = useState(Number(query.guests ?? 2));
    const [guestName, setGuestName] = useState(auth?.user?.name ?? '');
    const [guestEmail, setGuestEmail] = useState(auth?.user?.email ?? '');
    const [guestPhone, setGuestPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
    const [bookingCode, setBookingCode] = useState('');
    const [ktpFile, setKtpFile] = useState<File | null>(null);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [copied, setCopied] = useState(false);

    // Restore booking intent dari sessionStorage (setelah login redirect)
    useEffect(() => {
        const intent = sessionStorage.getItem('booking_intent');

        if (intent) {
            try {
                const params = JSON.parse(intent) as Record<string, string>;

                if (params.checkIn && !query.checkIn) {
                    // eslint-disable-next-line react-hooks/set-state-in-effect
                    setCheckIn(params.checkIn);
                }

                if (params.checkOut && !query.checkOut) {
                     
                    setCheckOut(params.checkOut);
                }

                if (params.guests && !query.guests) {
                     
                    setGuests(Number(params.guests));
                }
            } catch {
                // ignore
            }

            sessionStorage.removeItem('booking_intent');
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const nights = checkIn && checkOut ? differenceInDays(parseISO(checkOut), parseISO(checkIn)) : 0;

    // Kalkulasi harga konsisten dengan backend (weekday vs weekend per malam)
    const { subtotal, weekdayCount, weekendCount } = React.useMemo(() => {
        if (!villa || !checkIn || !checkOut || nights <= 0) {
            return { subtotal: 0, weekdayCount: 0, weekendCount: 0 };
        }

        const days = eachDayOfInterval({
            start: parseISO(checkIn),
            end: new Date(parseISO(checkOut).getTime() - 86400000),
        });
        let wdCount = 0, weCount = 0, total = 0;
        days.forEach(day => {
            const dow = day.getDay(); // 0=Sun,5=Fri,6=Sat
            const isWeekend = dow === 5 || dow === 6;

            if (isWeekend && villa.weekend_price) {
                total += Number(villa.weekend_price);
                weCount++;
            } else {
                total += Number(villa.price_per_night);
                wdCount++;
            }
        });

        return { subtotal: total, weekdayCount: wdCount, weekendCount: weCount };
    }, [villa, checkIn, checkOut, nights]);

    const taxPercentage = Number(settings?.tax_percentage ?? 0);
    const taxAmount = Math.round((taxPercentage / 100) * subtotal);
    const selectedPM = paymentMethods.find(pm => pm.id === selectedPaymentMethod);
    const adminFee = selectedPM?.admin_fee ?? 0;

    // Voucher state
    const [voucherCode, setVoucherCode] = useState('');
    const [voucherApplied, setVoucherApplied] = useState<{ id: number; code: string; description: string | null; discount_amount: number } | null>(null);
    const [voucherLoading, setVoucherLoading] = useState(false);
    const [voucherError, setVoucherError] = useState('');

    const handleApplyVoucher = async () => {
        if (!voucherCode.trim()) {
return;
}

        setVoucherLoading(true);
        setVoucherError('');

        try {
            const res = await axios.post('/api/v1/vouchers/validate', {
                code: voucherCode.trim(),
                booking_amount: subtotal,
            });
            setVoucherApplied(res.data.voucher);
            toast.success(`Voucher ${res.data.voucher.code} berhasil diterapkan!`);
        } catch (e: unknown) {
            const msg = axios.isAxiosError(e) ? (e.response?.data?.message ?? 'Voucher tidak valid.') : 'Voucher tidak valid.';
            setVoucherError(msg);
            setVoucherApplied(null);
        } finally {
            setVoucherLoading(false);
        }
    };

    const handleRemoveVoucher = () => {
        setVoucherApplied(null);
        setVoucherCode('');
        setVoucherError('');
    };

    const discountAmount = voucherApplied?.discount_amount ?? 0;
    const total = Math.max(0, subtotal + taxAmount + adminFee - discountAmount);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!villa) {
            return;
        }

        setProcessing(true);
        setErrors({});

        if (!selectedPaymentMethod) {
            toast.error('Pilih metode pembayaran terlebih dahulu.');
            setErrors((prev) => ({ ...prev, payment_method_id: 'Metode pembayaran wajib dipilih.' }));
            setProcessing(false);

            return;
        }

        if (!ktpFile) {
            toast.error('Foto KTP wajib diunggah.');
            setProcessing(false);

            return;
        }

        try {
            const formData = new FormData();
            formData.append('villa_id', String(villa.id));
            formData.append('check_in', checkIn);
            formData.append('check_out', checkOut);
            formData.append('num_guests', String(guests));
            formData.append('guest_name', guestName);
            formData.append('guest_email', guestEmail);
            formData.append('guest_phone', guestPhone);
            formData.append('notes', notes);
            formData.append('payment_method_id', String(selectedPaymentMethod));
            formData.append('ktp_image', ktpFile);

            if (voucherApplied) {
                formData.append('voucher_code', voucherApplied.code);
            }

            const res = await axios.post('/api/v1/bookings', formData, {
                headers: {
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                maxRedirects: 0,
            });
            const code = res.data.booking_code ?? res.data.data?.booking_code;
            setBookingCode(code);
            setStep('payment');
            toast.success('Pemesanan dibuat. Silakan selesaikan pembayaran.');

            try {
                localStorage.removeItem('pusatvillaid-booking-store');
            } catch {
                // ignore
            }
        } catch (err: any) {
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                toast.error(err.response?.data?.message ?? 'Terjadi kesalahan. Silakan coba lagi.');
            }
        } finally {
            setProcessing(false);
        }
    };

    const handleUploadProof = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPaymentMethod) {
            toast.error('Pilih metode pembayaran terlebih dahulu.');

            return;
        }

        if (!proofFile || !bookingCode) {
            toast.error('Unggah bukti pembayaran terlebih dahulu.');

            return;
        }

        setUploading(true);
        const form = new FormData();
        form.append('payment_proof', proofFile);
        form.append('payment_method_id', String(selectedPaymentMethod));

        if (guestEmail) {
            form.append('guest_email', guestEmail);
        }

        try {
            await axios.post(`/api/v1/bookings/${bookingCode}/confirm-manual-payment`, form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Bukti pembayaran berhasil dikirim!');
            setStep('success');
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Gagal mengirim bukti pembayaran.');
        } finally {
            setUploading(false);
        }
    };

    const copyBookingCode = () => {
        if (!bookingCode) {
            return;
        }

        navigator.clipboard.writeText(bookingCode).then(() => {
            setCopied(true);
            toast.success('Kode pemesanan disalin!');
            setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
            toast.error('Gagal menyalin kode.');
        });
    };

    if (!villa) {
        return (
            <>
                <Head title="Konfirmasi Pemesanan" />
                <div className="max-w-xl mx-auto px-4 py-20 text-center">
                    <div className="flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4">
                        <Home className="w-8 h-8 text-slate-400" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2 font-heading">Villa tidak ditemukan</h2>
                    <Link href="/villas" className="text-emerald-600 hover:underline text-sm font-medium">← Kembali ke daftar villa</Link>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={step === 'form' ? `Pesan ${villa.name}` : step === 'payment' ? 'Pembayaran' : 'Pemesanan Berhasil'} />

            <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10">
                <Link
                    href={step === 'form' ? `/villas/${villa.slug}` : step === 'payment' ? `/villas/${villa.slug}` : '/'}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
                >
                    ← {step === 'form' || step === 'payment' ? 'Kembali ke detail villa' : 'Kembali ke beranda'}
                </Link>

                {/* Mobile price summary bar */}
                {villa && nights > 0 && (
                    <div className="lg:hidden bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-4 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-800 truncate mr-2">{villa.name}</span>
                        <span className="text-sm font-bold text-emerald-700 shrink-0">{formatPrice(total)}</span>
                    </div>
                )}

                {step === 'form' ? (
                    <>
                        <h1 className="text-2xl font-black text-slate-800 mb-8 font-heading">Pesan Villa</h1>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                            <div className="lg:col-span-3">
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Villa summary */}
                                    <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                            <img src={getPhotoUrl(villa.photos?.[0])} alt={villa.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-slate-800 text-sm">{villa.name}</h3>
                                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{villa.location}</p>
                                            <div className="flex items-center gap-3 text-xs text-slate-600 mt-1.5">
                                                <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" />{villa.bedrooms} kamar</span>
                                                <span className="flex items-center gap-1"><Users className="w-3 h-3" />Maks. {villa.max_guests} tamu</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dates & Guests */}
                                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                                        <h2 className="font-bold text-slate-800 mb-4 text-sm">Tanggal & Tamu</h2>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">Check-in *</label>
                                                <DatePicker
                                                    value={checkIn}
                                                    onChange={setCheckIn}
                                                    placeholder="Pilih check-in"
                                                    minDate={new Date()}
                                                />
                                                {errors.check_in && <p className="text-xs text-red-500 mt-1">{errors.check_in}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">Check-out *</label>
                                                <DatePicker
                                                    value={checkOut}
                                                    onChange={setCheckOut}
                                                    placeholder="Pilih check-out"
                                                    minDate={checkIn ? new Date(checkIn + "T00:00:00") : new Date()}
                                                />
                                                {errors.check_out && <p className="text-xs text-red-500 mt-1">{errors.check_out}</p>}
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <label className="block text-xs font-medium text-slate-600 mb-1">Jumlah Tamu</label>
                                            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                                                {Array.from({ length: villa.max_guests }, (_, i) => i + 1).map(n => (
                                                    <option key={n} value={n}>{n} tamu</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Guest info */}
                                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                                        <h2 className="font-bold text-slate-800 mb-4 text-sm">Data Pemesan</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">Nama Lengkap *</label>
                                                <input type="text" required value={guestName} onChange={(e) => setGuestName(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Nama sesuai KTP" />
                                                {errors.guest_name && <p className="text-xs text-red-500 mt-1">{errors.guest_name}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">Email *</label>
                                                <input type="email" required value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500" placeholder="email@contoh.com" />
                                                {errors.guest_email && <p className="text-xs text-red-500 mt-1">{errors.guest_email}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">Nomor WhatsApp *</label>
                                                <input type="tel" required value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500" placeholder="08xx-xxxx-xxxx" />
                                                {errors.guest_phone && <p className="text-xs text-red-500 mt-1">{errors.guest_phone}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">Catatan (opsional)</label>
                                                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none" placeholder="Permintaan khusus..." />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">Foto KTP *</label>
                                                <label className={`flex items-center gap-3 w-full border-2 border-dashed rounded-lg px-3 py-3 cursor-pointer transition-colors ${ktpFile ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}>
                                                    <Upload className="w-4 h-4 text-slate-400 shrink-0" />
                                                    <span className="text-sm text-slate-500 truncate">
                                                        {ktpFile ? ktpFile.name : 'Upload foto KTP (JPG/PNG, maks 5MB)'}
                                                    </span>
                                                    <input
                                                        type="file"
                                                        accept="image/jpeg,image/png,image/jpg,image/webp"
                                                        className="hidden"
                                                        onChange={(e) => setKtpFile(e.target.files?.[0] ?? null)}
                                                    />
                                                </label>
                                                {errors.ktp_image && <p className="text-xs text-red-500 mt-1">{errors.ktp_image}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment method — required */}
                                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                                        <h2 className="font-bold text-slate-800 mb-1 text-sm">Metode Pembayaran *</h2>
                                        <p className="text-xs text-slate-500 mb-4">Wajib dipilih sebelum melanjutkan pemesanan.</p>
                                        {paymentMethods.length > 0 ? (
                                            <div className="space-y-2">
                                                {paymentMethods.map((pm) => (
                                                    <div key={pm.id}>
                                                        <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors ${selectedPaymentMethod === pm.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}>
                                                            <input type="radio" name="payment_method" value={pm.id} checked={selectedPaymentMethod === pm.id} onChange={() => setSelectedPaymentMethod(pm.id)} className="text-emerald-600 shrink-0" required />
                                                            <div>
                                                                <p className="text-sm font-semibold text-slate-800">{pm.name}</p>
                                                                {pm.account_number && <p className="text-xs text-slate-500">{pm.account_number} · {pm.account_name}</p>}
                                                            </div>
                                                        </label>
                                                        {selectedPaymentMethod === pm.id && (
                                                            <div className="mt-2 ml-6 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                                                                {pm.account_number && (
                                                                    <div className="flex justify-between">
                                                                        <span className="text-slate-500">No. Rekening</span>
                                                                        <span className="font-bold text-slate-800 font-mono">{pm.account_number}</span>
                                                                    </div>
                                                                )}
                                                                {pm.account_name && (
                                                                    <div className="flex justify-between">
                                                                        <span className="text-slate-500">Atas Nama</span>
                                                                        <span className="font-bold text-slate-800">{pm.account_name}</span>
                                                                    </div>
                                                                )}
                                                                {pm.instructions && (
                                                                    <div className="mt-2 pt-2 border-t border-slate-200 text-slate-500 whitespace-pre-line">
                                                                        {pm.instructions}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-red-500">Belum ada metode pembayaran aktif. Hubungi admin.</p>
                                        )}
                                        {errors.payment_method_id && <p className="text-xs text-red-500 mt-2">{errors.payment_method_id}</p>}
                                    </div>

                                    {/* Price summary */}
                                    <div className="bg-white border border-slate-200 rounded-2xl p-5">
                                        <h2 className="font-bold text-slate-800 mb-3 text-sm">Ringkasan Harga</h2>
                                        {nights > 0 ? (
                                            <>
                                            <div className="space-y-2 text-sm">
                                                {weekdayCount > 0 && (
                                                    <div className="flex justify-between text-slate-600">
                                                        <span>{formatPrice(villa.price_per_night)} × {weekdayCount} malam (weekday)</span>
                                                        <span>{formatPrice(weekdayCount * Number(villa.price_per_night))}</span>
                                                    </div>
                                                )}
                                                {weekendCount > 0 && villa.weekend_price && (
                                                    <div className="flex justify-between text-slate-600">
                                                        <span>{formatPrice(villa.weekend_price)} × {weekendCount} malam (weekend)</span>
                                                        <span>{formatPrice(weekendCount * Number(villa.weekend_price))}</span>
                                                    </div>
                                                )}
                                                {taxAmount > 0 && (
                                                    <div className="flex justify-between text-slate-600">
                                                        <span>Pajak ({taxPercentage}%)</span>
                                                        <span>{formatPrice(taxAmount)}</span>
                                                    </div>
                                                )}
                                                {adminFee > 0 && (
                                                    <div className="flex justify-between text-slate-600">
                                                        <span>Biaya admin</span>
                                                        <span>{formatPrice(adminFee)}</span>
                                                    </div>
                                                )}
                                                {discountAmount > 0 && (
                                                    <div className="flex justify-between text-green-600 font-semibold">
                                                        <span>Diskon voucher ({voucherApplied?.code})</span>
                                                        <span>-{formatPrice(discountAmount)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between font-black text-slate-800 border-t border-slate-100 pt-3 text-base">
                                                    <span>Total</span>
                                                    <span>{formatPrice(total)}</span>
                                                </div>
                                            </div>

                                            {/* Voucher input */}
                                            <div className="mt-4">
                                                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Kode Voucher</label>
                                                {voucherApplied ? (
                                                    <div className="flex items-center gap-2 px-3.5 py-2.5 bg-green-50 border border-green-200 rounded-xl">
                                                        <Tag className="w-4 h-4 text-green-600 shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-green-700">{voucherApplied.code}</p>
                                                            {voucherApplied.description && <p className="text-xs text-green-600">{voucherApplied.description}</p>}
                                                        </div>
                                                        <button type="button" onClick={handleRemoveVoucher} className="p-1 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
                                                            <X className="w-4 h-4 text-green-600" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={voucherCode}
                                                            onChange={e => {
 setVoucherCode(e.target.value.toUpperCase()); setVoucherError(''); 
}}
                                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleApplyVoucher())}
                                                            placeholder="Masukkan kode voucher"
                                                            className="flex-1 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={handleApplyVoucher}
                                                            disabled={voucherLoading || !voucherCode.trim()}
                                                            className="px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-semibold hover:bg-slate-900 transition-colors disabled:opacity-40 cursor-pointer"
                                                        >
                                                            {voucherLoading ? '...' : 'Pakai'}
                                                        </button>
                                                    </div>
                                                )}
                                                {voucherError && <p className="text-xs text-red-500 mt-1.5">{voucherError}</p>}
                                            </div>
                                        </>
                                        ) : (
                                            <p className="text-xs text-slate-400">Pilih tanggal untuk melihat harga</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || nights === 0 || !selectedPaymentMethod || paymentMethods.length === 0}
                                        className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                                    >
                                        {processing ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                                    </button>
                                </form>
                            </div>

                            {/* Sidebar summary card */}
                            <div className="lg:col-span-2">
                                <div className="sticky top-24 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                    <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                                        <img src={getPhotoUrl(villa.photos?.[0])} alt={villa.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm">{villa.name}</h3>
                                            <p className="text-xs text-slate-500">{villa.location}</p>
                                        </div>
                                        {nights > 0 && (
                                            <div className="text-xs text-slate-500 space-y-1 pt-3 border-t border-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    {format(parseISO(checkIn), 'dd MMM', { locale: localeID })} – {format(parseISO(checkOut), 'dd MMM yyyy', { locale: localeID })}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-3.5 h-3.5 text-slate-400" />
                                                    {guests} tamu · {nights} malam
                                                </div>
                                            </div>
                                        )}
                                        <div className="pt-3 border-t border-slate-100">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500">Total</span>
                                                <span className="font-black text-slate-800">{nights > 0 ? formatPrice(total) : '—'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : step === 'payment' ? (
                    /* ── PAYMENT STEP ── */
                    <div className="max-w-xl mx-auto">
                        {/* Booking code banner */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-5 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs text-emerald-600 font-semibold mb-0.5">Kode Pemesanan</p>
                                <p className="text-lg font-black text-emerald-800 font-mono tracking-widest">{bookingCode}</p>
                            </div>
                            <button
                                type="button"
                                onClick={copyBookingCode}
                                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                            >
                                {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? 'Disalin' : 'Salin'}
                            </button>
                        </div>

                        {/* Payment notice */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-5">
                            <p className="font-semibold text-yellow-800 text-sm">Pembayaran Belum Diterima</p>
                            <p className="text-xs text-yellow-600 mt-0.5">Segera transfer sesuai instruksi di bawah, lalu unggah bukti pembayaran.</p>
                        </div>

                        {/* Payment instructions */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
                            <h2 className="font-bold text-slate-800 mb-4 text-sm">Instruksi Pembayaran</h2>

                            {selectedPM ? (
                                <div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-3">
                                        {selectedPM.logo && (
                                            <img src={`/storage/${selectedPM.logo}`} alt={selectedPM.name} className="w-10 h-10 object-contain rounded-lg bg-white border border-slate-200 p-1 shrink-0" />
                                        )}
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{selectedPM.name}</p>
                                            {selectedPM.account_number && (
                                                <p className="text-xs text-slate-500 font-mono">{selectedPM.account_number}</p>
                                            )}
                                            {selectedPM.account_name && (
                                                <p className="text-xs text-slate-500">{selectedPM.account_name}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between text-sm py-2 border-b border-slate-100">
                                        <span className="text-slate-500">Jumlah Transfer</span>
                                        <span className="font-black text-slate-800">{formatPrice(total)}</span>
                                    </div>
                                    {(selectedPM.admin_fee ?? 0) > 0 && (
                                        <p className="text-xs text-slate-400 mt-1">Sudah termasuk biaya admin {formatPrice(selectedPM.admin_fee ?? 0)}</p>
                                    )}
                                    {selectedPM.instructions && (
                                        <div className="mt-3 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 whitespace-pre-line">
                                            {selectedPM.instructions}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500">Metode pembayaran tidak ditemukan.</p>
                            )}
                        </div>

                        {/* Proof upload form */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-5">
                            <h2 className="font-bold text-slate-800 mb-3 text-sm">Upload Bukti Pembayaran</h2>
                            <form onSubmit={handleUploadProof} className="space-y-4">
                                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl p-6 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors">
                                    <Upload className="w-6 h-6 text-slate-400" />
                                    <span className="text-xs text-slate-500 text-center">
                                        {proofFile ? proofFile.name : 'Klik untuk pilih file (JPG, PNG, WebP)'}
                                    </span>
                                    {proofPreview && (
                                        <img src={proofPreview} alt="Preview bukti" className="mt-2 max-h-40 rounded-lg object-contain" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            setProofFile(file);

                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => setProofPreview(ev.target?.result as string);
                                                reader.readAsDataURL(file);
                                            } else {
                                                setProofPreview(null);
                                            }
                                        }}
                                    />
                                </label>
                                <button
                                    type="submit"
                                    disabled={uploading || !proofFile}
                                    className="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                                >
                                    {uploading ? 'Mengirim...' : 'Kirim Bukti Pembayaran'}
                                </button>
                            </form>
                        </div>

                        {/* WhatsApp confirm */}
                        {settings.settings_whatsapp && (
                            <a
                                href={`https://wa.me/${settings.settings_whatsapp}?text=Halo, saya sudah booking %23${bookingCode} dan ingin konfirmasi pembayaran.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full border border-green-500 text-green-600 font-semibold px-5 py-3 rounded-xl hover:bg-green-50 transition-colors text-sm mb-3"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Konfirmasi via WhatsApp
                            </a>
                        )}
                        <Link href="/" className="block text-center text-sm text-slate-500 hover:text-slate-700 py-2">
                            Kembali ke Beranda
                        </Link>
                    </div>
                ) : (
                    /* ── SUCCESS STEP ── */
                    <div className="max-w-xl mx-auto">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                <CheckCircle className="w-10 h-10 text-green-600" />
                            </div>
                            <h1 className="text-2xl font-black text-slate-800 mb-2 font-heading">Bukti Terkirim!</h1>
                            <p className="text-slate-500 text-sm">
                                Terima kasih, <span className="font-semibold text-slate-700">{guestName}</span>. Pemesanan Anda telah diterima.
                            </p>
                        </div>

                        {/* Booking code */}
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 text-center">
                            <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1">Kode Pemesanan Anda</p>
                            <div className="flex items-center justify-center gap-3 mt-2">
                                <span className="text-2xl font-black text-emerald-800 font-mono tracking-widest">#{bookingCode}</span>
                                <button
                                    type="button"
                                    onClick={copyBookingCode}
                                    className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-600 transition-colors"
                                    title="Salin kode"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                            {copied && <p className="text-xs text-green-600 mt-2 font-medium">Kode disalin!</p>}
                            <p className="text-xs text-emerald-500 mt-2">Simpan kode ini untuk cek status pemesanan</p>
                        </div>

                        {/* Amount due */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 text-center">
                            <p className="text-sm text-slate-500 mb-1">Total yang harus dibayar</p>
                            <p className="text-3xl font-black text-emerald-700">{formatPrice(total)}</p>
                            {checkIn && checkOut && nights > 0 && (
                                <p className="text-xs text-slate-500 mt-1">
                                    {nights} malam · {format(parseISO(checkIn), 'dd MMM', { locale: localeID })} – {format(parseISO(checkOut), 'dd MMM yyyy', { locale: localeID })}
                                </p>
                            )}
                        </div>

                        {/* Villa + booking summary */}
                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-6">
                            <div className="h-40 overflow-hidden bg-slate-100">
                                <img src={getPhotoUrl(villa.photos?.[0])} alt={villa.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex items-start gap-2">
                                    <Home className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs text-slate-500">Villa</p>
                                        <p className="font-semibold text-slate-800">{villa.name}</p>
                                    </div>
                                </div>
                                {villa.location && (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-xs text-slate-500">Lokasi</p>
                                            <p className="text-sm text-slate-700">{villa.location}</p>
                                        </div>
                                    </div>
                                )}
                                {checkIn && checkOut && (
                                    <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-3">
                                        <div className="flex items-start gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-xs text-slate-500">Check-in</p>
                                                <p className="text-sm font-semibold text-slate-700">
                                                    {format(parseISO(checkIn), 'EEEE, dd MMM yyyy', { locale: localeID })}
                                                </p>
                                                {villa.check_in_time && (
                                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {villa.check_in_time}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-xs text-slate-500">Check-out</p>
                                                <p className="text-sm font-semibold text-slate-700">
                                                    {format(parseISO(checkOut), 'EEEE, dd MMM yyyy', { locale: localeID })}
                                                </p>
                                                {villa.check_out_time && (
                                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {villa.check_out_time}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-slate-400 shrink-0" />
                                    <div>
                                        <span className="text-xs text-slate-500">Tamu: </span>
                                        <span className="text-sm text-slate-700">{guests} orang</span>
                                        {nights > 0 && <span className="text-xs text-slate-400 ml-2">· {nights} malam</span>}
                                    </div>
                                </div>
                                {(taxAmount > 0 || adminFee > 0 || discountAmount > 0) && (
                                    <div className="border-t border-slate-100 pt-3 space-y-1.5 text-sm">
                                        <div className="flex justify-between text-slate-600">
                                            <span>Subtotal</span>
                                            <span>{formatPrice(subtotal)}</span>
                                        </div>
                                        {taxAmount > 0 && (
                                            <div className="flex justify-between text-slate-600">
                                                <span>Pajak ({taxPercentage}%)</span>
                                                <span>{formatPrice(taxAmount)}</span>
                                            </div>
                                        )}
                                        {adminFee > 0 && (
                                            <div className="flex justify-between text-slate-600">
                                                <span>Biaya admin</span>
                                                <span>{formatPrice(adminFee)}</span>
                                            </div>
                                        )}
                                        {discountAmount > 0 && (
                                            <div className="flex justify-between text-green-600 font-semibold">
                                                <span>Diskon ({voucherApplied?.code})</span>
                                                <span>-{formatPrice(discountAmount)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-slate-100 px-5 py-4 bg-slate-50 flex items-center justify-between">
                                <span className="text-sm text-slate-500">Total Pembayaran</span>
                                <span className="text-lg font-black text-slate-800">{formatPrice(total)}</span>
                            </div>
                        </div>

                        {/* Proof received confirmation */}
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                                <div>
                                    <p className="font-bold text-green-700 text-sm">Bukti pembayaran diterima!</p>
                                    <p className="text-xs text-green-600">Tim kami akan memverifikasi dalam 1×24 jam.</p>
                                </div>
                            </div>
                            {proofPreview && (
                                <div className="mt-3 rounded-xl overflow-hidden border border-green-200">
                                    <img src={proofPreview} alt="Bukti pembayaran" className="w-full max-h-64 object-contain bg-white" />
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <Link
                                href={`/booking/status?code=${bookingCode}`}
                                className="w-full bg-slate-800 text-white font-semibold px-5 py-3 rounded-xl hover:bg-slate-900 transition-colors text-sm text-center"
                            >
                                Cek Status Pemesanan
                            </Link>
                            {settings?.settings_whatsapp && (
                                <a
                                    href={`https://wa.me/${settings.settings_whatsapp}?text=Halo, saya sudah booking %23${bookingCode} dan ingin konfirmasi pembayaran.`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full border border-green-500 text-green-600 font-semibold px-5 py-3 rounded-xl hover:bg-green-50 transition-colors text-sm"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Konfirmasi via WhatsApp
                                </a>
                            )}
                            <Link href="/" className="text-center text-sm text-slate-500 hover:text-slate-700 py-2">
                                Kembali ke Beranda
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
