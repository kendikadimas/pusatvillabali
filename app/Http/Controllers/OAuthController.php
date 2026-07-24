<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class OAuthController extends Controller
{
    public function redirectToGoogle(): RedirectResponse
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback(Request $request): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Gagal autentikasi dengan Google.');
        }

        $user = User::where('email', $googleUser->getEmail())->first();

        if (! $user) {
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'password' => Hash::make(Str::password(32)),
                'role' => 'user',
                'email_verified_at' => now(),
            ]);
        } else {
            $user->update([
                'google_id' => $googleUser->getId(),
                'avatar' => $googleUser->getAvatar(),
                'email_verified_at' => $user->email_verified_at ?? now(),
            ]);
        }

        // Inertia app uses session auth — log user in directly
        Auth::login($user, true);
        $request->session()->regenerate();

        return redirect()->intended(route('home'));
    }

    /**
     * Legacy SPA landing: /auth/callback?code=... (one-time app code, not Google's code).
     * Completes login via session so Inertia works even if old OAuth still redirects here.
     */
    public function handleAuthCallback(Request $request): RedirectResponse
    {
        if ($request->filled('error')) {
            return redirect()->route('login')->with('error', (string) $request->query('error'));
        }

        $code = $request->query('code');

        if (! is_string($code) || $code === '') {
            return redirect()->route('login')->with('error', 'Kode otorisasi tidak ditemukan. Silakan coba lagi.');
        }

        $userId = Cache::pull('oauth_code:'.$code);

        if (! $userId) {
            return redirect()->route('login')->with('error', 'Kode otorisasi tidak valid atau kedaluwarsa. Silakan coba login kembali.');
        }

        $user = User::find($userId);

        if (! $user) {
            return redirect()->route('login')->with('error', 'User tidak ditemukan.');
        }

        Auth::login($user, true);
        $request->session()->regenerate();

        return redirect()->intended(route('home'));
    }

    /**
     * Exchange a one-time OAuth authorization code for a Sanctum token.
     */
    public function exchangeCode(Request $request): JsonResponse
    {
        $request->validate(['code' => 'required|string']);

        $code = $request->input('code');
        $userId = Cache::pull('oauth_code:'.$code);

        if (! $userId) {
            return response()->json(['message' => 'Kode otorisasi tidak valid atau kedaluwarsa.'], 401);
        }

        $user = User::find($userId);

        if (! $user) {
            return response()->json(['message' => 'User tidak ditemukan.'], 404);
        }

        $token = $user->createToken('user-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }
}
