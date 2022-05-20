<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('statements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('must');
            $table->text('comment')->nullable();
            $table->boolean('status')->default(false);
            $table->timestamp('done_at')->nullable();
            $table->timestamps();

            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('store_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('statements');
    }
};
