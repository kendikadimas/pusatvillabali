import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import type { Villa, Destination, PaginatedData } from '@/types';
import { formatPrice } from '@/lib/format';
import { getPhotoUrl } from '@/lib/villaUtils';
import { Plus, Edit, Trash2, Search, Star, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface Props {
    villas: PaginatedData<Villa>;
    destinations: Destination[];
}

export default function AdminVillasPage({ villas, destinations }: Props) {
    const [search, setSearch] = useState('');
    const [deleting, setDeleting] = useState<number | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/villas', { search }, { preserveScroll: true });
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Hapus villa "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
        setDeleting(id);
        try {
            await axios.delete(`/api/v1/admin/villas/${id}`);
            toast.success('Villa berhasil dihapus');
            router.reload();
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? 'Gagal menghapus villa');
        } finally {
            setDeleting(null);
        }
    };

    const toggleActive = async (id: number, current: boolean) => {
        try {
            await axios.put(`/api/v1/admin/villas/${id}`, { is_active: !current });
            toast.success(current ? 'Villa dinonaktifkan' : 'Villa diaktifkan');
            router.reload();
        } catch {
            toast.error('Gagal mengubah status villa');
        }
    };

    return (
        <>
            <Head title="Kelola Villa" />

            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">Villa</h1>
                        <p className="text-sm text-slate-500">{villas.total} villa terdaftar</p>
                    </div>
                    <Link
                        href="/admin/villas/new"
                        className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Tambah Villa
                    </Link>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="flex items-center gap-2 flex-1 max-w-sm bg-white border border-slate-200 rounded-lg px-3 py-2">
                        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Cari villa..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 text-sm outline-none text-slate-700 placeholder:text-slate-400"
                        />
                    </div>
                    <button type="submit" className="text-sm bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors">
                        Cari
                    </button>
                </form>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Villa</th>
                                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Lokasi</th>
                                    <th className="text-right px-4 py-3 font-semibold text-slate-600">Harga/malam</th>
                                    <th className="text-center px-4 py-3 font-semibold text-slate-600">Kamar</th>
                                    <th className="text-center px-4 py-3 font-semibold text-slate-600">Rating</th>
                                    <th className="text-center px-4 py-3 font-semibold text-slate-600">Status</th>
                                    <th className="text-center px-4 py-3 font-semibold text-slate-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {villas.data.map((villa) => (
                                    <tr key={villa.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                                                    <img
                                                        src={getPhotoUrl(villa.photos?.[0])}
                                                        alt={villa.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 line-clamp-1">{villa.name}</p>
                                                    <p className="text-xs text-slate-400">{villa.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-slate-600 max-w-[160px] truncate">{villa.location}</td>
                                        <td className="px-4 py-4 text-right font-semibold text-slate-800">{formatPrice(villa.price_per_night)}</td>
                                        <td className="px-4 py-4 text-center text-slate-600">{villa.bedrooms}</td>
                                        <td className="px-4 py-4 text-center">
                                            <span className="flex items-center justify-center gap-1 text-amber-600">
                                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                                {villa.reviews_avg_rating ? parseFloat(String(villa.reviews_avg_rating)).toFixed(1) : '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <button
                                                onClick={() => toggleActive(villa.id, villa.is_active)}
                                                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                                    villa.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                                                }`}
                                            >
                                                {villa.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                {villa.is_active ? 'Aktif' : 'Nonaktif'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-1">
                                                <Link
                                                    href={`/admin/villas/${villa.id}/edit`}
                                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(villa.id, villa.name)}
                                                    disabled={deleting === villa.id}
                                                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {villas.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                                            Belum ada villa. <Link href="/admin/villas/new" className="text-blue-600 hover:underline">Tambah villa pertama</Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {villas.last_page > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
                            <span className="text-xs text-slate-500">
                                {villas.from}–{villas.to} dari {villas.total}
                            </span>
                            <div className="flex gap-1">
                                {Array.from({ length: villas.last_page }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => router.get('/admin/villas', { page: String(page) })}
                                        className={`w-7 h-7 rounded text-xs font-medium ${
                                            page === villas.current_page ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
