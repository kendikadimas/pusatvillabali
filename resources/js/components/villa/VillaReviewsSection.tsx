import { format, parseISO } from 'date-fns';
import { id as localeID } from 'date-fns/locale';
import { Star, Search, X } from 'lucide-react';
import React from 'react';
import type { Review } from '@/types/index';

interface VillaReviewsSectionProps {
    reviews: Review[];
    avgRating: number;
}

export default function VillaReviewsSection({ reviews, avgRating }: VillaReviewsSectionProps) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
    const [sortOrder, setSortOrder] = React.useState('relevance');

    const TAGS = [
        { label: 'Kolam renang', keywords: ['kolam', 'renang', 'pool'] },
        { label: 'Lokasi', keywords: ['lokasi', 'location', 'tempat'] },
        { label: 'AC', keywords: ['ac', 'pendingin'] },
        { label: 'Area terdekat', keywords: ['dekat', 'sekitar', 'terdekat'] },
        { label: 'Kenyamanan', keywords: ['nyaman', 'comfort', 'tenang'] },
        { label: 'Kebersihan', keywords: ['bersih', 'clean', 'segar'] },
        { label: 'Keramahtamahan', keywords: ['ramah', 'host', 'pelayanan'] },
    ];

    const tagMap: Record<string, string[]> = {};
    TAGS.forEach(t => {
 tagMap[t.label] = t.keywords; 
});

    const keywordTagCounts = TAGS.map(tag => ({
        label: tag.label,
        count: reviews.filter(r => tag.keywords.some(kw => (r.comment || '').toLowerCase().includes(kw))).length,
    })).filter(t => t.count > 0);

    const filteredReviews = React.useMemo(() => {
        let list = [...reviews];

        if (selectedTag) {
            const kws = tagMap[selectedTag] || [];
            list = list.filter(r => kws.some(kw => (r.comment || '').toLowerCase().includes(kw)));
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(r => (r.comment || '').toLowerCase().includes(q));
        }

        if (sortOrder === 'recent') {
            list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        } else if (sortOrder === 'highest') {
            list.sort((a, b) => b.rating - a.rating);
        } else if (sortOrder === 'lowest') {
            list.sort((a, b) => a.rating - b.rating);
        }

        return list;
    }, [reviews, selectedTag, searchQuery, sortOrder]);

    const previewReviews = filteredReviews.slice(0, 6);

    if (reviews.length === 0) {
return null;
}

    return (
        <>
            <div id="ulasan-section" className="space-y-6 pb-8 border-b border-slate-200/80 scroll-mt-32">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Ulasan Tamu</h3>
                        {avgRating > 0 && (
                            <div className="flex items-center space-x-1.5 mt-1">
                                <Star className="w-4 h-4 fill-slate-900 text-slate-900" />
                                <span className="text-sm font-bold text-slate-900">{avgRating.toFixed(1)}</span>
                                <span className="text-sm text-slate-500">· {reviews.length} ulasan</span>
                            </div>
                        )}
                    </div>
                </div>

                {keywordTagCounts.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {keywordTagCounts.map(tag => (
                            <button
                                key={tag.label}
                                onClick={() => setSelectedTag(selectedTag === tag.label ? null : tag.label)}
                                className={`px-3 py-1.5 rounded-full text-[13px] font-semibold border transition-all cursor-pointer ${
                                    selectedTag === tag.label
                                        ? 'bg-slate-900 text-white border-slate-900'
                                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500'
                                }`}
                            >
                                {tag.label} ({tag.count})
                            </button>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {previewReviews.map((review, idx) => (
                        <div key={idx} className="space-y-3 p-4 bg-slate-50 rounded-2xl">
                            <div className="flex items-center space-x-3">
                                {review.guest_avatar ? (
                                    <img src={review.guest_avatar} alt={review.guest_name} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                                        {(review.guest_name || 'T').charAt(0).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{review.guest_name || 'Tamu'}</p>
                                    <p className="text-[11px] text-slate-400">{format(parseISO(review.created_at), 'MMMM yyyy', { locale: localeID })}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                ))}
                            </div>
                            <p className="text-slate-700 text-[14px] leading-relaxed font-normal line-clamp-4">{review.comment}</p>
                        </div>
                    ))}
                </div>

                {reviews.length > 6 && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="border border-slate-900 hover:bg-slate-50 text-slate-900 text-[15px] font-bold px-5 py-3 rounded-xl transition-all cursor-pointer"
                    >
                        Tampilkan semua {reviews.length} ulasan
                    </button>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
                    <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">{reviews.length} ulasan</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full cursor-pointer">
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>
                        <div className="p-4 border-b border-slate-100">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Cari ulasan..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex gap-2 mt-3 flex-wrap">
                                <select
                                    value={sortOrder}
                                    onChange={e => setSortOrder(e.target.value)}
                                    className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white cursor-pointer focus:outline-none"
                                >
                                    <option value="relevance">Relevansi</option>
                                    <option value="recent">Terbaru</option>
                                    <option value="highest">Rating tertinggi</option>
                                    <option value="lowest">Rating terendah</option>
                                </select>
                            </div>
                        </div>
                        <div className="overflow-y-auto flex-1 p-6 space-y-5">
                            {filteredReviews.map((review, idx) => (
                                <div key={idx} className="space-y-3 pb-5 border-b border-slate-100 last:border-0">
                                    <div className="flex items-center space-x-3">
                                        {review.guest_avatar ? (
                                            <img src={review.guest_avatar} alt={review.guest_name} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm">
                                                {(review.guest_name || 'T').charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{review.guest_name || 'Tamu'}</p>
                                            <div className="flex items-center space-x-0.5 mt-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                                ))}
                                                <span className="text-slate-400 text-xs ml-1">
                                                    {format(parseISO(review.created_at), 'dd MMM yyyy', { locale: localeID })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-700 text-[14px] leading-relaxed font-normal">{review.comment}</p>
                                </div>
                            ))}
                            {filteredReviews.length === 0 && (
                                <p className="text-slate-500 text-sm text-center py-8">Tidak ada ulasan yang cocok.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
