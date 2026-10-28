<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TrxAset extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'id_trx';

    protected $table = 'trx_asets'; //pinjam

    protected $fillable = [
        'kd_cabang',
        'name_asset',
        'tipe_asset',
        'serial_number',
        'trx_status',
        'kd_aktiva',
        'lokasi',
        'tanggal_keluar',
        'tanggal_kembali',
        'id_peminjam',
        'id_asets',
    ];
}
