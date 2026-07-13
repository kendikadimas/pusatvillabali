import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import axios from 'axios';
import { toast } from 'sonner';
import { Plus, Trash2, RefreshCw, ShieldCheck } from 'lucide-react';

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
    permissions: string[];
    active_sessions: number;
    created_at: string;
}

const ALL_PERMISSIONS = [
    'bookings.view',
    'bookings.manage',
    'villas.view',
    'villas.manage',
    'reviews.view',
    'reviews.manage',
    'destinations.view',
    'destinations.manage',
    'payment_methods.view',
    'payment_methods.manage',
    'analytics.view',
    'settings.view',
    'settings.manage',
];

const PERMISSION_LABELS: Record<string, string> = {
    'bookings.view': 'Lihat Pemesanan',
    'bookings.manage': 'Kelola Pemesanan',
    'villas.view': 'Lihat Villa',
    'villas.manage': 'Kelola Villa',
    'reviews.view': 'Lihat Ulasan',
    'reviews.manage': 'Kelola Ulasan',
    'destinations.view': 'Lihat Destinasi',
    'destinations.manage': 'Kelola Destinasi',
    'payment_methods.view': 'Lihat Metode Bayar',
    'payment_methods.manage': 'Kelola Metode Bayar',
    'analytics.view': 'Lihat Analitik',
    'settings.view': 'Lihat Pengaturan',
    'settings.manage': 'Kelola Pengaturan',
};

const emptyForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    permissions: [] as string[],
};

export default function AdminUsersPage() {
    const { auth } = usePage<{ auth: { user: { role: string } } }>().props;
    const isSuperAdmin = auth?.user?.role === 'super_admin';

    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ ...emptyForm });
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/v1/admin/admins');
            setAdmins(res.data.data);
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Gagal memuat daftar admin');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isSuperAdmin) {
            fetchAdmins();
        }
    }, [isSuperAdmin]);

    const togglePermission = (perm: string) => {
        setForm((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(perm)
                ? prev.permissions.filter((p) => p !== perm)
                : [...prev.permissions, perm],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setErrors({});
        try {
            await axios.post('/api/v1/admin/admins', form);
            toast.success('Admin berhasil dibuat');
            setShowModal(false);
            setForm({ ...emptyForm });
            fetchAdmins();
        } catch (err: any) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors ?? {});
            } else {
                toast.error(err.response?.data?.message ?? 'Gagal membuat admin');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (admin: AdminUser) => {
        if (!window.confirm(`Hapus admin "${admin.name}"? Semua sesinya akan diakhiri.`)) return;
        try {
            await axios.delete(`/api/v1/admin/admins/${admin.id}`);
            toast.success('Admin berhasil dihapus');
            setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Gagal menghapus admin');
        }
    };

    if (!isSuperAdmin) {
        return (
            <>
                <Head title="Kelola Pengguna" />
                <div className="space-y-5">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Pengguna & Admin</h1>
                        <p className="text-sm text-slate-500">Kelola akun pengguna dan sub-admin</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
                        <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                        <p className="text-sm font-semibold text-slate-700">Akses Terbatas</p>
                        <p className="text-sm text-slate-400 mt-1">Hanya Super Admin yang dapat mengelola akun admin.</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Kelola Pengguna" />
            <div className="space-y-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Pengguna & Admin</h1>
                        <p className="text-sm text-slate-500">Kelola akun sub-admin dan hak akses</p>
                    </div>
                    <button
                        onClick={() => { setShowModal(true); setForm({ ...emptyForm }); setErrors({}); }}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Admin
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    {/* Mobile card view */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {loading && (
                            <div className="p-6 text-center text-slate-400">
                                <RefreshCw className="w-5 h-5 mx-auto animate-spin" />
                            </div>
                        )}
                        {!loading && admins.length === 0 && (
                            <div className="p-6 text-center text-slate-400 text-sm">
                                Belum ada sub-admin. Klik "Tambah Admin" untuk membuat.
                            </div>
                        )}
                        {admins.map(u => (
                            <div key={u.id} className="p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-sm text-slate-800">{u.name}</p>
                                    <p className="text-xs text-slate-500">{u.email}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${u.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {u.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                    </span>
                                </div>
                                <button onClick={() => handleDelete(u)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Nama</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">Email</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Role</th>
                                    <th className="text-center px-4 py-3 font-semibold text-slate-600">Permissions</th>
                                    <th className="text-center px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">Sesi Aktif</th>
                                    <th className="text-center px-4 py-3 font-semibold text-slate-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {loading && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                                            <RefreshCw className="w-5 h-5 mx-auto animate-spin" />
                                        </td>
                                    </tr>
                                )}
                                {!loading && admins.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                                            Belum ada sub-admin. Klik "Tambah Admin" untuk membuat.
                                        </td>
                                    </tr>
                                )}
                                {admins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-slate-50">
                                        <td className="px-5 py-3 font-semibold text-slate-800">{admin.name}</td>
                                        <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">{admin.email}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full">
                                                {admin.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                                                {admin.permissions.length} izin
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-slate-600 hidden sm:table-cell">{admin.active_sessions}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleDelete(admin)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex"
                                                title="Hapus Admin"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800">Tambah Sub-Admin</h2>
                            <p className="text-sm text-slate-500 mt-0.5">Buat akun admin dengan hak akses terbatas</p>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Nama lengkap"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name[0]}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="admin@example.com"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email[0]}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="Min. 8 karakter"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password[0]}</p>}
                            </div>

                            {/* Password confirmation */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Konfirmasi Password</label>
                                <input
                                    type="password"
                                    value={form.password_confirmation}
                                    onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                                    placeholder="Ulangi password"
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Permissions */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Hak Akses (Permissions)</label>
                                <div className="border border-slate-200 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {ALL_PERMISSIONS.map((perm) => (
                                        <label key={perm} className="flex items-center gap-2.5 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={form.permissions.includes(perm)}
                                                onChange={() => togglePermission(perm)}
                                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="text-xs text-slate-700 group-hover:text-slate-900">
                                                {PERMISSION_LABELS[perm] ?? perm}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.permissions && <p className="text-xs text-red-500 mt-1">{errors.permissions[0]}</p>}
                                <div className="flex gap-3 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, permissions: [...ALL_PERMISSIONS] })}
                                        className="text-xs text-blue-600 hover:underline"
                                    >
                                        Pilih semua
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, permissions: [] })}
                                        className="text-xs text-slate-400 hover:underline"
                                    >
                                        Hapus semua
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 border border-slate-200 text-slate-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60"
                                >
                                    {submitting ? 'Menyimpan...' : 'Buat Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
