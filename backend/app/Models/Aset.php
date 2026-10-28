<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Aset extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'aset';
    protected $primaryKey = 'id_asets';
    public $incrementing = true;

    protected $fillable = [
        'kd_gudang',
        'name_asets',
        'spec',
        'tipe_aset',
        'harga',
        'serial_number',
        'inout_aset',
        'cover_photo',
        'tanggal_perolehan',
        'id_kat_aset',
        'id_user',
    ];
}
