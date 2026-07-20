import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { Check, Pencil, Plus, Tag, Trash2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';

interface Voucher {
    id: number;
    code: string;
    description: string | null;
    type: 'percent' | 'fixed';
    value: number;
    min_booking_amount: number;
    max_discount: number | null;
    usage_limit: number | null;
    used_count: number;
    bookings_count: number;
    is_active: boolean;
    valid_from: string | null;
    valid_until: string | null;
    created_at: string;
}

const emptyForm = {
    code: '',
    description: '',
    type: 'fixed' as 'fixed' | 'percent',
    value: '',
    min_booking_amount: '',
    max_discount: '',
    usage_limit: '',
    is_active: true,
    valid_from: '',
    valid_until: '',
};

function getAdminToken(): string {
    return localStorage.getItem('admin_token') ?? '';
}

function authHeaders() {
    return { Authorization: `Bearer ${getAdminToken()}` };
}

function fmtDate(d: string | null) {
    if (!d) return '—';
    try { return format(parseISO(d), 'd MMM yyyy', { locale: localeID }); } catch { return d; }
}

function StatusBadge({ active }: { active: boolean }) {
    return active
        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700"><Check className="w-3 h-3" />Aktif</span>
        : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-500"><X className="w-3 h-3" />Nonaktif</span>;
}

export default function VouchersPage() {
    const [vouchers, setVouchers] = useState<Voucher[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState({ ...emptyForm });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const fetchVouchers = () => {
        setLoading(true);
        axios.get('/api/v1/admin/vouchers', { headers: authHeaders() })
            .then(r => setVouchers(r.data.vouchers))
            .catch(() => toast.error('Gagal memuat data voucher.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchVouchers(); }, []);

    const openCreate = () => {
        setEditingId(null);
        setForm({ ...emptyForm });
        setErrors({});
        setShowModal(true);
    };

    const openEdit = (v: Voucher) => {
        setEditingId(v.id);
        setForm({
            code: v.code,
            description: v.description ?? '',
            type: v.type,
            value: String(v.value),
            min_booking_amount: v.min_booking_amount ? String(v.min_booking_amount) : '',
            max_discount: v.max_discount ? String(v.max_discount) : '',
            usage_limit: v.usage_limit ? String(v.usage_limit) : '',
            is_active: v.is_active,
            valid_from: v.valid_from ? v.valid_from.slice(0, 10) : '',
            valid_until: v.valid_until ? v.valid_until.slice(0, 10) : '',
        });
        setErrors({});
        setShowModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        setErrors({});
        const payload = {
            ...form,
            value: parseFloat(form.value) || 0,
            min_booking_amount: form.min_booking_amount ? parseFloat(form.min_booking_amount) : 0,
            max_discount: form.max_discount ? parseFloat(form.max_discount) : null,
            usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null,
            valid_from: form.valid_from || null,
            valid_until: form.valid_until || null,
        };
        try {
            if (editingId) {
                await axios.put(`/api/v1/admin/vouchers/${editingId}`, payload, { headers: authHeaders() });
                toast.success('Voucher berhasil diperbarui.');
            } else {
                await axios.post('/api/v1/admin/vouchers', payload, { headers: authHeaders() });
                toast.success('Voucher berhasil dibuat.');
            }
            setShowModal(false);
            fetchVouchers();
        } catch (e: unknown) {
            if (axios.isAxiosError(e) && e.response?.data?.errors) {
                setErrors(e.response.data.errors);
            } else {
                toast.error('Terjadi kesalahan. Coba lagi.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus/menonaktifkan voucher ini?')) return;
        setDeletingId(id);
        try {
            await axios.delete(`/api/v1/admin/vouchers/${id}`, { headers: authHeaders() });
            toast.success('Voucher dihapus.');
            fetchVouchers();
        } catch {
            toast.error('Gagal menghapus voucher.');
        } finally {
            setDeletingId(null);
        }
    };

    const field = (key: keyof typeof form) => ({
        value: form[key] as string,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
            setForm(f => ({ ...f, [key]: e.target.value })),
    });

    return (
        <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Voucher & Diskon</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Kelola kode voucher untuk potongan harga pemesanan.</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                        <Plus className="w-4 h-4" /> Buat Voucher
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : vouchers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-3">
                            <Tag className="w-10 h-10 opacity-30" />
                            <p className="text-sm font-medium">Belum ada voucher. Buat voucher pertama.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50">
                                        <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Kode</th>
                                        <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Diskon</th>
                                        <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Min. Pemesanan</th>
                                        <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Masa Berlaku</th>
                                        <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Penggunaan</th>
                                        <th className="text-left px-5 py-3 font-semibold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                                        <th className="px-5 py-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {vouchers.map(v => (
                                        <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div>
                                                    <span className="font-mono font-bold text-slate-900 tracking-wider">{v.code}</span>
                                                    {v.description && <p className="text-xs text-slate-400 mt-0.5">{v.description}</p>}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 font-semibold text-slate-800">
                                                {v.type === 'percent'
                                                    ? <span>{v.value}%{v.max_discount ? <span className="text-xs text-slate-400 ml-1">(maks. {formatPrice(v.max_discount)})</span> : null}</span>
                                                    : formatPrice(v.value)
                                                }
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-600">
                                                {v.min_booking_amount > 0 ? formatPrice(v.min_booking_amount) : '—'}
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-600 text-xs">
                                                {v.valid_from || v.valid_until
                                                    ? <>{fmtDate(v.valid_from)} – {fmtDate(v.valid_until)}</>
                                                    : <span className="text-slate-400">Selamanya</span>
                                                }
                                            </td>
                                            <td className="px-5 py-3.5 text-slate-600">
                                                {v.used_count}
                                                {v.usage_limit ? <span className="text-slate-400"> / {v.usage_limit}</span> : <span className="text-slate-400"> / ∞</span>}
                                            </td>
                                            <td className="px-5 py-3.5"><StatusBadge active={v.is_active} /></td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button
                                                        onClick={() => openEdit(v)}
                                                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(v.id)}
                                                        disabled={deletingId === v.id}
                                                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-40"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            {/* Modal */}
            {showModal && (
                <>
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto max-h-[92vh] overflow-y-auto">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                                <h2 className="text-lg font-black text-slate-900">{editingId ? 'Edit Voucher' : 'Buat Voucher Baru'}</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                                    <X className="w-5 h-5 text-slate-500" />
                                </button>
                            </div>
                            <div className="px-6 py-5 space-y-4">
                                {/* Code */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Kode Voucher *</label>
                                    <input
                                        {...field('code')}
                                        placeholder="cth. DISKON50"
                                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                    />
                                    {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code[0]}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Deskripsi</label>
                                    <input
                                        {...field('description')}
                                        placeholder="cth. Diskon hari jadi"
                                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                    />
                                </div>

                                {/* Type + Value */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Tipe *</label>
                                        <select
                                            value={form.type}
                                            onChange={e => setForm(f => ({ ...f, type: e.target.value as 'fixed' | 'percent' }))}
                                            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                        >
                                            <option value="fixed">Nominal (IDR)</option>
                                            <option value="percent">Persentase (%)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                                            {form.type === 'percent' ? 'Persentase (%)' : 'Nominal (IDR)'} *
                                        </label>
                                        <input
                                            {...field('value')}
                                            type="number"
                                            min="0"
                                            max={form.type === 'percent' ? 100 : undefined}
                                            placeholder={form.type === 'percent' ? '10' : '50000'}
                                            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                        />
                                        {errors.value && <p className="text-xs text-red-500 mt-1">{errors.value[0]}</p>}
                                    </div>
                                </div>

                                {/* Max discount (only for percent) */}
                                {form.type === 'percent' && (
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Maksimum Diskon (IDR)</label>
                                        <input
                                            {...field('max_discount')}
                                            type="number"
                                            min="0"
                                            placeholder="cth. 200000 (kosongkan = tidak ada batas)"
                                            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                        />
                                    </div>
                                )}

                                {/* Min booking */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Minimum Pemesanan (IDR)</label>
                                    <input
                                        {...field('min_booking_amount')}
                                        type="number"
                                        min="0"
                                        placeholder="0 = tidak ada minimum"
                                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                    />
                                </div>

                                {/* Usage limit */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Batas Penggunaan</label>
                                    <input
                                        {...field('usage_limit')}
                                        type="number"
                                        min="1"
                                        placeholder="Kosongkan = tidak terbatas"
                                        className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                                    />
                                </div>

                                {/* Validity dates */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Berlaku Dari</label>
                                        <input
                                            {...field('valid_from')}
                                            type="date"
                                            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 [color-scheme:light]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Berlaku Sampai</label>
                                        <input
                                            {...field('valid_until')}
                                            type="date"
                                            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 [color-scheme:light]"
                                        />
                                        {errors.valid_until && <p className="text-xs text-red-500 mt-1">{errors.valid_until[0]}</p>}
                                    </div>
                                </div>

                                {/* Active toggle */}
                                <div className="flex items-center justify-between py-3 border-t border-slate-100">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">Aktifkan Voucher</p>
                                        <p className="text-xs text-slate-400">Voucher hanya bisa digunakan jika aktif.</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${form.is_active ? 'bg-blue-600' : 'bg-slate-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-3 px-6 pb-6">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {saving ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Buat Voucher'}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
