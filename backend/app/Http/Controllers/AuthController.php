<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Login API
    public function login(Request $request)
    {
        $request->validate([
            'email_karyawan' => 'required|email',
            'password_user' => 'required|string',
        ]);

        $user = User::where('email_karyawan', $request->email_karyawan)->first();

        if (! $user || ! Hash::check($request->password_user, $user->password_user)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah',
            ], 401);
        }

        // Login user secara manual
        Auth::login($user);

        // Hapus semua token lama untuk keamanan
        $user->tokens()->delete();

        // Buat token baru
        $token = $user->createToken('web_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id_user'        => $user->id_user,
                'nama_karyawan'  => $user->nama_karyawan,
                'email_karyawan' => $user->email_karyawan,
                'role'           => $user->role,
                'id_gudang'      => $user->id_gudang,
            ],
        ], 200);
    }

    // Logout API
    public function logout(Request $request)
    {
        // Hapus token saat ini (logout hanya sesi ini)
        if ($request->user()?->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        Auth::logout();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil',
        ]);
    }

    // Ambil user yang sedang login
    public function user(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'user' => [
                'id_user'        => $user->id_user,
                'nama_karyawan'  => $user->nama_karyawan,
                'email_karyawan' => $user->email_karyawan,
                'role'           => $user->role,
                'id_gudang'      => $user->id_gudang,
            ],
        ]);
    }
}