<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

it('renders admin login as a standalone inertia page', function () {
    $this->get('/admin/login')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/login')
        );
});

it('redirects guests from admin dashboard to admin login', function () {
    $this->get('/admin/dashboard')
        ->assertRedirect('/admin/login');
});

it('renders admin dashboard for authenticated admins', function () {
    $admin = User::factory()->create(['role' => 'super_admin']);

    $this->actingAs($admin)
        ->get('/admin/dashboard')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->has('stats')
            ->has('recentBookings')
            ->has('sanctum_token')
            ->has('admin_token')
        );
});

it('rejects non-admin users from admin dashboard', function () {
    $user = User::factory()->create(['role' => 'user']);

    $this->actingAs($user)
        ->get('/admin/dashboard')
        ->assertForbidden();
});

it('logs admin in via web session and redirects to dashboard', function () {
    $admin = User::factory()->create([
        'role' => 'super_admin',
        'password' => bcrypt('password'),
    ]);

    $this->post('/admin/login', [
        'email' => $admin->email,
        'password' => 'password',
    ])->assertRedirect(route('admin.dashboard'));

    $this->assertAuthenticatedAs($admin);
    expect(session('admin_token'))->not->toBeEmpty()
        ->and(session('sanctum_token'))->not->toBeEmpty();
});

it('allows admin api calls with bearer token from web login session', function () {
    $admin = User::factory()->create([
        'role' => 'super_admin',
        'password' => bcrypt('password'),
    ]);

    $this->post('/admin/login', [
        'email' => $admin->email,
        'password' => 'password',
    ])->assertRedirect(route('admin.dashboard'));

    $token = session('admin_token');
    expect($token)->not->toBeEmpty();

    $this->withToken($token)
        ->getJson('/api/v1/admin/analytics?from='.now()->subMonth()->toDateString().'&to='.now()->toDateString())
        ->assertOk();
});
