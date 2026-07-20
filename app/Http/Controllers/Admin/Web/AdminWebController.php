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

        // Create Sanctum token for API calls from admin frontend
        $token = $user->createToken('admin-token', ['admin-access'])->plainTextToken;
        $request->session()->put('admin_token', $token);
        $request->session()->put('sanctum_token', $token);

        return redirect()->intended(route('admin.dashboard'));
    }

    public function handleLogout(Request $request): RedirectResponse
    {
        // Revoke all Sanctum tokens for the user
        if ($request->user()) {
            $request->user()->tokens()->delete();
        }

        Auth::logout();

        $request->session()->forget(['admin_token', 'sanctum_token']);
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

    public function villas(Request $request): Response
    {
        $search = $request->string('search')->trim()->value();
        $destinationId = $request->input('destination_id');
        $status = $request->input('status'); // 'active' | 'inactive' | ''
        $sort = $request->input('sort', 'newest'); // newest|oldest|name_asc|name_desc|price_asc|price_desc|rating

        $villas = Villa::with('destination')
            ->withCount('bookings')
            ->withAvg(['reviews' => fn ($q) => $q->where('is_approved', true)], 'rating')
            ->when($search, fn ($q) => $q->where(fn ($q2) => $q2
                ->where('name', 'like', "%{$search}%")
                ->orWhere('location', 'like', "%{$search}%")))
            ->when($destinationId, fn ($q) => $q->where('destination_id', $destinationId))
            ->when($status === 'active', fn ($q) => $q->where('is_active', true))
            ->when($status === 'inactive', fn ($q) => $q->where('is_active', false))
            ->when($sort === 'oldest', fn ($q) => $q->oldest())
            ->when($sort === 'name_asc', fn ($q) => $q->orderBy('name'))
            ->when($sort === 'name_desc', fn ($q) => $q->orderByDesc('name'))
            ->when($sort === 'price_asc', fn ($q) => $q->orderBy('price_per_night'))
            ->when($sort === 'price_desc', fn ($q) => $q->orderByDesc('price_per_night'))
            ->when($sort === 'rating', fn ($q) => $q->orderByDesc('reviews_avg_rating'))
            ->when(! in_array($sort, ['oldest', 'name_asc', 'name_desc', 'price_asc', 'price_desc', 'rating']), fn ($q) => $q->latest())
            ->paginate(20)
            ->withQueryString();

        $destinations = Destination::orderBy('name')->get();

        $villaStats = [
            'total' => Villa::count(),
            'active' => Villa::where('is_active', true)->count(),
            'inactive' => Villa::where('is_active', false)->count(),
            'avg_price' => (int) Villa::where('is_active', true)->avg('price_per_night'),
        ];

        return Inertia::render('admin/villas', [
            'villas' => $villas,
            'destinations' => $destinations,
            'stats' => $villaStats,
            'filters' => [
                'search' => $search,
                'destination_id' => $destinationId,
                'status' => $status,
                'sort' => $sort,
            ],
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

    public function bookings(Request $request): Response
    {
        $search = $request->string('search')->trim()->value();
        $status = $request->string('status')->trim()->value();
        $today = now()->toDateString();

        $bookings = Booking::with(['villa', 'payment'])
            ->when($search, fn ($q) => $q->where(fn ($q2) => $q2
                ->where('guest_name', 'like', "%{$search}%")
                ->orWhere('booking_code', 'like', "%{$search}%")
                ->orWhere('guest_email', 'like', "%{$search}%")))
            ->when($status, fn ($q) => $q->where('status', $status))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $villas = Villa::select('id', 'name')->orderBy('name')->get();

        // Stats
        $stats = [
            'total' => Booking::count(),
            'today' => Booking::whereDate('created_at', $today)->count(),
            'pending' => Booking::where('status', 'pending')->count(),
            'pending_payment' => Booking::where('payment_status', 'pending')->count(),
            'confirmed' => Booking::where('status', 'confirmed')->count(),
            'checkin_today' => Booking::with('villa:id,name')
                ->whereDate('check_in', $today)
                ->where('status', 'confirmed')
                ->get(['id', 'booking_code', 'guest_name', 'villa_id', 'check_in', 'check_out']),
            'checkout_today' => Booking::with('villa:id,name')
                ->whereDate('check_out', $today)
                ->where('status', 'confirmed')
                ->get(['id', 'booking_code', 'guest_name', 'villa_id', 'check_in', 'check_out']),
        ];

        return Inertia::render('admin/bookings', [
            'bookings' => $bookings,
            'villas' => $villas,
            'filters' => ['search' => $search, 'status' => $status],
            'stats' => $stats,
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

    public function reviews(Request $request): Response
    {
        $filter = $request->input('filter', 'pending');
        $filter = is_string($filter) ? trim($filter) : 'pending';

        if (! in_array($filter, ['all', 'pending', 'approved'], true)) {
            $filter = 'pending';
        }

        $reviews = Review::with(['villa:id,name,slug', 'booking:id,booking_code'])
            ->when($filter === 'pending', fn ($q) => $q->where('is_approved', false))
            ->when($filter === 'approved', fn ($q) => $q->where('is_approved', true))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        $villas = Villa::where('is_active', true)->select('id', 'name')->orderBy('name')->get();

        return Inertia::render('admin/reviews', [
            'reviews' => $reviews,
            'filters' => ['filter' => $filter],
            'villas' => $villas,
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

    public function vouchers(): Response
    {
        return Inertia::render('admin/vouchers');
    }
}
