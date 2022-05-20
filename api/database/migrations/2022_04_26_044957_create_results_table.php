<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('results', function (Blueprint $table) {
            $table->id();
            $table->json('answers')->default('[]');
            $table->timestamps();

            $table->foreignUuid('test_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('question_id')->constrained()->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('results');
    }
};
