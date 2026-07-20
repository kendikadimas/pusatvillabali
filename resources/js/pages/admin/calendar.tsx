import { Head } from '@inertiajs/react';
import axios from 'axios';
import { AlertTriangle, ChevronLeft, ChevronRight, Lock, Unlock, Users, X } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface VillaOption {
    id: number;
    name: string;
    slug: string;
}

interface BlockedDate {
    id: number;
    villa_id: number;
    date: string;
    reason: string | null;
}

interface BookingSummary {
    id: number;
    booking_code: string;
    guest_name: string;
    check_in: string;
    check_out: string;
    status: string;
}

interface BookedDateInfo {
    date: string;
    bookings: BookingSummary[];
}

interface Props {
    villas: VillaOption[];
}

const DAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function formatDate(y: number, m: number, d: number): string {
    return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function today(): string {
    const t = new Date();
    return formatDate(t.getFullYear(), t.getMonth(), t.getDate());
}

function toDateOnly(value: string): string {
    return value.slice(0, 10);
}

/** Expand check_in (inclusive) → check_out (exclusive) into YYYY-MM-DD strings */
function expandStayDates(checkIn: string, checkOut: string): string[] {
    const dates: string[] = [];
    const start = new Date(toDateOnly(checkIn) + 'T00:00:00');
    const end = new Date(toDateOnly(checkOut) + 'T00:00:00');
    const cursor = new Date(start);
    while (cursor < end) {
        dates.push(formatDate(cursor.getFullYear(), cursor.getMonth(), cursor.getDate()));
        cursor.setDate(cursor.getDate() + 1);
    }
    return dates;
}

export default function AdminCalendarPage({ villas }: Props) {
    const [selectedId, setSelectedId] = useState<string>('');
    const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
    const [bookings, setBookings] = useState<BookingSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [year, setYear] = useState(() => new Date().getFullYear());
    const [month, setMonth] = useState(() => new Date().getMonth());

    const [pendingDate, setPendingDate] = useState<string | null>(null);
    const [reason, setReason] = useState('');
    const [saving, setSaving] = useState(false);

    const todayStr = today();

    const fetchData = useCallback(async (villaId: string) => {
        if (!villaId) {
            setBlockedDates([]);
            setBookings([]);
            return;
        }
        setLoading(true);
        try {
            const [blockedRes, bookingsRes] = await Promise.all([
                axios.get('/api/v1/admin/blocked-dates', { params: { villa_id: villaId } }),
                axios.get('/api/v1/admin/bookings', {
                    params: {
                        villa_id: villaId,
                        status: 'pending,confirmed,completed',
                        per_page: 200,
                    },
                }),
            ]);
            setBlockedDates(Array.isArray(blockedRes.data) ? blockedRes.data : blockedRes.data?.data ?? []);
            const list = bookingsRes.data?.data ?? bookingsRes.data?.bookings ?? bookingsRes.data ?? [];
            setBookings(Array.isArray(list) ? list : []);
        } catch {
            toast.error('Gagal memuat data kalender');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(selectedId);
    }, [selectedId, fetchData]);

    const blockedMap = useMemo(
        () => new Map<string, BlockedDate>(blockedDates.map((b) => [toDateOnly(b.date), b])),
        [blockedDates],
    );

    /** date → list of bookings covering that night */
    const bookedMap = useMemo(() => {
        const map = new Map<string, BookingSummary[]>();
        for (const booking of bookings) {
            const nights = expandStayDates(booking.check_in, booking.check_out);
            for (const d of nights) {
                const existing = map.get(d) ?? [];
                existing.push(booking);
                map.set(d, existing);
            }
        }
        return map;
    }, [bookings]);

    const handleDayClick = (dateStr: string) => {
        if (!selectedId) return;
        if (dateStr < todayStr) return;
        const blocked = blockedMap.get(dateStr);
        if (blocked) {
            handleUnblock(blocked);
            return;
        }
        // Allow opening modal even if booked — show warning, block API will reject if needed
        setPendingDate(dateStr);
        setReason('');
    };

    const handleUnblock = async (blocked: BlockedDate) => {
        if (!confirm(`Batalkan blokir tanggal ${toDateOnly(blocked.date)}?`)) return;
        try {
            await axios.delete(`/api/v1/admin/blocked-dates/${blocked.id}`);
            toast.success('Blokir dibatalkan');
            setBlockedDates((prev) => prev.filter((b) => b.id !== blocked.id));
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Gagal membatalkan blokir');
        }
    };

    const confirmBlock = async () => {
        if (!pendingDate || !selectedId) return;
        setSaving(true);
        try {
            const res = await axios.post('/api/v1/admin/blocked-dates', {
                villa_id: Number(selectedId),
                date: pendingDate,
                reason: reason || null,
            });
            setBlockedDates((prev) => [...prev, res.data.blocked_date]);
            toast.success('Tanggal berhasil diblokir');
            setPendingDate(null);
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Gagal memblokir tanggal');
        } finally {
            setSaving(false);
        }
    };

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonth = () => {
        if (month === 0) { setMonth(11); setYear((y) => y - 1); }
        else setMonth((m) => m - 1);
    };
    const nextMonth = () => {
        if (month === 11) { setMonth(0); setYear((y) => y + 1); }
        else setMonth((m) => m + 1);
    };

    const selectedVilla = villas.find((v) => String(v.id) === selectedId);

    const upcomingBlocked = blockedDates
        .filter((b) => toDateOnly(b.date) >= todayStr)
        .sort((a, b) => toDateOnly(a.date).localeCompare(toDateOnly(b.date)));

    const upcomingBooked: BookedDateInfo[] = useMemo(() => {
        const entries: BookedDateInfo[] = [];
        for (const [date, bks] of bookedMap.entries()) {
            if (date >= todayStr) {
                entries.push({ date, bookings: bks });
            }
        }
        return entries.sort((a, b) => a.date.localeCompare(b.date));
    }, [bookedMap, todayStr]);

    const pendingBookings = pendingDate ? (bookedMap.get(pendingDate) ?? []) : [];

    return (
        <>
            <Head title="Kalender Ketersediaan" />
            <div className="space-y-5">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Kalender</h1>
                    <p className="text-sm text-slate-500">Klik tanggal untuk blokir atau batalkan blokir. Tanggal berbooking ditandai oranye.</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Villa</label>
                    <select
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-sm"
                    >
                        <option value="">-- Pilih Villa --</option>
                        {villas.map((v) => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                    </select>
                </div>

                {selectedId && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
                            <div className="flex items-center justify-between mb-4">
                                <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                                </button>
                                <span className="font-bold text-slate-800">{MONTHS[month]} {year}</span>
                                <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
                                    <ChevronRight className="w-4 h-4 text-slate-600" />
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-300 inline-block" />
                                    Diblokir
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-400 inline-block" />
                                    Ada booking
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-orange-100 border border-orange-400 inline-block" />
                                    Booking + diblokir
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-slate-100 border border-slate-200 inline-block" />
                                    Tersedia
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-slate-200 inline-block" />
                                    Lampau
                                </span>
                            </div>

                            {loading ? (
                                <div className="h-48 flex items-center justify-center text-sm text-slate-400">Memuat...</div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-7 mb-1">
                                        {DAYS.map((d) => (
                                            <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({ length: firstDay }).map((_, i) => (
                                            <div key={`empty-${i}`} />
                                        ))}

                                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                                            const dateStr = formatDate(year, month, day);
                                            const isBlocked = blockedMap.has(dateStr);
                                            const dayBookings = bookedMap.get(dateStr) ?? [];
                                            const isBooked = dayBookings.length > 0;
                                            const isPast = dateStr < todayStr;
                                            const isToday = dateStr === todayStr;
                                            const blockedEntry = blockedMap.get(dateStr);

                                            let cellClass = 'relative flex flex-col items-center justify-center rounded-lg py-1.5 text-sm font-medium transition-colors min-h-[44px] ';
                                            if (isPast) {
                                                cellClass += 'text-slate-300 bg-slate-50 cursor-default';
                                            } else if (isBlocked && isBooked) {
                                                cellClass += 'bg-orange-100 text-orange-800 border border-orange-400 hover:bg-orange-200 cursor-pointer';
                                            } else if (isBlocked) {
                                                cellClass += 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 cursor-pointer';
                                            } else if (isBooked) {
                                                cellClass += 'bg-amber-100 text-amber-800 border border-amber-400 hover:bg-amber-200 cursor-pointer';
                                            } else {
                                                cellClass += 'text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer';
                                                if (isToday) cellClass += ' ring-2 ring-blue-400 ring-offset-1';
                                            }

                                            const guestNames = dayBookings.map((b) => b.guest_name).join(', ');
                                            let title = '';
                                            if (isPast) title = '';
                                            else if (isBlocked && isBooked) title = `Diblokir + ada booking: ${guestNames}`;
                                            else if (isBlocked) title = `Diblokir${blockedEntry?.reason ? ': ' + blockedEntry.reason : ''}`;
                                            else if (isBooked) title = `Ada booking: ${guestNames} — klik untuk coba blokir`;
                                            else title = 'Klik untuk blokir';

                                            return (
                                                <div
                                                    key={day}
                                                    className={cellClass}
                                                    onClick={() => handleDayClick(dateStr)}
                                                    title={title}
                                                >
                                                    {day}
                                                    <div className="flex items-center gap-0.5 mt-0.5">
                                                        {isBooked && <Users className="w-2.5 h-2.5 text-amber-600" />}
                                                        {isBlocked && <Lock className="w-2.5 h-2.5 text-red-400" />}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Side panels */}
                        <div className="space-y-5">
                            {/* Booked dates */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-5">
                                <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-amber-600" />
                                    Ada Booking
                                </h3>
                                <p className="text-xs text-slate-400 mb-4">{selectedVilla?.name} — mendatang</p>

                                {loading ? (
                                    <p className="text-sm text-slate-400">Memuat...</p>
                                ) : upcomingBooked.length === 0 ? (
                                    <p className="text-sm text-slate-400">Tidak ada booking aktif</p>
                                ) : (
                                    <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                        {upcomingBooked.map(({ date, bookings: bks }) => (
                                            <li key={date} className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                                                <p className="text-sm font-semibold text-amber-900">{date}</p>
                                                {bks.map((b) => (
                                                    <p key={b.id} className="text-xs text-amber-700 mt-0.5">
                                                        {b.guest_name} · {b.booking_code}
                                                        <span className="text-amber-500"> ({toDateOnly(b.check_in)} → {toDateOnly(b.check_out)})</span>
                                                    </p>
                                                ))}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Blocked dates */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-5">
                                <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-red-500" />
                                    Tanggal Diblokir
                                </h3>
                                <p className="text-xs text-slate-400 mb-4">{selectedVilla?.name} — mendatang</p>

                                {loading ? (
                                    <p className="text-sm text-slate-400">Memuat...</p>
                                ) : upcomingBlocked.length === 0 ? (
                                    <p className="text-sm text-slate-400">Tidak ada tanggal yang diblokir</p>
                                ) : (
                                    <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
                                        {upcomingBlocked.map((b) => (
                                            <li key={b.id} className="flex items-start justify-between gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                                                <div>
                                                    <p className="text-sm font-semibold text-red-800">{toDateOnly(b.date)}</p>
                                                    {b.reason && <p className="text-xs text-red-600 mt-0.5">{b.reason}</p>}
                                                    {bookedMap.has(toDateOnly(b.date)) && (
                                                        <p className="text-xs text-orange-600 mt-0.5 font-medium">Ada booking aktif</p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleUnblock(b)}
                                                    className="p-1 rounded-lg hover:bg-red-200 text-red-400 hover:text-red-700 transition-colors flex-shrink-0 cursor-pointer"
                                                    title="Batalkan blokir"
                                                >
                                                    <Unlock className="w-3.5 h-3.5" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {!selectedId && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-sm">
                        Pilih villa untuk mulai mengelola tanggal blokir
                    </div>
                )}
            </div>

            {/* Block reason modal */}
            {pendingDate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-slate-800">Blokir Tanggal</h2>
                            <button type="button" onClick={() => setPendingDate(null)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                                <X className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>

                        <p className="text-sm text-slate-600 mb-3">
                            Villa: <span className="font-semibold">{selectedVilla?.name}</span><br />
                            Tanggal: <span className="font-semibold">{pendingDate}</span>
                        </p>

                        {pendingBookings.length > 0 && (
                            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 flex gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs font-semibold text-amber-800">Tanggal ini sudah ada booking aktif</p>
                                    {pendingBookings.map((b) => (
                                        <p key={b.id} className="text-xs text-amber-700 mt-1">
                                            {b.guest_name} · {b.booking_code}
                                            <br />
                                            <span className="text-amber-600">{toDateOnly(b.check_in)} → {toDateOnly(b.check_out)} · {b.status}</span>
                                        </p>
                                    ))}
                                    <p className="text-xs text-amber-600 mt-1.5">Server akan menolak blokir jika booking masih aktif.</p>
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-xs font-medium text-slate-600 mb-1">
                                Alasan blokir <span className="text-slate-400">(opsional)</span>
                            </label>
                            <input
                                type="text"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="cth: Renovasi, Acara pribadi..."
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && confirmBlock()}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={confirmBlock}
                                disabled={saving}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2.5 rounded-xl hover:bg-red-700 disabled:opacity-60 text-sm cursor-pointer transition-colors"
                            >
                                <Lock className="w-4 h-4" />
                                {saving ? 'Menyimpan...' : pendingBookings.length > 0 ? 'Tetap Blokir' : 'Blokir Tanggal'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setPendingDate(null)}
                                className="flex-1 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50 text-sm cursor-pointer"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
