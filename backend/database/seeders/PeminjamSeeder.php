<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PeminjamSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('peminjam')->insert([
            [
                'nik_karyawan'   => 100001,
                'nama_karyawan'  => 'Andi Prasetyo',
                'kd_gudang'      => 'GD01',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'nik_karyawan'   => 100002,
                'nama_karyawan'  => 'Budi Santoso',
                'kd_gudang'      => 'GD02',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'nik_karyawan'   => 100003,
                'nama_karyawan'  => 'Citra Dewi',
                'kd_gudang'      => 'GD03',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'nik_karyawan'   => 100004,
                'nama_karyawan'  => 'Dedi Gunawan',
                'kd_gudang'      => 'GD01',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'nik_karyawan'   => 100005,
                'nama_karyawan'  => 'Eka Lestari',
                'kd_gudang'      => 'GD02',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
        ]);
    }
}
