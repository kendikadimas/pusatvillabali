<?php

namespace Database\Seeders;

use App\Models\Destination;
use App\Models\Villa;
use Illuminate\Database\Seeder;

class BaliLocationSeeder extends Seeder
{
    public function run(): void
    {
        $destinations = [
            ['id' => 101, 'name' => 'Seminyak',    'city' => 'Seminyak, Badung',      'query' => 'Seminyak',    'image' => 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '15+ Villa'],
            ['id' => 102, 'name' => 'Canggu',      'city' => 'Canggu, Badung',        'query' => 'Canggu',      'image' => 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '21+ Villa'],
            ['id' => 103, 'name' => 'Ubud',        'city' => 'Ubud, Gianyar',         'query' => 'Ubud',        'image' => 'https://images.unsplash.com/photo-1549638441-b787d2e11f14?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '14+ Villa'],
            ['id' => 104, 'name' => 'Uluwatu',     'city' => 'Uluwatu, Badung',       'query' => 'Uluwatu',     'image' => 'https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '11+ Villa'],
            ['id' => 105, 'name' => 'Jimbaran',    'city' => 'Jimbaran, Badung',      'query' => 'Jimbaran',    'image' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '9+ Villa'],
            ['id' => 106, 'name' => 'Nusa Dua',    'city' => 'Nusa Dua, Badung',      'query' => 'Nusa Dua',    'image' => 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '8+ Villa'],
            ['id' => 107, 'name' => 'Kuta',        'city' => 'Kuta, Badung',          'query' => 'Kuta',        'image' => 'https://images.unsplash.com/photo-1520454974749-a795c5e0b8f0?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '12+ Villa'],
            ['id' => 108, 'name' => 'Legian',      'city' => 'Legian, Badung',        'query' => 'Legian',      'image' => 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '7+ Villa'],
            ['id' => 109, 'name' => 'Sanur',       'city' => 'Sanur, Denpasar',       'query' => 'Sanur',       'image' => 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '10+ Villa'],
            ['id' => 110, 'name' => 'Nusa Lembongan', 'city' => 'Nusa Lembongan, Klungkung', 'query' => 'Nusa Lembongan', 'image' => 'https://images.unsplash.com/photo-1559628233-100c798642e7?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '6+ Villa'],
            ['id' => 111, 'name' => 'Amed',        'city' => 'Amed, Karangasem',      'query' => 'Amed',        'image' => 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '5+ Villa'],
            ['id' => 112, 'name' => 'Candidasa',   'city' => 'Candidasa, Karangasem', 'query' => 'Candidasa',   'image' => 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '4+ Villa'],
            ['id' => 113, 'name' => 'Lovina',      'city' => 'Lovina, Buleleng',      'query' => 'Lovina',      'image' => 'https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '5+ Villa'],
            ['id' => 114, 'name' => 'Singaraja',   'city' => 'Singaraja, Buleleng',   'query' => 'Singaraja',   'image' => 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '3+ Villa'],
            ['id' => 115, 'name' => 'Tabanan',     'city' => 'Tabanan, Tabanan',      'query' => 'Tabanan',     'image' => 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '6+ Villa'],
            ['id' => 116, 'name' => 'Bedugul',     'city' => 'Bedugul, Tabanan',      'query' => 'Bedugul',     'image' => 'https://images.unsplash.com/photo-1589666564459-93cdd3ab856a?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '4+ Villa'],
            ['id' => 117, 'name' => 'Munduk',      'city' => 'Munduk, Buleleng',      'query' => 'Munduk',      'image' => 'https://images.unsplash.com/photo-1590004953392-5aba2e72269a?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '3+ Villa'],
            ['id' => 118, 'name' => 'Gianyar',     'city' => 'Gianyar, Gianyar',      'query' => 'Gianyar',     'image' => 'https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '5+ Villa'],
            ['id' => 119, 'name' => 'Klungkung',   'city' => 'Klungkung, Klungkung',  'query' => 'Klungkung',   'image' => 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '3+ Villa'],
            ['id' => 120, 'name' => 'Bangli',      'city' => 'Bangli, Bangli',        'query' => 'Bangli',      'image' => 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80', 'count_fallback' => '2+ Villa'],
        ];

        foreach ($destinations as $dest) {
            Destination::firstOrCreate(['query' => $dest['query']], $dest);
        }

        // ── SEMINYAK ──
        $seminyak = Destination::where('query', 'Seminyak')->first();
        if ($seminyak) {
            Villa::firstOrCreate(['slug' => 'seminyak-sunset-beach-villa'], [
                'name' => 'Seminyak Sunset Beach Villa',
                'slug' => 'seminyak-sunset-beach-villa',
                'description' => 'Villa mewah di kawasan Seminyak, hanya 5 menit berjalan kaki ke Pantai Double Six. Desain tropis kontemporer dengan kolam renang panjang, sun deck, dan area lounge terbuka untuk menikmati sunset Bali yang legendaris.',
                'short_desc' => 'Villa tropis mewah 5 menit dari Pantai Double Six Seminyak.',
                'location' => 'Seminyak, Kuta, Badung, Bali',
                'maps_url' => 'https://maps.google.com/?q=Seminyak+Bali',
                'bedrooms' => 3, 'bathrooms' => 3, 'max_guests' => 6,
                'price_per_night' => 5200000, 'weekend_price' => 5800000, 'min_nights' => 2,
                'amenities' => ['Kolam Renang', 'WiFi', 'AC', 'Dapur', 'Sun Deck', 'Bicycle', 'Room Service', 'Parkir'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 15:00 WITA\nCheck-out: 11:00 WITA\nDilarang membawa hewan peliharaan",
                'check_in_time' => '15:00:00', 'check_out_time' => '11:00:00', 'is_active' => true,
                'destination_id' => $seminyak->id,
            ]);
            Villa::firstOrCreate(['slug' => 'villa-seminyak-garden-paradise'], [
                'name' => 'Villa Seminyak Garden Paradise',
                'slug' => 'villa-seminyak-garden-paradise',
                'description' => 'Villa di Seminyak tengah dengan taman tropis yang indah. Kolam renang dikelilingi oleh tanaman hijau, area lounging yang nyaman, dan kamar tidur yang elegan. Lokasi strategis dekat dengan restoran dan klub pantai terkenal.',
                'short_desc' => 'Villa mewah di pusat Seminyak dengan taman tropis dan lokasi strategis.',
                'location' => 'Seminyak, Kuta, Badung, Bali',
                'maps_url' => 'https://maps.google.com/?q=Seminyak+Bali',
                'bedrooms' => 2, 'bathrooms' => 2, 'max_guests' => 4,
                'price_per_night' => 2800000, 'weekend_price' => 3200000, 'min_nights' => 2,
                'amenities' => ['Kolam Renang', 'Taman', 'WiFi', 'AC', 'Dapur', 'BBQ', 'Smart TV', 'Parkir'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00 WITA\nCheck-out: 12:00 WITA\nHanya untuk tamu terdaftar",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $seminyak->id,
            ]);
        }

        // ── CANGGU ──
        $canggu = Destination::where('query', 'Canggu')->first();
        if ($canggu) {
            Villa::firstOrCreate(['slug' => 'canggu-boho-beach-villa'], [
                'name' => 'Canggu Boho Beach Villa',
                'slug' => 'canggu-boho-beach-villa',
                'description' => 'Villa bergaya bohemian modern di Canggu, dikelilingi oleh sawah dan hanya 10 menit dari Pantai Berawa. Dilengkapi kolam renang, outdoor shower, dan rooftop terrace untuk bersantai sore.',
                'short_desc' => 'Bohemian villa dekat Pantai Berawa Canggu dengan rooftop terrace.',
                'location' => 'Canggu, Kuta Utara, Badung, Bali',
                'maps_url' => 'https://maps.google.com/?q=Canggu+Bali',
                'bedrooms' => 2, 'bathrooms' => 2, 'max_guests' => 4,
                'price_per_night' => 3900000, 'weekend_price' => 4200000, 'min_nights' => 2,
                'amenities' => ['Kolam Renang', 'Rooftop', 'Outdoor Shower', 'WiFi', 'AC', 'Dapur', 'Bicycle', 'Parkir'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00 WITA\nCheck-out: 12:00 WITA\nUntuk keluarga/dewasa",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $canggu->id,
            ]);
            Villa::firstOrCreate(['slug' => 'canggu-echo-beach-surf-villa'], [
                'name' => 'Canggu Echo Beach Surf Villa',
                'slug' => 'canggu-echo-beach-surf-villa',
                'description' => 'Villa surf-themed yang stylish di kawasan Echo Beach Canggu. Hanya 3 menit dari spot surfing terbaik. Dilengkapi kolam renang, rooftop sunset bar, ruang kerja bersama, dan area penyimpanan papan selancar.',
                'short_desc' => 'Surf villa 3 menit dari Echo Beach Canggu dengan rooftop bar.',
                'location' => 'Echo Beach, Canggu, Badung, Bali',
                'maps_url' => 'https://maps.google.com/?q=Echo+Beach+Canggu',
                'bedrooms' => 1, 'bathrooms' => 1, 'max_guests' => 2,
                'price_per_night' => 2100000, 'weekend_price' => 2500000, 'min_nights' => 1,
                'amenities' => ['Kolam Renang', 'Rooftop Bar', 'WiFi', 'AC', 'Dapur', 'Surfboard Storage', 'Coworking Space'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00\nCheck-out: 12:00\nCocok untuk digital nomad & surfer",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $canggu->id,
            ]);
        }

        // ── UBUD ──
        $ubud = Destination::where('query', 'Ubud')->first();
        if ($ubud) {
            Villa::firstOrCreate(['slug' => 'ubud-rice-terrace-villa'], [
                'name' => 'Ubud Rice Terrace Villa',
                'slug' => 'ubud-rice-terrace-villa',
                'description' => 'Villa romantis yang menghadap langsung ke sawah terasering Ubud. Desain open-plan dengan kamar tidur menghadap ke pemandangan hijau, kolam renang pribadi berbentuk free-form, dan gazebo santai.',
                'short_desc' => 'Villa romantis menghadap sawah terasering Ubud dengan kolam renang free-form.',
                'location' => 'Tegalalang, Ubud, Gianyar, Bali',
                'maps_url' => 'https://maps.google.com/?q=Tegalalang+Ubud',
                'bedrooms' => 2, 'bathrooms' => 2, 'max_guests' => 4,
                'price_per_night' => 3500000, 'weekend_price' => 3500000, 'min_nights' => 2,
                'amenities' => ['Kolam Renang', 'WiFi', 'AC', 'Gazebo', 'Sarapan', 'Sepeda Gratis', 'Yoga Deck'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00 WITA\nCheck-out: 12:00 WITA\nJaga ketenangan lingkungan sawah",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $ubud->id,
            ]);
            Villa::firstOrCreate(['slug' => 'ubud-jungle-treehouse-villa'], [
                'name' => 'Ubud Jungle Treehouse Villa',
                'slug' => 'ubud-jungle-treehouse-villa',
                'description' => 'Treehouse villa unik di tengah hutan Ubud dengan pemandangan lembah sungai Ayung. Kamar tidur utama memiliki kaca besar dari lantai ke langit-langit untuk pengalaman menginap di tengah kanopi hutan.',
                'short_desc' => 'Treehouse villa unik dengan kolam renang di tengah hutan Ubud.',
                'location' => 'Bangkit, Ubud, Gianyar, Bali',
                'maps_url' => 'https://maps.google.com/?q=Ubud+Bali',
                'bedrooms' => 1, 'bathrooms' => 1, 'max_guests' => 2,
                'price_per_night' => 2800000, 'weekend_price' => 3200000, 'min_nights' => 2,
                'amenities' => ['Kolam Renang', 'WiFi', 'AC', 'Floating Breakfast', 'Spa Service', 'Yoga', 'Mini Bar'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1549638441-b787d2e11f14?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00 WITA\nCheck-out: 12:00 WITA\nCocok untuk pasangan\nTidak untuk pesta",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $ubud->id,
            ]);
            Villa::firstOrCreate(['slug' => 'ubud-wellness-retreat-villa'], [
                'name' => 'Ubud Wellness Retreat Villa',
                'slug' => 'ubud-wellness-retreat-villa',
                'description' => 'Villa wellness eksklusif di tengah hutan bambu Ubud. Dilengkapi studio yoga pribadi, kolam renang alami, spa room, dan menu vegetarian dari kebun organik sendiri. Retreat healing lengkap untuk tubuh dan jiwa.',
                'short_desc' => 'Wellness villa dengan yoga studio, spa, dan kolam renang alami di Ubud.',
                'location' => 'Tegalalang, Ubud, Gianyar, Bali',
                'maps_url' => 'https://maps.google.com/?q=Tegalalang+Ubud',
                'bedrooms' => 1, 'bathrooms' => 1, 'max_guests' => 2,
                'price_per_night' => 4200000, 'weekend_price' => 4200000, 'min_nights' => 3,
                'amenities' => ['Kolam Renang Alami', 'Yoga Studio', 'Spa Room', 'Kebun Organik', 'WiFi', 'AC', 'Vegan Breakfast'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00\nCheck-out: 12:00\nArea hening — jaga ketenangan\nCocok untuk retreat",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $ubud->id,
            ]);
        }

        // ── ULUWATU ──
        $uluwatu = Destination::where('query', 'Uluwatu')->first();
        if ($uluwatu) {
            Villa::firstOrCreate(['slug' => 'uluwatu-cliff-ocean-villa'], [
                'name' => 'Uluwatu Cliff Ocean Villa',
                'slug' => 'uluwatu-cliff-ocean-villa',
                'description' => 'Villa dramatis di atas tebing karst Uluwatu dengan pemandangan Samudra Hindia 270 derajat. Infinity pool tepi tebing, akses ke pantai tersembunyi, dan arsitektur tropis kontemporer yang memukau.',
                'short_desc' => 'Villa tebing Uluwatu dengan infinity pool dan pemandangan laut 270 derajat.',
                'location' => 'Uluwatu, Kuta Selatan, Badung, Bali',
                'maps_url' => 'https://maps.google.com/?q=Uluwatu+Bali',
                'bedrooms' => 2, 'bathrooms' => 2, 'max_guests' => 4,
                'price_per_night' => 6800000, 'weekend_price' => 7500000, 'min_nights' => 2,
                'amenities' => ['Infinity Pool', 'WiFi', 'AC', 'Pantai Tersembunyi', 'Butler', 'Spa', 'Sun Deck'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1573790387438-4da905039392?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 15:00 WITA\nCheck-out: 11:00 WITA\nTidak untuk anak di bawah 12 tahun",
                'check_in_time' => '15:00:00', 'check_out_time' => '11:00:00', 'is_active' => true,
                'destination_id' => $uluwatu->id,
            ]);
        }

        // ── JIMBARAN ──
        $jimbaran = Destination::where('query', 'Jimbaran')->first();
        if ($jimbaran) {
            Villa::firstOrCreate(['slug' => 'jimbaran-luxury-cliff-villa'], [
                'name' => 'Jimbaran Luxury Cliff Villa',
                'slug' => 'jimbaran-luxury-cliff-villa',
                'description' => 'Villa super mewah di atas tebing Jimbaran dengan pemandangan Samudra Hindia. Infinity pool tepi tebing, akses pantai pribadi, dan layanan butler 24 jam memberikan pengalaman liburan yang tak terlupakan.',
                'short_desc' => 'Villa super mewah di atas tebing Jimbaran dengan infinity pool dan akses pantai pribadi.',
                'location' => 'Jimbaran, Kuta Selatan, Badung, Bali',
                'maps_url' => 'https://maps.google.com/?q=Jimbaran+Bali',
                'bedrooms' => 4, 'bathrooms' => 4, 'max_guests' => 8,
                'price_per_night' => 8500000, 'weekend_price' => 9500000, 'min_nights' => 3,
                'amenities' => ['Infinity Pool', 'WiFi', 'AC', 'Butler 24 Jam', 'Pantai Pribadi', 'Spa', 'Home Theater', 'Wine Cellar'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 15:00 WITA\nCheck-out: 11:00 WITA\nFormal dress code untuk dinner",
                'check_in_time' => '15:00:00', 'check_out_time' => '11:00:00', 'is_active' => true,
                'destination_id' => $jimbaran->id,
            ]);
        }

        // ── NUSA DUA ──
        $nusadua = Destination::where('query', 'Nusa Dua')->first();
        if ($nusadua) {
            Villa::firstOrCreate(['slug' => 'nusa-dua-private-resort-villa'], [
                'name' => 'Nusa Dua Private Resort Villa',
                'slug' => 'nusa-dua-private-resort-villa',
                'description' => 'Villa resort mewah di kawasan Nusa Dua dengan akses ke pantai pasir putih. Dilengkapi kolam renang pribadi, taman tropis yang rimbun, dan akses golf course. Keamanan 24 jam dan layanan concierge siap memanjakan tamu.',
                'short_desc' => 'Resort villa di Nusa Dua dengan kolam renang pribadi dan akses pantai pasir putih.',
                'location' => 'Nusa Dua, Kuta Selatan, Badung, Bali',
                'maps_url' => 'https://maps.google.com/?q=Nusa+Dua+Bali',
                'bedrooms' => 3, 'bathrooms' => 3, 'max_guests' => 6,
                'price_per_night' => 4800000, 'weekend_price' => 5500000, 'min_nights' => 2,
                'amenities' => ['Kolam Renang', 'Akses Pantai', 'Golf Course', 'WiFi', 'AC', 'Concierge', 'Security 24 Jam', 'Parkir'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 15:00 WITA\nCheck-out: 11:00 WITA\nArea resor — jaga ketenangan",
                'check_in_time' => '15:00:00', 'check_out_time' => '11:00:00', 'is_active' => true,
                'destination_id' => $nusadua->id,
            ]);
        }

        // ── KUTA ──
        $kuta = Destination::where('query', 'Kuta')->first();
        if ($kuta) {
            Villa::firstOrCreate(['slug' => 'kuta-beach-side-villa'], [
                'name' => 'Kuta Beach Side Villa',
                'slug' => 'kuta-beach-side-villa',
                'description' => 'Villa nyaman di pusat Kuta, hanya 3 menit berjalan kaki ke Pantai Kuta. Lokasi strategis dikelilingi restoran, klub malam, dan pusat perbelanjaan. Kolam renang dan rooftop lounge untuk bersantai.',
                'short_desc' => 'Villa 3 menit dari Pantai Kuta dengan rooftop lounge dan kolam renang.',
                'location' => 'Kuta, Badung, Bali',
                'maps_url' => 'https://maps.google.com/?q=Kuta+Bali',
                'bedrooms' => 2, 'bathrooms' => 1, 'max_guests' => 5,
                'price_per_night' => 1500000, 'weekend_price' => 1800000, 'min_nights' => 1,
                'amenities' => ['Kolam Renang', 'Rooftop', 'WiFi', 'AC', 'Dapur', 'Parkir', 'Smart TV'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1520454974749-a795c5e0b8f0?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00 WITA\nCheck-out: 12:00 WITA\nArea ramai — harap maklum",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $kuta->id,
            ]);
        }

        // ── LEGIAN ──
        $legian = Destination::where('query', 'Legian')->first();
        if ($legian) {
            Villa::firstOrCreate(['slug' => 'legian-chic-boutique-villa'], [
                'name' => 'Legian Chic Boutique Villa',
                'slug' => 'legian-chic-boutique-villa',
                'description' => 'Boutique villa bergaya di Legian dengan desain interior artistik. Kolam renang halaman belakang, rooftop garden, dan lokasi tenang namun dekat dengan keramaian Kuta dan Seminyak. Cocok untuk pasangan atau keluarga kecil.',
                'short_desc' => 'Boutique villa artistik di Legian dengan rooftop garden dan kolam renang.',
                'location' => 'Legian, Kuta, Badung, Bali',
                'maps_url' => 'https://maps.google.com/?q=Legian+Bali',
                'bedrooms' => 2, 'bathrooms' => 1, 'max_guests' => 4,
                'price_per_night' => 1700000, 'weekend_price' => 2100000, 'min_nights' => 1,
                'amenities' => ['Kolam Renang', 'Rooftop Garden', 'WiFi', 'AC', 'Dapur', 'Smart TV', 'Parkir'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00\nCheck-out: 12:00\nHormati tetangga sekitar",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $legian->id,
            ]);
        }

        // ── SANUR ──
        $sanur = Destination::where('query', 'Sanur')->first();
        if ($sanur) {
            Villa::firstOrCreate(['slug' => 'sanur-beachfront-villa'], [
                'name' => 'Sanur Beachfront Villa',
                'slug' => 'sanur-beachfront-villa',
                'description' => 'Villa tepi pantai di Sanur dengan akses langsung ke jalur jogging track pinggir laut. Desain Bali modern dengan taman tropis, kolam renang, dan area bale santai menikmati sunrise.',
                'short_desc' => 'Villa tepi pantai Sanur dengan kolam renang dan akses jogging track.',
                'location' => 'Sanur, Denpasar, Bali',
                'maps_url' => 'https://maps.google.com/?q=Sanur+Bali',
                'bedrooms' => 3, 'bathrooms' => 2, 'max_guests' => 6,
                'price_per_night' => 3200000, 'weekend_price' => 3600000, 'min_nights' => 2,
                'amenities' => ['Kolam Renang', 'Akses Pantai', 'WiFi', 'AC', 'Bale Santai', 'Sepeda', 'Parkir'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00 WITA\nCheck-out: 12:00 WITA\nArea keluarga — jaga ketenangan",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $sanur->id,
            ]);
        }

        // ── NUSA LEMBONGAN ──
        $lembongan = Destination::where('query', 'Nusa Lembongan')->first();
        if ($lembongan) {
            Villa::firstOrCreate(['slug' => 'lembongan-island-beach-villa'], [
                'name' => 'Lembongan Island Beach Villa',
                'slug' => 'lembongan-island-beach-villa',
                'description' => 'Villa tropis di Nusa Lembongan dengan akses langsung ke pantai pasir putih dan laut biru jernih. Kolam renang, sun loungers, dan area snorkeling di depan villa. Suasana pulau yang tenang dan damai.',
                'short_desc' => 'Villa tepi pantai di Nusa Lembongan dengan akses snorkeling langsung.',
                'location' => 'Jungutbatu, Nusa Lembongan, Klungkung, Bali',
                'maps_url' => 'https://maps.google.com/?q=Nusa+Lembongan',
                'bedrooms' => 2, 'bathrooms' => 1, 'max_guests' => 4,
                'price_per_night' => 1900000, 'weekend_price' => 2300000, 'min_nights' => 2,
                'amenities' => ['Kolam Renang', 'Akses Pantai', 'Snorkeling', 'WiFi', 'AC', 'Sewa Sepeda', 'Sun Loungers'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1559628233-100c798642e7?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00 WITA\nCheck-out: 11:00 WITA\nPulau kecil — bawa uang tunai",
                'check_in_time' => '14:00:00', 'check_out_time' => '11:00:00', 'is_active' => true,
                'destination_id' => $lembongan->id,
            ]);
        }

        // ── AMED ──
        $amed = Destination::where('query', 'Amed')->first();
        if ($amed) {
            Villa::firstOrCreate(['slug' => 'amed-bay-seaview-villa'], [
                'name' => 'Amed Bay Seaview Villa',
                'slug' => 'amed-bay-seaview-villa',
                'description' => 'Villa di tepi Teluk Amed dengan pemandangan laut dan Gunung Agung di kejauhan. Kolam renang infinity, akses snorkeling dari depan villa, dan restoran seafood lokal. Surga tersembunyi di Bali timur.',
                'short_desc' => 'Villa teluk Amed dengan infinity pool dan pemandangan Gunung Agung.',
                'location' => 'Amed, Abang, Karangasem, Bali',
                'maps_url' => 'https://maps.google.com/?q=Amed+Bali',
                'bedrooms' => 1, 'bathrooms' => 1, 'max_guests' => 2,
                'price_per_night' => 1200000, 'weekend_price' => 1500000, 'min_nights' => 1,
                'amenities' => ['Infinity Pool', 'Snorkeling', 'WiFi', 'AC', 'Restoran', 'Sun Deck'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00\nCheck-out: 12:00\nArea tenang — cocok untuk relaksasi",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $amed->id,
            ]);
        }

        // ── CANDIDASA ──
        $candidasa = Destination::where('query', 'Candidasa')->first();
        if ($candidasa) {
            Villa::firstOrCreate(['slug' => 'candidasa-laguna-villa'], [
                'name' => 'Candidasa Laguna Villa',
                'slug' => 'candidasa-laguna-villa',
                'description' => 'Villa tenang di Candidasa dengan laguna pribadi dan taman tropis yang rimbun. Cocok untuk pasangan yang mencari ketenangan di Bali timur. Kolam renang dan akses mudah ke Candi Tebing dan Taman Ujung.',
                'short_desc' => 'Villa dengan laguna pribadi di Candidasa, Bali timur yang tenang.',
                'location' => 'Candidasa, Karangasem, Bali',
                'maps_url' => 'https://maps.google.com/?q=Candidasa+Bali',
                'bedrooms' => 1, 'bathrooms' => 1, 'max_guests' => 2,
                'price_per_night' => 980000, 'weekend_price' => 1200000, 'min_nights' => 1,
                'amenities' => ['Kolam Renang', 'Laguna', 'WiFi', 'AC', 'Taman', 'Parkir'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00 WITA\nCheck-out: 12:00 WITA\nArea hening — jaga ketenangan",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $candidasa->id,
            ]);
        }

        // ── LOVINA ──
        $lovina = Destination::where('query', 'Lovina')->first();
        if ($lovina) {
            Villa::firstOrCreate(['slug' => 'lovina-sunset-beach-villa'], [
                'name' => 'Lovina Sunset Beach Villa',
                'slug' => 'lovina-sunset-beach-villa',
                'description' => 'Villa di tepi Pantai Lovina dengan pemandangan sunset yang indah. Kolam renang air tawar, area berjemur, dan akses mudah untuk melihat lumba-lumba di pagi hari. Suasana Bali utara yang masih asri dan tenang.',
                'short_desc' => 'Villa tepi pantai Lovina dengan view sunset dan wisata lumba-lumba.',
                'location' => 'Lovina, Buleleng, Bali',
                'maps_url' => 'https://maps.google.com/?q=Lovina+Bali',
                'bedrooms' => 2, 'bathrooms' => 1, 'max_guests' => 4,
                'price_per_night' => 1100000, 'weekend_price' => 1400000, 'min_nights' => 1,
                'amenities' => ['Kolam Renang', 'Akses Pantai', 'WiFi', 'AC', 'Dapur', 'Parkir', 'Dolphin Tour'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1562602833-0f4ab2fc46e3?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00 WITA\nCheck-out: 12:00 WITA\nBangun pagi untuk lumba-lumba!",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $lovina->id,
            ]);
        }

        // ── SINGARAJA ──
        $singaraja = Destination::where('query', 'Singaraja')->first();
        if ($singaraja) {
            Villa::firstOrCreate(['slug' => 'singaraja-heritage-villa'], [
                'name' => 'Singaraja Heritage Villa',
                'slug' => 'singaraja-heritage-villa',
                'description' => 'Villa heritage di pusat Kota Singaraja dengan arsitektur kolonial Belanda yang masih terjaga. Halaman luas, kolam renang, dan taman tropis. Gerbang masuk ke kota budaya dan sejarah Bali Utara.',
                'short_desc' => 'Villa kolonial heritage di pusat Kota Singaraja dengan kolam renang.',
                'location' => 'Singaraja, Buleleng, Bali',
                'maps_url' => 'https://maps.google.com/?q=Singaraja+Bali',
                'bedrooms' => 2, 'bathrooms' => 1, 'max_guests' => 4,
                'price_per_night' => 850000, 'weekend_price' => 1050000, 'min_nights' => 1,
                'amenities' => ['Kolam Renang', 'WiFi', 'AC', 'Taman', 'Dapur', 'Parkir', 'Museum Lokal'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00\nCheck-out: 12:00\nBangunan heritage — jaga kebersihan",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $singaraja->id,
            ]);
        }

        // ── TABANAN ──
        $tabanan = Destination::where('query', 'Tabanan')->first();
        if ($tabanan) {
            Villa::firstOrCreate(['slug' => 'tabanan-rice-terrace-villa'], [
                'name' => 'Tabanan Rice Terrace Villa',
                'slug' => 'tabanan-rice-terrace-villa',
                'description' => 'Villa di tengah sawah terasering Tabanan yang asri. Arsitektur tradisional Bali dengan atap alang-alang, kolam renang alami, dan area sawah yang bisa dijelajahi. Pengalaman tinggal di pedesaan Bali yang autentik.',
                'short_desc' => 'Villa tradisional di tengah sawah terasering Tabanan yang autentik.',
                'location' => 'Tabanan, Bali',
                'maps_url' => 'https://maps.google.com/?q=Tabanan+Bali',
                'bedrooms' => 1, 'bathrooms' => 1, 'max_guests' => 2,
                'price_per_night' => 750000, 'weekend_price' => 950000, 'min_nights' => 1,
                'amenities' => ['Kolam Renang Alami', 'WiFi', 'Sawah', 'Sepeda', 'Sarapan Tradisional', 'Parkir'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00 WITA\nCheck-out: 12:00 WITA\nArea pedesaan — jaga ketenangan",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $tabanan->id,
            ]);
        }

        // ── BEDUGUL ──
        $bedugul = Destination::where('query', 'Bedugul')->first();
        if ($bedugul) {
            Villa::firstOrCreate(['slug' => 'bedugul-lake-villa'], [
                'name' => 'Bedugul Lake View Villa',
                'slug' => 'bedugul-lake-view-villa',
                'description' => 'Villa di kawasan Bedugul dengan pemandangan Danau Beratan dan Pura Ulun Danu. Udara pegunungan yang sejuk, perapian kayu, dan taman bunga yang indah. Tempat istirahat sempurna dari hiruk pikuk kota.',
                'short_desc' => 'Villa pegunungan dengan view Danau Beratan dan udara sejuk Bedugul.',
                'location' => 'Bedugul, Tabanan, Bali',
                'maps_url' => 'https://maps.google.com/?q=Bedugul+Bali',
                'bedrooms' => 2, 'bathrooms' => 1, 'max_guests' => 4,
                'price_per_night' => 950000, 'weekend_price' => 1200000, 'min_nights' => 1,
                'amenities' => ['Perapian', 'WiFi', 'AC', 'Taman Bunga', 'Dapur', 'Parkir', 'Sarapan'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00 WITA\nCheck-out: 12:00 WITA\nBawa jaket — udara dingin",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $bedugul->id,
            ]);
        }

        // ── MUNDUK ──
        $munduk = Destination::where('query', 'Munduk')->first();
        if ($munduk) {
            Villa::firstOrCreate(['slug' => 'munduk-mountain-villa'], [
                'name' => 'Munduk Mountain Retreat Villa',
                'slug' => 'munduk-mountain-villa',
                'description' => 'Villa di kawasan Munduk dengan pemandangan pegunungan dan air terjun. Udara sejuk khas Bali pegunungan, trail trekking di hutan tropis, dan kopi lokal dari perkebunan sekitar. Surga bagi pecinta alam.',
                'short_desc' => 'Villa pegunungan di Munduk dengan trekking hutan dan air terjun.',
                'location' => 'Munduk, Buleleng, Bali',
                'maps_url' => 'https://maps.google.com/?q=Munduk+Bali',
                'bedrooms' => 1, 'bathrooms' => 1, 'max_guests' => 2,
                'price_per_night' => 650000, 'weekend_price' => 850000, 'min_nights' => 1,
                'amenities' => ['WiFi', 'Air Terjun', 'Trekking', 'Kopi Lokal', 'Parkir', 'Sarapan'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1590004953392-5aba2e72269a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00\nCheck-out: 12:00\nJaga alam sekitar — bawa botol minum",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $munduk->id,
            ]);
        }

        // ── GIANYAR ──
        $gianyar = Destination::where('query', 'Gianyar')->first();
        if ($gianyar) {
            Villa::firstOrCreate(['slug' => 'gianyar-art-village-villa'], [
                'name' => 'Gianyar Art Village Villa',
                'slug' => 'gianyar-art-village-villa',
                'description' => 'Villa di pusat Kabupaten Gianyar yang dikenal sebagai kota seni. Dekat dengan pasar seni, kerajinan batik, dan ukiran kayu khas Gianyar. Kolam renang, taman, dan galeri seni pribadi di dalam villa.',
                'short_desc' => 'Villa seni di Gianyar dengan galeri pribadi dan kolam renang.',
                'location' => 'Gianyar, Bali',
                'maps_url' => 'https://maps.google.com/?q=Gianyar+Bali',
                'bedrooms' => 2, 'bathrooms' => 1, 'max_guests' => 4,
                'price_per_night' => 850000, 'weekend_price' => 1050000, 'min_nights' => 1,
                'amenities' => ['Kolam Renang', 'Galeri Seni', 'WiFi', 'AC', 'Dapur', 'Parkir', 'Workshop Batik'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00\nCheck-out: 12:00\nIkuti workshop batik yang tersedia",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $gianyar->id,
            ]);
        }

        // ── KLUNGKUNG ──
        $klungkung = Destination::where('query', 'Klungkung')->first();
        if ($klungkung) {
            Villa::firstOrCreate(['slug' => 'klungkung-heritage-villa'], [
                'name' => 'Klungkung Heritage Villa',
                'slug' => 'klungkung-heritage-villa',
                'description' => 'Villa heritage di pusat Kota Klungkung yang kaya sejarah. Arsitektur tradisional Bali dengan Kori Agung, kolam renang, dan taman yang asri. Lokasi strategis untuk menjelajahi Kertha Gosa dan Goa Lawah.',
                'short_desc' => 'Villa heritage di Klungkung dekat Kertha Gosa dan Goa Lawah.',
                'location' => 'Klungkung, Bali',
                'maps_url' => 'https://maps.google.com/?q=Klungkung+Bali',
                'bedrooms' => 1, 'bathrooms' => 1, 'max_guests' => 2,
                'price_per_night' => 600000, 'weekend_price' => 800000, 'min_nights' => 1,
                'amenities' => ['Kolam Renang', 'WiFi', 'AC', 'Taman', 'Parkir', 'Tour Guide'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00\nCheck-out: 12:00\nJaga kebersihan dan ketenangan",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $klungkung->id,
            ]);
        }

        // ── BANGLI ──
        $bangli = Destination::where('query', 'Bangli')->first();
        if ($bangli) {
            Villa::firstOrCreate(['slug' => 'bangli-mountain-villa'], [
                'name' => 'Bangli Mountain Escape Villa',
                'slug' => 'bangli-mountain-villa',
                'description' => 'Villa di daerah pegunungan Bangli dengan pemandangan Gunung Batur dan Danau Batur. Udara sejuk, trekking ke kawah gunung berapi, dan pemandian air panas alami. Petualangan alam yang autentik.',
                'short_desc' => 'Villa pegunungan Bangli dengan view Gunung Batur dan Danau Batur.',
                'location' => 'Bangli, Bali',
                'maps_url' => 'https://maps.google.com/?q=Bangli+Bali',
                'bedrooms' => 1, 'bathrooms' => 1, 'max_guests' => 2,
                'price_per_night' => 500000, 'weekend_price' => 700000, 'min_nights' => 1,
                'amenities' => ['WiFi', 'Trekking', 'Air Panas Alami', 'Sarapan', 'Parkir', 'Tour Guide'],
                'photos' => $this->makePhotos(['https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80']),
                'rules' => "Check-in: 14:00\nCheck-out: 12:00\nBawa sepatu trekking",
                'check_in_time' => '14:00:00', 'check_out_time' => '12:00:00', 'is_active' => true,
                'destination_id' => $bangli->id,
            ]);
        }
    }

    private function makePhotos(array $urls): array
    {
        $categories = ['Ruang tamu', 'Kamar tidur', 'Kolam renang', 'Luar ruangan', 'Dapur'];

        return array_map(fn ($url, $idx) => [
            'url' => $url,
            'description' => $categories[$idx % count($categories)],
            'category' => $categories[$idx % count($categories)],
        ], $urls, array_keys($urls));
    }
}
