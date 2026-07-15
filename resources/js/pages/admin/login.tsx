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
            <Head title="Admin Login" />
            <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-black text-xl">PV</span>
                        </div>
                        <h1 className="text-2xl font-black text-white">Admin Panel</h1>
                        <p className="text-slate-400 text-sm mt-1">Masuk sebagai administrator</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-2xl p-7">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                    className="mt-1"
                                    placeholder="admin@example.com"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                                <PasswordInput
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="mt-1"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <Button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700">
                                {processing ? 'Memproses...' : 'Masuk'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

AdminLoginPage.layout = null;
