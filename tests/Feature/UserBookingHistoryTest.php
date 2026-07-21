<?php

use App\Models\Booking;
use App\Models\PaymentMethod;
use App\Models\User;
use App\Models\Villa;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Sanctum\Sanctum;

it('shows profile bookings matched by user_id', function () {
    $user = User::factory()->create(['role' => 'user']);
    $other = User::factory()->create(['role' => 'user']);
    $villa = Villa::factory()->create();

    $own = Booking::factory()->create([
        'villa_id' => $villa->id,
        'user_id' => $user->id,
        'guest_email' => $user->email,
    ]);

    Booking::factory()->create([
        'villa_id' => $villa->id,
        'user_id' => $other->id,
        'guest_email' => $other->email,
    ]);

    $this->actingAs($user)
        ->get(route('profile'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/profile')
            ->has('userBookings', 1)
            ->where('userBookings.0.id', $own->id)
        );
});

it('shows profile bookings matched by guest_email when user_id is null', function () {
    $user = User::factory()->create([
        'role' => 'user',
        'email' => 'guest.history@example.com',
    ]);
    $villa = Villa::factory()->create();

    $orphan = Booking::factory()->create([
        'villa_id' => $villa->id,
        'user_id' => null,
        'guest_email' => 'Guest.History@example.com',
    ]);

    $this->actingAs($user)
        ->get(route('profile'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/profile')
            ->has('userBookings', 1)
            ->where('userBookings.0.id', $orphan->id)
        );
});

it('api user bookings includes email-matched orphan bookings', function () {
    $user = User::factory()->create([
        'role' => 'user',
        'email' => 'api.history@example.com',
    ]);
    $villa = Villa::factory()->create();

    $byUser = Booking::factory()->create([
        'villa_id' => $villa->id,
        'user_id' => $user->id,
        'guest_email' => $user->email,
    ]);

    $byEmail = Booking::factory()->create([
        'villa_id' => $villa->id,
        'user_id' => null,
        'guest_email' => $user->email,
    ]);

    Sanctum::actingAs($user);

    $response = $this->getJson('/api/v1/user/bookings');

    $response->assertOk();

    $ids = collect($response->json('data'))->pluck('id')->all();
    expect($ids)->toContain($byUser->id)
        ->and($ids)->toContain($byEmail->id);
});

it('stores user_id when booking is created by authenticated user', function () {
    Storage::fake('private');

    $user = User::factory()->create(['role' => 'user']);
    $villa = Villa::factory()->create([
        'price_per_night' => 1000000,
        'weekend_price' => null,
        'is_active' => true,
        'max_guests' => 6,
    ]);
    $method = PaymentMethod::factory()->create(['is_active' => true]);

    Sanctum::actingAs($user);

    $response = $this->postJson('/api/v1/bookings', [
        'villa_id' => $villa->id,
        'payment_method_id' => $method->id,
        'guest_name' => $user->name,
        'guest_email' => $user->email,
        'guest_phone' => '081234567890',
        'check_in' => now()->addDays(30)->toDateString(),
        'check_out' => now()->addDays(33)->toDateString(),
        'num_guests' => 2,
        'ktp_image' => UploadedFile::fake()->image('ktp.jpg'),
    ]);

    $response->assertCreated();

    $this->assertDatabaseHas('bookings', [
        'booking_code' => $response->json('booking_code'),
        'user_id' => $user->id,
        'guest_email' => $user->email,
    ]);
});
