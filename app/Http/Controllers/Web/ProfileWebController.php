<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileWebController extends Controller
{
    public function dashboard(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $bookings = Booking::where('user_id', $user->id)
            ->with(['villa', 'payment'])
            ->latest()
            ->get();

        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('public/profile', [
            'userBookings' => $bookings,
            'settings' => $settings,
        ]);
    }

    public function profile(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $bookings = Booking::where('user_id', $user->id)
            ->with(['villa', 'payment'])
            ->latest()
            ->get();

        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('public/profile', [
            'userBookings' => $bookings,
            'settings' => $settings,
        ]);
    }

    public function wishlist(Request $request): Response
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('public/wishlist', [
            'settings' => $settings,
        ]);
    }
}
