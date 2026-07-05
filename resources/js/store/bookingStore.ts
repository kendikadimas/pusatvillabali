import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Villa } from '@/types/index';
import { differenceInDays, parseISO, eachDayOfInterval } from 'date-fns';

interface BookingState {
    selectedVilla: Villa | null;
    checkIn: string | null; // YYYY-MM-DD
    checkOut: string | null; // YYYY-MM-DD
    numGuests: number;
    notes: string;
    totalNights: number;
    totalAmount: number;
    isRefundable: boolean;
    priceBreakdown: {
        weekdays: { count: number; price: number; total: number };
        weekends: { count: number; price: number; total: number };
    };
    setVilla: (villa: Villa | null) => void;
    setDates: (checkIn: string | null, checkOut: string | null) => void;
    setNumGuests: (guests: number) => void;
    setNotes: (notes: string) => void;
    setRefundable: (isRefundable: boolean) => void;
    calculatePricing: () => void;
    resetStore: () => void;
}

export const useBookingStore = create<BookingState>()(
    persist(
        (set, get) => ({
            selectedVilla: null,
            checkIn: null,
            checkOut: null,
            numGuests: 1,
            notes: '',
            totalNights: 0,
            totalAmount: 0,
            isRefundable: false,
            priceBreakdown: {
                weekdays: { count: 0, price: 0, total: 0 },
                weekends: { count: 0, price: 0, total: 0 },
            },

            setVilla: (villa) => {
                set({ selectedVilla: villa });
                get().calculatePricing();
            },

            setDates: (checkIn, checkOut) => {
                set({ checkIn, checkOut });
                get().calculatePricing();
            },

            setNumGuests: (numGuests) => set({ numGuests }),

            setNotes: (notes) => set({ notes }),

            setRefundable: (isRefundable) => {
                set({ isRefundable });
                get().calculatePricing();
            },

            calculatePricing: () => {
                const { selectedVilla, checkIn, checkOut, isRefundable } = get();

                if (!selectedVilla || !checkIn || !checkOut) {
                    set({
                        totalNights: 0,
                        totalAmount: 0,
                        priceBreakdown: {
                            weekdays: { count: 0, price: 0, total: 0 },
                            weekends: { count: 0, price: 0, total: 0 },
                        },
                    });
                    return;
                }

                const checkInDate = parseISO(checkIn);
                const checkOutDate = parseISO(checkOut);
                const totalNights = differenceInDays(checkOutDate, checkInDate);

                if (totalNights <= 0) {
                    set({
                        totalNights: 0,
                        totalAmount: 0,
                        priceBreakdown: {
                            weekdays: { count: 0, price: 0, total: 0 },
                            weekends: { count: 0, price: 0, total: 0 },
                        },
                    });
                    return;
                }

                const days = eachDayOfInterval({ start: checkInDate, end: new Date(checkOutDate.getTime() - 86400000) });

                const weekendDays = [5, 6]; // Friday, Saturday
                let weekdayCount = 0;
                let weekendCount = 0;

                days.forEach(day => {
                    const dow = day.getDay();
                    if (weekendDays.includes(dow)) {
                        weekendCount++;
                    } else {
                        weekdayCount++;
                    }
                });

                const weekdayPrice = Number(selectedVilla.price_per_night) || 0;
                const weekendPrice = Number(selectedVilla.weekend_price ?? selectedVilla.price_per_night) || weekdayPrice;

                const weekdayTotal = weekdayCount * weekdayPrice;
                const weekendTotal = weekendCount * weekendPrice;
                let totalAmount = weekdayTotal + weekendTotal;

                // Add refundable fee if applicable
                if (isRefundable) {
                    totalAmount += totalAmount * 0.1; // 10% refundable fee
                }

                set({
                    totalNights,
                    totalAmount,
                    priceBreakdown: {
                        weekdays: { count: weekdayCount, price: weekdayPrice, total: weekdayTotal },
                        weekends: { count: weekendCount, price: weekendPrice, total: weekendTotal },
                    },
                });
            },

            resetStore: () => set({
                selectedVilla: null,
                checkIn: null,
                checkOut: null,
                numGuests: 1,
                notes: '',
                totalNights: 0,
                totalAmount: 0,
                isRefundable: false,
                priceBreakdown: {
                    weekdays: { count: 0, price: 0, total: 0 },
                    weekends: { count: 0, price: 0, total: 0 },
                },
            }),
        }),
        {
            name: 'pusatvillabali-booking-store',
        }
    )
);
