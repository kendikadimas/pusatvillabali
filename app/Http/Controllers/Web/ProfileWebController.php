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
    public function profile(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        // Redirect admin users to admin dashboard
        if ($user->isAdmin()) {
            abort(redirect('/admin/dashboard'));
        }

        // Match by user_id OR guest_email so bookings made while auth token
        // failed to attach (or guest checkout with same email) still appear.
        $bookings = Booking::query()
            ->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                    ->orWhereRaw('LOWER(guest_email) = ?', [strtolower($user->email)]);
            })
            ->with(['villa', 'payment'])
            ->latest()
            ->get();

        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('public/profile', [
            'userBookings' => $bookings,
            'settings' => $settings,
            'hasPassword' => $user->hasUserPassword(),
            'isGoogleAccount' => $user->isGoogleAccount(),
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
