import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        router.post('/admin/login', { email, password }, {
            onError: (err) => setErrors(err),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title="Admin Login — PusatVillaBali" />
            <div className="relative grid min-h-dvh lg:grid-cols-2">

                {/* ── Left Brand Panel ── */}
                <div className="relative hidden lg:flex flex-col overflow-hidden min-h-dvh">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#14532d] via-[#166534] to-[#15803d]" />
                    {/* Subtle radial overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.08)_0%,_transparent_60%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,0,0,0.25)_0%,_transparent_55%)]" />
                    {/* Dot pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.07]"
                        style={{
                            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
                            backgroundSize: '28px 28px',
                        }}
                    />
                    {/* Decorative blobs */}
                    <div className="absolute -top-32 -right-32 h-72 w-72 rounded-full bg-green-300/10 blur-3xl" />
                    <div className="absolute bottom-0 -left-20 h-80 w-80 rounded-full bg-green-900/30 blur-3xl" />
                    <div className="absolute top-1/2 right-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

                    {/* Content */}
                    <div className="relative z-10 flex h-full flex-col p-10">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/10">
                                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6">
                                    <circle cx="100" cy="100" r="96" fill="#166534"/>
                                    <polygon points="30,118 170,118 155,98 45,98" fill="#f0fdf4"/>
                                    <polygon points="52,98 148,98 136,80 64,80" fill="#dcfce7"/>
                                    <polygon points="72,80 128,80 120,65 80,65" fill="#f0fdf4"/>
                                    <line x1="80" y1="65" x2="120" y2="65" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round"/>
                                    <rect x="72" y="118" width="56" height="36" fill="#f0fdf4"/>
                                    <path d="M91,154 L91,134 Q100,126 109,134 L109,154 Z" fill="#15803d"/>
                                    <rect x="77" y="123" width="10" height="10" rx="1" fill="#15803d" opacity="0.5"/>
                                    <rect x="113" y="123" width="10" height="10" rx="1" fill="#15803d" opacity="0.5"/>
                                    <line x1="55" y1="154" x2="145" y2="154" stroke="#86efac" strokeWidth="2" strokeLinecap="round"/>
                                    <path d="M55,154 Q42,130 30,120" stroke="#86efac" strokeWidth="3" strokeLinecap="round" fill="none"/>
                                    <path d="M55,154 Q38,138 28,138" stroke="#86efac" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                                    <path d="M145,154 Q158,130 170,120" stroke="#86efac" strokeWidth="3" strokeLinecap="round" fill="none"/>
                                    <path d="M145,154 Q162,138 172,138" stroke="#86efac" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                                    <circle cx="100" cy="44" r="5" fill="#86efac"/>
                                    <line x1="100" y1="34" x2="100" y2="32" stroke="#86efac" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="100" y1="54" x2="100" y2="56" stroke="#86efac" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="90" y1="44" x2="88" y2="44" stroke="#86efac" strokeWidth="2" strokeLinecap="round"/>
                                    <line x1="110" y1="44" x2="112" y2="44" stroke="#86efac" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <span className="text-lg font-semibold tracking-tight text-white">PusatVillaBali</span>
                        </div>

                        {/* Center messaging */}
                        <div className="mt-auto mb-auto flex flex-col gap-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3 py-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse" />
                                    <span className="text-xs font-medium text-white/80 tracking-wide uppercase">Admin Panel</span>
                                </div>
                                <h2 className="text-4xl font-bold leading-tight tracking-tight text-white">
                                    Kelola villa
                                    <br />
                                    <span className="text-green-200">
                                        dengan mudah
                                    </span>
                                    <br />
                                    dan efisien
                                </h2>
                                <p className="max-w-xs text-base leading-relaxed text-white/60">
                                    Pantau booking, kelola konten villa, dan lacak pendapatan dari satu dashboard terpusat.
                                </p>
                            </div>

                            {/* Feature pills */}
                            <div className="flex flex-col gap-3">
                                {[
                                    { icon: '◼', label: 'Manajemen booking real-time' },
                                    { icon: '◼', label: 'Laporan & analitik lengkap' },
                                    { icon: '◼', label: 'Kelola villa & ulasan tamu' },
                                ].map((f) => (
                                    <div key={f.label} className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-green-300/70 shrink-0" />
                                        <span className="text-sm text-white/70">{f.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom */}
                        <div className="border-t border-white/10 pt-6">
                            <p className="text-xs text-white/35">
                                &copy; {new Date().getFullYear()} PusatVillaBali. Akses terbatas untuk administrator.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Right Form Panel ── */}
                <div className="relative flex min-h-dvh items-center justify-center bg-slate-50 p-6 lg:p-10">
                    {/* Mobile logo */}
                    <div className="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
                        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-8">
                            <circle cx="100" cy="100" r="96" fill="#15803d"/>
                            <polygon points="30,118 170,118 155,98 45,98" fill="#f0fdf4"/>
                            <polygon points="52,98 148,98 136,80 64,80" fill="#dcfce7"/>
                            <polygon points="72,80 128,80 120,65 80,65" fill="#f0fdf4"/>
                            <rect x="72" y="118" width="56" height="36" fill="#f0fdf4"/>
                            <path d="M91,154 L91,134 Q100,126 109,134 L109,154 Z" fill="#15803d"/>
                            <path d="M55,154 Q42,130 30,120" stroke="#86efac" strokeWidth="3" strokeLinecap="round" fill="none"/>
                            <path d="M145,154 Q158,130 170,120" stroke="#86efac" strokeWidth="3" strokeLinecap="round" fill="none"/>
                        </svg>
                        <span className="text-sm font-semibold tracking-tight text-slate-900">PusatVillaBali</span>
                    </div>

                    <div className="mx-auto w-full max-w-sm">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 shadow-lg shadow-green-600/30">
                                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-7">
                                    <circle cx="100" cy="100" r="96" fill="#166534"/>
                                    <polygon points="30,118 170,118 155,98 45,98" fill="#f0fdf4"/>
                                    <polygon points="52,98 148,98 136,80 64,80" fill="#dcfce7"/>
                                    <polygon points="72,80 128,80 120,65 80,65" fill="#f0fdf4"/>
                                    <rect x="72" y="118" width="56" height="36" fill="#f0fdf4"/>
                                    <path d="M91,154 L91,134 Q100,126 109,134 L109,154 Z" fill="#15803d"/>
                                    <rect x="77" y="123" width="10" height="10" rx="1" fill="#15803d" opacity="0.5"/>
                                    <rect x="113" y="123" width="10" height="10" rx="1" fill="#15803d" opacity="0.5"/>
                                    <path d="M55,154 Q42,130 30,120" stroke="#86efac" strokeWidth="3" strokeLinecap="round" fill="none"/>
                                    <path d="M145,154 Q158,130 170,120" stroke="#86efac" strokeWidth="3" strokeLinecap="round" fill="none"/>
                                    <circle cx="100" cy="44" r="5" fill="#86efac"/>
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Masuk ke Admin Panel</h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Khusus administrator PusatVillaBali
                            </p>
                        </div>

                        {/* Form card */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        autoComplete="username"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                        className="h-10 border-slate-200 bg-slate-50 focus:border-green-500 focus:ring-green-500/20"
                                        placeholder="admin@pusatvillabali.com"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                                        Password
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="h-10 border-slate-200 bg-slate-50 focus:border-green-500 focus:ring-green-500/20"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-2 h-10 w-full bg-green-600 font-semibold text-white shadow-sm hover:bg-green-700 focus-visible:ring-green-600 disabled:opacity-60"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                            </svg>
                                            Memproses...
                                        </span>
                                    ) : 'Masuk'}
                                </Button>
                            </form>
                        </div>

                        <p className="mt-6 text-center text-xs text-slate-400">
                            Butuh akses? Hubungi super administrator.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminLoginPage.layout = false;
