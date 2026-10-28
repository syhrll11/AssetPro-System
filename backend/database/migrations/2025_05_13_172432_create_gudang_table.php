<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGudangTable extends Migration
{
    public function up()
    {
        Schema::create('gudang', function (Blueprint $table) {
            $table->id('id_gudang');
            $table->string('kd_gudang', 4);
            $table->string('nama_gudang', 45);
            $table->string('alamat_gudang', 45);
            $table->string('koordinat', 45);
            $table->timestamps();  // created_at, updated_at
            $table->softDeletes();  // deleted_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('gudang');
    }
}