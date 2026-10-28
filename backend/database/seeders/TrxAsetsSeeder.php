<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TrxAsetsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('trx_asets')->insert([
            [
                'kd_cabang'        => 'CBG001',
                'name_asset'       => 'Laptop Lenovo',
                'tipe_asset'       => 'Elektronik',
                'serial_number'    => 'SN-LEN123456',
                'trx_status'       => 'out',
                'kd_aktiva'        => 'AKT1001',
                'lokasi'           => 'Ruang IT',
                'tanggal_keluar'   => '2024-06-01 08:00:00',
                'tanggal_kembali'  => null,
                'created_at'       => now(),
                'updated_at'       => now(),
                'id_peminjam'      => 1,
                'id_asets'         => 1,
            ],
            [
                'kd_cabang'        => 'CBG002',
                'name_asset'       => 'Printer Epson',
                'tipe_asset'       => 'Elektronik',
                'serial_number'    => 'SN-PRT098765',
                'trx_status'       => 'service',
                'kd_aktiva'        => 'AKT2002',
                'lokasi'           => 'Service Center',
                'tanggal_keluar'   => '2024-05-15 09:30:00',
                'tanggal_kembali'  => null,
                'created_at'       => now(),
                'updated_at'       => now(),
                'id_peminjam'      => 2,
                'id_asets'         => 4,
            ],
            [
                'kd_cabang'        => 'CBG003',
                'name_asset'       => 'Mobil Pickup',
                'tipe_asset'       => 'Kendaraan',
                'serial_number'    => 'SN-VEH778899',
                'trx_status'       => 'out',
                'kd_aktiva'        => 'AKT3003',
                'lokasi'           => 'Lapangan Gudang',
                'tanggal_keluar'   => '2024-04-10 07:00:00',
                'tanggal_kembali'  => '2024-04-11 18:00:00',
                'created_at'       => now(),
                'updated_at'       => now(),
                'id_peminjam'      => 3,
                'id_asets'         => 3,
            ],
            [
                'kd_cabang'        => 'CBG004',
                'name_asset'       => 'Lemari Arsip',
                'tipe_asset'       => 'Furniture',
                'serial_number'    => 'SN-LEM556677',
                'trx_status'       => 'BAP',
                'kd_aktiva'        => 'AKT4004',
                'lokasi'           => 'Ruang Administrasi',
                'tanggal_keluar'   => '2024-03-20 13:00:00',
                'tanggal_kembali'  => '2024-03-25 09:00:00',
                'created_at'       => now(),
                'updated_at'       => now(),
                'id_peminjam'      => 4,
                'id_asets'         => 5,
            ],
        ]);
    }
}
