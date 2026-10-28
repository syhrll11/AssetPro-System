<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class KategoriAset extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'kat_aset';

    protected $primaryKey = 'id_kat_aset';

    protected $fillable = [
        'kat_aset'
    ];

    public $timestamps = false; // nonaktifkan jika field created_at dan updated_at tidak standar
}
