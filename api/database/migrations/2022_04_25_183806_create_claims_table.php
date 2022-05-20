<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('claims', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('invoice');
            $table->integer('not_delivery')->nullable();
            $table->string('not_attachment')->nullable();
            $table->string('regrading')->nullable();
            $table->timestamp('short_shelf_life')->nullable();
            $table->timestamp('delivery_at')->nullable();
            $table->timestamps();

            $table->foreignUuid('provider_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('store_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('claims');
    }
};
