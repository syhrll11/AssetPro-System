<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AsetSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('aset')->insert([
            [
                'kd_gudang'        => 'GD01',
                'name_asets'       => 'Laptop Lenovo',
                'spec'             => 'Core i5, 8GB RAM, 512GB SSD',
                'tipe_aset'        => 'Elektronik',
                'harga'            => 10000000.00,
                'serial_number'    => 'SN-LEN123456',
                'inout_aset'       => 'in',
                'cover_photo'      => 'laptop-lenovo.jpg',
                'tanggal_perolehan'=> '2023-05-10',
                'created_at'       => now(),
                'updated_at'       => now(),
                'id_kat_aset'      => 1,
                'id_user'          => 1,
            ],
            [
                'kd_gudang'        => 'GD02',
                'name_asets'       => 'Meja Kantor',
                'spec'             => 'Kayu jati, ukuran 120x60 cm',
                'tipe_aset'        => 'Furniture',
                'harga'            => 1500000.00,
                'serial_number'    => 'SN-FUR001234',
                'inout_aset'       => 'in',
                'cover_photo'      => 'meja-kantor.jpg',
                'tanggal_perolehan'=> '2022-08-15',
                'created_at'       => now(),
                'updated_at'       => now(),
                'id_kat_aset'      => 2,
                'id_user'          => 2,
            ],
            [
                'kd_gudang'        => 'GD03',
                'name_asets'       => 'Mobil Pickup',
                'spec'             => 'Daihatsu Gran Max, 2021',
                'tipe_aset'        => 'Kendaraan',
                'harga'            => 135000000.00,
                'serial_number'    => 'SN-VEH778899',
                'inout_aset'       => 'in',
                'cover_photo'      => 'pickup.jpg',
                'tanggal_perolehan'=> '2021-12-01',
                'created_at'       => now(),
                'updated_at'       => now(),
                'id_kat_aset'      => 3,
                'id_user'          => 3,
            ],
            [
                'kd_gudang'        => 'GD01',
                'name_asets'       => 'Printer Epson',
                'spec'             => 'Epson L3150, Ink Tank',
                'tipe_aset'        => 'Elektronik',
                'harga'            => 2300000.00,
                'serial_number'    => 'SN-PRT098765',
                'inout_aset'       => 'in',
                'cover_photo'      => 'printer-epson.jpg',
                'tanggal_perolehan'=> '2023-01-20',
                'created_at'       => now(),
                'updated_at'       => now(),
                'id_kat_aset'      => 1,
                'id_user'          => 1,
            ],
            [
                'kd_gudang'        => 'GD05',
                'name_asets'       => 'Lemari Arsip',
                'spec'             => 'Besi, 4 rak, warna abu-abu',
                'tipe_aset'        => 'Furniture',
                'harga'            => 2000000.00,
                'serial_number'    => 'SN-LEM556677',
                'inout_aset'       => 'in',
                'cover_photo'      => 'lemari-arsip.jpg',
                'tanggal_perolehan'=> '2024-03-11',
                'created_at'       => now(),
                'updated_at'       => now(),
                'id_kat_aset'      => 2,
                'id_user'          => 2,
            ],
        ]);
    }
}
