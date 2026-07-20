import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search, Star, Eye, EyeOff, Home, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/format';
import { getPhotoUrl } from '@/lib/villaUtils';
import type { Villa, Destination, PaginatedData } from '@/types';

interface Props {
    villas: PaginatedData<Villa>;
    destinations: Destination[];
    stats: { total: number; active: number; inactive: number; avg_price: number };
    filters: { search: string; destination_id?: string | null; status?: string; sort?: string };
}

export default function AdminVillasPage({ villas, destinations, stats, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [destinationId, setDestinationId] = useState<string>(filters.destination_id ? String(filters.destination_id) : '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [sort, setSort] = useState(filters.sort ?? 'newest');
    const [deleting, setDeleting] = useState<number | null>(null);

    const applyFilters = (overrides: { search?: string; dest?: string; status?: string; sort?: string }) => {
        router.get('/admin/villas', {
            search: overrides.search ?? search,
            destination_id: (overrides.dest ?? destinationId) || undefined,
            status: (overrides.status ?? status) || undefined,
            sort: overrides.sort ?? sort,
        }, { preserveScroll: true });
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters({});
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Hapus villa "${name}"? Tindakan ini tidak bisa dibatalkan.`)) {
return;
}

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
            await axios.patch(`/api/v1/admin/villas/${id}`, { is_active: !current });
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
                        className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-3 sm:px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" /><span className="hidden sm:inline">Tambah Villa</span>
                    </Link>
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-blue-600 rounded-xl p-4">
                        <p className="text-xs text-white/70 mb-1">Total Villa</p>
                        <p className="text-2xl font-black text-white">{stats.total}</p>
                    </div>
                    <div className="bg-green-600 rounded-xl p-4">
                        <p className="text-xs text-white/70 mb-1">Aktif</p>
                        <p className="text-2xl font-black text-white">{stats.active}</p>
                    </div>
                    <div className="bg-slate-500 rounded-xl p-4">
                        <p className="text-xs text-white/70 mb-1">Tidak Aktif</p>
                        <p className="text-2xl font-black text-white">{stats.inactive}</p>
                    </div>
                    <div className="bg-purple-600 rounded-xl p-4">
                        <p className="text-xs text-white/70 mb-1">Rata-rata Harga</p>
                        <p className="text-lg font-black text-white">{formatPrice(stats.avg_price)}</p>
                    </div>
                </div>

                {/* Search + Filters */}
                <form onSubmit={handleSearch} className="bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex flex-col lg:flex-row gap-3">
                        <div className="flex gap-2 flex-1">
                            <div className="flex items-center gap-2 flex-1 border border-slate-200 rounded-lg px-3 py-2">
                                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Cari nama atau lokasi villa..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="flex-1 text-sm outline-none text-slate-700 placeholder:text-slate-400"
                                />
                            </div>
                            <button type="submit" className="text-sm bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 transition-colors shrink-0">
                                Cari
                            </button>
                        </div>
                        <select
                            value={destinationId}
                            onChange={(e) => { setDestinationId(e.target.value); applyFilters({ dest: e.target.value }); }}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Semua Lokasi</option>
                            {destinations.map((d) => (
                                <option key={d.id} value={d.id}>{d.name}</option>
                            ))}
                        </select>
                        <select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Semua Status</option>
                            <option value="active">Aktif</option>
                            <option value="inactive">Tidak Aktif</option>
                        </select>
                        <select
                            value={sort}
                            onChange={(e) => { setSort(e.target.value); applyFilters({ sort: e.target.value }); }}
                            className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="newest">Terbaru</option>
                            <option value="oldest">Terlama</option>
                            <option value="name_asc">Nama A-Z</option>
                            <option value="name_desc">Nama Z-A</option>
                            <option value="price_asc">Harga Terendah</option>
                            <option value="price_desc">Harga Tertinggi</option>
                            <option value="rating">Rating Tertinggi</option>
                        </select>
                    </div>
                </form>

                {/* Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    {/* Mobile cards */}
                    <div className="md:hidden divide-y divide-slate-100">
                        {villas.data.map((villa) => (
                            <div key={villa.id} className="p-4 flex items-center gap-3">
                                <div className="w-14 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                    <img src={getPhotoUrl(villa.photos?.[0])} alt={villa.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 text-sm truncate">{villa.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{villa.location}</p>
                                    <p className="text-xs font-bold text-slate-700 mt-0.5">{formatPrice(villa.price_per_night)}/malam</p>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button onClick={() => toggleActive(villa.id, villa.is_active)}
                                        className={`text-xs px-2 py-1 rounded-full font-semibold ${villa.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {villa.is_active ? 'Aktif' : 'Nonaktif'}
                                    </button>
                                    <Link href={`/admin/villas/${villa.id}/edit`} className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg">
                                        <Edit className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(villa.id, villa.name)}
                                        disabled={deleting === villa.id}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {villas.data.length === 0 && (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                Belum ada villa. <Link href="/admin/villas/new" className="text-blue-600 hover:underline">Tambah villa pertama</Link>
                            </div>
                        )}
                    </div>

                    <div className="hidden md:block overflow-x-auto">
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
                                        onClick={() => router.get('/admin/villas', { search, destination_id: destinationId || undefined, status: status || undefined, sort, page: String(page) })}
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
