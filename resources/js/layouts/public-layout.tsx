import React from 'react';
import PublicFooter from '@/components/public/public-footer';
import PublicHeader from '@/components/public/public-header';
import { useAuthTokenSync } from '@/hooks/use-auth-token-sync';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
    useAuthTokenSync();

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <PublicHeader />
            <main className="flex-1">{children}</main>
            <PublicFooter />
        </div>
    );
}
