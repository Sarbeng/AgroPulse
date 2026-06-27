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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            $table->foreignId('buyer_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('harvest_log_id')->constrained('harvest_logs')->cascadeOnDelete();

            $table->decimal('total_price', 12, 2);
            $table->string('status'); // pending_escrow, secured, completed

            $table->timestamps();

            $table->index(['buyer_id', 'status']);
            $table->index(['harvest_log_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};

