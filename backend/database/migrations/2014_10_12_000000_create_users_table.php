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
        Schema::create('users', function (Blueprint $table) {
            $table->id('id_user');
            $table->string('email_karyawan', 50);
            $table->string('nama_karyawan', 50);
            $table->bigInteger('nik_user');
            $table->string('role', 20);
            $table->string('password_user', 60);
            $table->timestamps();  // created_at, updated_at
            $table->softDeletes();  // delete_at
            $table->rememberToken();
            $table->unsignedBigInteger('id_gudang');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
