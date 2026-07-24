<?php

use App\Http\Controllers\Admin\Web\AdminWebController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\OAuthController;
use App\Http\Controllers\Web\BookingWebController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\InvoiceController;
use App\Http\Controllers\Web\ProfileWebController;
use App\Http\Controllers\Web\VillaWebController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');

// Public villa routes
Route::get('/villas', [VillaWebController::class, 'index'])->name('villas.index');
Route::get('/villas/destination', [VillaWebController::class, 'byDestination'])->name('villas.by-destination');
Route::get('/villas/{slug}', [VillaWebController::class, 'show'])->name('villas.show');

// Booking routes (auth required)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('/profile', [ProfileWebController::class, 'profile'])->name('profile');
    Route::get('/wishlist', [ProfileWebController::class, 'wishlist'])->name('wishlist');

    Route::prefix('booking')->name('booking.')->group(function () {
        Route::get('/confirm', [BookingWebController::class, 'confirm'])->name('confirm');
        Route::get('/payment', [BookingWebController::class, 'payment'])->name('payment');
        Route::get('/status', [BookingWebController::class, 'status'])->name('status');
        Route::get('/success', [BookingWebController::class, 'success'])->name('success');
        Route::get('/failed', [BookingWebController::class, 'failed'])->name('failed');
        Route::get('/review', [BookingWebController::class, 'review'])->name('review');
    });

    Route::get('/invoice/{code}', [InvoiceController::class, 'download'])->name('invoice.download');
});

Route::prefix('auth')->group(function () {
    Route::get('/google/redirect', [OAuthController::class, 'redirectToGoogle']);
    Route::get('/google/callback', [OAuthController::class, 'handleGoogleCallback']);
    // Handles legacy SPA redirects: /auth/callback?code=... (session login)
    Route::get('/callback', [OAuthController::class, 'handleAuthCallback'])->name('auth.callback');
});

Route::post('/auth/exchange-code', [OAuthController::class, 'exchangeCode']);

Route::middleware('auth')->group(function () {
    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    })->middleware('throttle:6,1')->name('verification.send');
});

// Admin (web / Inertia)
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AdminWebController::class, 'login'])->name('login');
    Route::post('/login', [AdminWebController::class, 'handleLogin'])->name('login.submit');
    Route::post('/logout', [AdminWebController::class, 'handleLogout'])->name('logout');

    Route::middleware(['web_admin'])->group(function () {
        Route::get('/dashboard', [AdminWebController::class, 'dashboard'])->name('dashboard');
        Route::get('/analytics', [AdminWebController::class, 'analytics'])->name('analytics');
        Route::get('/villas', [AdminWebController::class, 'villas'])->name('villas');
        Route::get('/villas/new', [AdminWebController::class, 'villaNew'])->name('villas.new');
        Route::get('/villas/{id}/edit', [AdminWebController::class, 'villaEdit'])->name('villas.edit');
        Route::get('/bookings', [AdminWebController::class, 'bookings'])->name('bookings');
        Route::get('/bookings/{id}', [AdminWebController::class, 'bookingDetail'])->name('bookings.detail');
        Route::get('/bookings/{code}/ktp', [BookingController::class, 'showKtp'])->name('bookings.ktp');
        Route::get('/bookings/{code}/payment-proof', [BookingController::class, 'showPaymentProof'])->name('bookings.payment-proof');
        Route::get('/reviews', [AdminWebController::class, 'reviews'])->name('reviews');
        Route::get('/destinations', [AdminWebController::class, 'destinations'])->name('destinations');
        Route::get('/calendar', [AdminWebController::class, 'calendar'])->name('calendar');
        Route::get('/settings', [AdminWebController::class, 'settings'])->name('settings');
        Route::get('/users', [AdminWebController::class, 'users'])->name('users');
        Route::get('/vouchers', [AdminWebController::class, 'vouchers'])->name('vouchers');
    });
});

require __DIR__.'/settings.php';
