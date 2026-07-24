<?php

namespace Database\Seeders;

use App\Models\BlockedDate;
use App\Models\Booking;
use App\Models\Destination;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\Review;
use App\Models\User;
use App\Models\Villa;
use Carbon\Carbon;
use Faker\Factory as Faker;
use Faker\Generator;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductionLayoutSeeder extends Seeder
{
    use WithoutModelEvents;

    private Generator $faker;

    public function __construct()
    {
        $this->faker = Faker::create('id_ID');
    }

    public function run(): void
    {
        // 1. Admin
        $admin = User::updateOrCreate(
            ['email' => 'admin@pusatvillabali.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
                'role' => 'admin',
            ]
        );

        // 2. Sample users
        $users = [];
        for ($i = 1; $i <= 10; $i++) {
            $users[] = User::updateOrCreate(
                ['email' => "user{$i}@example.com"],
                [
                    'name' => $this->faker->name(),
                    'password' => bcrypt('password'),
                    'role' => 'user',
                ]
            );
        }

        // 3. Destinations (reuse BaliLocationSeeder)
        $this->call(BaliLocationSeeder::class);

        // 4. Generate extra villas per destination using factory
        $destinations = Destination::all();
        $villaNames = [
            'Sunset Paradise', 'Ocean Breeze', 'Tropical Haven', 'Palm Retreat', 'Coral Bay',
            'Island Bliss', 'Wave Rider', 'Coconut Grove', 'Sandy Toes', 'Blue Lagoon',
            'Morning Dew', 'Garden View', 'Hilltop Escape', 'Valley Mist', 'River Song',
            'Moonlight Villa', 'Starlight Suite', 'Golden Hour', 'Silver Tide', 'Diamond Cove',
            'Emerald Park', 'Ruby Residence', 'Sapphire Suite', 'Pearl Palace', 'Crystal Cave',
            'Amber Coast', 'Jade Garden', 'Opal Oasis', 'Topaz Tower', 'Garnet Villa',
            'Sunrise Point', 'Twilight Terrace', 'Dawn Break', 'Dusk View', 'Midnight Bloom',
            'Cloud Nine', 'Sky High', 'Sea Breeze', 'Wind Chime', 'Rain Drop',
            'Fire Place', 'Earth Tone', 'Water Fall', 'Stone Wall', 'Wood Land',
            'Bamboo Nest', 'Lotus Pond', 'Frangipani', 'Hibiscus', 'Orchid Villa',
        ];

        $villaCount = 0;
        foreach ($destinations as $dest) {
            // Already have villas from BaliLocationSeeder, add 2-4 more per destination
            $extraCount = $this->faker->numberBetween(2, 4);
            for ($i = 0; $i < $extraCount; $i++) {
                $name = $villaNames[$villaCount % count($villaNames)].' '.$dest->name;
                $slug = Str::slug($name).'-'.$villaCount;

                Villa::firstOrCreate(['slug' => $slug], [
                    'name' => $name,
                    'slug' => $slug,
                    'description' => $this->faker->paragraphs(3, true),
                    'short_desc' => $this->faker->sentence(),
                    'location' => $dest->city.', Bali',
                    'maps_url' => 'https://maps.google.com/?q='.urlencode($dest->name.' Bali'),
                    'bedrooms' => $this->faker->numberBetween(1, 5),
                    'bathrooms' => $this->faker->numberBetween(1, 4),
                    'max_guests' => $this->faker->numberBetween(2, 10),
                    'price_per_night' => $this->faker->numberBetween(500000, 8000000),
                    'weekend_price' => $this->faker->optional(0.7)->numberBetween(750000, 10000000),
                    'min_nights' => $this->faker->randomElement([1, 1, 1, 2, 2, 3]),
                    'amenities' => $this->faker->randomElements(
                        ['Kolam Renang', 'WiFi', 'AC', 'Dapur', 'BBQ', 'Rooftop', 'Spa', 'Yoga Deck', 'Gym', 'Parking', 'Smart TV', 'Mini Bar', 'Outdoor Shower', 'Garden', 'Sea View', 'Mountain View', 'Bicycle', 'Kayak'],
                        $this->faker->numberBetween(4, 8)
                    ),
                    'photos' => $this->randomPhotos($this->faker->numberBetween(3, 6)),
                    'rules' => 'Check-in: '.$this->faker->randomElement(['14:00', '15:00'])." WITA\nCheck-out: ".$this->faker->randomElement(['11:00', '12:00'])." WITA\n".$this->faker->randomElement(['Dilarang merokok', 'Tidak untuk pesta', 'Hewan peliharaan tidak diperbolehkan', 'Jaga ketenangan setelah jam 22:00']),
                    'check_in_time' => $this->faker->randomElement(['14:00:00', '15:00:00']),
                    'check_out_time' => $this->faker->randomElement(['11:00:00', '12:00:00']),
                    'is_active' => $this->faker->boolean(90),
                    'destination_id' => $dest->id,
                ]);

                $villaCount++;
            }
        }

        // 5. Generate bookings with various statuses
        $allVillas = Villa::where('is_active', true)->get();
        $bookingStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        $paymentStatuses = ['unpaid', 'paid', 'refunded'];

        for ($i = 0; $i < 80; $i++) {
            $villa = $allVillas->random();
            $checkIn = Carbon::now()->addDays($this->faker->numberBetween(-30, 60))->toDateString();
            $nights = $this->faker->numberBetween(1, 7);
            $checkOut = Carbon::parse($checkIn)->addDays($nights)->toDateString();
            $status = $this->faker->randomElement($bookingStatuses);
            $paymentStatus = $status === 'completed' ? 'paid' : ($status === 'cancelled' ? 'refunded' : $this->faker->randomElement(['unpaid', 'paid']));

            $booking = Booking::create([
                'booking_code' => 'VB-'.now()->year.'-'.str_pad($this->faker->unique()->numberBetween(1, 99999), 5, '0', STR_PAD_LEFT),
                'villa_id' => $villa->id,
                'guest_name' => $this->faker->name(),
                'guest_email' => $this->faker->unique()->safeEmail(),
                'guest_phone' => '08'.$this->faker->numerify('##########'),
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'total_nights' => $nights,
                'num_guests' => $this->faker->numberBetween(1, $villa->max_guests),
                'base_price' => $villa->price_per_night,
                'total_amount' => $villa->price_per_night * $nights,
                'status' => $status,
                'payment_status' => $paymentStatus,
                'notes' => $this->faker->optional(0.4)->sentence(),
                'cancelled_at' => $status === 'cancelled' ? now() : null,
                'utm_source' => $this->faker->randomElement(['google', 'instagram', 'facebook', 'tiktok', null]),
                'utm_medium' => $this->faker->randomElement(['organic', 'cpc', 'social', null]),
            ]);

            // Create payment for paid bookings
            if ($paymentStatus === 'paid') {
                Payment::create([
                    'booking_id' => $booking->id,
                    'midtrans_order_id' => 'MID-'.$booking->booking_code,
                    'midtrans_transaction_id' => 'TX-'.$this->faker->uuid(),
                    'amount' => $booking->total_amount,
                    'status' => 'success',
                    'paid_at' => Carbon::parse($checkIn)->subDays($this->faker->numberBetween(1, 14)),
                    'payment_type' => $this->faker->randomElement(['bank_transfer', 'qris', 'credit_card', 'ewallet']),
                    'snap_token' => null,
                    'expired_at' => null,
                ]);
            }
        }

        // 6. Generate reviews (only for completed bookings)
        $completedBookings = Booking::where('status', 'completed')->get();
        $reviewComments = [
            'Villa ini luar biasa! Pemandangannya sangat indah dan staff-nya ramah.',
            'Sangat puas dengan menginap di sini. Kebersihan terjaga dan fasilitas lengkap.',
            'Tempat yang sempurna untuk liburan keluarga. Anak-anak sangat senang!',
            'Kolam renangnya bagus, view-nya menakjubkan. Pasti akan kembali lagi.',
            'Villa yang sangat nyaman dan tenang. Cocok untuk honeymoon.',
            'Lokasi strategis, dekat dengan pantai dan restoran. Recommended!',
            'Pelayanan sangat baik, semua permintaan dipenuhi dengan cepat.',
            'Villa mewah dengan harga terjangkau. Worth every penny!',
            'Pengalaman menginap yang tak terlupakan. Terima kasih PusatVillaBali!',
            'Tempatnya instagramable banget! Foto-foto jadi bagus semua.',
            'Kamar tidur luas dan nyaman. Tidur nyenyak setiap malam.',
            'Dapur lengkap, bisa masak sendiri. Sangat homey.',
            'Sunset view dari villa ini tiada tara. Highly recommended!',
            'Staff sangat helpful dan responsif. Check-in dan check-out lancar.',
            'Villa bersih, terawat, dan sesuai dengan foto. Tidak mengecewakan.',
        ];

        foreach ($completedBookings as $booking) {
            if ($this->faker->boolean(80)) { // 80% chance to have a review
                Review::firstOrCreate(
                    ['booking_id' => $booking->id],
                    [
                        'villa_id' => $booking->villa_id,
                        'guest_name' => $booking->guest_name,
                        'rating' => $this->faker->randomElement([3, 4, 4, 5, 5, 5]),
                        'comment' => $this->faker->randomElement($reviewComments),
                        'is_approved' => $this->faker->boolean(90),
                        'approved_at' => $this->faker->boolean(90) ? now() : null,
                        'approved_by' => $this->faker->boolean(90) ? $admin->id : null,
                    ]
                );
            }
        }

        // 7. Blocked dates for next 90 days
        foreach ($allVillas->random(15) as $villa) {
            $blockedCount = $this->faker->numberBetween(3, 12);
            for ($i = 0; $i < $blockedCount; $i++) {
                $date = Carbon::now()->addDays($this->faker->numberBetween(1, 90));
                BlockedDate::firstOrCreate(
                    ['villa_id' => $villa->id, 'date' => $date->toDateString()],
                    [
                        'reason' => $this->faker->randomElement([
                            'Sudah dibooking via Airbnb',
                            'Maintenance kolam renang',
                            'Renovasi kamar',
                            'Private event',
                            'Owner stay',
                            null,
                        ]),
                        'created_by' => $admin->id,
                        'source' => $this->faker->randomElement(['manual', 'external']),
                    ]
                );
            }
        }

        // 8. Payment methods
        $paymentMethods = [
            ['name' => 'QRIS', 'code' => 'qris', 'account_number' => '', 'account_name' => 'PT PUSAT VILLA INDONESIA', 'logo_url' => null, 'is_active' => true],
            ['name' => 'Bank Central Asia (BCA)', 'code' => 'bca', 'account_number' => '8019208392', 'account_name' => 'PT PUSAT VILLA INDONESIA', 'logo_url' => null, 'is_active' => true],
            ['name' => 'Bank Mandiri', 'code' => 'mandiri', 'account_number' => '1230009876543', 'account_name' => 'PT PUSAT VILLA INDONESIA', 'logo_url' => null, 'is_active' => true],
            ['name' => 'Bank Negara Indonesia (BNI)', 'code' => 'bni', 'account_number' => '0987654321', 'account_name' => 'PT PUSAT VILLA INDONESIA', 'logo_url' => null, 'is_active' => true],
            ['name' => 'Bank Rakyat Indonesia (BRI)', 'code' => 'bri', 'account_number' => '5678912345', 'account_name' => 'PT PUSAT VILLA INDONESIA', 'logo_url' => null, 'is_active' => false],
        ];

        foreach ($paymentMethods as $pm) {
            PaymentMethod::firstOrCreate(['code' => $pm['code']], $pm);
        }
    }

    private function randomPhotos(int $count): array
    {
        $pool = [
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1520454974749-a795c5e0b8f0?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1559628233-100c798642e7?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1590004953392-5aba2e72269a?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80',
        ];

        $categories = ['Ruang Tamu', 'Kamar Tidur', 'Kolam Renang', 'Luar Ruangan', 'Dapur', 'Kamar Mandi', 'Taman', 'View'];
        $selected = $this->faker->randomElements($pool, $count);

        return array_map(fn ($url, $idx) => [
            'url' => $url,
            'description' => $categories[$idx % count($categories)],
            'category' => $categories[$idx % count($categories)],
        ], $selected, array_keys($selected));
    }
}
