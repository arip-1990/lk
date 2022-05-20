<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('time_cards', function (Blueprint $table) {
            $table->id();
            $table->string('user');
            $table->string('post');
            $table->string('time_card_number');
            $table->json('attendance')->default('[]');
            $table->timestamps();

            $table->foreignUuid('store_id')->constrained()->onDelete('cascade');
            $table->foreignId('normative_id')->constrained()->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('time_cards');
    }
};
