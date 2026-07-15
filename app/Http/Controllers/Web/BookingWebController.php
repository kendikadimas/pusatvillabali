<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\PaymentMethod;
use App\Models\Review;
use App\Models\Setting;
use App\Models\Villa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingWebController extends Controller
{
    public function confirm(Request $request): Response
    {
        $villa = null;
        if ($request->filled('villa_slug')) {
            $villa = Villa::where('slug', $request->villa_slug)
                ->where('is_active', true)
                ->first();
        }

        $paymentMethods = PaymentMethod::where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        $settings = Setting::pluck('value', 'key')->toArray();

        $authUser = $request->user();

        return Inertia::render('public/booking-confirm', [
            'villa' => $villa,
            'paymentMethods' => $paymentMethods,
            'settings' => $settings,
            'query' => $request->only(['villa_slug', 'checkIn', 'checkOut', 'guests']),
            'authUser' => $authUser ? [
                'name' => $authUser->name,
                'email' => $authUser->email,
            ] : null,
        ]);
    }

    public function payment(Request $request): Response
    {
        $booking = null;
        if ($request->filled('code')) {
            $booking = Booking::where('booking_code', $request->code)
                ->with(['villa', 'payment', 'payment.paymentMethod'])
                ->first();
        }

        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('public/booking-payment', [
            'booking' => $booking,
            'settings' => $settings,
            'code' => $request->code,
        ]);
    }

    public function status(Request $request): Response
    {
        $booking = null;
        if ($request->filled('code')) {
            $booking = Booking::where('booking_code', $request->code)
                ->with(['villa', 'payment'])
                ->first();
        }

        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('public/booking-status', [
            'booking' => $booking,
            'settings' => $settings,
            'code' => $request->code,
        ]);
    }

    public function success(Request $request): Response
    {
        $booking = null;
        if ($request->filled('code')) {
            $booking = Booking::where('booking_code', $request->code)
                ->with(['villa', 'payment'])
                ->first();
        }

        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('public/booking-success', [
            'booking' => $booking,
            'settings' => $settings,
        ]);
    }

    public function failed(Request $request): Response
    {
        $booking = null;
        if ($request->filled('code')) {
            $booking = Booking::where('booking_code', $request->code)
                ->with(['villa', 'payment'])
                ->first();
        }

        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('public/booking-failed', [
            'booking' => $booking,
            'settings' => $settings,
        ]);
    }

    public function review(Request $request): Response
    {
        $booking = null;
        $existingReview = null;

        if ($request->filled('token')) {
            $booking = Booking::whereHas('reviewToken', function ($q) use ($request) {
                $q->where('token', $request->token)->where('used', false)->where('expires_at', '>', now());
            })
                ->with('villa')
                ->first();

            if ($booking) {
                $existingReview = Review::where('booking_id', $booking->id)->first();
            }
        }

        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('public/booking-review', [
            'booking' => $booking,
            'existingReview' => $existingReview,
            'token' => $request->token,
            'settings' => $settings,
        ]);
    }
}
