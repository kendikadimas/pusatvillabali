import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import type { Villa } from '@/types/index';
import { formatPrice } from '@/lib/format';

interface VillaBookingSidebarProps {
    villa: Villa;
    storeCheckIn: string | null;
    storeCheckOut: string | null;
    storeNumGuests: number;
    totalNights: number;
    totalAmount: number;
    onSetNumGuests: (guests: number) => void;
    onScrollToCalendar: () => void;
    onBookingSubmit: () => void;
}

export default function VillaBookingSidebar({
    villa, storeCheckIn, storeCheckOut, storeNumGuests,
    totalNights, totalAmount,
    onSetNumGuests, onScrollToCalendar, onBookingSubmit,
}: VillaBookingSidebarProps) {
    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block lg:col-span-1">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl sticky top-36 space-y-5">
                    <div>
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="text-[22px] font-bold text-slate-900 font-sans tracking-tight">
                                {totalNights > 0 ? formatPrice(totalAmount) : formatPrice(villa.price_per_night)}
                            </span>
                            <span className="text-sm text-slate-500 font-normal">
                                {totalNights > 0 ? `untuk ${totalNights} malam` : 'untuk 1 malam'}
                            </span>
                        </div>
                    </div>

                    <div className="border border-slate-300 rounded-2xl overflow-hidden divide-y divide-slate-200">
                        <div className="grid grid-cols-2 divide-x divide-slate-200">
                            <div onClick={onScrollToCalendar} className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                                <label className="text-[9px] font-black text-slate-700 block tracking-wider">CHECK-IN</label>
                                <span className="text-xs font-semibold text-slate-900">
                                    {storeCheckIn ? format(parseISO(storeCheckIn), 'd MMM yyyy') : 'Tambah tanggal'}
                                </span>
                            </div>
                            <div onClick={onScrollToCalendar} className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                                <label className="text-[9px] font-black text-slate-700 block tracking-wider">CHECK-OUT</label>
                                <span className="text-xs font-semibold text-slate-900">
                                    {storeCheckOut ? format(parseISO(storeCheckOut), 'd MMM yyyy') : 'Tambah tanggal'}
                                </span>
                            </div>
                        </div>
                        <div className="p-3">
                            <label className="text-[9px] font-black text-slate-700 block tracking-wider mb-1">TAMU</label>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onSetNumGuests(Math.max(1, storeNumGuests - 1))}
                                    className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer text-slate-700 font-bold"
                                >-</button>
                                <span className="text-sm font-semibold text-slate-900 min-w-[20px] text-center">{storeNumGuests}</span>
                                <button
                                    onClick={() => onSetNumGuests(Math.min(villa.max_guests || 20, storeNumGuests + 1))}
                                    className="w-7 h-7 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer text-slate-700 font-bold"
                                >+</button>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onBookingSubmit}
                        className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl shadow-md text-sm transition-all cursor-pointer"
                    >
                        {storeCheckIn && storeCheckOut ? 'Pesan Sekarang' : 'Cek Ketersediaan'}
                    </button>

                    <div className="flex items-center justify-center space-x-1.5 text-slate-500 text-[12px]">
                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                        <span>Pembayaran aman & terenkripsi</span>
                    </div>
                </div>
            </aside>

            {/* Mobile Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 flex items-center justify-between lg:hidden shadow-2xl">
                <div>
                    <span className="text-base text-slate-900 font-black block">
                        {totalAmount > 0 ? formatPrice(totalAmount) : formatPrice(villa.price_per_night)}
                        <span className="text-[10px] text-slate-500 font-normal ml-1">/ malam</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                        {storeCheckIn && storeCheckOut ? `${totalNights} malam` : 'Pilih tanggal'}
                    </span>
                </div>
                <button
                    onClick={onBookingSubmit}
                    className="bg-[#2563EB] hover:bg-[#1d4ed8] active:scale-[0.98] text-white font-bold px-6 py-3 rounded-xl shadow-md text-sm transition-all cursor-pointer"
                >
                    Pesan
                </button>
            </div>
        </>
    );
}
