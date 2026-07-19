import { Head, Link } from '@inertiajs/react';
import axios from 'axios';
import { Plus, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
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

    // Payment methods local state so toggling updates UI immediately
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
    const [togglingId, setTogglingId] = useState<number | null>(null);

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
            await axios.patch(`/api/v1/admin/payment-methods/${pm.id}`, {
                is_active: !pm.is_active,
            });
            setPaymentMethods((prev) =>
                prev.map((p) => (p.id === pm.id ? { ...p, is_active: !p.is_active } : p))
            );
            toast.success(`${pm.name} ${!pm.is_active ? 'diaktifkan' : 'dinonaktifkan'}`);
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Gagal mengubah status metode pembayaran');
        } finally {
            setTogglingId(null);
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
                                tab === t
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-slate-500 hover:text-slate-700'
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
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        value={(form as any)[key]}
                                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                                        placeholder={placeholder}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                )}
                            </div>
                        ))}
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
                        >
                            {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                        </button>
                    </form>
                )}

                {tab === 'payment' && (
                    <div className="space-y-4">
                        {/* Header row with add button */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-slate-500">{paymentMethods.length} metode pembayaran</p>
                            <Link
                                href="/admin/payment-methods/create"
                                className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Tambah Metode
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {paymentMethods.map((pm) => {
                                const isToggling = togglingId === pm.id;

                                return (
                                    <div
                                        key={pm.id}
                                        className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                                    >
                                        {/* Info */}
                                        <div className="min-w-0">
                                            <p className="font-semibold text-slate-800">{pm.name}</p>
                                            <p className="text-xs text-slate-500 mt-0.5">
                                                {pm.type}
                                                {pm.account_number ? ` · ${pm.account_number}` : ''}
                                                {pm.account_name ? ` · ${pm.account_name}` : ''}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 shrink-0">
                                            {/* Active badge */}
                                            <span
                                                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                    pm.is_active
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-slate-100 text-slate-500'
                                                }`}
                                            >
                                                {pm.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>

                                            {/* Toggle button */}
                                            <button
                                                onClick={() => handleToggleActive(pm)}
                                                disabled={isToggling}
                                                title={pm.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
                                                    pm.is_active
                                                        ? 'text-green-600 hover:bg-green-50'
                                                        : 'text-slate-400 hover:bg-slate-100'
                                                }`}
                                            >
                                                {isToggling ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : pm.is_active ? (
                                                    <ToggleRight className="w-5 h-5" />
                                                ) : (
                                                    <ToggleLeft className="w-5 h-5" />
                                                )}
                                            </button>

                                             {/* Edit link */}
                                             <Link
                                                 href={`/admin/payment-methods/${pm.id}/edit`}
                                                 className="text-xs text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-lg transition-colors"
                                             >
                                                 Edit
                                             </Link>
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
        </>
    );
}
