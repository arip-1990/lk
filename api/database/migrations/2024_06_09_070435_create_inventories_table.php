<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->text('description');
            $table->string('inventory_number')->nullable();
            $table->string('line1', length: 255)->nullable();
            $table->string('line2', length: 255)->nullable();
            $table->string('barcode', length: 255)->nullable();
            $table->string('sheet')->nullable();

            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('store_id')->nullable()->constrained()->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('inventories');
    }
};
