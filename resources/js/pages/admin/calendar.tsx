import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { CalendarX, ExternalLink } from 'lucide-react';

interface Props {
    villas: { id: number; name: string; slug: string }[];
}

export default function AdminCalendarPage({ villas }: Props) {
    const [selectedId, setSelectedId] = useState<string>('');

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedId(e.target.value);
    };

    const goToEdit = () => {
        if (selectedId) {
            router.visit(`/admin/villas/${selectedId}/edit?tab=blocked`);
        }
    };

    const selectedVilla = villas.find((v) => String(v.id) === selectedId);

    return (
        <>
            <Head title="Kalender Ketersediaan" />
            <div className="space-y-5">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Kalender</h1>
                    <p className="text-sm text-slate-500">Kelola ketersediaan dan tanggal blokir villa</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Villa</label>
                        <div className="flex gap-3 items-center">
                            <select
                                value={selectedId}
                                onChange={handleSelect}
                                className="border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-sm"
                            >
                                <option value="">-- Pilih Villa --</option>
                                {villas.map((v) => (
                                    <option key={v.id} value={v.id}>{v.name}</option>
                                ))}
                            </select>
                            {selectedId && (
                                <button
                                    onClick={goToEdit}
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition-colors whitespace-nowrap"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Kelola Tanggal Blokir
                                </button>
                            )}
                        </div>
                    </div>

                    {!selectedId && (
                        <div className="text-center py-16 text-slate-400">
                            <CalendarX className="w-10 h-10 mx-auto mb-3 text-slate-300" />
                            <p className="text-sm">Pilih villa untuk mengelola tanggal blokir</p>
                        </div>
                    )}

                    {selectedId && selectedVilla && (
                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 space-y-2">
                            <p className="text-sm font-semibold text-blue-800">{selectedVilla.name}</p>
                            <p className="text-sm text-blue-700">
                                Tanggal blokir dikelola di halaman edit villa. Klik tombol{' '}
                                <span className="font-semibold">Kelola Tanggal Blokir</span> di atas untuk membuka tab
                                Blocked Dates pada form edit villa.
                            </p>
                            <button
                                onClick={goToEdit}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 underline underline-offset-2 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                Buka halaman edit villa &rarr;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
