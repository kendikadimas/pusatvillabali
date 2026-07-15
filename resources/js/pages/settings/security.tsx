import { Form, Head } from '@inertiajs/react';
import { KeyRound, Save, Shield } from 'lucide-react';
import { useRef } from 'react';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/input-error';
import type { Props as ManageTwoFactorProps } from '@/components/manage-two-factor';
import ManageTwoFactor from '@/components/manage-two-factor';
import PasswordInput from '@/components/password-input';
import { edit } from '@/routes/security';

type Props = {
    passwordRules: string;
} & ManageTwoFactorProps;

export default function Security(props: Props) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <>
            <Head title="Keamanan Akun" />

            <div className="space-y-6">
                {/* Password card */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-slate-400" />
                            <h2 className="text-sm font-semibold text-slate-700">Ubah Password</h2>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">Gunakan password yang kuat dan unik</p>
                    </div>

                    <Form
                        {...SecurityController.update['/settings/password'].form()}
                        options={{ preserveScroll: true }}
                        resetOnError={['password', 'password_confirmation', 'current_password']}
                        resetOnSuccess
                        onError={(errors) => {
                            if (errors.password) {
passwordInput.current?.focus();
}

                            if (errors.current_password) {
currentPasswordInput.current?.focus();
}
                        }}
                        className="px-5 py-5 space-y-4"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div>
                                    <label htmlFor="current_password" className="block text-xs font-medium text-slate-600 mb-1">
                                        Password Saat Ini
                                    </label>
                                    <PasswordInput
                                        id="current_password"
                                        name="current_password"
                                        autoComplete="current-password"
                                        ref={currentPasswordInput}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                    />
                                    <InputError className="mt-1" message={errors.current_password} />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-xs font-medium text-slate-600 mb-1">
                                        Password Baru
                                    </label>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        autoComplete="new-password"
                                        ref={passwordInput}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                    />
                                    <InputError className="mt-1" message={errors.password} />
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="block text-xs font-medium text-slate-600 mb-1">
                                        Konfirmasi Password Baru
                                    </label>
                                    <PasswordInput
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        autoComplete="new-password"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                    />
                                    <InputError className="mt-1" message={errors.password_confirmation} />
                                </div>

                                <div className="pt-1">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        data-test="update-password-button"
                                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
                                    >
                                        <Save className="w-4 h-4" />
                                        {processing ? 'Menyimpan...' : 'Simpan Password'}
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* Two-factor card */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-slate-400" />
                            <h2 className="text-sm font-semibold text-slate-700">Autentikasi Dua Faktor</h2>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">Tambahkan lapisan keamanan ekstra pada akun Anda</p>
                    </div>
                    <div className="px-5 py-5">
                        <ManageTwoFactor
                            canManageTwoFactor={props.canManageTwoFactor}
                            requiresConfirmation={props.requiresConfirmation}
                            twoFactorEnabled={props.twoFactorEnabled}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

Security.layout = {
    breadcrumbs: [
        {
            title: 'Keamanan Akun',
            href: edit(),
        },
    ],
};
