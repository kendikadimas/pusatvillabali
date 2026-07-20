import { Head } from '@inertiajs/react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Lock, Unlock, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface VillaOption {
    id: number;
    name: string;
    slug: string;
}

interface BlockedDate {
    id: number;
    villa_id: number;
    date: string; // YYYY-MM-DD
    reason: string | null;
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

export default function AdminCalendarPage({ villas }: Props) {
    const [selectedId, setSelectedId] = useState<string>('');
    const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
    const [loading, setLoading] = useState(false);
    const [year, setYear] = useState(() => new Date().getFullYear());
    const [month, setMonth] = useState(() => new Date().getMonth());

    // Reason modal state
    const [pendingDate, setPendingDate] = useState<string | null>(null);
    const [reason, setReason] = useState('');
    const [saving, setSaving] = useState(false);

    const todayStr = today();

    const fetchBlocked = useCallback(async (villaId: string) => {
        if (!villaId) { setBlockedDates([]); return; }
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/admin/blocked-dates', { params: { villa_id: villaId } });
            setBlockedDates(res.data);
        } catch {
            toast.error('Gagal memuat tanggal blokir');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlocked(selectedId);
    }, [selectedId, fetchBlocked]);

    // Map date -> blocked entry for O(1) lookup
    const blockedMap = new Map<string, BlockedDate>(blockedDates.map((b) => [b.date, b]));

    const handleDayClick = (dateStr: string) => {
        if (!selectedId) return;
        if (dateStr < todayStr) return; // past dates — no action
        const blocked = blockedMap.get(dateStr);
        if (blocked) {
            handleUnblock(blocked);
        } else {
            setPendingDate(dateStr);
            setReason('');
        }
    };

    const handleUnblock = async (blocked: BlockedDate) => {
        if (!confirm(`Batalkan blokir tanggal ${blocked.date}?`)) return;
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

    // Build calendar grid for current month
    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
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

    // Upcoming blocked dates list
    const upcomingBlocked = blockedDates
        .filter((b) => b.date >= todayStr)
        .sort((a, b) => a.date.localeCompare(b.date));

    return (
        <>
            <Head title="Kalender Ketersediaan" />
            <div className="space-y-5">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Kalender</h1>
                    <p className="text-sm text-slate-500">Klik tanggal untuk blokir atau batalkan blokir</p>
                </div>

                {/* Villa selector */}
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
                        {/* Calendar */}
                        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
                            {/* Month navigation */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={prevMonth}
                                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                                </button>
                                <span className="font-bold text-slate-800">
                                    {MONTHS[month]} {year}
                                </span>
                                <button
                                    onClick={nextMonth}
                                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                    <ChevronRight className="w-4 h-4 text-slate-600" />
                                </button>
                            </div>

                            {/* Legend */}
                            <div className="flex items-center gap-4 mb-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-3 h-3 rounded-sm bg-red-100 border border-red-300 inline-block" />
                                    Diblokir
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
                                    {/* Day headers */}
                                    <div className="grid grid-cols-7 mb-1">
                                        {DAYS.map((d) => (
                                            <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>
                                        ))}
                                    </div>

                                    {/* Date cells */}
                                    <div className="grid grid-cols-7 gap-1">
                                        {/* Empty cells before first day */}
                                        {Array.from({ length: firstDay }).map((_, i) => (
                                            <div key={`empty-${i}`} />
                                        ))}

                                        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                                            const dateStr = formatDate(year, month, day);
                                            const isBlocked = blockedMap.has(dateStr);
                                            const isPast = dateStr < todayStr;
                                            const isToday = dateStr === todayStr;
                                            const blockedEntry = blockedMap.get(dateStr);

                                            let cellClass = 'relative flex flex-col items-center justify-center rounded-lg py-1.5 text-sm font-medium transition-colors ';
                                            if (isPast) {
                                                cellClass += 'text-slate-300 bg-slate-50 cursor-default';
                                            } else if (isBlocked) {
                                                cellClass += 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 cursor-pointer';
                                            } else {
                                                cellClass += 'text-slate-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer';
                                                if (isToday) cellClass += ' ring-2 ring-blue-400 ring-offset-1';
                                            }

                                            return (
                                                <div
                                                    key={day}
                                                    className={cellClass}
                                                    onClick={() => handleDayClick(dateStr)}
                                                    title={isBlocked ? `Diblokir${blockedEntry?.reason ? ': ' + blockedEntry.reason : ''}` : isPast ? '' : 'Klik untuk blokir'}
                                                >
                                                    {day}
                                                    {isBlocked && (
                                                        <Lock className="w-2.5 h-2.5 text-red-400 mt-0.5" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Upcoming blocked dates list */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5">
                            <h3 className="font-bold text-slate-800 mb-1">Tanggal Diblokir</h3>
                            <p className="text-xs text-slate-400 mb-4">{selectedVilla?.name} — mendatang</p>

                            {loading ? (
                                <p className="text-sm text-slate-400">Memuat...</p>
                            ) : upcomingBlocked.length === 0 ? (
                                <p className="text-sm text-slate-400">Tidak ada tanggal yang diblokir</p>
                            ) : (
                                <ul className="space-y-2 max-h-96 overflow-y-auto pr-1">
                                    {upcomingBlocked.map((b) => (
                                        <li key={b.id} className="flex items-start justify-between gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5">
                                            <div>
                                                <p className="text-sm font-semibold text-red-800">{b.date}</p>
                                                {b.reason && (
                                                    <p className="text-xs text-red-600 mt-0.5">{b.reason}</p>
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
                            <button
                                type="button"
                                onClick={() => setPendingDate(null)}
                                className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                            >
                                <X className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>

                        <p className="text-sm text-slate-600 mb-4">
                            Villa: <span className="font-semibold">{selectedVilla?.name}</span><br />
                            Tanggal: <span className="font-semibold">{pendingDate}</span>
                        </p>

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
                                {saving ? 'Menyimpan...' : 'Blokir Tanggal'}
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
