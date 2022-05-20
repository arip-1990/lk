<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('barcode')->unique();
            $table->string('inn')->nullable();
            $table->string('email')->unique()->nullable();
            $table->string('mobile_phone')->unique()->nullable();
            $table->json('internal_phones')->default('[]');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('middle_name')->nullable();
            $table->string('position')->nullable();
            $table->boolean('status')->default(false);
            $table->rememberToken();
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable();

            $table->foreignId('role_id')->nullable()->constrained()->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
