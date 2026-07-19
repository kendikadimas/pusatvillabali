import { Head, Link, router } from '@inertiajs/react';
import { MapPin, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import React, { useRef, useState } from 'react';
import VillaCard from '@/components/public/villa-card';
import type { Villa, Destination, AppSettings } from '@/types';

interface Props {
    villas: Villa[];
    villasByDestination: Record<string, Villa[]>;
    destinations: Destination[];
    settings: AppSettings;
}

const DEFAULT_DESTINATIONS: Destination[] = [
    { id: 1,  name: 'Seminyak',  city: 'Seminyak, Badung',  query: 'Seminyak',  image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=200&h=200&q=80', count_fallback: '15+ Villa' },
    { id: 2,  name: 'Canggu',    city: 'Canggu, Badung',    query: 'Canggu',    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=200&h=200&q=80', count_fallback: '21+ Villa' },
    { id: 3,  name: 'Legian',    city: 'Legian, Badung',    query: 'Legian',    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&h=200&q=80', count_fallback: '7+ Villa' },
    { id: 4,  name: 'Kuta',      city: 'Kuta, Badung',      query: 'Kuta',      image: 'https://images.unsplash.com/photo-1520454974749-a795c5e0b8f0?auto=format&fit=crop&w=200&h=200&q=80', count_fallback: '12+ Villa' },
    { id: 5,  name: 'Jimbaran',  city: 'Jimbaran, Badung',  query: 'Jimbaran',  image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=200&h=200&q=80', count_fallback: '9+ Villa' },
    { id: 6,  name: 'Nusa Dua',  city: 'Nusa Dua, Badung',  query: 'Nusa Dua',  image: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=200&h=200&q=80', count_fallback: '8+ Villa' },
    { id: 7,  name: 'Uluwatu',   city: 'Uluwatu, Badung',   query: 'Uluwatu',   image: 'https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=200&h=200&q=80', count_fallback: '11+ Villa' },
    { id: 8,  name: 'Ubud',      city: 'Ubud, Gianyar',     query: 'Ubud',      image: 'https://images.unsplash.com/photo-1549638441-b787d2e11f14?auto=format&fit=crop&w=200&h=200&q=80', count_fallback: '14+ Villa' },
    { id: 9,  name: 'Kintamani', city: 'Kintamani, Bangli', query: 'Kintamani', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=200&h=200&q=80', count_fallback: '5+ Villa' },
    { id: 10, name: 'Sanur',     city: 'Sanur, Denpasar',   query: 'Sanur',     image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=200&h=200&q=80', count_fallback: '10+ Villa' },
];

// Horizontal scroll section with prev/next buttons
function HScrollSection({ title, query, villas }: { title: string; query: string; villas: Villa[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) {
return;
}

        const amount = scrollRef.current.clientWidth * 0.75;
        scrollRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
    };

    if (villas.length === 0) {
return null;
}

    return (
        <section className="py-6">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
                {/* Section header — title kiri, prev/next kanan */}
                <div className="flex items-center justify-between mb-4">
                    <Link
                        href={`/villas?search=${encodeURIComponent(query)}`}
                        className="flex items-center gap-2 group/title"
                    >
                        <h2 className="text-lg sm:text-xl font-semibold text-[#222222] group-hover/title:underline">
                            Penginapan populer di {title}
                        </h2>
                        <ArrowRight className="w-4 h-4 text-[#222222]" />
                    </Link>
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={() => scroll('left')}
                            className="w-8 h-8 bg-white border border-[#dddddd] rounded-full shadow-sm flex items-center justify-center hover:border-[#222222] transition-colors"
                            aria-label="Scroll kiri"
                        >
                            <ChevronLeft className="w-4 h-4 text-[#222222]" strokeWidth={2.5} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-8 h-8 bg-white border border-[#dddddd] rounded-full shadow-sm flex items-center justify-center hover:border-[#222222] transition-colors"
                            aria-label="Scroll kanan"
                        >
                            <ChevronRight className="w-4 h-4 text-[#222222]" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                {/* Scroll container */}
                <div
                    ref={scrollRef}
                    className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {villas.map((villa) => (
                        <div
                            key={villa.id}
                            className="shrink-0 w-[185px] sm:w-[200px]"
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <VillaCard villa={villa} variant="home" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Home({ villas, villasByDestination, destinations, settings }: Props) {
    const destList = destinations && destinations.length > 0 ? destinations : DEFAULT_DESTINATIONS;
    const destScrollRef = useRef<HTMLDivElement>(null);
    const [activeDest, setActiveDest] = useState<Destination | null>(null);

    const BEDROOM_OPTIONS = [
        { label: '1 Bedroom', value: '1' },
        { label: '2 Bedroom', value: '2' },
        { label: '3 Bedroom', value: '3' },
        { label: '4 Bedroom', value: '4' },
        { label: '5+ Bedroom', value: '5' },
    ];

    const scrollDest = (dir: 'left' | 'right') => {
        if (!destScrollRef.current) return;
        destScrollRef.current.scrollBy({ left: dir === 'right' ? 240 : -240, behavior: 'smooth' });
    };

    const handleDestClick = (dest: Destination) => {
        setActiveDest((prev) => (prev?.id === dest.id ? null : dest));
    };

    const handleBedroomClick = (dest: Destination, bedrooms: string) => {
        router.get('/villas', { search: dest.query, bedrooms });
    };

    // Use villasByDestination from controller if available, otherwise fallback to client-side grouping
    const hasGroupedData = villasByDestination && Object.keys(villasByDestination).length > 0;

    const appName = settings?.settings_prop_name ?? 'PusatVillaBali';

    return (
        <>
            <Head title={`${appName} – Sewa Villa Premium di Bali`} />

            {/* ── Destination chips + bedroom pills ── */}
            <div className="border-b border-[#ebebeb] bg-white sticky top-[64px] sm:top-[80px] z-40">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
                    <div className="relative group/dest py-1">
                        {/* Left scroll btn */}
                        <button
                            onClick={() => scrollDest('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-[#dddddd] rounded-full shadow-sm flex items-center justify-center sm:opacity-0 sm:group-hover/dest:opacity-100 transition-opacity"
                            aria-label="Scroll destinasi kiri"
                        >
                            <ChevronLeft className="w-4 h-4 text-[#222222]" strokeWidth={2.5} />
                        </button>

                        {/* Left gradient fade */}
                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-[5]" />

                        <div
                            ref={destScrollRef}
                            className="flex gap-2 overflow-x-auto scrollbar-hide py-3 px-1"
                        >
                            {/* "Semua" chip */}
                            <button
                                onClick={() => { setActiveDest(null); router.get('/villas'); }}
                                className="shrink-0 flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:bg-[#f7f7f7] group/chip min-w-[72px]"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#f7f7f7] flex items-center justify-center border-2 border-transparent group-hover/chip:border-[#222222] transition-colors overflow-hidden">
                                    <MapPin className="w-5 h-5 text-[#6a6a6a]" />
                                </div>
                                <span className="text-[11px] font-medium text-[#6a6a6a] whitespace-nowrap">Semua</span>
                            </button>

                            {destList.map((dest) => {
                                const isActive = activeDest?.id === dest.id;
                                return (
                                    <button
                                        key={dest.id}
                                        onClick={() => handleDestClick(dest)}
                                        className={`shrink-0 flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg transition-colors min-w-[72px] ${isActive ? 'bg-[#f7f7f7]' : 'hover:bg-[#f7f7f7]'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-colors ${isActive ? 'border-[#222222]' : 'border-transparent hover:border-[#222222]'}`}>
                                            <img
                                                src={dest.image}
                                                alt={dest.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <span className={`text-[11px] font-medium whitespace-nowrap ${isActive ? 'text-[#222222]' : 'text-[#6a6a6a]'}`}>{dest.name}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Right gradient fade */}
                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-[5]" />

                        {/* Right scroll btn */}
                        <button
                            onClick={() => scrollDest('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-[#dddddd] rounded-full shadow-sm flex items-center justify-center sm:opacity-0 sm:group-hover/dest:opacity-100 transition-opacity"
                            aria-label="Scroll destinasi kanan"
                        >
                            <ChevronRight className="w-4 h-4 text-[#222222]" strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Bedroom pills — muncul ketika destinasi dipilih */}
                    {activeDest && (
                        <div className="flex items-center gap-2 pb-3 px-1 flex-wrap">
                            <span className="text-xs text-[#6a6a6a] font-medium shrink-0">{activeDest.name}:</span>
                            {BEDROOM_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleBedroomClick(activeDest, opt.value)}
                                    className="shrink-0 px-3 py-1.5 rounded-full border border-[#dddddd] text-xs font-medium text-[#222222] hover:border-[#222222] hover:bg-[#f7f7f7] transition-colors"
                                >
                                    {opt.label}
                                </button>
                            ))}
                            <button
                                onClick={() => router.get('/villas', { search: activeDest.query })}
                                className="shrink-0 px-3 py-1.5 rounded-full bg-[#222222] text-white text-xs font-medium hover:bg-[#444444] transition-colors"
                            >
                                Lihat Semua
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Villa sections per destinasi ── */}
            <div className="bg-white min-h-screen">
                {hasGroupedData ? (
                    // Grouped by destination from controller
                    Object.entries(villasByDestination).map(([destination, destVillas]) => (
                        <HScrollSection
                            key={destination}
                            title={destination}
                            query={destination}
                            villas={destVillas}
                        />
                    ))
                ) : (
                    // Fallback: show all villas in one section
                    villas.length > 0 && (
                        <section className="py-8">
                            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="text-xl sm:text-2xl font-semibold text-[#222222]">
                                        Villa di Bali
                                    </h2>
                                    <Link
                                        href="/villas"
                                        className="text-sm font-semibold text-[#222222] underline underline-offset-2 hover:text-[#484848] transition-colors flex items-center gap-1 shrink-0 ml-4"
                                    >
                                        Tampilkan semua <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                                    {villas.map((villa) => (
                                        <VillaCard key={villa.id} villa={villa} variant="home" />
                                    ))}
                                </div>
                            </div>
                        </section>
                    )
                )}

                {/* Empty state */}
                {villas.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-32 px-4">
                        <div className="w-16 h-16 rounded-full bg-[#f7f7f7] flex items-center justify-center mb-4">
                            <MapPin className="w-8 h-8 text-[#929292]" />
                        </div>
                        <p className="text-[#222222] font-semibold text-lg mb-1">Belum ada villa tersedia</p>
                        <p className="text-[#6a6a6a] text-sm text-center max-w-xs">
                            Villa akan segera hadir. Hubungi kami untuk informasi lebih lanjut.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
