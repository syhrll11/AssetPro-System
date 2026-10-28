<?php

namespace App\Http\Controllers;

use App\Models\Peminjam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PeminjamController extends Controller
{
    /**
     * Display a listing of the peminjam.
     */
    public function index()
    {
        $peminjams = Peminjam::all();
    
        // Cek jika data kosong
        if ($peminjams->isEmpty()) {
            return response()->json([
                'success' => false,  // Mengubah 'success' menjadi false ketika data tidak ditemukan
                'message' => 'No data found',  // Pesan yang lebih sesuai
            ], 404);  // Status code 404 karena data tidak ditemukan
        }
    
        // Mengembalikan response jika data ditemukan
        return response()->json([
            'success' => true,
            'message' => 'Get All Resource',
            'data' => $peminjams
        ], 200);  // Status code 200 untuk data yang ditemukan
    }
    

    /**
     * Store a newly created peminjam in the database.
     */
    public function store(Request $request)
    {
        // 1. validator
        $validator = Validator::make($request->all(), [
            'nik_karyawan' => 'required|integer',
            'nama_karyawan' => 'required|string|max:50',
            'kd_gudang' => 'required|string|max:4',
        ]);

        // 2. check validator error
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        // 3. insert data
        $peminjam = Peminjam::create([
            'nik_karyawan' => $request->nik_karyawan,
            'nama_karyawan' => $request->nama_karyawan,
            'kd_gudang' => $request->kd_gudang,
        ]);

        // 4. response
        return response()->json([
            'success' => true,
            'message' => 'Resource added successfully!',
            'data' => $peminjam
        ], 201);
    }

    /**
     * Display the specified peminjam.
     */
    public function show($id)
    {
        $peminjam = Peminjam::find($id);

        if ($peminjam) {
            return response()->json([
                'success' => true,
                'message' => 'Resource found',
                'data' => $peminjam
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Resource not found'
        ], 404);
    }

    /**
     * Update the specified peminjam in the database.
     */
    public function update(Request $request, $id)
    {
        $peminjam = Peminjam::find($id);

        if (!$peminjam) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found'
            ], 404);
        }

        // 1. validator
        $validator = Validator::make($request->all(), [
            'nik_karyawan' => 'required|integer',
            'nama_karyawan' => 'required|string|max:50',
            'kd_gudang' => 'required|string|max:4',
        ]);

        // 2. check validator error
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()
            ], 422);
        }

        // 3. update data
        $peminjam->update([
            'nik_karyawan' => $request->nik_karyawan,
            'nama_karyawan' => $request->nama_karyawan,
            'kd_gudang' => $request->kd_gudang,
        ]);

        // 4. response
        return response()->json([
            'success' => true,
            'message' => 'Resource updated successfully!',
            'data' => $peminjam
        ], 200);
    }

    /**
     * Remove the specified peminjam from storage.
     */
    public function destroy($id)
    {
        $peminjam = Peminjam::find($id);

        if (!$peminjam) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found'
            ], 404);
        }

        // 1. delete data
        $peminjam->delete();

        // 2. response
        return response()->json([
            'success' => true,
            'message' => 'Resource deleted successfully'
        ], 200);
    }
}
