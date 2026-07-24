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
});
