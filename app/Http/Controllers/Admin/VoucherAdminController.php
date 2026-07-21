<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class VoucherAdminController extends Controller
{
    public function index(): JsonResponse
    {
        $vouchers = Voucher::withCount('bookings')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['vouchers' => $vouchers]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'code' => 'required|string|max:50|unique:vouchers,code',
            'description' => 'nullable|string|max:255',
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'min_booking_amount' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
        ]);

        if ($data['type'] === 'percent' && $data['value'] > 100) {
            return response()->json(['errors' => ['value' => ['Persentase tidak boleh lebih dari 100.']]], 422);
        }

        $data['code'] = Str::upper(trim($data['code']));
        $data['min_booking_amount'] = $data['min_booking_amount'] ?? 0;

        $voucher = Voucher::create($data);

        ActivityLogService::log('create', 'Voucher', $voucher->code, 'Voucher baru dibuat: '.$voucher->code);

        return response()->json(['voucher' => $voucher, 'message' => 'Voucher berhasil dibuat.'], 201);
    }

    public function show(int $id): JsonResponse
    {
        $voucher = Voucher::withCount('bookings')->findOrFail($id);

        return response()->json(['voucher' => $voucher]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $voucher = Voucher::findOrFail($id);

        $data = $request->validate([
            'code' => 'required|string|max:50|unique:vouchers,code,'.$id,
            'description' => 'nullable|string|max:255',
            'type' => 'required|in:percent,fixed',
            'value' => 'required|numeric|min:0',
            'min_booking_amount' => 'nullable|numeric|min:0',
            'max_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'valid_from' => 'nullable|date',
            'valid_until' => 'nullable|date|after_or_equal:valid_from',
        ]);

        if ($data['type'] === 'percent' && $data['value'] > 100) {
            return response()->json(['errors' => ['value' => ['Persentase tidak boleh lebih dari 100.']]], 422);
        }

        $data['code'] = Str::upper(trim($data['code']));
        $data['min_booking_amount'] = $data['min_booking_amount'] ?? 0;

        $voucher->update($data);

        ActivityLogService::log('update', 'Voucher', $voucher->code, 'Voucher diperbarui: '.$voucher->code);

        return response()->json(['voucher' => $voucher->fresh(), 'message' => 'Voucher berhasil diperbarui.']);
    }

    public function destroy(int $id): JsonResponse
    {
        $voucher = Voucher::findOrFail($id);

        // Soft-disable instead of hard delete if it has been used
        if ($voucher->used_count > 0) {
            $voucher->update(['is_active' => false]);

            ActivityLogService::log('disable', 'Voucher', $voucher->code, 'Voucher dinonaktifkan (sudah pernah digunakan): '.$voucher->code);

            return response()->json(['message' => 'Voucher sudah pernah digunakan, dinonaktifkan saja.']);
        }

        ActivityLogService::log('delete', 'Voucher', $voucher->code, 'Voucher dihapus: '.$voucher->code);

        $voucher->delete();

        return response()->json(['message' => 'Voucher berhasil dihapus.']);
    }
}
