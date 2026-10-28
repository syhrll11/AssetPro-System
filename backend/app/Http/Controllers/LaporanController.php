<?php

namespace App\Http\Controllers;

use App\Models\TrxAset;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    /**
     * Mengelompokkan data berdasarkan status dan hitung total untuk statbox
     */
    public function groupedByStatus()
    {
        $statuses = ['in', 'out', 'service', 'BAP'];
        $result = [];

        foreach ($statuses as $status) {
            $result['data'][$status] = TrxAset::where('trx_status', $status)->get();
            $result['total'][$status] = TrxAset::where('trx_status', $status)->count();
        }

        return response()->json($result);
    }

    public function grouped()
    {
        $trx = TrxAset::with('kategori')->get()->map(function ($t) {
            return [
                'name_asset'     => $t->name_asset,
                'kd_cabang'      => $t->kd_cabang,
                'tipe_asset'     => $t->kategori->kat_aset ?? '-', // ambil dari relasi kategori
                'serial_number'  => $t->serial_number,
                'trx_status'     => $t->trx_status,
                'tanggal_keluar' => $t->tanggal_keluar,
            ];
        })->groupBy('trx_status');

        $total = [
            'in'      => $trx->get('in')?->count() ?? 0,
            'out'     => $trx->get('out')?->count() ?? 0,
            'service' => $trx->get('service')?->count() ?? 0,
            'BAP'     => $trx->get('BAP')?->count() ?? 0,
        ];

        return response()->json([
            'data' => $trx,
            'total' => $total,
        ]);
    }

}
