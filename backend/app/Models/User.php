<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, SoftDeletes;

    protected $table = 'users';
    protected $primaryKey = 'id_user';

    protected $fillable = [
        'email_karyawan',
        'nama_karyawan',
        'nik_user',
        'role',
        'password_user',
        'id_gudang',
    ];

    public function getAuthPassword()
    {
        return $this->password_user;
    }
    protected $dates = ['deleted_at'];
}