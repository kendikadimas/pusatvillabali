import { Head } from '@inertiajs/react';
import { Palette } from 'lucide-react';
import AppearanceTabs from '@/components/appearance-tabs';
import { edit as editAppearance } from '@/routes/appearance';

export default function Appearance() {
    return (
        <>
            <Head title="Tampilan" />

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-slate-400" />
                        <h2 className="text-sm font-semibold text-slate-700">Tampilan</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Sesuaikan tampilan antarmuka</p>
                </div>
                <div className="px-5 py-5">
                    <AppearanceTabs />
                </div>
            </div>
        </>
    );
}

Appearance.layout = {
    breadcrumbs: [
        {
            title: 'Tampilan',
            href: editAppearance(),
        },
    ],
};
