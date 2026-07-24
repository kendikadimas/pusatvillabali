<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('bookings')) {
            return;
        }

        Schema::table('bookings', function (Blueprint $table) {
            if (! Schema::hasColumn('bookings', 'voucher_id')) {
                $table->foreignId('voucher_id')->nullable()->after('payment_method_id')->constrained('vouchers')->nullOnDelete();
            }

            if (! Schema::hasColumn('bookings', 'voucher_code')) {
                $table->string('voucher_code')->nullable()->after('voucher_id');
            }

            if (! Schema::hasColumn('bookings', 'discount_amount')) {
                $table->decimal('discount_amount', 12, 2)->default(0)->after('voucher_code');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('bookings')) {
            return;
        }

        Schema::table('bookings', function (Blueprint $table) {
            // Only drop voucher_code if we added it alone on a partially migrated DB.
            if (Schema::hasColumn('bookings', 'voucher_code')) {
                $table->dropColumn('voucher_code');
            }
        });
    }
};
