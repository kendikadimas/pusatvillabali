<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('villa_ical_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('villa_id')->constrained('villas')->onDelete('cascade');
            $table->string('channel_name');
            $table->text('ical_url');
            $table->timestamp('last_synced_at')->nullable();
            $table->enum('sync_status', ['active', 'error', 'paused'])->default('active');
            $table->text('last_error')->nullable();
            $table->timestamps();

            $table->index(['villa_id', 'sync_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('villa_ical_links');
    }
};
