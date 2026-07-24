import { router, usePage } from '@inertiajs/react';
import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { Spinner } from '@/components/ui/spinner';

export default function AuthCallback() {
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split('?')[1] || '');
    const code = searchParams.get('code');
    const errorMsg = searchParams.get('error');
    const initialError = useMemo(() => errorMsg ? decodeURIComponent(errorMsg) : null, [errorMsg]);
    const [error, setError] = useState<string | null>(initialError);

    useEffect(() => {
        if (errorMsg || !code) {
            return;
        }

        console.log('[OAuth Debug] Exchanging code:', code.substring(0, 10) + '...');

        // Exchange one-time code for a Sanctum Bearer token
        axios.post('/auth/exchange-code', { code })
            .then((res) => {
                console.log('[OAuth Debug] Exchange success:', res.data);
                const token = res.data.token;

                if (token) {
                    localStorage.setItem('sanctum_token', token);
                    console.log('[OAuth Debug] Token stored in localStorage');

                    // Store user info for Inertia shared props fallback
                    if (res.data.user) {
                        localStorage.setItem('auth_user', JSON.stringify(res.data.user));
                        console.log('[OAuth Debug] User stored:', res.data.user);
                    }
                }

                const redirectTo = sessionStorage.getItem('oauth_redirect') || '/profile';
                sessionStorage.removeItem('oauth_redirect');

                console.log('[OAuth Debug] Redirecting to:', redirectTo);
                // Full page reload so server session picks up the Sanctum token
                window.location.href = redirectTo;
            })
            .catch((err) => {
                console.error('[OAuth Debug] Exchange failed:', err.response?.data || err.message);
                setError('Gagal menukar kode otorisasi. Silakan coba login kembali.');
            });
    }, [code, errorMsg]);

    // Set error for missing code on mount (not in effect)
    if (!errorMsg && !code && !error) {
        setError('Kode otorisasi tidak ditemukan. Silakan coba lagi.');
    }

    return (
        <div className="flex min-h-dvh items-center justify-center bg-white">
            <div className="text-center">
                {error ? (
                    <div className="space-y-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                            <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">Authentication Failed</h2>
                        <p className="text-sm text-slate-500">{error}</p>
                        <button
                            onClick={() => router.visit('/login')}
                            className="mt-4 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                            Back to login
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Spinner className="mx-auto size-8" />
                        <p className="text-sm text-slate-500">Completing authentication...</p>
                    </div>
                )}
            </div>
        </div>
    );
}
