<?php

namespace App\Http\Controllers\Admin\Web;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Destination;
use App\Models\PaymentMethod;
use App\Models\Review;
use App\Models\Setting;
use App\Models\User;
use App\Models\Villa;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminWebController extends Controller
{
    public function login(): Response
    {
        return Inertia::render('admin/login');
    }

    public function handleLogin(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ], [
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Password wajib diisi.',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => 'Email atau password salah.',
            ]);
        }

        if (! in_array($user->role, ['admin', 'super_admin'])) {
            throw ValidationException::withMessages([
                'email' => 'Akses ditolak. Akun ini bukan administrator.',
            ]);
        }

        Auth::login($user);

        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }

    public function handleLogout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/admin/login');
    }

    public function dashboard(): Response
    {
        $stats = [
            'checkins_today' => Booking::whereDate('check_in', today())->whereIn('status', ['confirmed', 'completed'])->count(),
            'bookings_this_month' => Booking::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->count(),
            'revenue_this_month' => Booking::whereMonth('created_at', now()->month)->whereYear('created_at', now()->year)->where('payment_status', 'paid')->sum('total_amount'),
            'pending_payments' => Booking::where('payment_status', 'pending')->count(),
            'pending_reviews' => Review::where('is_approved', false)->count(),
            'occupancy_rate' => 0,
        ];

        $recentBookings = Booking::with('villa')->latest()->take(10)->get();
        $todayCheckins = Booking::with('villa')->whereDate('check_in', today())->whereIn('status', ['confirmed'])->get();
        $todayCheckouts = Booking::with('villa')->whereDate('check_out', today())->whereIn('status', ['confirmed', 'completed'])->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentBookings' => $recentBookings,
            'todayCheckins' => $todayCheckins,
            'todayCheckouts' => $todayCheckouts,
        ]);
    }

    public function analytics(): Response
    {
        return Inertia::render('admin/analytics');
    }

    public function villas(): Response
    {
        $villas = Villa::with('destination')
            ->withCount('bookings')
            ->withAvg('reviews', 'rating')
            ->latest()
            ->paginate(20);

        $destinations = Destination::orderBy('name')->get();

        return Inertia::render('admin/villas', [
            'villas' => $villas,
            'destinations' => $destinations,
        ]);
    }

    public function villaNew(): Response
    {
        $destinations = Destination::orderBy('name')->get();

        return Inertia::render('admin/villa-form', [
            'villa' => null,
            'destinations' => $destinations,
        ]);
    }

    public function villaEdit(int $id): Response
    {
        $villa = Villa::with(['destination', 'blockedDates'])->findOrFail($id);
        $destinations = Destination::orderBy('name')->get();

        return Inertia::render('admin/villa-form', [
            'villa' => $villa,
            'destinations' => $destinations,
        ]);
    }

    public function bookings(): Response
    {
        $bookings = Booking::with(['villa', 'payment'])
            ->latest()
            ->paginate(20);

        $villas = Villa::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('admin/bookings', [
            'bookings' => $bookings,
            'villas' => $villas,
        ]);
    }

    public function bookingDetail(int $id): Response
    {
        $booking = Booking::with(['villa', 'user', 'payment', 'paymentMethod'])->findOrFail($id);
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('admin/booking-detail', [
            'booking' => $booking,
            'settings' => $settings,
        ]);
    }

    public function reviews(): Response
    {
        $reviews = Review::with(['villa', 'booking'])
            ->latest()
            ->paginate(20);

        return Inertia::render('admin/reviews', [
            'reviews' => $reviews,
        ]);
    }

    public function destinations(): Response
    {
        $destinations = Destination::withCount('villas')->orderBy('name')->get();

        return Inertia::render('admin/destinations', [
            'destinations' => $destinations,
        ]);
    }

    public function calendar(): Response
    {
        $villas = Villa::where('is_active', true)->select('id', 'name', 'slug')->orderBy('name')->get();

        return Inertia::render('admin/calendar', [
            'villas' => $villas,
        ]);
    }

    public function settings(): Response
    {
        $settings = Setting::pluck('value', 'key')->toArray();
        $paymentMethods = PaymentMethod::orderBy('sort_order')->get();

        return Inertia::render('admin/settings', [
            'settings' => $settings,
            'paymentMethods' => $paymentMethods,
        ]);
    }

    public function users(): Response
    {
        return Inertia::render('admin/users');
    }
}
