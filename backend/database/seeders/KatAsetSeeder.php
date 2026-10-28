<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KatAsetSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('kat_aset')->insert([
            [
                'kat_aset'    => 'Elektronik',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'kat_aset'    => 'Furniture',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'kat_aset'    => 'Kendaraan',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
            [
                'kat_aset'    => 'Peralatan Kantor',
                'created_at'  => now(),
                'updated_at'  => now(),
            ],
        ]);
    }
}
