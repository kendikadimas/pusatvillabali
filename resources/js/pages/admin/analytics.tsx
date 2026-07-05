import React from 'react';
import { Head } from '@inertiajs/react';

export default function AdminAnalyticsPage() {
    return (
        <>
            <Head title="Analitik" />
            <div className="space-y-5">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Analitik</h1>
                    <p className="text-sm text-slate-500">Data performa dan statistik bisnis</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                    <div className="text-5xl mb-4">📊</div>
                    <h2 className="text-lg font-bold text-slate-700 mb-2">Halaman Analitik</h2>
                    <p className="text-sm text-slate-500">Data analitik lengkap tersedia via API. Halaman ini akan menampilkan grafik pendapatan, booking trend, dan occupancy rate.</p>
                </div>
            </div>
        </>
    );
}
