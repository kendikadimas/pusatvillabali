<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\Villa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VillaWebController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Villa::where('is_active', true)
            ->with('destination')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                    ->orWhere('location', 'like', '%'.$search.'%');
            });
        } elseif ($request->filled('location')) {
            $query->where('location', 'like', '%'.$request->location.'%');
        }

        if ($request->filled('bedrooms')) {
            $query->where('bedrooms', '>=', (int) $request->bedrooms);
        }

        if ($request->filled('guests')) {
            $query->where('max_guests', '>=', (int) $request->guests);
        }

        if ($request->filled('min_price')) {
            $query->where('price_per_night', '>=', (int) $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price_per_night', '<=', (int) $request->max_price);
        }

        if ($request->filled('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        $sortBy = in_array($request->sortBy, ['price_per_night', 'created_at', 'name']) ? $request->sortBy : 'created_at';
        $sortOrder = $request->sortOrder === 'asc' ? 'asc' : 'desc';
        $query->orderBy($sortBy, $sortOrder);

        $villas = $query->paginate(12)->withQueryString();

        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('public/villas', [
            'villas' => $villas,
            'filters' => $request->only(['search', 'location', 'checkIn', 'checkOut', 'guests', 'bedrooms', 'min_price', 'max_price', 'sortBy', 'sortOrder', 'category']),
            'settings' => $settings,
        ]);
    }

    public function show(string $slug): Response
    {
        $villa = Villa::where('slug', $slug)
            ->where('is_active', true)
            ->with(['destination', 'reviews' => function ($q) {
                $q->where('is_approved', true)->latest()->take(10);
            }])
            ->withAvg(['reviews' => fn ($q) => $q->where('is_approved', true)], 'rating')
            ->withCount(['reviews' => fn ($q) => $q->where('is_approved', true)])
            ->firstOrFail();

        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('public/villa-detail', [
            'villa' => $villa,
            'settings' => $settings,
        ]);
    }
}
