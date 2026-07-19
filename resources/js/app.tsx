import { createInertiaApp } from '@inertiajs/react';
import axios from 'axios';
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
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';

// Attach Sanctum Bearer token from localStorage on every request
axios.interceptors.request.use((config) => {
    const url = String(config.url ?? '');
    const isAdminApi = url.includes('/api/v1/admin') || url.includes('/admin/');
    const token = isAdminApi
        ? localStorage.getItem('admin_token') || localStorage.getItem('sanctum_token')
        : localStorage.getItem('sanctum_token') || localStorage.getItem('admin_token');

    if (token) {
        config.headers = config.headers ?? {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
});

// On 401: drop stale Bearer and retry once so session cookie can authenticate
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config as (typeof error.config & { _authRetry?: boolean }) | undefined;

        if (error.response?.status === 401 && config && !config._authRetry) {
            const authHeader = config.headers?.Authorization ?? config.headers?.authorization;

            if (authHeader) {
                config._authRetry = true;
                const raw = String(authHeader).replace(/^Bearer\s+/i, '');

                if (localStorage.getItem('sanctum_token') === raw) {
                    localStorage.removeItem('sanctum_token');
                }

                if (localStorage.getItem('admin_token') === raw) {
                    localStorage.removeItem('admin_token');
                }

                if (config.headers) {
                    delete config.headers.Authorization;
                    delete config.headers.authorization;
                }

                return axios.request(config);
            }
        }

        return Promise.reject(error);
    },
);

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name === 'admin/login':
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
