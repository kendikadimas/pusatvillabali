import React, { useState, useRef } from 'react';
import { Link } from '@inertiajs/react';
import { Star, Heart, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import type { Villa } from '@/types';
import { getPhotoUrl } from '@/lib/villaUtils';
import { formatPrice } from '@/lib/format';

export interface VillaCardProps {
    villa: Villa;
    wishlist?: number[];
    toggleWishlist?: (id: number, e: React.MouseEvent) => void;
    searchParams?: { checkIn?: string; checkOut?: string };
    variant?: 'home' | 'catalog';
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
    isSelected?: boolean;
}

const MAX_SLIDER_PHOTOS = 3;

export default function VillaCard({
    villa,
    wishlist = [],
    toggleWishlist,
    searchParams = {},
    variant = 'home',
    onMouseEnter,
    onMouseLeave,
    onClick,
    isSelected = false,
}: VillaCardProps) {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [imgError, setImgError] = useState(false);
    const touchStartX = useRef<number | null>(null);

    const isWished = wishlist.includes(villa.id);

    const detailUrl = `/villas/${villa.slug}${
        searchParams.checkIn && searchParams.checkOut
            ? `?checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}`
            : ''
    }`;

    const ratingVal = villa.reviews_avg_rating
        ? parseFloat(villa.reviews_avg_rating.toString())
        : 4.5 + (villa.id % 5) * 0.1;
    const ratingText = ratingVal.toFixed(1).replace('.', ',');
    const reviewCount = villa.reviews_count ?? 0;

    const allPhotos =
        villa.photos && villa.photos.length > 0
            ? villa.photos
            : ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80'];
    const photos = allPhotos.slice(0, MAX_SLIDER_PHOTOS);

    const handlePrev = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setImgError(false);
        setCurrentPhotoIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setImgError(false);
        setCurrentPhotoIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
    };

    const hasWeekendPrice = villa.weekend_price && villa.weekend_price !== villa.price_per_night;
    const priceText = formatPrice(villa.price_per_night);
    const priceLabel = hasWeekendPrice ? `– ${formatPrice(villa.weekend_price!)}` : '/ malam';

    return (
        <Link
            href={detailUrl}
            className={`group cursor-pointer flex flex-col w-full bg-transparent hover:no-underline ${
                isSelected ? 'ring-2 ring-blue-500 rounded-xl' : ''
            }`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
        >
            {/* Photo Slider */}
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                {imgError ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                        <ImageOff className="w-8 h-8 text-slate-400" />
                    </div>
                ) : (
                    <img
                        src={getPhotoUrl(photos[currentPhotoIndex])}
                        alt={villa.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => setImgError(true)}
                        onTouchStart={(e) => {
                            touchStartX.current = e.touches[0].clientX;
                        }}
                        onTouchEnd={(e) => {
                            if (touchStartX.current === null) return;
                            const delta = e.changedTouches[0].clientX - touchStartX.current;
                            if (Math.abs(delta) > 40) {
                                if (delta < 0) handleNext(e as unknown as React.MouseEvent);
                                else handlePrev(e as unknown as React.MouseEvent);
                            }
                            touchStartX.current = null;
                        }}
                    />
                )}

                {/* Nav arrows */}
                {photos.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-white/80 hover:bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft className="w-4 h-4 text-slate-700" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/80 hover:bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight className="w-4 h-4 text-slate-700" />
                        </button>
                        {/* Dots */}
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {photos.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                                        i === currentPhotoIndex ? 'bg-white w-3' : 'bg-white/60'
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Wishlist */}
                {toggleWishlist && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleWishlist(villa.id, e);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors shadow"
                    >
                        <Heart
                            className={`w-4 h-4 transition-colors ${
                                isWished ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
                            }`}
                        />
                    </button>
                )}

                {/* Rating */}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 rounded-full px-2 py-0.5 shadow">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-semibold text-slate-700">{ratingText}</span>
                    {reviewCount > 0 && (
                        <span className="text-xs text-slate-500">({reviewCount})</span>
                    )}
                </div>
            </div>

            {/* Info */}
            <div className="pt-3 flex flex-col space-y-0.5">
                <h3 className="text-[14px] sm:text-[15px] font-semibold text-slate-700 leading-tight tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {villa.name}
                </h3>
                <p className="text-xs text-slate-500 truncate">{villa.location}</p>
                <div className="text-[13px] sm:text-[14px] text-slate-700 font-normal pt-0.5">
                    <span className="font-semibold">{priceText}</span>
                    <span className="text-slate-500">
                        {' '}
                        {hasWeekendPrice ? priceLabel : '/ malam'}
                    </span>
                </div>
            </div>
        </Link>
    );
}
