import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

/**
 * Keeps localStorage Sanctum tokens in sync with Inertia shared session props.
 * Covers Fortify register/login and any session-only auth path.
 */
export function useAuthTokenSync() {
    const { auth, sanctum_token, admin_token } = usePage<{
        auth: { user: { role?: string | null } | null };
        sanctum_token?: string | null;
        admin_token?: string | null;
    }>().props;

    useEffect(() => {
        if (!auth?.user) {
            localStorage.removeItem('sanctum_token');
            localStorage.removeItem('admin_token');
            localStorage.removeItem('auth_user');

            return;
        }

        if (sanctum_token) {
            localStorage.setItem('sanctum_token', sanctum_token);
        }

        if (admin_token) {
            localStorage.setItem('admin_token', admin_token);
        } else if (sanctum_token && ['admin', 'super_admin'].includes(auth.user.role ?? '')) {
            localStorage.setItem('admin_token', sanctum_token);
        }
    }, [auth?.user, sanctum_token, admin_token]);
}
