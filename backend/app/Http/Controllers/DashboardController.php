<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Aset;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Status Aset Keseluruhan (in, out, service, BAP)
        $statusAset = Aset::select('inout_aset', DB::raw('count(*) as total'))
            ->groupBy('inout_aset')
            ->pluck('total', 'inout_aset');

        // 2. Proporsi Dipinjam (out) vs Tersedia (in)
        $dipinjam = Aset::where('inout_aset', 'out')->count();
        $tersedia = Aset::where('inout_aset', 'in')->count();

        // 3. Distribusi Kerusakan per Kategori (service)
        $kerusakanPerKategori = DB::table('aset')
            ->join('kat_aset', 'aset.id_kat_aset', '=', 'kat_aset.id_kat_aset')
            ->where('aset.inout_aset', 'service')
            ->select('kat_aset.kat_aset as kategori', DB::raw('count(*) as jumlah'))
            ->groupBy('kat_aset.kat_aset')
            ->get();

        // 4. Tren Kerusakan Bulanan
        $trenBulanan = Aset::where('inout_aset', 'service')
            ->select(
                DB::raw("DATE_FORMAT(updated_at, '%Y-%m') as bulan"),
                DB::raw('count(*) as rusak')
            )
            ->groupBy('bulan')
            ->orderBy('bulan', 'asc')
            ->limit(6)
            ->get();

        return response()->json([
            'status_aset' => $statusAset,
            'proporsi_dipinjam' => [
                'dipinjam' => $dipinjam,
                'tersedia' => $tersedia,
            ],
            'kerusakan_per_kategori' => $kerusakanPerKategori,
            'tren_bulanan' => $trenBulanan,
        ]);
    }
}