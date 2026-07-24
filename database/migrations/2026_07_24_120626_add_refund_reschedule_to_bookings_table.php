<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // ponytail: MODIFY COLUMN only on MySQL; SQLite tests rebuild from scratch so skip there
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE bookings MODIFY COLUMN status ENUM('pending','confirmed','cancelled','completed','refunded','rescheduled') NOT NULL DEFAULT 'pending'");
        }

        Schema::table('bookings', function (Blueprint $table) {
            $table->boolean('is_refundable')->default(false)->after('notes');
            $table->date('reschedule_check_in')->nullable()->after('is_refundable');
            $table->date('reschedule_check_out')->nullable()->after('reschedule_check_in');
        });
    }

    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['is_refundable', 'reschedule_check_in', 'reschedule_check_out']);
        });

        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE bookings MODIFY COLUMN status ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending'");
        }
    }
};
