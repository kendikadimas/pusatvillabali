<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Models\Setting;
use App\Models\Villa;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $villas = Villa::where('is_active', true)
            ->with('destination')
            ->withAvg('reviews', 'rating')
            ->withCount('reviews')
            ->orderBy('destination_id')
            ->orderBy('name')
            ->get();

        // Group villas by destination
        $villasByDestination = $villas->groupBy(function ($villa) {
            return $villa->destination?->name ?? 'Lainnya';
        })->map(function ($group) {
            return $group->values();
        });

        $destinations = Destination::orderBy('name')->get();

        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('public/home', [
            'villas' => $villas,
            'villasByDestination' => $villasByDestination,
            'destinations' => $destinations,
            'settings' => $settings,
        ]);
    }
}
