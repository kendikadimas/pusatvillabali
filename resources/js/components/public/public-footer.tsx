import { Link, usePage } from '@inertiajs/react';
import { Mail, MapPin } from 'lucide-react';
import React from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import type { AppSettings } from '@/types';

const formatWhatsAppDisplay = (num: string): string => {
    if (!num) {
return '';
}

    const clean = num.replace(/\D/g, '');

    if (clean.length >= 12) {
        return `+${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5, 9)} ${clean.slice(9)}`;
    }

    return `+${clean}`;
};

export default function PublicFooter() {
    const { settings } = usePage<{ settings: AppSettings }>().props;
    const appName = settings?.settings_prop_name ?? 'PusatVillaBali';
    const whatsappRaw = settings?.settings_whatsapp ?? '6281234567890';
    const whatsappDisplay = formatWhatsAppDisplay(whatsappRaw);
    const email = settings?.settings_email ?? '';

    return (
        <footer className="relative bg-gradient-to-b from-emerald-900 via-emerald-950 to-emerald-950 text-white overflow-hidden">
            {/* Decorative background patterns */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 1px, transparent 1px), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 1px, transparent 1px)',
                    backgroundSize: '60px 60px, 40px 40px',
                }}
            />
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl" />

            <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-10 lg:px-16 xl:px-20 pt-16 sm:pt-20 pb-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

                    {/* ── Brand (4 cols) ── */}
                    <div className="lg:col-span-4 space-y-5">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="w-11 h-11 bg-emerald-500/15 rounded-xl flex items-center justify-center ring-1 ring-emerald-400/20 group-hover:ring-emerald-400/40 transition-all text-emerald-300">
                                <AppLogoIcon className="size-6" />
                            </div>
                            <div>
                                <span className="text-lg font-black tracking-tight text-white font-heading">{appName}</span>
                                <p className="text-[10px] text-emerald-400/60 tracking-widest uppercase">Agen Villa Bali</p>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed text-emerald-200/65 max-w-sm">
                            Agen villa terpercaya di Bali — kami kurasi properti terbaik, urus semua kebutuhan Anda, Anda tinggal menikmati liburan.
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                            <a href={`https://wa.me/${whatsappRaw}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-emerald-500/10 hover:bg-emerald-500/25 flex items-center justify-center transition-colors" aria-label="WhatsApp">
                                <svg className="w-4 h-4 text-emerald-300" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                            </a>
                            {email && (
                                <a href={`mailto:${email}`} className="w-9 h-9 rounded-full bg-emerald-500/10 hover:bg-emerald-500/25 flex items-center justify-center transition-colors" aria-label="Email">
                                    <Mail className="w-4 h-4 text-emerald-300" />
                                </a>
                            )}
                            <a href="/villas" className="w-9 h-9 rounded-full bg-emerald-500/10 hover:bg-emerald-500/25 flex items-center justify-center transition-colors" aria-label="Semua Villa">
                                <MapPin className="w-4 h-4 text-emerald-300" />
                            </a>
                        </div>
                    </div>

                    {/* ── Jelajahi (2 cols) ── */}
                    <div className="lg:col-span-2 space-y-5">
                        <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-[0.15em] font-heading">Jelajahi</h3>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Semua Villa', href: '/villas' },
                                { label: 'Villa Seminyak', href: '/villas?location=Seminyak' },
                                { label: 'Villa Canggu', href: '/villas?location=Canggu' },
                                { label: 'Villa Legian', href: '/villas?location=Legian' },
                                { label: 'Villa Kuta', href: '/villas?location=Kuta' },
                                { label: 'Villa Jimbaran', href: '/villas?location=Jimbaran' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="group inline-flex items-center gap-1.5 text-sm text-emerald-200/65 hover:text-white transition-colors">
                                        <span className="w-1 h-1 rounded-full bg-emerald-500/40 group-hover:bg-emerald-400 transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Populer (2 cols) ── */}
                    <div className="lg:col-span-2 space-y-5">
                        <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-[0.15em] font-heading">Populer</h3>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Villa Nusa Dua', href: '/villas?location=Nusa Dua' },
                                { label: 'Villa Uluwatu', href: '/villas?location=Uluwatu' },
                                { label: 'Villa Ubud', href: '/villas?location=Ubud' },
                                { label: 'Villa Kintamani', href: '/villas?location=Kintamani' },
                                { label: 'Villa Sanur', href: '/villas?location=Sanur' },
                                { label: 'Cek Status Booking', href: '/booking/status' },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link href={link.href} className="group inline-flex items-center gap-1.5 text-sm text-emerald-200/65 hover:text-white transition-colors">
                                        <span className="w-1 h-1 rounded-full bg-emerald-500/40 group-hover:bg-emerald-400 transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Kontak (4 cols) ── */}
                    <div className="lg:col-span-4 space-y-5">
                        <h3 className="text-xs font-bold text-emerald-300 uppercase tracking-[0.15em] font-heading">Kontak</h3>
                        <ul className="space-y-3.5">
                            {whatsappRaw && (
                                <li>
                                    <a href={`https://wa.me/${whatsappRaw}`} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 group">
                                        <span className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 group-hover:bg-green-500/20 transition-colors">
                                            <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                            </svg>
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-white group-hover:text-emerald-200 transition-colors">{whatsappDisplay}</p>
                                            <p className="text-xs text-emerald-400/60">Hubungi via WhatsApp</p>
                                        </div>
                                    </a>
                                </li>
                            )}
                            {email && (
                                <li>
                                    <a href={`mailto:${email}`}
                                        className="flex items-center gap-3 group">
                                        <span className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                                            <Mail className="w-5 h-5 text-emerald-400" />
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-white group-hover:text-emerald-200 transition-colors">{email}</p>
                                            <p className="text-xs text-emerald-400/60">Kirim email</p>
                                        </div>
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                </div>

                {/* ── Bottom Bar ── */}
                <div className="mt-16 sm:mt-20 pt-6 pb-6 border-t border-emerald-700/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <p className="text-emerald-400/60 text-center sm:text-left">
                        &copy; {new Date().getFullYear()} {appName}. Semua hak cipta dilindungi.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/villas" className="text-emerald-400/60 hover:text-emerald-300 transition-colors">Villa</Link>
                        <Link href="/wishlist" className="text-emerald-400/60 hover:text-emerald-300 transition-colors">Wishlist</Link>
                        <Link href="/login" className="text-emerald-400/60 hover:text-emerald-300 transition-colors">Masuk</Link>
                    </div>

                </div>
            </div>
        </footer>
    );
}
