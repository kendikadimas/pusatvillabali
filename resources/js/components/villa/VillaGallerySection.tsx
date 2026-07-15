import { X } from 'lucide-react';
import React from 'react';
import { getPhotoUrl, getPhotoDesc } from '@/lib/villaUtils';

interface VillaGallerySectionProps {
    photos: Array<string | { url: string; description: string; category?: string }>;
    villaName: string;
}

export default function VillaGallerySection({ photos, villaName }: VillaGallerySectionProps) {
    const mainPhoto = getPhotoUrl(photos[0]);
    const thumbPhotos = photos.slice(1, 5);
    const [isLightboxOpen, setIsLightboxOpen] = React.useState(false);
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    return (
        <>
            <div className="relative mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-2xl overflow-hidden bg-white">
                    <div
                        onClick={() => {
 setCurrentImageIndex(0); setIsLightboxOpen(true); 
}}
                        className="md:col-span-2 aspect-[4/3] overflow-hidden rounded-l-2xl cursor-pointer relative group"
                    >
                        <img src={mainPhoto} alt={villaName} className="w-full h-full object-cover group-hover:brightness-90 transition duration-300" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                    </div>

                    <div className="md:col-span-2 grid grid-cols-2 gap-3 h-full" style={{ gridTemplateRows: 'repeat(2, minmax(0, 1fr))' }}>
                        {thumbPhotos.map((photo, i) => {
                            let cornerClass = '';

                            if (i === 1) {
cornerClass = 'md:rounded-tr-2xl';
}

                            if (i === 3) {
cornerClass = 'md:rounded-br-2xl';
}

                            return (
                                <div key={i} onClick={() => {
 setCurrentImageIndex(i + 1); setIsLightboxOpen(true); 
}} className={`overflow-hidden cursor-pointer relative group min-h-0 ${cornerClass}`}>
                                    <img src={getPhotoUrl(photo)} alt={getPhotoDesc(photo) || `Thumbnail ${i}`} className="w-full h-full object-cover group-hover:brightness-90 transition duration-300" />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                                </div>
                            );
                        })}
                        {[...Array(Math.max(0, 4 - thumbPhotos.length))].map((_, i) => (
                            <div key={`empty-${i}`} className="bg-slate-100 min-h-0" />
                        ))}
                    </div>
                </div>

                {photos.length > 5 && (
                    <button
                        onClick={() => setIsLightboxOpen(true)}
                        className="absolute bottom-4 right-4 bg-white border border-slate-300 text-slate-800 text-sm font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                        Lihat semua {photos.length} foto
                    </button>
                )}
            </div>

            {isLightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 p-2 rounded-full transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <img
                        src={getPhotoUrl(photos[currentImageIndex])}
                        alt={`Foto ${currentImageIndex + 1}`}
                        className="max-h-[75vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
                    />
                    <div className="flex justify-center space-x-2 overflow-x-auto max-w-2xl mx-auto pb-4 mt-4 scrollbar-none">
                        {photos.map((ph, idx) => (
                            <img
                                key={idx}
                                src={getPhotoUrl(ph)}
                                alt="Thumb"
                                onClick={() => setCurrentImageIndex(idx)}
                                className={`w-16 h-12 object-cover rounded-lg cursor-pointer border-2 transition-all ${idx === currentImageIndex ? 'border-blue-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-85'}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
