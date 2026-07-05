import React from 'react';
import { Head } from '@inertiajs/react';

export default function AdminUsersPage() {
    return (
        <>
            <Head title="Kelola Pengguna" />
            <div className="space-y-5">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Pengguna & Admin</h1>
                    <p className="text-sm text-slate-500">Kelola akun pengguna dan sub-admin</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                    <div className="text-5xl mb-4">👥</div>
                    <h2 className="text-lg font-bold text-slate-700 mb-2">Manajemen Pengguna</h2>
                    <p className="text-sm text-slate-500">Kelola pengguna dan sub-akun admin via API endpoint yang tersedia.</p>
                </div>
            </div>
        </>
    );
}
