<?php

use App\Http\Controllers\OAuthController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\ProfileWebController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('/profile', [ProfileWebController::class, 'profile'])->name('profile');
    Route::get('/wishlist', [ProfileWebController::class, 'wishlist'])->name('wishlist');
});

Route::prefix('auth')->group(function () {
    Route::get('/google/redirect', [OAuthController::class, 'redirectToGoogle']);
    Route::get('/google/callback', [OAuthController::class, 'handleGoogleCallback']);
});

Route::post('/auth/exchange-code', [OAuthController::class, 'exchangeCode']);

Route::middleware('auth')->group(function () {
    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    })->middleware('throttle:6,1')->name('verification.send');
});

require __DIR__.'/settings.php';
