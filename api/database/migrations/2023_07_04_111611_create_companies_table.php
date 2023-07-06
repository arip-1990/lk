<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('inn')->nullable();
            $table->string('ogrn')->nullable();
            $table->string('license')->nullable();
            $table->string('address')->nullable();
            $table->string('website')->nullable();
            $table->timestamps();
        });

        Schema::table('stores', function (Blueprint $table) {
            $table->foreignId('company_id')->nullable()->constrained()->cascadeOnUpdate()->nullOnDelete();
        });

        Schema::table('cities', function (Blueprint $table) {
            $table->string('prefix', 8)->after('name')->default('г');

            $table->unique(['name', 'type']);

            $table->foreignUuid('parent_id')->nullable()->constrained('cities')->cascadeOnUpdate()->nullOnDelete();
        });

        Schema::table('locations', function (Blueprint $table) {
            $table->string('type')->after('id')->nullable();
            $table->string('prefix', 8)->after('type')->nullable();

            $table->unique(['city_id', 'street', 'house']);
        });
    }

    public function down(): void
    {
        Schema::table('locations', function (Blueprint $table) {
            $table->dropUnique(['city_id', 'street', 'house']);

            $table->dropColumn(['prefix', 'type']);
        });

        Schema::table('cities', function (Blueprint $table) {
            $table->dropUnique(['name', 'type']);

            $table->dropColumn(['parent_id', 'prefix']);
        });

        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn('company_id');
        });

        Schema::dropIfExists('companies');
    }
};
