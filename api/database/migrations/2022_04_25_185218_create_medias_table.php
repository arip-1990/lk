<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medias', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('type');
            $table->smallInteger('sort')->default(0);
            $table->timestamps();

            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('store_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignUuid('user_id')->nullable()->constrained()->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medias');
    }
};
