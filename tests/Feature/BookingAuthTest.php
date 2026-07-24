<?php

use App\Models\User;
use App\Models\Villa;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Sanctum\Sanctum;

it('shares sanctum_token for session-authenticated users', function () {
    $user = User::factory()->create(['role' => 'user']);

    $this->actingAs($user)
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('sanctum_token')
            ->where('auth.user.id', $user->id)
        );

    expect(session('sanctum_token'))->not->toBeEmpty();
});

it('allows booking via session auth without bearer token', function () {
    Storage::fake('private');
    $user = User::factory()->create(['role' => 'user']);
    $villa = Villa::factory()->create([
        'price_per_night' => 1000000,
        'weekend_price' => null,
        'is_active' => true,
        'max_guests' => 6,
    ]);

    $response = $this->actingAs($user)->postJson('/api/v1/bookings', [
        'villa_id' => $villa->id,
        'guest_name' => $user->name,
        'guest_email' => $user->email,
        'guest_phone' => '081234567890',
        'check_in' => now()->addDays(14)->toDateString(),
        'check_out' => now()->addDays(17)->toDateString(),
        'num_guests' => 2,
        'ktp_image' => UploadedFile::fake()->image('ktp.jpg'),
    ]);

    $response->assertCreated()
        ->assertJsonStructure(['booking_code', 'total_amount']);
});

it('allows booking via sanctum bearer token', function () {
    Storage::fake('private');
    $user = User::factory()->create(['role' => 'user']);
    Sanctum::actingAs($user);
    $villa = Villa::factory()->create([
        'price_per_night' => 1000000,
        'weekend_price' => null,
        'is_active' => true,
        'max_guests' => 6,
    ]);

    $response = $this->postJson('/api/v1/bookings', [
        'villa_id' => $villa->id,
        'guest_name' => $user->name,
        'guest_email' => $user->email,
        'guest_phone' => '081234567890',
        'check_in' => now()->addDays(21)->toDateString(),
        'check_out' => now()->addDays(24)->toDateString(),
        'num_guests' => 2,
        'ktp_image' => UploadedFile::fake()->image('ktp.jpg'),
    ]);

    $response->assertCreated()
        ->assertJsonStructure(['booking_code', 'total_amount']);
});

it('rejects unauthenticated booking requests', function () {
    $villa = Villa::factory()->create(['is_active' => true]);

    $response = $this->postJson('/api/v1/bookings', [
        'villa_id' => $villa->id,
        'guest_name' => 'Guest',
        'guest_email' => 'guest@example.com',
        'guest_phone' => '081234567890',
        'check_in' => now()->addDays(7)->toDateString(),
        'check_out' => now()->addDays(10)->toDateString(),
        'num_guests' => 2,
        'ktp_image' => UploadedFile::fake()->image('ktp.jpg'),
    ]);

    $response->assertUnauthorized();
});

it('rejects admin from creating bookings', function () {
    Storage::fake('private');
    $admin = User::factory()->admin()->create();
    $villa = Villa::factory()->create([
        'price_per_night' => 1000000,
        'weekend_price' => null,
        'is_active' => true,
        'max_guests' => 6,
    ]);

    $response = $this->actingAs($admin)->postJson('/api/v1/bookings', [
        'villa_id' => $villa->id,
        'guest_name' => $admin->name,
        'guest_email' => $admin->email,
        'guest_phone' => '081234567890',
        'check_in' => now()->addDays(14)->toDateString(),
        'check_out' => now()->addDays(17)->toDateString(),
        'num_guests' => 2,
        'ktp_image' => UploadedFile::fake()->image('ktp.jpg'),
    ]);

    $response->assertForbidden()
        ->assertJson([
            'message' => 'Akun admin tidak dapat membuat booking. Silakan gunakan akun pengguna biasa.',
        ]);
});

it('rejects super_admin from creating bookings', function () {
    Storage::fake('private');
    $superAdmin = User::factory()->superAdmin()->create();
    $villa = Villa::factory()->create([
        'price_per_night' => 1000000,
        'weekend_price' => null,
        'is_active' => true,
        'max_guests' => 6,
    ]);

    $response = $this->actingAs($superAdmin)->postJson('/api/v1/bookings', [
        'villa_id' => $villa->id,
        'guest_name' => $superAdmin->name,
        'guest_email' => $superAdmin->email,
        'guest_phone' => '081234567890',
        'check_in' => now()->addDays(21)->toDateString(),
        'check_out' => now()->addDays(24)->toDateString(),
        'num_guests' => 2,
        'ktp_image' => UploadedFile::fake()->image('ktp.jpg'),
    ]);

    $response->assertForbidden()
        ->assertJson([
            'message' => 'Akun admin tidak dapat membuat booking. Silakan gunakan akun pengguna biasa.',
        ]);
});

it('returns sanctum token on api user login', function () {
    $user = User::factory()->create([
        'role' => 'user',
        'password' => bcrypt('password'),
    ]);

    $response = $this->postJson('/api/v1/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertOk()
        ->assertJsonStructure(['token', 'user']);

    expect($response->json('token'))->not->toBeEmpty();
    expect($user->tokens()->count())->toBeGreaterThan(0);
});
