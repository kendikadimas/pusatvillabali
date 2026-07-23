<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();
            $table->string('description')->nullable();
            $table->enum('type', ['percent', 'fixed'])->default('fixed');
            $table->decimal('value', 12, 2);                        // percent 0-100 or fixed IDR amount
            $table->decimal('min_booking_amount', 12, 2)->default(0); // minimum order to apply
            $table->decimal('max_discount', 12, 2)->nullable();     // cap for percent type
            $table->integer('usage_limit')->nullable();             // null = unlimited
            $table->integer('used_count')->default(0);
            $table->boolean('is_active')->default(true);
            $table->date('valid_from')->nullable();
            $table->date('valid_until')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
