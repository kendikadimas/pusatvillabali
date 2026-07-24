<?php

use App\Models\PaymentMethod;
use App\Models\Setting;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

// =====================================================
// SETTINGS
// =====================================================

it('admin can fetch settings', function () {
    actingAsAdmin();
    Setting::setValue('settings_prop_name', 'Test Villa');
    Setting::setValue('settings_whatsapp', '6281111111111');

    $response = $this->getJson('/api/v1/admin/settings');

    $response->assertOk()
        ->assertJsonPath('settings_prop_name', 'Test Villa')
        ->assertJsonPath('settings_whatsapp', '6281111111111');
});

it('admin can update settings with frontend field names', function () {
    actingAsAdmin();

    $response = $this->postJson('/api/v1/admin/settings', [
        'settings_prop_name' => 'PusatVillaBali',
        'settings_whatsapp' => '6281234567890',
        'settings_email' => 'admin@pusatvillabali.com',
        'settings_address' => 'Bali, Indonesia',
        'settings_meta_title' => 'Sewa Villa Bali',
        'settings_meta_description' => 'Platform sewa villa premium di Bali',
    ]);

    $response->assertOk()
        ->assertJsonPath('message', 'Pengaturan berhasil disimpan.');

    expect(Setting::getValue('settings_prop_name'))->toBe('PusatVillaBali');
    expect(Setting::getValue('settings_whatsapp'))->toBe('6281234567890');
    expect(Setting::getValue('settings_wa'))->toBe('6281234567890'); // legacy sync
    expect(Setting::getValue('settings_email'))->toBe('admin@pusatvillabali.com');
    expect(Setting::getValue('settings_meta_title'))->toBe('Sewa Villa Bali');
});

it('settings update rejects invalid email', function () {
    actingAsAdmin();

    $response = $this->postJson('/api/v1/admin/settings', [
        'settings_prop_name' => 'Test',
        'settings_whatsapp' => '628123',
        'settings_email' => 'not-an-email',
        'settings_address' => '',
        'settings_meta_title' => '',
        'settings_meta_description' => '',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['settings_email']);
});

it('settings update allows empty optional fields', function () {
    actingAsAdmin();

    $response = $this->postJson('/api/v1/admin/settings', [
        'settings_prop_name' => '',
        'settings_whatsapp' => '',
        'settings_email' => '',
        'settings_address' => '',
        'settings_meta_title' => '',
        'settings_meta_description' => '',
    ]);

    $response->assertOk()
        ->assertJsonPath('message', 'Pengaturan berhasil disimpan.');
});

// =====================================================
// PAYMENT METHOD TOGGLE
// =====================================================

it('admin can toggle payment method active status', function () {
    actingAsAdmin();
    $pm = PaymentMethod::create([
        'name' => 'BCA',
        'code' => 'bca',
        'account_number' => '123456',
        'account_name' => 'PusatVilla',
        'is_active' => true,
    ]);

    $response = $this->patchJson("/api/v1/admin/payment-methods/{$pm->id}/toggle");

    $response->assertOk()
        ->assertJsonPath('payment_method.is_active', false);

    $this->assertDatabaseHas('payment_methods', [
        'id' => $pm->id,
        'is_active' => false,
    ]);

    $response2 = $this->patchJson("/api/v1/admin/payment-methods/{$pm->id}/toggle");
    $response2->assertOk()
        ->assertJsonPath('payment_method.is_active', true);
});

it('toggle returns 404 for missing payment method', function () {
    actingAsAdmin();

    $this->patchJson('/api/v1/admin/payment-methods/99999/toggle')
        ->assertStatus(404);
});

it('non-admin cannot update settings', function () {
    $user = User::factory()->create(['role' => 'user']);
    Sanctum::actingAs($user);

    $this->postJson('/api/v1/admin/settings', [
        'settings_prop_name' => 'Hacked',
        'settings_whatsapp' => '628',
        'settings_email' => 'x@y.com',
    ])->assertStatus(403);
});
