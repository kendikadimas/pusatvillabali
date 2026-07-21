<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\PasswordUpdateRequest;
use App\Http\Requests\Settings\TwoFactorAuthenticationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class SecurityController extends Controller
{
    /**
     * Show the user's security settings page.
     */
    public function edit(TwoFactorAuthenticationRequest $request): Response|JsonResponse
    {
        $props = [
            'canManageTwoFactor' => Features::canManageTwoFactorAuthentication(),
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ];

        if (Features::canManageTwoFactorAuthentication()) {
            $request->ensureStateIsValid();

            $props['twoFactorEnabled'] = $request->user()->hasEnabledTwoFactorAuthentication();
            $props['requiresConfirmation'] = Features::optionEnabled(Features::twoFactorAuthentication(), 'confirm');
        }

        // Return JSON for API/non-Inertia requests (Bearer token or no X-Inertia header on web)
        if ($request->bearerToken() || ! $request->header('X-Inertia')) {
            return response()->json($props);
        }

        // Otherwise return Inertia response for web
        return Inertia::render('settings/security', $props);
    }

    /**
     * Update the user's password.
     * Google-only accounts may set a password without current_password.
     */
    public function update(PasswordUpdateRequest $request): JsonResponse|RedirectResponse
    {
        $user = $request->user();
        $wasFirstSet = ! $user->hasUserPassword();

        $user->update([
            'password' => $request->password,
            'password_set_by_user' => true,
        ]);

        $message = $wasFirstSet
            ? 'Password berhasil dibuat. Anda sekarang bisa login dengan email dan password.'
            : 'Password berhasil diperbarui.';

        // Inertia web form (profile page) expects a redirect back
        if ($request->header('X-Inertia')) {
            return back()->with('success', $message);
        }

        return response()->json(['message' => $message]);
    }
}
