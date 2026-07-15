import { Form, Head, usePage } from '@inertiajs/react';
import { Mail, Save, User } from 'lucide-react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { edit } from '@/routes/profile';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Pengaturan Profil" />

            <div className="space-y-6">
                {/* Profile card */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <h2 className="text-sm font-semibold text-slate-700">Informasi Profil</h2>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">Perbarui nama dan alamat email Anda</p>
                    </div>

                    <Form
                        {...ProfileController.update['/settings/profile'].form()}
                        options={{ preserveScroll: true }}
                        className="px-5 py-5 space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div>
                                    <label htmlFor="name" className="block text-xs font-medium text-slate-600 mb-1">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        autoComplete="name"
                                        defaultValue={auth.user.name}
                                        placeholder="Nama lengkap Anda"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                    />
                                    <InputError className="mt-1" message={errors.name} />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-xs font-medium text-slate-600 mb-1">
                                        Alamat Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            autoComplete="email"
                                            defaultValue={auth.user.email}
                                            placeholder="email@contoh.com"
                                            className="w-full border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                                        />
                                    </div>
                                    <InputError className="mt-1" message={errors.email} />
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
                                        Email Anda belum diverifikasi.
                                        {status === 'verification-link-sent' && (
                                            <span className="block mt-1 font-medium text-green-700">
                                                Link verifikasi baru telah dikirim ke email Anda.
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="pt-1">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        data-test="update-profile-button"
                                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition"
                                    >
                                        <Save className="w-4 h-4" />
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                {/* Delete account card */}
                <div className="bg-white rounded-xl border border-red-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-red-50">
                        <h2 className="text-sm font-semibold text-red-600">Hapus Akun</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Tindakan ini tidak dapat dibatalkan</p>
                    </div>
                    <div className="px-5 py-5">
                        <DeleteUser />
                    </div>
                </div>
            </div>
        </>
    );
}

Profile.layout = {
    breadcrumbs: [
        {
            title: 'Pengaturan Profil',
            href: edit(),
        },
    ],
};
