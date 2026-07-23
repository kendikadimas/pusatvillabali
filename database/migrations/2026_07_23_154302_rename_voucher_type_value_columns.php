<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            // SQLite cannot rename enum columns directly.
            // Recreate the column with the new name and correct enum values.
            Schema::table('vouchers', function (Blueprint $table) {
                $table->string('discount_type')->default('fixed')->after('description');
                $table->decimal('discount_value', 12, 2)->after('discount_type');
            });
            DB::statement("UPDATE vouchers SET discount_type = CASE WHEN type = 'percent' THEN 'percentage' ELSE type END, discount_value = value");
            Schema::table('vouchers', function (Blueprint $table) {
                $table->dropColumn(['type', 'value']);
            });

            return;
        }

        // MySQL: rename columns
        Schema::table('vouchers', function (Blueprint $table) {
            $table->renameColumn('type', 'discount_type');
            $table->renameColumn('value', 'discount_value');
        });

        // Update enum values: 'percent' → 'percentage'
        DB::statement("ALTER TABLE vouchers MODIFY COLUMN discount_type ENUM('percentage', 'fixed') NOT NULL DEFAULT 'fixed'");
        DB::statement("UPDATE vouchers SET discount_type = 'percentage' WHERE discount_type = 'percent'");
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            Schema::table('vouchers', function (Blueprint $table) {
                $table->string('type')->default('fixed')->after('description');
                $table->decimal('value', 12, 2)->after('type');
            });
            DB::statement("UPDATE vouchers SET type = CASE WHEN discount_type = 'percentage' THEN 'percent' ELSE discount_type END, value = discount_value");
            Schema::table('vouchers', function (Blueprint $table) {
                $table->dropColumn(['discount_type', 'discount_value']);
            });

            return;
        }

        DB::statement("UPDATE vouchers SET discount_type = 'percent' WHERE discount_type = 'percentage'");
        DB::statement("ALTER TABLE vouchers MODIFY COLUMN discount_type ENUM('percent', 'fixed') NOT NULL DEFAULT 'fixed'");

        Schema::table('vouchers', function (Blueprint $table) {
            $table->renameColumn('discount_type', 'type');
            $table->renameColumn('discount_value', 'value');
        });
    }
};
