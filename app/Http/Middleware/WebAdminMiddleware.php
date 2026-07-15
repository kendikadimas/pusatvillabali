<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class WebAdminMiddleware
{
    /**
     * Handle an incoming request.
     * Checks authentication via session or Sanctum token, and verifies admin role.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if authenticated via session or Sanctum token
        $user = $request->user();

        if (! $user) {
            return redirect('/admin/login');
        }

        if (! $user->isAdmin()) {
            abort(403, 'Unauthorized. Admin access required.');
        }

        return $next($request);
    }
}
