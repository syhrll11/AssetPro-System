<?php

namespace App\Http\Controllers;

use App\Models\TrxAset;
use App\Models\Aset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrxAsetOutController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->input('status', 'out'); // Default = 'out'
        

        $query = DB::table('trx_asets')
            ->join('aset', 'trx_asets.id_asets', '=', 'aset.id_asets')
            ->join('peminjam', 'trx_asets.id_peminjam', '=', 'peminjam.id_peminjam')
            ->where('trx_asets.trx_status', '=', $status)
            ->whereNull('trx_asets.tanggal_kembali');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('peminjam.nama_karyawan', 'like', '%' . $search . '%')
                  ->orWhere('peminjam.nik_karyawan', 'like', '%' . $search . '%');
            });
        }

        $data = $query->select(
            'trx_asets.id_trx',
            'trx_asets.tanggal_keluar',
            'trx_asets.trx_status',
            'aset.name_asets',
            'aset.tipe_aset',
            'aset.serial_number',
            'trx_asets.lokasi',
            'aset.kd_gudang',
            'peminjam.nama_karyawan',
            'peminjam.nik_karyawan'
        )->get();

        return response()->json($data);
    }



    // POST: Proses pengembalian aset, ubah status transaksi ke "in"
    public function store(Request $request)
    {
        $validated = $request->validate([
            'id_trx' => 'required|exists:trx_asets,id_trx',
        ]);

        DB::beginTransaction();

        try {
            $trx = TrxAset::findOrFail($validated['id_trx']);

            // Update transaksi jadi "in" dan isi tanggal kembali
            $trx->update([
                'trx_status' => 'in',
                'tanggal_kembali' => now(),
            ]);

            // Update status aset jadi "in"
            Aset::where('id_asets', $trx->id_asets)
                ->update(['inout_aset' => 'in']);

            DB::commit();
            return response()->json(['message' => 'Aset berhasil dikembalikan.']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Gagal mengembalikan aset.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
