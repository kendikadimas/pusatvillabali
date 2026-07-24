<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SettingAdminController extends Controller
{
    /**
     * Keys managed by the admin settings form (and used by public pages).
     *
     * @var list<string>
     */
    private const KEYS = [
        'settings_prop_name',
        'settings_whatsapp',
        'settings_email',
        'settings_address',
        'settings_meta_title',
        'settings_meta_description',
    ];

    /**
     * Get all settings.
     */
    public function index(): JsonResponse
    {
        // Prefer settings_whatsapp; fall back to legacy settings_wa if present.
        $whatsapp = Setting::getValue('settings_whatsapp')
            ?? Setting::getValue('settings_wa', '6281234567890');

        $settings = [
            'settings_prop_name' => Setting::getValue('settings_prop_name', 'PusatVillaBali'),
            'settings_whatsapp' => $whatsapp,
            'settings_email' => Setting::getValue('settings_email', 'noreply@pusatvilla.id'),
            'settings_address' => Setting::getValue('settings_address', ''),
            'settings_meta_title' => Setting::getValue('settings_meta_title', ''),
            'settings_meta_description' => Setting::getValue('settings_meta_description', ''),
        ];

        return response()->json($settings);
    }

    /**
     * Update settings.
     */
    public function update(Request $request): JsonResponse
    {
        $rules = [
            'settings_prop_name' => 'nullable|string|max:255',
            'settings_whatsapp' => 'nullable|string|max:50',
            'settings_email' => 'nullable|email|max:255',
            'settings_address' => 'nullable|string|max:1000',
            'settings_meta_title' => 'nullable|string|max:255',
            'settings_meta_description' => 'nullable|string|max:1000',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        foreach (self::KEYS as $key) {
            if ($request->has($key)) {
                Setting::setValue($key, $request->input($key));
            }
        }

        // Keep legacy key in sync for any code still reading settings_wa.
        if ($request->has('settings_whatsapp')) {
            Setting::setValue('settings_wa', $request->input('settings_whatsapp'));
        }

        return response()->json(['message' => 'Pengaturan berhasil disimpan.']);
    }
}
