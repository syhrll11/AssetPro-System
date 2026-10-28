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
        Schema::create('trx_asets', function (Blueprint $table) {
            $table->id('id_trx');
            $table->string('kd_cabang', 10);
            $table->string('name_asset', 30);
            $table->string('tipe_asset', 50);
            $table->string('serial_number', 25);
            $table->enum('trx_status', ['in','out','service', 'BAP']);
            $table->string('kd_aktiva', 15);
            $table->string('lokasi', 50);
            $table->dateTime('tanggal_keluar')->nullable();
            $table->dateTime('tanggal_kembali')->nullable();
            $table->timestamps(0);  // created_at, updated_at
            $table->softDeletes();  // deleted_at
            $table->unsignedBigInteger('id_peminjam');
            $table->unsignedBigInteger('id_asets');
            // $table->foreign('data_peminjaman_id_peminjam')->references('id_peminjam')->on('data_peminjaman');
            // $table->foreign('assets_id_assets')->references('id_assets')->on('assets');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trx_asets');
    }
};
