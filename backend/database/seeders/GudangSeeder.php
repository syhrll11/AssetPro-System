<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GudangSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('gudang')->insert([
            [
                'kd_gudang'      => 'GD01',
                'nama_gudang'    => 'Gudang Utama',
                'alamat_gudang'  => 'Jl. Raya Merdeka No. 1',
                'koordinat'      => '-6.200000,106.816666',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'kd_gudang'      => 'GD02',
                'nama_gudang'    => 'Gudang Barat',
                'alamat_gudang'  => 'Jl. Kemerdekaan Barat No. 10',
                'koordinat'      => '-6.210000,106.826666',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'kd_gudang'      => 'GD03',
                'nama_gudang'    => 'Gudang Timur',
                'alamat_gudang'  => 'Jl. Timur Laut No. 5',
                'koordinat'      => '-6.190000,106.836666',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'kd_gudang'      => 'GD04',
                'nama_gudang'    => 'Gudang Selatan',
                'alamat_gudang'  => 'Jl. Selatan Indah No. 9',
                'koordinat'      => '-6.195000,106.820000',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
            [
                'kd_gudang'      => 'GD05',
                'nama_gudang'    => 'Gudang Cadangan',
                'alamat_gudang'  => 'Jl. Persediaan No. 12',
                'koordinat'      => '-6.185000,106.810000',
                'created_at'     => now(),
                'updated_at'     => now(),
            ],
        ]);
    }
}
