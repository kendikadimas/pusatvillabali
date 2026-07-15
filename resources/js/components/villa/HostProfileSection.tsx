import { Check, ShieldCheck, Shield } from 'lucide-react';
import React from 'react';
import { getHostAboutIcon } from '@/lib/villaIcons';

interface CoHost {
    name: string;
    avatar: string;
}

interface HostProfileSectionProps {
    hostName: string;
    hostAvatar: string;
    hostYears: number;
    hostIsVerified: boolean;
    hostAboutList: string[];
    coHosts: CoHost[];
    hostJoinedLabel: string;
    reviewsCount: number;
    avgRating: number;
}

export default function HostProfileSection({
    hostName, hostAvatar, hostYears, hostIsVerified,
    hostAboutList, coHosts, hostJoinedLabel, reviewsCount, avgRating
}: HostProfileSectionProps) {
    const coHostFallbackAvatar = 'https://ui-avatars.com/api/?name=CoHost&background=e2e8f0&color=475569&size=120';

    return (
        <div className="border-t border-b border-slate-200/80 py-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl md:text-[22px] font-semibold text-slate-900 tracking-tight">
                        Dipandu oleh {hostName}
                    </h2>
                    <div className="flex items-center space-x-1.5 text-slate-500 text-xs font-semibold mt-1">
                        {hostIsVerified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                        <span>{hostJoinedLabel}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 items-start">
                <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                        <img
                            src={hostAvatar}
                            alt={hostName}
                            className="w-28 h-28 rounded-full object-cover shadow-sm border border-slate-100"
                        />
                        {hostIsVerified && (
                            <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                                <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                        )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{hostName}</h3>
                    {hostIsVerified && (
                        <div className="text-[11px] text-blue-500 font-bold mt-1">Superhost</div>
                    )}
                    <div className="text-[12px] text-slate-500 mt-2 space-y-0.5">
                        {reviewsCount > 0 && <p>{reviewsCount} ulasan</p>}
                        {avgRating > 0 && <p>Rating {avgRating.toFixed(1)}</p>}
                        {hostYears > 0 && <p>{hostYears} tahun hosting</p>}
                    </div>
                </div>

                <div className="space-y-5">
                    {hostAboutList.length > 0 && (
                        <div className="space-y-3">
                            {hostAboutList.map((item, idx) => {
                                const IconComponent = getHostAboutIcon(item, idx);

                                return (
                                    <div key={idx} className="flex items-start space-x-3">
                                        <IconComponent className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" strokeWidth={1.5} />
                                        <p className="text-[14px] text-slate-700 font-normal leading-relaxed">{item}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {coHosts.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-[13px] font-bold text-slate-700">Co-host</p>
                            <div className="flex items-center gap-3 flex-wrap">
                                {coHosts.map((coHost, idx) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                        <img
                                            src={coHost.avatar || coHostFallbackAvatar}
                                            alt={coHost.name}
                                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                        />
                                        <span className="text-[13px] text-slate-700 font-medium">{coHost.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-2 space-y-3">
                        <button className="w-full bg-slate-900 hover:bg-black text-white text-sm font-bold py-3 px-6 rounded-xl transition-colors active:scale-95 duration-150">
                            Kirimkan pesan kepada tuan rumah
                        </button>
                        <div className="flex items-start space-x-2.5 max-w-xl">
                            <Shield className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-slate-500 leading-normal">
                                Untuk melindungi pembayaran Anda, jangan pernah mentransfer uang atau berkomunikasi di luar situs web atau aplikasi PusatVillaBali.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
