<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Peminjam extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'peminjam';
    protected $primaryKey = 'id_peminjam'; // Tentukan kolom primary key yang digunakan

    protected $fillable = [
        'nik_karyawan',
        'nama_karyawan',
        'kd_gudang',
    ];

    // Jika menggunakan soft deletes
    protected $dates = ['deleted_at'];
}
