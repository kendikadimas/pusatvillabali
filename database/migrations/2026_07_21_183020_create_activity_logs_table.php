<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('actor_name')->nullable();  // snapshot nama admin
            $table->string('action', 50);              // create, update, delete, approve, reject, etc.
            $table->string('module', 100);             // villa, booking, payment_method, etc.
            $table->string('subject')->nullable();     // nama/kode entitas yang diubah
            $table->text('description')->nullable();   // deskripsi lengkap
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
