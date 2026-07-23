import type { Villa } from '@/types';

const FALLBACK_PHOTO =
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80';

export function normaliseStorageUrl(url: string | null | undefined): string {
    if (!url) {
        return FALLBACK_PHOTO;
    }

    // Already a relative storage path — return as-is
    if (url.startsWith('/storage/') || url.startsWith('storage/')) {
        return url.startsWith('/') ? url : '/' + url;
    }

    // Legacy absolute URL stored in DB (e.g. http://localhost/storage/villas/abc.jpg)
    // Extract the /storage/... portion so it works on any domain
    const storageIndex = url.indexOf('/storage/');

    if (storageIndex !== -1) {
        return url.slice(storageIndex);
    }

    return url;
}

export function getPhotoUrl(photo: unknown): string {
    if (!photo) {
return FALLBACK_PHOTO;
}

    const raw =
        typeof photo === 'string'
            ? photo
            : ((photo as { url?: string }).url ?? FALLBACK_PHOTO);

    return normaliseStorageUrl(raw);
}

export function getPhotoDesc(photo: unknown): string {
    if (!photo || typeof photo === 'string') {
return '';
}

    return (photo as { description?: string }).description ?? '';
}

export function getPhotoCategory(photo: unknown): string {
    if (!photo || typeof photo === 'string') {
return 'Lainnya';
}

    return (photo as { category?: string }).category ?? 'Lainnya';
}

export function getMainPhoto(villa: Villa | null | undefined): string {
    if (!villa) {
return FALLBACK_PHOTO;
}

    if (villa.photos && villa.photos.length > 0) {
        return getPhotoUrl(villa.photos[0]);
    }

    return FALLBACK_PHOTO;
}
