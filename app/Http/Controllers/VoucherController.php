<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    /**
     * Validate a voucher code and return discount info.
     * POST /api/v1/vouchers/validate
     */
    public function validate(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
            'booking_amount' => 'required|numeric|min:0',
        ]);

        $voucher = Voucher::where('code', strtoupper(trim($request->code)))->first();

        if (! $voucher) {
            return response()->json(['message' => 'Kode voucher tidak ditemukan.'], 404);
        }

        if (! $voucher->isValid((float) $request->booking_amount)) {
            $reason = 'Voucher tidak dapat digunakan.';

            if (! $voucher->is_active) {
                $reason = 'Voucher sudah tidak aktif.';
            } elseif ($voucher->valid_until && $voucher->valid_until->toDateString() < now()->toDateString()) {
                $reason = 'Voucher sudah kedaluwarsa.';
            } elseif ($voucher->valid_from && $voucher->valid_from->toDateString() > now()->toDateString()) {
                $reason = 'Voucher belum berlaku.';
            } elseif ($voucher->usage_limit !== null && $voucher->used_count >= $voucher->usage_limit) {
                $reason = 'Kuota voucher sudah habis.';
            } elseif ((float) $request->booking_amount < (float) $voucher->min_booking_amount) {
                $reason = 'Minimum pemesanan untuk voucher ini adalah '.number_format($voucher->min_booking_amount, 0, ',', '.').'.';
            }

            return response()->json(['message' => $reason], 422);
        }

        $discount = $voucher->calculateDiscount((float) $request->booking_amount);

        return response()->json([
            'voucher' => [
                'id' => $voucher->id,
                'code' => $voucher->code,
                'description' => $voucher->description,
                'type' => $voucher->type,
                'value' => $voucher->value,
                'discount_amount' => $discount,
            ],
        ]);
    }
}
