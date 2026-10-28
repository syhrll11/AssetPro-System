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
        Schema::create('kat_aset', function (Blueprint $table) {
            $table->id('id_kat_aset');
            $table->string('kat_aset', 25);
            $table->timestamps();  // created_at, updated_at
            $table->softDeletes();  // deleted_asset
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kat_aset');
    }
};
