<?php

use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\PermissionMiddleware;
use App\Http\Middleware\RedirectIfAuthenticated;
use App\Http\Middleware\RequirePasswordCustom;
use App\Http\Middleware\SuperAdminMiddleware;
use App\Http\Middleware\WebAdminMiddleware;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'admin' => AdminMiddleware::class,
            'web_admin' => WebAdminMiddleware::class,
            'super_admin' => SuperAdminMiddleware::class,
            'permission' => PermissionMiddleware::class,
            'password.confirm' => RequirePasswordCustom::class,
            'guest' => RedirectIfAuthenticated::class,
        ]);

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        // Trust reverse proxies (cPanel/Cloudflare) so HTTPS is detected correctly
        $middleware->trustProxies(at: '*');

        // Enable stateful API so Inertia session auth works with Sanctum
        $middleware->statefulApi();

        // Never redirect guests to HTML login for API — always 401 JSON
        $middleware->redirectGuestsTo(function (Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return null;
            }

            return $request->is('admin/*') ? '/admin/login' : '/login';
        });

        // Add Inertia middleware to share auth state with frontend
        $middleware->appendToGroup('web', HandleInertiaRequests::class);

        $middleware->validateCsrfTokens(except: [
            'api/*',
            'login',
            'register',
            'logout',
            'forgot-password',
            'reset-password',
            'email/verification-notification',
            'user/confirm-password',
            'auth/exchange-code',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // API must never 302→GET login redirects (causes MethodNotAllowed on /api/v1/bookings)
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
        });

        $exceptions->render(function (MethodNotAllowedHttpException $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return response()->json([
                    'message' => $e->getMessage() ?: 'Method not allowed.',
                    'allowed' => $e->getHeaders()['Allow'] ?? null,
                ], 405);
            }
        });
    })->create();
