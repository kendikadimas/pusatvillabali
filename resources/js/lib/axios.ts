import axios from 'axios';

declare module 'axios' {
    export interface AxiosRequestConfig {
        skipAuth?: boolean;
    }
}

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
    if (config.skipAuth) {
        return config;
    }

    const url = config.url ?? '';
    const isApiRequest = url.startsWith('/api/') || url.includes('/api/');

    if (!isApiRequest) {
        return config;
    }

    const headers = config.headers;
    const existing = headers?.get?.('Authorization') ?? headers?.Authorization;

    if (existing) {
        return config;
    }

    const token =
        localStorage.getItem('admin_token') ||
        localStorage.getItem('sanctum_token');

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
});

export default axios;
