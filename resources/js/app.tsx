import { createInertiaApp, usePage } from '@inertiajs/react';
import axios from 'axios';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AdminLayout from '@/layouts/admin-layout';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import PublicLayout from '@/layouts/public-layout';
import SettingsLayout from '@/layouts/settings/layout';

// Base axios config
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Attach Sanctum Bearer token from localStorage on every request
axios.interceptors.request.use((config) => {
    // Check for admin token first (for admin panel), then regular sanctum token
    const token = localStorage.getItem('admin_token') || localStorage.getItem('sanctum_token');

    if (token) {
        config.headers = config.headers ?? {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
});

// Component to sync admin_token from flash to localStorage
function AdminTokenSync() {
    const { flash } = usePage().props as { flash?: { admin_token?: string } };

    useEffect(() => {
        if (flash?.admin_token) {
            localStorage.setItem('admin_token', flash.admin_token);
        }
    }, [flash?.admin_token]);

    return null;
}

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('public/'):
                return PublicLayout;
            case name.startsWith('admin/'):
                return AdminLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                <AdminTokenSync />
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
