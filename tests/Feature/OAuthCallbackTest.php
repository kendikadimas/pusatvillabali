<?php

use App\Models\User;
use Illuminate\Support\Facades\Cache;

it('logs in user from legacy auth callback one-time code', function () {
    $user = User::factory()->create([
        'email' => 'oauth-callback@test.com',
        'google_id' => 'google-callback-1',
    ]);

    $code = 'test-oauth-code-123';
    Cache::put('oauth_code:'.$code, $user->id, 60);

    $response = $this->get('/auth/callback?code='.$code);

    $response->assertRedirect(route('home'));
    $this->assertAuthenticatedAs($user);
    expect(Cache::get('oauth_code:'.$code))->toBeNull();
});

it('redirects to login when auth callback code is missing', function () {
    $response = $this->get('/auth/callback');

    $response->assertRedirect(route('login'));
    $this->assertGuest();
});

it('redirects to login when auth callback code is invalid', function () {
    $response = $this->get('/auth/callback?code=invalid-or-expired');

    $response->assertRedirect(route('login'));
    $this->assertGuest();
});
