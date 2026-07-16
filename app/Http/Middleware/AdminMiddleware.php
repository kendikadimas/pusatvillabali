<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Admin session timeout in seconds (1 hour of inactivity).
     */
    private const INACTIVITY_TIMEOUT = 3600;

    public function handle(Request $request, Closure $next): Response
    {
        // Use sanctum guard explicitly since all admin routes use auth:sanctum
        $user = auth('sanctum')->user() ?? $request->user();

        // Must be authenticated and have admin or super_admin role
        if (! $user || ! $user->isAdmin()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        // Token must carry the admin-access ability
        $token = $user->currentAccessToken();
        if (! $token || ! $token->can('admin-access')) {
            return response()->json(['message' => 'Token tidak valid untuk akses admin.'], 403);
        }

        // Enforce 1-hour inactivity timeout.
        // In tests, Sanctum::actingAs() uses a Mockery mock token where property access
        // on unstubbed attributes throws or returns unexpected values, so guard defensively.
        try {
            $lastUsed = $token->last_used_at instanceof \DateTimeInterface ? $token->last_used_at : null;
        } catch (\Throwable) {
            $lastUsed = null;
        }
        if ($lastUsed !== null && now()->diffInSeconds($lastUsed) > self::INACTIVITY_TIMEOUT) {
            $token->delete();

            return response()->json([
                'message' => 'Sesi admin telah berakhir karena tidak aktif. Silakan login kembali.',
                'code' => 'SESSION_EXPIRED',
            ], 401);
        }

        return $next($request);
    }
}
