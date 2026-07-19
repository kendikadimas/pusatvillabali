import { addMonths } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

interface VillaCalendarSectionProps {
    dateRange: { from: Date | undefined; to?: Date | undefined } | undefined;
    disabledDays: Date[];
    isMobile: boolean;
    onSelect: (range: { from: Date | undefined; to?: Date | undefined } | undefined) => void;
}

export default function VillaCalendarSection({ dateRange, disabledDays, isMobile, onSelect }: VillaCalendarSectionProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const goPrev = () => setCurrentMonth(prev => addMonths(prev, -1));
    const goNext = () => setCurrentMonth(prev => addMonths(prev, 1));

    return (
        <div id="calendar-section" className="space-y-5 pb-6 border-b border-slate-200/80 scroll-mt-32">
            <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">Cek Ketersediaan Menginap</h3>
                <p className="text-slate-500 text-[13px] mt-1 font-semibold uppercase tracking-wider">
                    Pilih tanggal check-in dan check-out untuk menghitung rincian sewa. Tanggal redup tidak dapat dipesan.
                </p>
            </div>

            <div className="flex items-center justify-end gap-2 mb-1 px-2">
                <button onClick={goPrev} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600 cursor-pointer">
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={goNext} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600 cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="villa-calendar bg-slate-50 border border-slate-200 rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center overflow-x-auto">
                <DayPicker
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => onSelect(range)}
                    disabled={[{ before: new Date() }, ...disabledDays]}
                    numberOfMonths={isMobile ? 1 : 2}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    locale={localeID}
                />
            </div>
        </div>
    );
}
