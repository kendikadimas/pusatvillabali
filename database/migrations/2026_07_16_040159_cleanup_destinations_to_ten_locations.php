<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private array $keep = [
        'Seminyak', 'Canggu', 'Legian', 'Kuta', 'Jimbaran',
        'Nusa Dua', 'Uluwatu', 'Ubud', 'Kintamani', 'Sanur',
    ];

    public function up(): void
    {
        // 1. Tambah Kintamani jika belum ada
        $exists = DB::table('destinations')->where('query', 'Kintamani')->exists();
        if (! $exists) {
            DB::table('destinations')->insert([
                'name' => 'Kintamani',
                'city' => 'Kintamani, Bangli',
                'query' => 'Kintamani',
                'image' => 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=600&q=80',
                'count_fallback' => '5+ Villa',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // 2. Cari ID destinasi yang tidak termasuk dalam 10 lokasi resmi
        $toDelete = DB::table('destinations')
            ->whereNotIn('query', $this->keep)
            ->pluck('id');

        if ($toDelete->isEmpty()) {
            return;
        }

        // 3. Lepas relasi villa ke destinasi yang akan dihapus
        DB::table('villas')
            ->whereIn('destination_id', $toDelete)
            ->update(['destination_id' => null]);

        // 4. Hapus destinasi yang tidak diinginkan
        DB::table('destinations')
            ->whereIn('id', $toDelete)
            ->delete();
    }

    public function down(): void
    {
        // Tidak bisa dikembalikan karena data yang dihapus tidak disimpan
        // Down sengaja dikosongkan
    }
};
