<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use Illuminate\Http\Request;
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
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        // Load app settings — cached to avoid N+1 on every request
        $settings = cache()->remember('app_settings', 300, function () {
            if (class_exists(Setting::class) && \Schema::hasTable('settings')) {
                return Setting::all()->pluck('value', 'key')->toArray();
            }

            return [];
        });

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'avatar' => $user->avatar ?? null,
                    'phone' => $user->phone ?? null,
                    'role' => $user->role ?? null,
                    'permissions' => $user->permissions ?? [],
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'info' => $request->session()->get('info'),
            ],
            'admin_token' => $request->session()->get('admin_token'),
            // Ensure every session-authenticated user has a Sanctum token for API calls
            'sanctum_token' => $user ? $this->ensureSanctumToken($request, $user) : null,
            'settings' => $settings,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    /**
     * Return (and mint if needed) a Sanctum plain-text token stored in session.
     * Covers Fortify register/login and any session-only auth path.
     */
    private function ensureSanctumToken(Request $request, mixed $user): string
    {
        $existing = $request->session()->get('sanctum_token')
            ?: $request->session()->get('admin_token');

        if (is_string($existing) && $existing !== '') {
            $request->session()->put('sanctum_token', $existing);

            return $existing;
        }

        $tokenName = in_array($user->role ?? null, ['admin', 'super_admin'], true)
            ? 'admin-token'
            : 'user-token';

        $abilities = in_array($user->role ?? null, ['admin', 'super_admin'], true)
            ? ['admin-access']
            : ['*'];

        $token = $user->createToken($tokenName, $abilities)->plainTextToken;
        $request->session()->put('sanctum_token', $token);

        if (in_array($user->role ?? null, ['admin', 'super_admin'], true) && ! $request->session()->has('admin_token')) {
            $request->session()->put('admin_token', $token);
        }

        return $token;
    }
}
