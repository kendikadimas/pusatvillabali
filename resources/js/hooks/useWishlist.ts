import { useState, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

function readWishlistFromStorage(): number[] {
    try {
        const saved = localStorage.getItem('pusatvillabali_wishlist');

        if (saved) {
            return JSON.parse(saved);
        }
    } catch {
        // ignore
    }

    return [];
}

export function useWishlist() {
    const initialWishlist = useMemo(() => readWishlistFromStorage(), []);
    const [wishlist, setWishlist] = useState<number[]>(initialWishlist);

    const toggleWishlist = useCallback((id: number, e: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        let updated: number[];

        if (wishlist.includes(id)) {
            updated = wishlist.filter(item => item !== id);
            toast.success('Dihapus dari daftar keinginan');
        } else {
            updated = [...wishlist, id];
            toast.success('Disimpan ke daftar keinginan!');
        }

        setWishlist(updated);
        localStorage.setItem('pusatvillabali_wishlist', JSON.stringify(updated));
    }, [wishlist]);

    const isWished = useCallback((id: number) => wishlist.includes(id), [wishlist]);

    return { wishlist, toggleWishlist, isWished };
}
