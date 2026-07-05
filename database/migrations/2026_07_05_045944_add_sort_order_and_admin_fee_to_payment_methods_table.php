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
        Schema::table('payment_methods', function (Blueprint $table) {
            if (! Schema::hasColumn('payment_methods', 'sort_order')) {
                $table->integer('sort_order')->default(0)->after('is_active');
            }
            if (! Schema::hasColumn('payment_methods', 'admin_fee')) {
                $table->integer('admin_fee')->default(0)->after('sort_order');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_methods', function (Blueprint $table) {
            if (Schema::hasColumn('payment_methods', 'sort_order')) {
                $table->dropColumn('sort_order');
            }
            if (Schema::hasColumn('payment_methods', 'admin_fee')) {
                $table->dropColumn('admin_fee');
            }
        });
    }
};
