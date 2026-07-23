<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\TransientToken;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Admin session timeout in seconds (1 hour of inactivity).
     */
    private const INACTIVITY_TIMEOUT = 3600;

    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Must be authenticated and have admin or super_admin role
        if (! $user || ! $user->isAdmin()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        // Token must carry the admin-access ability
        // TransientToken (used in tests) always passes ability checks
        // Session-authenticated users (web guard) have no token — allow them through
        $token = $user->currentAccessToken();
        if (! $token) {
            // No token means session-authenticated (web guard) — allow admins through
            return $next($request);
        }

        $isTransient = $token instanceof TransientToken;
        if (! $isTransient && ! $token->can('admin-access')) {
            return response()->json(['message' => 'Token tidak valid untuk akses admin.'], 403);
        }

        // Enforce 1-hour inactivity timeout (skip for TransientToken used in tests)
        if (! $isTransient) {
            $lastUsed = $token->last_used_at ?: null;
            if ($lastUsed !== null && now()->diffInSeconds($lastUsed) > self::INACTIVITY_TIMEOUT) {
                $token->delete();

                return response()->json([
                    'message' => 'Sesi admin telah berakhir karena tidak aktif. Silakan login kembali.',
                    'code' => 'SESSION_EXPIRED',
                ], 401);
            }
        }

        return $next($request);
    }
}
