<?php

namespace App\Http\Controllers;

use App\Models\KategoriAset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


class KategoriAsetController extends Controller
{
    // Menampilkan semua kategori aset
    public function index()
    {
        return response()->json(KategoriAset::all());
    }

    // Menampilkan satu kategori aset
    public function show($id)
    {
        $kategori = KategoriAset::find($id);

        if (!$kategori) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        return response()->json($kategori);
    }

    // Menambah kategori aset baru
    public function store(Request $request)
    {
        KategoriAset::create([
            'kat_aset' => $request->kat_aset,
        ]);
        return response()->json(['message' => 'Data berhasil ditambahkan'], 201);
    }

    // Mengupdate kategori aset
    public function update(Request $request, $id)
    {
        $kategori = Kategoriaset::findOrFail($id);

        $kategori->update([
            'kat_aset' => $request->kat_aset,
        ]);

        return response()->json(['message' => 'Data berhasil diperbarui']);
    }

    // Menghapus kategori aset
    public function destroy($id)
    {
        $kategori = KategoriAset::find($id);

        if (!$kategori) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $kategori->delete();

        return response()->json(['message' => 'Data berhasil dihapus']);
    }
}
