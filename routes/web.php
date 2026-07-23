<?php

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
});

Route::post('/auth/exchange-code', [OAuthController::class, 'exchangeCode']);

Route::middleware('auth')->group(function () {
    Route::post('/email/verification-notification', function (Request $request) {
        $request->user()->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    })->middleware('throttle:6,1')->name('verification.send');
});

require __DIR__.'/settings.php';
