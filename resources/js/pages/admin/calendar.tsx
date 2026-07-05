import React from 'react';
import { Head } from '@inertiajs/react';
import type { Villa } from '@/types';

interface Props {
    villas: { id: number; name: string; slug: string }[];
}

export default function AdminCalendarPage({ villas }: Props) {
    return (
        <>
            <Head title="Kalender Ketersediaan" />
            <div className="space-y-5">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Kalender</h1>
                    <p className="text-sm text-slate-500">Kelola ketersediaan dan tanggal blokir villa</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Villa</label>
                        <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-sm">
                            <option value="">-- Pilih Villa --</option>
                            {villas.map((v) => (
                                <option key={v.id} value={v.id}>{v.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="text-center py-16 text-slate-400">
                        <div className="text-4xl mb-3">📅</div>
                        <p className="text-sm">Pilih villa untuk melihat kalender ketersediaan</p>
                        <p className="text-xs mt-1 text-slate-300">Fitur kalender interaktif akan tersedia di update berikutnya</p>
                    </div>
                </div>
            </div>
        </>
    );
}
