import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Download, RefreshCw, ArrowUpRight } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';

interface DailyRevenue {
    date: string;
    revenue: string;
}

interface BookingsPerVilla {
    villa_name: string;
    bookings_count: number;
}

interface PaymentMethodStat {
    method: string;
    count: number;
    revenue: number;
}

interface LeadSource {
    source: string;
    count: number;
}

interface FunnelStep {
    step: string;
    value: number;
}

interface AnalyticsData {
    period: { from: string; to: string };
    daily_revenue: DailyRevenue[];
    bookings_per_villa: BookingsPerVilla[];
    payment_methods: PaymentMethodStat[];
    lead_sources: LeadSource[];
    conversion_funnel: FunnelStep[];
}

function todayStr() {
    return new Date().toISOString().slice(0, 10);
}

function daysAgo(n: number) {
    const d = new Date();
    d.setDate(d.getDate() - n);

    return d.toISOString().slice(0, 10);
}

export default function AdminAnalyticsPage() {
    const [from, setFrom] = useState(daysAgo(30));
    const [to, setTo] = useState(todayStr());
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [exporting, setExporting] = useState(false);
    const fetchedRef = React.useRef(false);

    const fetchData = useCallback(async (fromDate?: string, toDate?: string) => {
        setLoading(true);

        try {
            const res = await axios.get('/api/v1/admin/analytics', {
                params: { from: fromDate ?? from, to: toDate ?? to },
            });
            setData(res.data);
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Gagal memuat data analitik');
        } finally {
            setLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!fetchedRef.current) {
            fetchedRef.current = true;
            fetchData(from, to);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleExport = async () => {
        setExporting(true);

        try {
            const res = await axios.get('/api/v1/admin/analytics/export', {
                params: { from, to },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `laporan-booking-${from}-ke-${to}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            toast.success('Laporan berhasil diunduh');
        } catch {
            toast.error('Gagal mengunduh laporan');
        } finally {
            setExporting(false);
        }
    };

    // Derived totals from daily_revenue and funnel
    const totalRevenue = data?.daily_revenue.reduce((sum, d) => sum + parseFloat(d.revenue), 0) ?? 0;
    const totalBookings = data?.conversion_funnel?.[0]?.value ?? data?.conversion_funnel.reduce((sum, f) => sum + f.value, 0) ?? 0;
    const avgPerBooking = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Group daily_revenue by month for the table
    const byMonth: Record<string, { month: string; bookings: number; revenue: number }> = {};

    if (data) {
        data.daily_revenue.forEach((d) => {
            const month = d.date.slice(0, 7); // YYYY-MM

            if (!byMonth[month]) {
                byMonth[month] = { month, bookings: 0, revenue: 0 };
            }

            byMonth[month].revenue += parseFloat(d.revenue);
        });
        // Attach booking counts from funnel total spread across months (best effort: count days)
        // We just show revenue per month from daily data
    }

    const monthRows = Object.values(byMonth).sort((a, b) => a.month.localeCompare(b.month));

    return (
        <>
            <Head title="Analitik" />
            <div className="space-y-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Analitik</h1>
                        <p className="text-sm text-slate-500">Data performa dan statistik bisnis</p>
                    </div>
                    <button
                        onClick={handleExport}
                        disabled={exporting || loading}
                        className="inline-flex items-center gap-2 bg-slate-800 text-white text-sm font-semibold px-3 sm:px-4 py-2.5 rounded-xl hover:bg-slate-900 transition-colors disabled:opacity-60"
                    >
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">{exporting ? 'Mengunduh...' : 'Export Excel'}</span>
                    </button>
                </div>

                {/* Date filter */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Dari Tanggal</label>
                        <input
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1.5">Sampai Tanggal</label>
                        <input
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={() => fetchData(from, to)}
                        disabled={loading}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        {loading ? 'Memuat...' : 'Tampilkan'}
                    </button>
                    {/* Quick ranges */}
                    <div className="flex gap-2 flex-wrap">
                        {[
                            { label: '7 hari', days: 7 },
                            { label: '30 hari', days: 30 },
                            { label: '90 hari', days: 90 },
                        ].map(({ label, days }) => (
                            <button
                                key={days}
                                onClick={() => {
                                    const newFrom = daysAgo(days);
                                    const newTo = todayStr();
                                    setFrom(newFrom);
                                    setTo(newTo);
                                    fetchData(newFrom, newTo);
                                }}
                                className="text-xs text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats cards */}
                {data && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className={`rounded-2xl p-5 bg-green-600`}>
                                <p className="text-xs font-medium text-white/70 mb-1">Total Pendapatan</p>
                                <p className="text-2xl font-black text-white">{formatPrice(totalRevenue)}</p>
                                <p className="text-xs text-white/60 mt-1">{data.period.from} – {data.period.to}</p>
                            </div>
                            <Link href="/admin/bookings" className="rounded-2xl p-5 bg-blue-600 hover:brightness-110 transition-all group">
                                <p className="text-xs font-medium text-white/70 mb-1">Total Pemesanan</p>
                                <div className="flex items-end justify-between">
                                    <p className="text-2xl font-black text-white">{totalBookings.toLocaleString('id-ID')}</p>
                                    <ArrowUpRight className="w-4 h-4 text-white/60 mb-0.5" />
                                </div>
                                <p className="text-xs text-white/60 mt-1">Semua status</p>
                            </Link>
                            <div className={`rounded-2xl p-5 bg-purple-600`}>
                                <p className="text-xs font-medium text-white/70 mb-1">Rata-rata per Booking</p>
                                <p className="text-2xl font-black text-white">{formatPrice(avgPerBooking)}</p>
                                <p className="text-xs text-white/60 mt-1">{totalBookings > 0 ? `dari ${totalBookings} booking` : 'Belum ada data'}</p>
                            </div>
                        </div>

                        {/* Conversion funnel */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5">
                            <h2 className="text-sm font-semibold text-slate-700 mb-4">Status Pemesanan</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {data.conversion_funnel.map((f) => (
                                    <div key={f.step} className="bg-slate-50 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-black text-slate-800">{f.value}</p>
                                        <p className="text-xs text-slate-500 mt-1">{f.step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bookings per villa */}
                        {data.bookings_per_villa.length > 0 && (
                            <div className="bg-white border border-slate-200 rounded-2xl p-5">
                                <h2 className="text-sm font-semibold text-slate-700 mb-4">Booking per Villa</h2>
                                <div className="space-y-2">
                                    {data.bookings_per_villa
                                        .sort((a, b) => b.bookings_count - a.bookings_count)
                                        .map((v) => {
                                            const max = Math.max(...data.bookings_per_villa.map((x) => x.bookings_count));
                                            const pct = max > 0 ? (v.bookings_count / max) * 100 : 0;

                                            return (
                                                <div key={v.villa_name} className="flex items-center gap-3">
                                                    <p className="text-sm text-slate-700 w-40 truncate shrink-0">{v.villa_name}</p>
                                                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className="bg-blue-500 h-2 rounded-full transition-all"
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                    <p className="text-sm font-semibold text-slate-700 w-8 text-right shrink-0">{v.bookings_count}</p>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        )}

                        {/* Payment methods */}
                        {data.payment_methods.length > 0 && (
                            <div className="bg-white border border-slate-200 rounded-2xl p-5">
                                <h2 className="text-sm font-semibold text-slate-700 mb-4">Metode Pembayaran</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Metode</th>
                                                <th className="text-right px-4 py-2.5 font-semibold text-slate-600">Transaksi</th>
                                                <th className="text-right px-4 py-2.5 font-semibold text-slate-600">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {data.payment_methods.map((pm) => (
                                                <tr key={pm.method} className="hover:bg-slate-50">
                                                    <td className="px-4 py-2.5 text-slate-700">{pm.method}</td>
                                                    <td className="px-4 py-2.5 text-right text-slate-600">{pm.count}</td>
                                                    <td className="px-4 py-2.5 text-right font-semibold text-slate-800">{formatPrice(pm.revenue)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Monthly revenue table */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-5">
                            <h2 className="text-sm font-semibold text-slate-700 mb-4">Pendapatan per Bulan</h2>
                            {monthRows.length === 0 ? (
                                <p className="text-sm text-slate-400 py-4 text-center">Belum ada data pendapatan dalam periode ini</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-100">
                                                <th className="text-left px-4 py-2.5 font-semibold text-slate-600">Bulan</th>
                                                <th className="text-right px-4 py-2.5 font-semibold text-slate-600">Pendapatan</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {monthRows.map((row) => (
                                                <tr key={row.month} className="hover:bg-slate-50">
                                                    <td className="px-4 py-2.5 text-slate-700">
                                                        {new Date(row.month + '-01').toLocaleDateString('id-ID', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                        })}
                                                    </td>
                                                    <td className="px-4 py-2.5 text-right font-semibold text-slate-800">{formatPrice(row.revenue)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-t-2 border-slate-200 bg-slate-50">
                                                <td className="px-4 py-2.5 font-bold text-slate-700">Total</td>
                                                <td className="px-4 py-2.5 text-right font-black text-slate-800">{formatPrice(totalRevenue)}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Lead sources */}
                        {data.lead_sources.length > 0 && (
                            <div className="bg-white border border-slate-200 rounded-2xl p-5">
                                <h2 className="text-sm font-semibold text-slate-700 mb-4">Sumber Traffic (UTM)</h2>
                                <div className="flex flex-wrap gap-2">
                                    {data.lead_sources.map((ls) => (
                                        <span key={ls.source} className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-full">
                                            {ls.source}
                                            <span className="bg-slate-300 text-slate-600 text-xs font-bold px-1.5 py-0.5 rounded-full">{ls.count}</span>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {loading && !data && (
                    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                        <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin text-slate-300" />
                        <p className="text-sm">Memuat data analitik...</p>
                    </div>
                )}
            </div>
        </>
    );
}
