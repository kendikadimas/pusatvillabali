<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('password_set_by_user')->default(true);
        });

        // Google-only accounts were created with a random unknown password
        if (Schema::hasColumn('users', 'google_id')) {
            DB::table('users')
                ->whereNotNull('google_id')
                ->where('google_id', '!=', '')
                ->update(['password_set_by_user' => false]);
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('password_set_by_user');
        });
    }
};
