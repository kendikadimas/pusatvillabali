<?php

use App\Http\Controllers\Admin\Web\AdminWebController;
use App\Http\Controllers\OAuthController;
use App\Http\Controllers\Web\BookingWebController;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\ProfileWebController;
use App\Http\Controllers\Web\VillaWebController;
use Illuminate\Support\Facades\Route;

// ==========================================
// Public Routes
// ==========================================
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/villas', [VillaWebController::class, 'index'])->name('villas.index');
Route::get('/villas/explore', [VillaWebController::class, 'byDestination'])->name('villas.by-destination');
Route::get('/villas/{slug}', [VillaWebController::class, 'show'])->name('villas.show');

// Wishlist (public access, stored in session/localStorage)
Route::get('/wishlist', [ProfileWebController::class, 'wishlist'])->name('wishlist');

// Booking public routes
Route::get('/booking/confirm', [BookingWebController::class, 'confirm'])->name('booking.confirm');
Route::get('/booking/payment', [BookingWebController::class, 'payment'])->name('booking.payment');
Route::get('/booking/status', [BookingWebController::class, 'status'])->name('booking.status');
Route::get('/booking/success', [BookingWebController::class, 'success'])->name('booking.success');
Route::get('/booking/failed', [BookingWebController::class, 'failed'])->name('booking.failed');

// Review (via token, public access)
Route::get('/review', [BookingWebController::class, 'review'])->name('booking.review');

// ==========================================
// Auth (Fortify handles POST, we handle GET pages)
// ==========================================
Route::prefix('auth')->group(function () {
    Route::get('/google/redirect', [OAuthController::class, 'redirectToGoogle'])->name('google.redirect');
    Route::get('/google/callback', [OAuthController::class, 'handleGoogleCallback'])->name('google.callback');
    // Inertia page that handles the one-time code exchange on the frontend
    Route::get('/callback', fn () => inertia('auth/callback'))->name('auth.callback');
});
Route::post('/auth/exchange-code', [OAuthController::class, 'exchangeCode'])
    ->middleware('throttle:oauth')
    ->name('auth.exchange-code');

// ==========================================
// Authenticated User Routes
// ==========================================
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [ProfileWebController::class, 'dashboard'])->name('dashboard');
    Route::get('/profile', [ProfileWebController::class, 'profile'])->name('profile');
});

// ==========================================
// Admin Routes (web, Inertia-based)
// ==========================================
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
        Route::get('/reviews', [AdminWebController::class, 'reviews'])->name('reviews');
        Route::get('/destinations', [AdminWebController::class, 'destinations'])->name('destinations');
        Route::get('/calendar', [AdminWebController::class, 'calendar'])->name('calendar');
        Route::get('/settings', [AdminWebController::class, 'settings'])->name('settings');
        Route::get('/users', [AdminWebController::class, 'users'])->name('users');
    });
});

require __DIR__.'/settings.php';
