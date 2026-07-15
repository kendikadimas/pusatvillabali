import axios from 'axios';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Booking } from '@/types/index';

type Status = 'idle' | 'loading' | 'error' | 'success';

interface Anchor {
    code?: string;
    email?: string;
}

const ANCHOR_KEY = 'pusatvillabali-active-booking';
const cacheKey = (code: string) => `pusatvillabali-booking-cache-${code}`;

function readAnchorFromStorage(): Anchor {
    try {
        const raw = localStorage.getItem(ANCHOR_KEY);

        if (raw) {
            const parsed = JSON.parse(raw);

            return { code: parsed.code, email: parsed.email };
        }
    } catch {
        // ignore
    }

    return {};
}

function readCache(code?: string): Booking | null {
    if (!code) {
        return null;
    }

    try {
        const raw = localStorage.getItem(cacheKey(code));

        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function writeCache(code: string, booking: Booking) {
    try {
        localStorage.setItem(cacheKey(code), JSON.stringify(booking));
    } catch {
        // ignore
    }
}

/**
 * Hook resilient untuk fetch data booking di halaman payment/status/success.
 * - Hydrate instan dari cache supaya UI tidak blank saat reload.
 * - Fetch ke server di background dengan retry + exponential backoff.
 * - Auto-retry saat tab kembali visible.
 * - TIDAK PERNAH redirect/reset otomatis saat error.
 */
export function useResilientBooking(codeFromUrl?: string, emailFromUrl?: string) {
    const generationRef = useRef(0);
    const mountedRef = useRef(true);
    const fetchedRef = useRef(false);

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;
        };
    }, []);

    const anchor = useMemo<Anchor>(() => {
        if (codeFromUrl && emailFromUrl) {
            return { code: codeFromUrl, email: emailFromUrl };
        }

        const fromStorage = readAnchorFromStorage();

        return {
            code: codeFromUrl || fromStorage.code,
            email: emailFromUrl || fromStorage.email,
        };
    }, [codeFromUrl, emailFromUrl]);

    const initialCache = useMemo(() => readCache(anchor.code), [anchor.code]);
    const [booking, setBooking] = useState<Booking | null>(initialCache);
    const [status, setStatus] = useState<Status>('idle');
    const [isFromCache, setIsFromCache] = useState(!!initialCache);

    const fetchBooking = useCallback(async () => {
        if (!anchor.code) {
            setStatus('error');

            return;
        }

        const gen = ++generationRef.current;
        setStatus('loading');

        for (let attempt = 0; attempt < 4; attempt++) {
            if (!mountedRef.current || gen !== generationRef.current) {
                return;
            }

            try {
                const params: Record<string, string> = { code: anchor.code };

                if (anchor.email) {
                    params.email = anchor.email;
                }

                const res = await axios.get('/api/v1/bookings/by-code', { params });
                const data = res.data?.data ?? res.data;

                if (!mountedRef.current || gen !== generationRef.current) {
                    return;
                }

                setBooking(data);
                setIsFromCache(false);
                setStatus('success');
                writeCache(anchor.code, data);

                return;
            } catch {
                if (!mountedRef.current || gen !== generationRef.current) {
                    return;
                }

                if (attempt === 3) {
                    setStatus('error');
                } else {
                    const backoffMs = 1000 * Math.pow(2, attempt);
                    await new Promise(r => setTimeout(r, backoffMs));
                }
            }
        }
    }, [anchor.code, anchor.email]);

    const refetch = useCallback(() => {
        fetchedRef.current = false;
        fetchBooking();
    }, [fetchBooking]);

    useEffect(() => {
        if (!fetchedRef.current) {
            fetchedRef.current = true;
            fetchBooking();
        }
    }, [fetchBooking]);

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === 'visible' && status === 'error') {
                fetchBooking();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [status, fetchBooking]);

    return { booking, status, isFromCache, anchor, refetch };
}
