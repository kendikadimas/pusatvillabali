import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            {/* Balinese-inspired villa mark: meru roof + palm leaf + sun */}
            <g fill="currentColor">
                {/* Meru roof (traditional Balinese temple roof) — 3-tiered */}
                <path d="M20 2L6 14h4v2l-4 2v2h28v-2l-4-2v-2h4L20 2z" />
                <path d="M20 8L12 15h2v2l-4 2v2h20v-2l-4-2v-2h2L20 8z" opacity="0.7" />
                {/* Central spire */}
                <path d="M19 2h2v5h-2z" />
                {/* Villa base / pillars */}
                <rect x="14" y="22" width="12" height="4" rx="1" />
                <rect x="16" y="26" width="8" height="6" rx="0.5" />
                {/* Door */}
                <rect x="18.5" y="27" width="3" height="5" rx="0.5" opacity="0.3" />
                {/* Palm leaf left */}
                <path d="M6 16c-4-2-6-8-4-12 2 3 4 6 4 10v2z" opacity="0.5" />
                <path d="M8 18c-3-1-5-2-6-4 2 1 4 2 6 3v1z" opacity="0.4" />
                {/* Palm leaf right */}
                <path d="M34 16c4-2 6-8 4-12-2 3-4 6-4 10v2z" opacity="0.5" />
                <path d="M32 18c3-1 5-2 6-4-2 1-4 2-6 3v1z" opacity="0.4" />
                {/* Sun / decorative circle above */}
                <circle cx="20" cy="5" r="1.5" opacity="0.4" />
            </g>
        </svg>
    );
}
