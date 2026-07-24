<?php

use App\Models\Booking;
use App\Models\Destination;
use App\Models\PaymentMethod;
use App\Models\Review;
use App\Models\User;
use App\Models\Villa;
use App\Models\Voucher;
use Laravel\Sanctum\Sanctum;

// =====================================================
// VOUCHERS
// =====================================================

it('admin can list vouchers', function () {
    actingAsAdmin();
    Voucher::factory()->count(3)->create();

    $response = $this->getJson('/api/v1/admin/vouchers');

    $response->assertOk();
    expect($response->json())->toBeArray();
});

it('admin can create a percent voucher', function () {
    actingAsAdmin();

    $response = $this->postJson('/api/v1/admin/vouchers', [
        'code' => 'DISC10',
        'description' => 'Diskon 10%',
        'discount_type' => 'percentage',
        'discount_value' => 10,
        'min_booking_amount' => 500000,
        'max_discount' => 100000,
        'usage_limit' => 50,
        'is_active' => true,
        'valid_from' => now()->toDateString(),
        'valid_until' => now()->addMonth()->toDateString(),
    ]);

    $response->assertCreated()
        ->assertJsonPath('voucher.code', 'DISC10')
        ->assertJsonPath('voucher.discount_type', 'percentage');

    $this->assertDatabaseHas('vouchers', ['code' => 'DISC10']);
});

it('admin can create a fixed voucher', function () {
    actingAsAdmin();

    $response = $this->postJson('/api/v1/admin/vouchers', [
        'code' => 'FLAT50K',
        'description' => 'Potongan Rp50.000',
        'discount_type' => 'fixed',
        'discount_value' => 50000,
        'min_booking_amount' => 300000,
        'is_active' => true,
        'valid_from' => now()->toDateString(),
        'valid_until' => now()->addMonth()->toDateString(),
    ]);

    $response->assertCreated()
        ->assertJsonPath('voucher.discount_type', 'fixed');
});

it('admin cannot create voucher with duplicate code', function () {
    actingAsAdmin();
    Voucher::factory()->create(['code' => 'DUPE']);

    $response = $this->postJson('/api/v1/admin/vouchers', [
        'code' => 'DUPE',
        'type' => 'fixed',
        'value' => 10000,
        'min_booking_amount' => 0,
        'is_active' => true,
        'valid_from' => now()->toDateString(),
        'valid_until' => now()->addMonth()->toDateString(),
    ]);

    $response->assertStatus(422);
});

it('admin can update a voucher', function () {
    actingAsAdmin();
    $voucher = Voucher::factory()->create(['is_active' => true]);

    $response = $this->putJson("/api/v1/admin/vouchers/{$voucher->id}", [
        'code' => $voucher->code,
        'discount_type' => $voucher->discount_type,
        'discount_value' => $voucher->discount_value,
        'min_booking_amount' => $voucher->min_booking_amount,
        'is_active' => false,
        'valid_from' => now()->toDateString(),
        'valid_until' => now()->addMonth()->toDateString(),
    ]);

    $response->assertOk()
        ->assertJsonPath('voucher.is_active', false);

    $this->assertDatabaseHas('vouchers', ['id' => $voucher->id, 'is_active' => false]);
});

it('admin can delete an unused voucher', function () {
    actingAsAdmin();
    $voucher = Voucher::factory()->create(['used_count' => 0]);

    $response = $this->deleteJson("/api/v1/admin/vouchers/{$voucher->id}");

    $response->assertOk();
    $this->assertDatabaseMissing('vouchers', ['id' => $voucher->id]);
});

it('admin deleting a used voucher deactivates instead of deletes', function () {
    actingAsAdmin();
    $voucher = Voucher::factory()->create(['used_count' => 1, 'is_active' => true]);

    $response = $this->deleteJson("/api/v1/admin/vouchers/{$voucher->id}");

    $response->assertStatus(422);
    $this->assertDatabaseHas('vouchers', ['id' => $voucher->id]);
});

it('non-admin cannot access voucher endpoints', function () {
    $user = User::factory()->create(['role' => 'user']);
    Sanctum::actingAs($user);

    $this->getJson('/api/v1/admin/vouchers')->assertStatus(403);
});

// =====================================================
// DESTINATIONS
// =====================================================

it('admin can list destinations', function () {
    actingAsAdmin();
    Destination::factory()->count(3)->create();

    $response = $this->getJson('/api/v1/admin/destinations');

    $response->assertOk()
        ->assertJsonStructure(['data']);
});

it('admin can create a destination', function () {
    actingAsAdmin();

    $response = $this->postJson('/api/v1/admin/destinations', [
        'name' => 'Ubud Test',
        'city' => 'Ubud, Gianyar',
        'query' => 'UbudTest',
        'image' => 'https://example.com/ubud.jpg',
    ]);

    $response->assertCreated()
        ->assertJsonPath('data.name', 'Ubud Test');

    $this->assertDatabaseHas('destinations', ['name' => 'Ubud Test']);
});

it('admin can update a destination', function () {
    actingAsAdmin();
    $dest = Destination::factory()->create();

    $response = $this->putJson("/api/v1/admin/destinations/{$dest->id}", [
        'name' => 'Updated Destination',
        'city' => $dest->city,
        'query' => $dest->query,
        'image' => $dest->image,
    ]);

    $response->assertOk()
        ->assertJsonPath('data.name', 'Updated Destination');
});

it('admin can delete a destination', function () {
    actingAsAdmin();
    $dest = Destination::factory()->create();

    $response = $this->deleteJson("/api/v1/admin/destinations/{$dest->id}");

    $response->assertOk();
    $this->assertDatabaseMissing('destinations', ['id' => $dest->id]);
});

// =====================================================
// VILLAS
// =====================================================

it('admin can list villas', function () {
    actingAsAdmin();
    Villa::factory()->count(3)->create();

    $response = $this->getJson('/api/v1/admin/villas');

    $response->assertOk();
    expect($response->json())->toBeArray();
});

it('admin can create a villa', function () {
    actingAsAdmin();
    $dest = Destination::factory()->create();

    $response = $this->postJson('/api/v1/admin/villas', [
        'name' => 'Villa Sunset',
        'description' => 'Villa indah di Seminyak dengan pemandangan sunset.',
        'short_desc' => 'Villa dengan pemandangan sunset.',
        'location' => 'Seminyak, Bali',
        'destination_id' => $dest->id,
        'price_per_night' => 1500000,
        'bedrooms' => 2,
        'bathrooms' => 2,
        'max_guests' => 4,
        'min_nights' => 1,
        'check_in_time' => '14:00',
        'check_out_time' => '12:00',
        'is_active' => true,
    ]);

    $response->assertCreated()
        ->assertJsonPath('villa.name', 'Villa Sunset');

    $this->assertDatabaseHas('villas', ['name' => 'Villa Sunset']);
});

it('admin can create a villa with relative host avatar path', function () {
    actingAsAdmin();
    $dest = Destination::factory()->create();

    $response = $this->postJson('/api/v1/admin/villas', [
        'name' => 'Villa Relative Avatar',
        'description' => 'Villa dengan avatar relatif dari form admin.',
        'short_desc' => 'Avatar relatif /storage.',
        'location' => 'Canggu, Bali',
        'destination_id' => $dest->id,
        'price_per_night' => 1200000,
        'weekend_price' => 1500000,
        'bedrooms' => 3,
        'bathrooms' => 2,
        'max_guests' => 6,
        'min_nights' => 2,
        'check_in_time' => '14:00:00',
        'check_out_time' => '12:00:00',
        'is_active' => true,
        'host_name' => 'Admin',
        'host_years' => 1,
        'host_avatar' => '/storage/avatars/host.jpg',
        'host_phone' => '081234567890',
        'host_is_verified' => true,
        'amenities' => [
            ['name' => 'WiFi', 'icon' => 'Wifi'],
        ],
        'beds' => 4,
        'cleaning_fee' => 100000,
        'bedrooms_info' => [
            ['image' => '/storage/villas/extras/room.jpg', 'title' => 'Master', 'subtext' => 'King bed'],
        ],
    ]);

    $response->assertCreated()
        ->assertJsonPath('villa.host_avatar', '/storage/avatars/host.jpg');
});

it('admin can update a villa', function () {
    actingAsAdmin();
    $dest = Destination::factory()->create();
    $villa = Villa::factory()->create(['destination_id' => $dest->id]);

    $response = $this->putJson("/api/v1/admin/villas/{$villa->id}", [
        'name' => 'Villa Updated',
        'description' => $villa->description ?? 'Deskripsi villa.',
        'short_desc' => $villa->short_desc ?? 'Short desc.',
        'location' => $villa->location,
        'destination_id' => $dest->id,
        'price_per_night' => $villa->price_per_night,
        'bedrooms' => $villa->bedrooms,
        'bathrooms' => $villa->bathrooms,
        'max_guests' => $villa->max_guests,
        'min_nights' => 1,
        'check_in_time' => '14:00',
        'check_out_time' => '12:00',
        'is_active' => false,
    ]);

    $response->assertOk()
        ->assertJsonPath('villa.name', 'Villa Updated');
});

it('admin can delete a villa', function () {
    actingAsAdmin();
    $villa = Villa::factory()->create(['is_active' => true]);

    $response = $this->deleteJson("/api/v1/admin/villas/{$villa->id}");

    $response->assertOk();
    // destroy() deactivates instead of hard deleting
    $this->assertDatabaseHas('villas', ['id' => $villa->id, 'is_active' => false]);
});

// =====================================================
// BOOKINGS
// =====================================================

it('admin can list bookings', function () {
    actingAsAdmin();
    $villa = Villa::factory()->create();
    Booking::factory()->count(3)->create(['villa_id' => $villa->id]);

    $response = $this->getJson('/api/v1/admin/bookings');

    $response->assertOk()
        ->assertJsonStructure(['data', 'meta']);
});

it('admin can view a single booking', function () {
    actingAsAdmin();
    $villa = Villa::factory()->create();
    $booking = Booking::factory()->create(['villa_id' => $villa->id]);

    $response = $this->getJson("/api/v1/admin/bookings/{$booking->id}");

    $response->assertOk()
        ->assertJsonPath('id', $booking->id);
});

it('admin can update booking status', function () {
    actingAsAdmin();
    $villa = Villa::factory()->create();
    $booking = Booking::factory()->create([
        'villa_id' => $villa->id,
        'status' => 'pending',
        'guest_email' => 'guest@example.com',
    ]);

    $response = $this->patchJson("/api/v1/admin/bookings/{$booking->id}/status", [
        'status' => 'confirmed',
        'payment_status' => 'paid',
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('bookings', ['id' => $booking->id, 'status' => 'confirmed']);
});

// =====================================================
// PAYMENT METHODS
// =====================================================

it('admin can list payment methods', function () {
    actingAsAdmin();
    PaymentMethod::factory()->count(2)->create();

    $response = $this->getJson('/api/v1/admin/payment-methods');

    $response->assertOk();
    expect($response->json())->toBeArray();
});

it('admin can create a payment method', function () {
    actingAsAdmin();

    $response = $this->postJson('/api/v1/admin/payment-methods', [
        'name' => 'BCA Transfer',
        'code' => 'bca_test',
        'account_number' => '1234567890',
        'account_name' => 'PT Pusat Villa',
        'is_active' => true,
    ]);

    $response->assertCreated()
        ->assertJsonPath('payment_method.name', 'BCA Transfer');

    $this->assertDatabaseHas('payment_methods', ['name' => 'BCA Transfer']);
});

it('admin can update a payment method', function () {
    actingAsAdmin();
    $pm = PaymentMethod::factory()->create();

    $response = $this->putJson("/api/v1/admin/payment-methods/{$pm->id}", [
        'name' => 'Updated Bank',
        'code' => $pm->code,
        'account_number' => $pm->account_number,
        'account_name' => $pm->account_name,
        'is_active' => $pm->is_active,
    ]);

    $response->assertOk();
    $this->assertDatabaseHas('payment_methods', ['id' => $pm->id, 'name' => 'Updated Bank']);
});

it('admin can delete a payment method', function () {
    actingAsAdmin();
    $pm = PaymentMethod::factory()->create();

    $response = $this->deleteJson("/api/v1/admin/payment-methods/{$pm->id}");

    $response->assertOk();
    $this->assertDatabaseMissing('payment_methods', ['id' => $pm->id]);
});

// =====================================================
// REVIEWS
// =====================================================

it('admin can list reviews', function () {
    actingAsAdmin();
    $villa = Villa::factory()->create();
    $user = User::factory()->create();
    $booking = Booking::factory()->create(['villa_id' => $villa->id, 'user_id' => $user->id]);
    Review::factory()->count(2)->create(['villa_id' => $villa->id, 'booking_id' => $booking->id]);

    $response = $this->getJson('/api/v1/admin/reviews');

    $response->assertOk()
        ->assertJsonStructure(['data', 'meta']);
});

it('admin can approve a review', function () {
    actingAsAdmin();
    $villa = Villa::factory()->create();
    $user = User::factory()->create();
    $booking = Booking::factory()->create(['villa_id' => $villa->id, 'user_id' => $user->id]);
    $review = Review::factory()->create([
        'villa_id' => $villa->id,
        'booking_id' => $booking->id,
        'is_approved' => false,
    ]);

    $response = $this->patchJson("/api/v1/admin/reviews/{$review->id}/approve");

    $response->assertOk();
    $this->assertDatabaseHas('reviews', ['id' => $review->id, 'is_approved' => true]);
});

it('admin can delete a review', function () {
    actingAsAdmin();
    $villa = Villa::factory()->create();
    $user = User::factory()->create();
    $booking = Booking::factory()->create(['villa_id' => $villa->id, 'user_id' => $user->id]);
    $review = Review::factory()->create(['villa_id' => $villa->id, 'booking_id' => $booking->id]);

    $response = $this->deleteJson("/api/v1/admin/reviews/{$review->id}");

    $response->assertOk();
    $this->assertDatabaseMissing('reviews', ['id' => $review->id]);
});
