import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import React, { useState } from 'react';
import GoogleLoginButton from '@/components/google-login-button';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const res = await axios.post('/api/v1/login', { email, password, remember });
            const token = res.data.token;

            if (token) {
                localStorage.setItem('sanctum_token', token);

                if (res.data.user) {
                    localStorage.setItem('auth_user', JSON.stringify(res.data.user));
                }
            }

            // Redirect to intended page or dashboard
            const redirectTo = sessionStorage.getItem('oauth_redirect') || '/profile';
            sessionStorage.removeItem('oauth_redirect');
            router.visit(redirectTo, { replace: true });
        } catch (err: any) {
            if (err.response?.data?.errors) {
                const raw = err.response.data.errors;
                const flat: Record<string, string> = {};
                Object.keys(raw).forEach((k) => {
                    flat[k] = Array.isArray(raw[k]) ? raw[k][0] : raw[k];
                });
                setErrors(flat);
            } else {
                setErrors({ email: err.response?.data?.message ?? 'Login gagal. Silakan coba lagi.' });
            }
        } finally {
            setProcessing(false);
        }
    };

    return (
        <>
            <Head title="Log in" />

            <div className="mb-6 space-y-3">
                <GoogleLoginButton />
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wide">
                    <span className="bg-white px-3 text-slate-400">
                        Or sign in with email
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid gap-5">
                    <div className="grid gap-1.5">
                        <Label
                            htmlFor="email"
                            className="text-sm sm:text-base font-medium text-slate-700"
                        >
                            Email address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-10 rounded-lg border-slate-300 bg-white transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-1.5">
                        <div className="flex items-center">
                            <Label
                                htmlFor="password"
                                className="text-sm sm:text-base font-medium text-slate-700"
                            >
                                Password
                            </Label>
                            {canResetPassword && (
                                <TextLink
                                    href={request()}
                                    className="ml-auto text-sm font-medium text-blue-600 hover:text-blue-700"
                                    tabIndex={5}
                                >
                                    Forgot your password?
                                </TextLink>
                            )}
                        </div>
                        <PasswordInput
                            id="password"
                            name="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            inputClassName="h-10 rounded-lg border-slate-300 bg-white transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            tabIndex={3}
                            checked={remember}
                            onCheckedChange={(v) => setRemember(!!v)}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <Label
                            htmlFor="remember"
                            className="text-sm sm:text-base text-slate-600"
                        >
                            Remember me
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        className="mt-2 h-11 w-full rounded-lg bg-blue-600 text-base font-semibold text-white transition-all duration-200 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60"
                        tabIndex={4}
                        disabled={processing}
                        data-test="login-button"
                    >
                        {processing && <Spinner className="mr-2" />}
                        {processing ? 'Signing in...' : 'Log in'}
                    </Button>
                </div>

                <div className="mt-2 text-center text-sm text-slate-500">
                    Don't have an account?{' '}
                    <TextLink
                        href={register()}
                        tabIndex={5}
                        className="font-semibold text-blue-600 hover:text-blue-700"
                    >
                        Sign up
                    </TextLink>
                </div>
            </form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-blue-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Welcome back',
    description: 'Enter your credentials to access your account',
};
