<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('vouchers')) {
            return;
        }

        if (Schema::hasColumn('vouchers', 'discount_type') && Schema::hasColumn('vouchers', 'discount_value')) {
            return;
        }

        if (! Schema::hasColumn('vouchers', 'type') || ! Schema::hasColumn('vouchers', 'value')) {
            return;
        }

        if (DB::getDriverName() === 'sqlite') {
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

        // MySQL: expand enum → normalize values → shrink enum → rename via CHANGE COLUMN
        // (renameColumn mangles enum defaults on some MySQL/doctrine combos)
        DB::statement("ALTER TABLE vouchers MODIFY COLUMN type ENUM('percent', 'percentage', 'fixed') NOT NULL DEFAULT 'fixed'");
        DB::statement("UPDATE vouchers SET type = 'percentage' WHERE type = 'percent'");
        DB::statement("ALTER TABLE vouchers CHANGE COLUMN type discount_type ENUM('percentage', 'fixed') NOT NULL DEFAULT 'fixed'");
        DB::statement('ALTER TABLE vouchers CHANGE COLUMN value discount_value DECIMAL(12, 2) NOT NULL');
    }

    public function down(): void
    {
        if (! Schema::hasTable('vouchers')) {
            return;
        }

        if (Schema::hasColumn('vouchers', 'type') && Schema::hasColumn('vouchers', 'value')) {
            return;
        }

        if (! Schema::hasColumn('vouchers', 'discount_type') || ! Schema::hasColumn('vouchers', 'discount_value')) {
            return;
        }

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

        DB::statement("ALTER TABLE vouchers CHANGE COLUMN discount_type type ENUM('percent', 'percentage', 'fixed') NOT NULL DEFAULT 'fixed'");
        DB::statement('ALTER TABLE vouchers CHANGE COLUMN discount_value value DECIMAL(12, 2) NOT NULL');
        DB::statement("UPDATE vouchers SET type = 'percent' WHERE type = 'percentage'");
        DB::statement("ALTER TABLE vouchers MODIFY COLUMN type ENUM('percent', 'fixed') NOT NULL DEFAULT 'fixed'");
    }
};
