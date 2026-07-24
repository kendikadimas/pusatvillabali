<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Handle the incoming request — ensure session token is created before share() runs.
     */
    public function handle(Request $request, Closure $next): mixed
    {
        return parent::handle($request, $next);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $sanctumToken = $request->session()->get('sanctum_token');
        $adminToken = $request->session()->get('admin_token');

        if ($user && ! $sanctumToken) {
            try {
                $abilities = $user->isAdmin() ? ['admin-access'] : [];
                $sanctumToken = $user->createToken('session-token', $abilities)->plainTextToken;
                $request->session()->put('sanctum_token', $sanctumToken);

                if ($user->isAdmin()) {
                    $adminToken = $sanctumToken;
                    $request->session()->put('admin_token', $adminToken);
                }
            } catch (\Throwable $e) {
                Log::error('HandleInertiaRequests createToken failed', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
                $sanctumToken = null;
            }
        }

        // Admin API routes require a token with the admin-access ability.
        if ($user && $user->isAdmin() && ! $adminToken) {
            try {
                $adminToken = $user->createToken('admin-token', ['admin-access'])->plainTextToken;
                $request->session()->put('admin_token', $adminToken);
                $request->session()->put('sanctum_token', $adminToken);
                $sanctumToken = $adminToken;
            } catch (\Throwable $e) {
                Log::error('HandleInertiaRequests create admin token failed', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
                $adminToken = null;
            }
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'sanctum_token' => $sanctumToken,
            'admin_token' => $user && $user->isAdmin() ? $adminToken : null,
        ];
    }
}
