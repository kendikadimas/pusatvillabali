import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { Villa } from '@/types';
import VillaCard from './villa-card';

interface VillaCarouselProps {
    villas: Villa[];
    wishlist: number[];
    toggleWishlist: (id: number, e: React.MouseEvent) => void;
    searchParams?: { checkIn?: string; checkOut?: string };
}

export default function VillaCarousel({ villas, wishlist, toggleWishlist, searchParams }: VillaCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = useCallback(() => {
        const el = scrollRef.current;

        if (!el) {
return;
}

        setCanScrollLeft(el.scrollLeft > 10);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;

        if (!el) {
return;
}

        checkScroll();
        el.addEventListener('scroll', checkScroll, { passive: true });
        window.addEventListener('resize', checkScroll);

        return () => {
            el.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [checkScroll]);

    const scroll = (dir: 'left' | 'right') => {
        const el = scrollRef.current;

        if (!el) {
return;
}

        const cardWidth = 300;
        el.scrollBy({ left: dir === 'left' ? -cardWidth * 2 : cardWidth * 2, behavior: 'smooth' });
    };

    if (villas.length === 0) {
return null;
}

    return (
        <div className="relative group/carousel">
            {/* Left arrow */}
            {canScrollLeft && (
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-white -translate-x-1/2"
                >
                    <ChevronLeft className="w-5 h-5 text-slate-700" />
                </button>
            )}

            {/* Right arrow */}
            {canScrollRight && (
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity hover:bg-white translate-x-1/2"
                >
                    <ChevronRight className="w-5 h-5 text-slate-700" />
                </button>
            )}

            {/* Scrollable container */}
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-none pb-2 -mx-1 px-1 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {villas.map((villa) => (
                    <div key={villa.id} className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start">
                        <VillaCard
                            villa={villa}
                            wishlist={wishlist}
                            toggleWishlist={toggleWishlist}
                            searchParams={searchParams}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
