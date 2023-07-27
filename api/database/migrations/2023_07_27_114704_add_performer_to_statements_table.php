<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('statements', function (Blueprint $table) {
            $table->renameColumn('user_id', 'applicant_id');
            $table->foreignUuid('performer_id')->nullable()->constrained('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('statements', function (Blueprint $table) {
            $table->dropColumn('performer_id');
            $table->renameColumn('applicant_id', 'user_id');
        });
    }
};
