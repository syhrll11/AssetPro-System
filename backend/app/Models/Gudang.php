<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Gudang extends Model
{
    use SoftDeletes;

    protected $table = 'gudang';
    protected $primaryKey = 'id_gudang';

    protected $fillable = [
        'kd_gudang',
        'nama_gudang',
        'alamat_gudang',
        'koordinat'
    ];

    // Jika kamu mau, timestamps default sudah aktif (created_at, updated_at)
    public $timestamps = true;

    protected $dates = ['deleted_at'];
}
