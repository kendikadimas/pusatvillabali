import { Head } from '@inertiajs/react';
import axios from 'axios';
import { Edit, Loader2, Plus, ToggleLeft, ToggleRight, Trash2, Upload, X } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import type { PaymentMethod } from '@/types';

interface Settings {
    [key: string]: string | null | undefined;
}

interface Props {
    settings: Settings;
    paymentMethods: PaymentMethod[];
}

const PM_TYPES = ['bank_transfer', 'ewallet', 'payment_gateway', 'cash'] as const;

const emptyPmForm = {
    name: '',
    code: '',
    type: 'bank_transfer' as PaymentMethod['type'],
    account_number: '',
    account_name: '',
    logo_url: '',
    admin_fee: '0',
    is_active: true,
};

export default function AdminSettingsPage({ settings, paymentMethods: initialPaymentMethods }: Props) {
    const [tab, setTab] = useState<'general' | 'payment'>('general');
    const [form, setForm] = useState({
        settings_prop_name: settings.settings_prop_name ?? '',
        settings_whatsapp: settings.settings_whatsapp ?? '',
        settings_email: settings.settings_email ?? '',
        settings_address: settings.settings_address ?? '',
        settings_meta_title: settings.settings_meta_title ?? '',
        settings_meta_description: settings.settings_meta_description ?? '',
    });
    const [saving, setSaving] = useState(false);

    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    // Payment method modal
    const [pmModal, setPmModal] = useState(false);
    const [editingPm, setEditingPm] = useState<PaymentMethod | null>(null);
    const [pmForm, setPmForm] = useState({ ...emptyPmForm });
    const [pmSaving, setPmSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [pmErrors, setPmErrors] = useState<Record<string, string>>({});

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await axios.post('/api/v1/admin/settings', form);
            toast.success('Pengaturan berhasil disimpan');
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Gagal menyimpan pengaturan');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async (pm: PaymentMethod) => {
        setTogglingId(pm.id);

        try {
            await axios.patch(`/api/v1/admin/payment-methods/${pm.id}/toggle`);
            setPaymentMethods((prev) => prev.map((p) => (p.id === pm.id ? { ...p, is_active: !p.is_active } : p)));
            toast.success(`${pm.name} ${!pm.is_active ? 'diaktifkan' : 'dinonaktifkan'}`);
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Gagal mengubah status');
        } finally {
            setTogglingId(null);
        }
    };

    const openPmCreate = () => {
        setEditingPm(null);
        setPmForm({ ...emptyPmForm });
        setPmErrors({});
        setPmModal(true);
    };

    const openPmEdit = (pm: PaymentMethod) => {
        setEditingPm(pm);
        setPmForm({
            name: pm.name,
            code: pm.code,
            type: pm.type,
            account_number: pm.account_number ?? '',
            account_name: pm.account_name ?? '',
            logo_url: pm.logo ?? '',
            admin_fee: String(pm.admin_fee ?? 0),
            is_active: pm.is_active,
        });
        setPmErrors({});
        setPmModal(true);
    };

    const closePmModal = () => {
        setPmModal(false);
        setEditingPm(null);
        setPmForm({ ...emptyPmForm });
        setPmErrors({});
    };

    const handleLogoUpload = async (file: File) => {
        setUploadingLogo(true);

        try {
            const fd = new FormData();
            fd.append('logo', file);
            const res = await axios.post('/api/v1/admin/payment-methods/upload-logo', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setPmForm((f) => ({ ...f, logo_url: res.data.logo_url }));
            toast.success('Logo berhasil diunggah');
        } catch {
            toast.error('Gagal mengunggah logo');
        } finally {
            setUploadingLogo(false);
        }
    };

    const handlePmSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setPmSaving(true);
        setPmErrors({});
        const payload = {
            name: pmForm.name,
            code: pmForm.code,
            type: pmForm.type,
            account_number: pmForm.account_number,
            account_name: pmForm.account_name,
            logo_url: pmForm.logo_url || null,
            admin_fee: parseInt(pmForm.admin_fee) || 0,
            is_active: pmForm.is_active,
        };

        try {
            if (editingPm) {
                const res = await axios.put(`/api/v1/admin/payment-methods/${editingPm.id}`, payload);
                const updated = res.data.payment_method;
                setPaymentMethods((prev) => prev.map((p) => (p.id === editingPm.id ? { ...p, ...updated } : p)));
                toast.success('Metode pembayaran diperbarui');
            } else {
                const res = await axios.post('/api/v1/admin/payment-methods', payload);
                setPaymentMethods((prev) => [...prev, res.data.payment_method]);
                toast.success('Metode pembayaran ditambahkan');
            }

            closePmModal();
        } catch (err: any) {
            if (err.response?.data?.errors) {
                const raw = err.response.data.errors as Record<string, string[]>;
                setPmErrors(Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, v[0]])));
            } else {
                toast.error(err.response?.data?.message ?? 'Gagal menyimpan');
            }
        } finally {
            setPmSaving(false);
        }
    };

    const handlePmDelete = async (pm: PaymentMethod) => {
        if (!confirm(`Hapus metode pembayaran "${pm.name}"?`)) {
return;
}

        try {
            await axios.delete(`/api/v1/admin/payment-methods/${pm.id}`);
            setPaymentMethods((prev) => prev.filter((p) => p.id !== pm.id));
            toast.success('Metode pembayaran dihapus');
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Gagal menghapus');
        }
    };

    return (
        <>
            <Head title="Pengaturan" />
            <div className="space-y-5 max-w-3xl">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Pengaturan</h1>
                    <p className="text-sm text-slate-500">Kelola konfigurasi sistem</p>
                </div>

                <div className="flex gap-2 border-b border-slate-200">
                    {(['general', 'payment'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                                tab === t ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {t === 'general' ? 'Umum' : 'Metode Pembayaran'}
                        </button>
                    ))}
                </div>

                {tab === 'general' && (
                    <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                        {[
                            { key: 'settings_prop_name', label: 'Nama Properti', placeholder: 'PusatVillaBali' },
                            { key: 'settings_whatsapp', label: 'WhatsApp (no. internasional)', placeholder: '6281234567890' },
                            { key: 'settings_email', label: 'Email Kontak', placeholder: 'admin@example.com' },
                            { key: 'settings_address', label: 'Alamat', placeholder: 'Jl. ...' },
                            { key: 'settings_meta_title', label: 'Meta Title (SEO)', placeholder: 'PusatVillaBali - Sewa Villa Premium' },
                            { key: 'settings_meta_description', label: 'Meta Description (SEO)', placeholder: 'Platform sewa villa...' },
                        ].map(({ key, label, placeholder }) => (
                            <div key={key}>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                                {key === 'settings_meta_description' ? (
                                    <textarea
                                        value={(form as any)[key]}
                                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                        placeholder={placeholder}
                                        rows={3}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={(form as any)[key]}
                                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                        placeholder={placeholder}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                )}
                            </div>
                        ))}
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-60"
                        >
                            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </button>
                    </form>
                )}

                {tab === 'payment' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">{paymentMethods.length} metode pembayaran</p>
                            <button
                                onClick={openPmCreate}
                                className="inline-flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline">Tambah Metode</span>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {paymentMethods.map((pm) => {
                                const isToggling = togglingId === pm.id;

                                return (
                                    <div key={pm.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {pm.logo && (
                                                <img src={pm.logo} alt={pm.name} className="w-8 h-8 object-contain rounded" />
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-800">{pm.name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {pm.type}
                                                    {pm.account_number ? ` · ${pm.account_number}` : ''}
                                                    {pm.account_name ? ` · ${pm.account_name}` : ''}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${pm.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                {pm.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                            <button
                                                onClick={() => handleToggleActive(pm)}
                                                disabled={isToggling}
                                                title={pm.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer ${pm.is_active ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:bg-slate-100'}`}
                                            >
                                                {isToggling ? <Loader2 className="w-5 h-5 animate-spin" /> : pm.is_active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                                            </button>
                                            <button
                                                onClick={() => openPmEdit(pm)}
                                                className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handlePmDelete(pm)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {paymentMethods.length === 0 && (
                                <div className="text-center py-12 text-slate-400 bg-white border border-slate-200 rounded-2xl">
                                    <p className="text-sm">Belum ada metode pembayaran</p>
                                    <p className="text-xs mt-1">Klik "Tambah Metode" untuk membuat yang pertama</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Payment method modal */}
            {pmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <h2 className="font-bold text-slate-800">{editingPm ? 'Edit Metode Pembayaran' : 'Tambah Metode Pembayaran'}</h2>
                            <button type="button" onClick={closePmModal} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                                <X className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handlePmSave} className="p-5 space-y-4">
                            {/* Logo upload */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Logo</label>
                                <label className="flex items-center gap-3 border border-dashed border-slate-300 rounded-xl p-3 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors">
                                    {pmForm.logo_url ? (
                                        <img src={pmForm.logo_url} alt="Logo" className="w-10 h-10 object-contain rounded" />
                                    ) : (
                                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center">
                                            <Upload className="w-4 h-4 text-slate-400" />
                                        </div>
                                    )}
                                    <span className="text-xs text-slate-500">
                                        {uploadingLogo ? 'Mengunggah...' : pmForm.logo_url ? 'Ganti logo' : 'Pilih logo (opsional)'}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                                        className="hidden"
                                        disabled={uploadingLogo}
                                        onChange={(e) => {
 const f = e.target.files?.[0];

 if (f) {
handleLogoUpload(f);
} 
}}
                                    />
                                </label>
                                {pmForm.logo_url && (
                                    <button type="button" onClick={() => setPmForm((f) => ({ ...f, logo_url: '' }))} className="mt-1 text-xs text-red-500 hover:text-red-700 cursor-pointer">
                                        Hapus logo
                                    </button>
                                )}
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Nama *</label>
                                <input type="text" required value={pmForm.name} onChange={(e) => setPmForm((f) => ({ ...f, name: e.target.value }))}
                                    placeholder="BCA Transfer" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                                {pmErrors.name && <p className="text-xs text-red-500 mt-1">{pmErrors.name}</p>}
                            </div>

                            {/* Code */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Kode *</label>
                                <input type="text" required value={pmForm.code} onChange={(e) => setPmForm((f) => ({ ...f, code: e.target.value }))}
                                    placeholder="bca" disabled={!!editingPm}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-50 disabled:text-slate-400" />
                                {pmErrors.code && <p className="text-xs text-red-500 mt-1">{pmErrors.code}</p>}
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Tipe *</label>
                                <select value={pmForm.type} onChange={(e) => setPmForm((f) => ({ ...f, type: e.target.value as PaymentMethod['type'] }))}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500">
                                    {PM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            {/* Account number */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">
                                    No. Rekening {pmForm.type !== 'cash' && pmForm.code !== 'qris' ? '*' : ''}
                                </label>
                                <input type="text" value={pmForm.account_number} onChange={(e) => setPmForm((f) => ({ ...f, account_number: e.target.value }))}
                                    placeholder="1234567890" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                                {pmErrors.account_number && <p className="text-xs text-red-500 mt-1">{pmErrors.account_number}</p>}
                            </div>

                            {/* Account name */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Nama Pemilik *</label>
                                <input type="text" required value={pmForm.account_name} onChange={(e) => setPmForm((f) => ({ ...f, account_name: e.target.value }))}
                                    placeholder="PT. Pusat Villa" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                                {pmErrors.account_name && <p className="text-xs text-red-500 mt-1">{pmErrors.account_name}</p>}
                            </div>

                            {/* Admin fee */}
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1">Biaya Admin (Rp)</label>
                                <input type="number" min="0" value={pmForm.admin_fee} onChange={(e) => setPmForm((f) => ({ ...f, admin_fee: e.target.value }))}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                            </div>

                            {/* Active toggle */}
                            <div className="flex items-center gap-3">
                                <button type="button" role="switch" aria-checked={pmForm.is_active}
                                    onClick={() => setPmForm((f) => ({ ...f, is_active: !f.is_active }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${pmForm.is_active ? 'bg-green-500' : 'bg-slate-200'}`}>
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${pmForm.is_active ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <span className="text-sm text-slate-700">Aktif</span>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={closePmModal} className="flex-1 border border-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl hover:bg-slate-50 text-sm cursor-pointer">
                                    Batal
                                </button>
                                <button type="submit" disabled={pmSaving || uploadingLogo} className="flex-1 bg-emerald-600 text-white font-semibold py-2.5 rounded-xl hover:bg-emerald-700 disabled:opacity-60 text-sm cursor-pointer">
                                    {pmSaving ? 'Menyimpan...' : editingPm ? 'Simpan' : 'Tambah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
