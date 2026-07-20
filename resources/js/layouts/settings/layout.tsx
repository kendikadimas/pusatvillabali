import { Link } from '@inertiajs/react';
import { KeyRound, Palette, User } from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';

const navItems = [
    { title: 'Profil', href: edit(), icon: User },
    { title: 'Keamanan', href: editSecurity(), icon: KeyRound },
    { title: 'Tampilan', href: '/settings/appearance', icon: Palette },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800">Pengaturan Akun</h1>
                    <p className="text-sm text-slate-500 mt-1">Kelola profil dan preferensi akun Anda</p>
                </div>

                <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
                    {/* Sidebar nav */}
                    <aside className="lg:w-52 flex-shrink-0">
                        <nav className="flex flex-row lg:flex-col gap-1 bg-white rounded-xl border border-slate-200 p-2 overflow-x-auto">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = isCurrentOrParentUrl(item.href);

                                return (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className={cn(
                                            'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-1 lg:flex-none',
                                            active
                                                ? 'bg-slate-900 text-white'
                                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800',
                                        )}
                                    >
                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    {/* Content */}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
