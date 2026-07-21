<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;

it('shows password flags on profile page', function () {
    $user = User::factory()->create([
        'role' => 'user',
        'password_set_by_user' => true,
        'google_id' => null,
    ]);

    $this->actingAs($user)
        ->get(route('profile'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/profile')
            ->where('hasPassword', true)
            ->where('isGoogleAccount', false)
        );
});

it('marks google-only users as without user password', function () {
    $user = User::factory()->create([
        'role' => 'user',
        'google_id' => 'google-123',
        'password_set_by_user' => false,
        'password' => Hash::make(str()->random(32)),
    ]);

    $this->actingAs($user)
        ->get(route('profile'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('hasPassword', false)
            ->where('isGoogleAccount', true)
        );
});

it('allows google users to set a password without current password', function () {
    $user = User::factory()->create([
        'role' => 'user',
        'google_id' => 'google-456',
        'password_set_by_user' => false,
        'password' => Hash::make(str()->random(32)),
    ]);

    $response = $this->actingAs($user)->put(route('user-password.update'), [
        'password' => 'new-secure-password',
        'password_confirmation' => 'new-secure-password',
    ]);

    $response->assertOk()
        ->assertJsonFragment([
            'message' => 'Password berhasil dibuat. Anda sekarang bisa login dengan email dan password.',
        ]);

    $user->refresh();
    expect($user->password_set_by_user)->toBeTrue()
        ->and(Hash::check('new-secure-password', $user->password))->toBeTrue();
});

it('requires current password when user already has a password', function () {
    $user = User::factory()->create([
        'role' => 'user',
        'password' => Hash::make('password'),
        'password_set_by_user' => true,
    ]);

    $response = $this->actingAs($user)
        ->from(route('profile'))
        ->put(route('user-password.update'), [
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ]);

    $response->assertSessionHasErrors('current_password');
});

it('updates password when current password is correct', function () {
    $user = User::factory()->create([
        'role' => 'user',
        'password' => Hash::make('password'),
        'password_set_by_user' => true,
    ]);

    $response = $this->actingAs($user)->put(route('user-password.update'), [
        'current_password' => 'password',
        'password' => 'brand-new-password',
        'password_confirmation' => 'brand-new-password',
    ]);

    $response->assertOk();
    expect(Hash::check('brand-new-password', $user->refresh()->password))->toBeTrue();
});
