import type { SVGAttributes } from 'react';

/**
 * Bali-inspired mark: meru-tiered temple roof + tropical fronds + sun.
 * Designed to work as currentColor (fill) or with className sizing.
 */
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            aria-hidden="true"
        >
            {/* Soft ground / island */}
            <ellipse cx="20" cy="34.5" rx="14" ry="2.2" fill="currentColor" opacity="0.2" />

            {/* Tropical fronds left */}
            <path
                d="M10 33c-1.5-4-4.2-6.5-7-7.5 1.8 0.4 3.2 1.6 4 3.2C6.2 26.5 5 24.2 5 22c2.2 1.2 3.6 3.5 4.2 6.2 0.4-2.8 1.5-5 3.2-6.5-0.2 2.2-0.6 4.8-1.4 7.3-.5 1.5-0.8 2.8-1 4z"
                fill="currentColor"
                opacity="0.85"
            />
            {/* Tropical fronds right */}
            <path
                d="M30 33c1.5-4 4.2-6.5 7-7.5-1.8 0.4-3.2 1.6-4 3.2C33.8 26.5 35 24.2 35 22c-2.2 1.2-3.6 3.5-4.2 6.2-0.4-2.8-1.5-5-3.2-6.5 0.2 2.2 0.6 4.8 1.4 7.3.5 1.5 0.8 2.8 1 4z"
                fill="currentColor"
                opacity="0.85"
            />

            {/* Meru / temple tiers */}
            <path d="M8 27.5h24l-2.5-3.2H10.5L8 27.5z" fill="currentColor" />
            <path d="M11 24.3h18l-2.2-2.8H13.2L11 24.3z" fill="currentColor" opacity="0.92" />
            <path d="M13.5 21.5h13l-1.8-2.4H15.3L13.5 21.5z" fill="currentColor" opacity="0.88" />
            <path d="M16 19.1h8l-1.4-2H17.4L16 19.1z" fill="currentColor" opacity="0.84" />
            <path d="M18 17.1h4l-0.9-1.4h-2.2L18 17.1z" fill="currentColor" opacity="0.8" />

            {/* Finial / sun above peak */}
            <circle cx="20" cy="11.5" r="2.2" fill="currentColor" />
            <path
                d="M20 7.2v1.4M20 14.4v1.4M15.8 11.5h1.4M22.8 11.5h1.4M17 8.5l1 1M22 13.5l1 1M23 8.5l-1 1M17 13.5l-1 1"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
            />

            {/* Temple body */}
            <rect x="15.5" y="27.5" width="9" height="6" rx="0.6" fill="currentColor" />
            {/* Door */}
            <path d="M18.6 33.5v-3.4c0-0.9 0.7-1.5 1.4-1.5s1.4 0.6 1.4 1.5v3.4" fill="currentColor" opacity="0.35" />
            {/* Windows */}
            <rect x="16.3" y="28.5" width="1.8" height="1.8" rx="0.25" fill="currentColor" opacity="0.35" />
            <rect x="21.9" y="28.5" width="1.8" height="1.8" rx="0.25" fill="currentColor" opacity="0.35" />
        </svg>
    );
}
