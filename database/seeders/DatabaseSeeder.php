<?php

namespace Database\Seeders;

use App\Models\BlockedDate;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\Review;
use App\Models\User;
use App\Models\Villa;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // 1. Create Admin User
        $admin = User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin PusatVilla',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]
        );

        // 2. Create Regular Test User
        User::firstOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'User PusatVilla',
                'password' => bcrypt('password'),
                'role' => 'user',
            ]
        );

        // 3. Seed Bali destinations & villas
        $this->call(BaliLocationSeeder::class);

        // 4. Create a Mock Booking and Review for each villa
        $allVillas = Villa::all();

        foreach ($allVillas as $villa) {
            $booking = Booking::firstOrCreate(
                ['booking_code' => 'VB-2026-'.str_pad($villa->id, 4, '0', STR_PAD_LEFT)],
                [
                    'villa_id' => $villa->id,
                    'guest_name' => 'Budi Santoso',
                    'guest_email' => 'budi.santoso@example.com',
                    'guest_phone' => '081234567890',
                    'check_in' => '2026-05-10',
                    'check_out' => '2026-05-12',
                    'total_nights' => 2,
                    'num_guests' => 2,
                    'base_price' => $villa->price_per_night,
                    'total_amount' => $villa->price_per_night * 2,
                    'status' => 'completed',
                    'payment_status' => 'paid',
                    'notes' => 'Minta disiapkan handuk ekstra.',
                    'utm_source' => 'google',
                    'utm_medium' => 'organic',
                ]
            );

            if ($booking->payment_status === 'paid') {
                Payment::firstOrCreate(
                    ['booking_id' => $booking->id],
                    [
                        'midtrans_order_id' => 'MID-'.$booking->booking_code,
                        'amount' => $booking->total_amount,
                        'status' => 'success',
                        'paid_at' => $booking->check_in,
                        'payment_type' => 'bank_transfer',
                    ]
                );
            }

            Review::firstOrCreate(
                ['booking_id' => $booking->id],
                [
                    'villa_id' => $villa->id,
                    'guest_name' => $booking->guest_name,
                    'rating' => 5,
                    'comment' => 'Sangat merekomendasikan villa ini! Kebersihannya luar biasa dan pemandangannya sangat indah. Pelayanan ramah sekali.',
                    'is_approved' => true,
                    'approved_at' => now(),
                    'approved_by' => $admin->id,
                ]
            );
        }

        // 5. Seed Payment Methods
        $paymentMethods = [
            [
                'name' => 'QRIS',
                'code' => 'qris',
                'account_number' => '',
                'account_name' => 'PT PUSAT VILLA INDONESIA',
                'logo_url' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Bank Central Asia (BCA)',
                'code' => 'bca',
                'account_number' => '8019208392',
                'account_name' => 'PT PUSAT VILLA INDONESIA',
                'logo_url' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Bank Mandiri',
                'code' => 'mandiri',
                'account_number' => '1230009876543',
                'account_name' => 'PT PUSAT VILLA INDONESIA',
                'logo_url' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Bank Negara Indonesia (BNI)',
                'code' => 'bni',
                'account_number' => '0987654321',
                'account_name' => 'PT PUSAT VILLA INDONESIA',
                'logo_url' => null,
                'is_active' => true,
            ],
            [
                'name' => 'Bank Rakyat Indonesia (BRI)',
                'code' => 'bri',
                'account_number' => '5678912345',
                'account_name' => 'PT PUSAT VILLA INDONESIA',
                'logo_url' => null,
                'is_active' => false,
            ],
        ];

        foreach ($paymentMethods as $pm) {
            PaymentMethod::firstOrCreate(['code' => $pm['code']], $pm);
        }

        // 6. Seed Blocked Dates for first villa (next 30 days, random weekends)
        $firstVilla = Villa::first();
        if ($firstVilla) {
            $blockedCount = 0;
            for ($i = 1; $i <= 30; $i++) {
                $date = Carbon::now()->addDays($i);
                if ($date->isWeekend() && $blockedCount < 4) {
                    BlockedDate::firstOrCreate(
                        ['villa_id' => $firstVilla->id, 'date' => $date->toDateString()],
                        [
                            'reason' => 'Sudah dibooking via Airbnb',
                            'created_by' => $admin->id,
                            'source' => 'external',
                        ]
                    );
                    $blockedCount++;
                }
            }
        }
    }
}
