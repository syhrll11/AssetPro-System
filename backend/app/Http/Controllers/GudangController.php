<?php

namespace App\Http\Controllers;

use App\Models\Gudang;
use Illuminate\Http\Request;

class GudangController extends Controller
{
    // GET /api/gudang
    public function index()
    {
        $gudangs = Gudang::all();
        return response()->json($gudangs);
    }

    // GET /api/gudang/{id}
    public function show($id)
    {
        $gudang = Gudang::find($id);
        if (!$gudang) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }
        return response()->json($gudang);
    }

    // POST /api/gudang
    public function store(Request $request)
    {
        $request->validate([
            'kd_gudang' => 'required|string|max:4',
            'nama_gudang' => 'required|string|max:45',
            'alamat_gudang' => 'required|string|max:45',
            'koordinat' => 'required|string|max:45',
        ]);

        $gudang = Gudang::create($request->all());

        return response()->json($gudang, 201);
    }

    // PUT /api/gudang/{id}
    public function update(Request $request, $id)
    {
        $gudang = Gudang::find($id);
        if (!$gudang) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $request->validate([
            'kd_gudang' => 'sometimes|required|string|max:4',
            'nama_gudang' => 'sometimes|required|string|max:45',
            'alamat_gudang' => 'sometimes|required|string|max:45',
            'koordinat' => 'sometimes|required|string|max:45',
        ]);

        $gudang->update($request->all());

        return response()->json($gudang);
    }

    // DELETE /api/gudang/{id}
    public function destroy($id)
    {
        $gudang = Gudang::find($id);
        if (!$gudang) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $gudang->delete();

        return response()->json(['message' => 'Data berhasil dihapus']);
    }
}