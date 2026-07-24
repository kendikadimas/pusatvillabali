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
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_booking_amount: number;
    max_discount: number | null;
    usage_limit: number | null;
    used_count: number;
    is_active: boolean;
    valid_from: string | null;
    valid_until: string | null;
    created_at: string;
}

const emptyForm = {
    code: '',
    description: '',
    discount_type: 'fixed' as 'fixed' | 'percentage',
    discount_value: '',
    min_booking_amount: '',
    max_discount: '',
    usage_limit: '',
    is_active: true,
    valid_from: '',
    valid_until: '',
};

function fmtDate(d: string | null) {
    if (!d) {
        return '—';
    }

    try {
        return format(parseISO(d), 'd MMM yyyy', { locale: localeID });
    } catch {
        return d;
    }
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
        axios.get('/api/v1/admin/vouchers')
            .then(r => {
                const list = Array.isArray(r.data) ? r.data : (r.data?.vouchers ?? []);
                setVouchers(list);
            })
            .catch(() => toast.error('Gagal memuat data voucher.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

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
            discount_type: v.discount_type,
            discount_value: String(v.discount_value),
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
            code: form.code,
            description: form.description || null,
            discount_type: form.discount_type,
            discount_value: Number(form.discount_value) || 0,
            min_booking_amount: form.min_booking_amount ? Number(form.min_booking_amount) : 0,
            max_discount: form.max_discount ? Number(form.max_discount) : null,
            usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
            valid_from: form.valid_from || null,
            valid_until: form.valid_until || null,
            is_active: form.is_active,
        };

        try {
            if (editingId) {
                await axios.put(`/api/v1/admin/vouchers/${editingId}`, payload);
                toast.success('Voucher berhasil diperbarui.');
            } else {
                await axios.post('/api/v1/admin/vouchers', payload);
                toast.success('Voucher berhasil dibuat.');
            }
            setShowModal(false);
            fetchVouchers();
        } catch (err: any) {
            const apiErrors = err.response?.data?.errors;
            if (apiErrors) {
                setErrors(apiErrors);
                const first = Object.values(apiErrors).flat()[0];
                toast.error(typeof first === 'string' ? first : 'Gagal menyimpan voucher.');
            } else {
                toast.error(err.response?.data?.message || 'Gagal menyimpan voucher.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Yakin ingin menghapus voucher ini?')) {
            return;
        }

        setDeletingId(id);
        try {
            await axios.delete(`/api/v1/admin/vouchers/${id}`);
            toast.success('Voucher berhasil dihapus.');
            fetchVouchers();
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Gagal menghapus voucher.');
        } finally {
            setDeletingId(null);
        }
    };

    const field = (key: keyof typeof form) => ({
        value: form[key] as string,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            setForm(f => ({ ...f, [key]: e.target.value }));
        },
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Voucher</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola kode diskon untuk booking villa</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Buat Voucher
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                </div>
            ) : (vouchers ?? []).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <Tag className="w-12 h-12 mb-3 opacity-50" />
                    <p className="text-sm">Belum ada voucher. Klik "Buat Voucher" untuk memulai.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Kode</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Diskon</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Min. Booking</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Digunakan</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Berlaku</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Status</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {(vouchers ?? []).map(v => (
                                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-mono font-bold text-emerald-600">{v.code}</div>
                                        {v.description && <div className="text-xs text-slate-500 mt-0.5">{v.description}</div>}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-700">
                                        {v.discount_type === 'percentage'
                                            ? <span>{v.discount_value}%{v.max_discount ? <span className="text-xs text-slate-400 ml-1">(maks. {formatPrice(v.max_discount)})</span> : null}</span>
                                            : formatPrice(v.discount_value)
                                        }
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600">{formatPrice(v.min_booking_amount)}</td>
                                    <td className="px-4 py-3 text-sm text-slate-600">
                                        {v.used_count} {v.usage_limit ? `/ ${v.usage_limit}` : ''}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500">
                                        {fmtDate(v.valid_from)} – {fmtDate(v.valid_until)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <StatusBadge active={v.is_active} />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => openEdit(v)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
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

            {showModal && (
                <>
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={() => !saving && setShowModal(false)} />
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-800">
                                    {editingId ? 'Edit Voucher' : 'Buat Voucher Baru'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Kode Voucher *
                                    </label>
                                    <input
                                        {...field('code')}
                                        type="text"
                                        placeholder="DISC10"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code[0]}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Deskripsi
                                    </label>
                                    <textarea
                                        {...field('description')}
                                        rows={2}
                                        placeholder="Diskon spesial untuk pelanggan baru"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description[0]}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipe Diskon *</label>
                                        <select
                                            value={form.discount_type}
                                            onChange={e => setForm(f => ({ ...f, discount_type: e.target.value as 'fixed' | 'percentage' }))}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="fixed">Nominal (IDR)</option>
                                            <option value="percentage">Persentase (%)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            {form.discount_type === 'percentage' ? 'Persentase (%)' : 'Nominal (IDR)'} *
                                        </label>
                                        <input
                                            {...field('discount_value')}
                                            type="number"
                                            min="0"
                                            max={form.discount_type === 'percentage' ? 100 : undefined}
                                            placeholder={form.discount_type === 'percentage' ? '10' : '50000'}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                        {errors.discount_value && <p className="text-xs text-red-500 mt-1">{errors.discount_value[0]}</p>}
                                    </div>
                                </div>

                                {form.discount_type === 'percentage' && (
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            Maksimal Diskon (IDR)
                                        </label>
                                        <input
                                            {...field('max_discount')}
                                            type="number"
                                            min="0"
                                            placeholder="100000"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                        {errors.max_discount && <p className="text-xs text-red-500 mt-1">{errors.max_discount[0]}</p>}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Minimal Booking (IDR)
                                    </label>
                                    <input
                                        {...field('min_booking_amount')}
                                        type="number"
                                        min="0"
                                        placeholder="500000"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.min_booking_amount && <p className="text-xs text-red-500 mt-1">{errors.min_booking_amount[0]}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                        Batas Penggunaan
                                    </label>
                                    <input
                                        {...field('usage_limit')}
                                        type="number"
                                        min="1"
                                        placeholder="50"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    {errors.usage_limit && <p className="text-xs text-red-500 mt-1">{errors.usage_limit[0]}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Berlaku Dari</label>
                                        <input
                                            {...field('valid_from')}
                                            type="date"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                        {errors.valid_from && <p className="text-xs text-red-500 mt-1">{errors.valid_from[0]}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Berlaku Hingga</label>
                                        <input
                                            {...field('valid_until')}
                                            type="date"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                        {errors.valid_until && <p className="text-xs text-red-500 mt-1">{errors.valid_until[0]}</p>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={form.is_active}
                                        onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                    />
                                    <label htmlFor="is_active" className="text-sm font-medium text-slate-700 cursor-pointer">
                                        Aktifkan voucher
                                    </label>
                                </div>
                            </div>

                            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    disabled={saving}
                                    type="button"
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 cursor-pointer"
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
