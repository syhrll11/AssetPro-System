<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'email_karyawan'   => 'admin@example.com',
                'nama_karyawan'    => 'Admin',
                'nik_user'         => 1234567890,
                'role'             => 'admin',
                'password_user'    => Hash::make('admin1234'),
                'created_at'       => now(),
                'updated_at'       => now(),
                'remember_token'   => Str::random(10),
                'id_gudang'        => 1,
            ],
            [
                'email_karyawan'   => 'user@example.com',
                'nama_karyawan'    => 'User Biasa',
                'nik_user'         => 2234567890,
                'role'             => 'user',
                'password_user'    => Hash::make('user1234'),
                'created_at'       => now(),
                'updated_at'       => now(),
                'remember_token'   => Str::random(10),
                'id_gudang'        => 1,
            ],
            [
                'email_karyawan'   => 'manager@example.com',
                'nama_karyawan'    => 'Manager',
                'nik_user'         => 3234567890,
                'role'             => 'manager',
                'password_user'    => Hash::make('manager1234'),
                'created_at'       => now(),
                'updated_at'       => now(),
                'remember_token'   => Str::random(10),
                'id_gudang'        => 1,
            ],
        ]);
    }
}
