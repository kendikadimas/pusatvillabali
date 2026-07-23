<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        DB::statement("ALTER TABLE bookings MODIFY COLUMN payment_status ENUM('unpaid', 'pending', 'paid', 'refunded', 'expired') NOT NULL DEFAULT 'unpaid'");
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            return;
        }

        DB::statement("ALTER TABLE bookings MODIFY COLUMN payment_status ENUM('unpaid', 'paid', 'refunded', 'expired') NOT NULL DEFAULT 'unpaid'");
    }
};
