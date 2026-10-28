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
        Schema::create('aset', function (Blueprint $table) {
            $table->id('id_asets');
            $table->string('kd_gudang', 4);
            $table->string('name_asets', 30);
            $table->text('spec');
            $table->string('tipe_aset', 50);
            $table->decimal('harga', 15, 2);
            $table->string('serial_number', 25);
            $table->enum('inout_aset', ['in','out','service', 'BAP']);
            $table->string('cover_photo');
            $table->date('tanggal_perolehan');
            $table->timestamps();  // created_at, updated_at
            $table->softDeletes();  // deleted_at
            $table->unsignedBigInteger('id_kat_aset');
            $table->unsignedBigInteger('id_user');
            // $table->foreign('kat_asset_id_kat_asset')->references('id_kat_asset')->on('kat_asset');
            // $table->foreign('Users_id_user')->references('id_user')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aset');
    }
};
