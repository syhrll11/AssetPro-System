<?php

namespace App\Http\Controllers;

use App\Models\Aset;
use App\Models\TrxAset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrxAsetInController extends Controller
{
    // GET: Menampilkan semua aset dengan status "in"
    public function index()
    {
        $data = Aset::where('inout_aset', 'in')->get();
        return response()->json($data);
    }

    // POST: Menambahkan transaksi aset keluar (pinjam)
    public function store(Request $request)
    {
        // Mapping tombol ke ENUM yang valid
        $statusMapping = [
            'out' => 'out',
            'service' => 'service',
            'bap' => 'bap',
        ];

        // Ambil status asli dari request (boleh "pinjam", "service", "bap")
        $incomingStatus = $request->input('trx_status');

        // Cek validitas status
        if (!array_key_exists($incomingStatus, $statusMapping)) {
            return response()->json([
                'message' => 'Status transaksi tidak dikenali.',
                'errors' => ['trx_status' => ['Status tidak valid.']],
            ], 422);
        }

        $validated = $request->validate([
            'kd_cabang'     => ['required', 'string', 'max:10'],
            'name_asset'    => 'required|string|max:30',
            'tipe_asset'    => 'required|string|max:50',
            'serial_number' => 'required|string|max:25',
            'kd_aktiva'     => 'required|string|max:15',
            'lokasi'        => 'required|string|max:50',
            'id_peminjam'   => 'required|integer',
            'id_asets'      => 'required|integer',
        ]);

        // Masukkan nilai enum yang sesuai untuk penyimpanan
        $validated['trx_status'] = $statusMapping[$incomingStatus];
        $validated['tanggal_keluar'] = now();

        DB::beginTransaction();

        try {
            // Simpan transaksi ke DB
            $trx = TrxAset::create($validated);

            // Update status aset
            Aset::where('id_asets', $validated['id_asets'])
                ->update(['inout_aset' => $validated['trx_status']]);

            DB::commit();
            return response()->json($trx, 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => 'Gagal menyimpan transaksi.',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
