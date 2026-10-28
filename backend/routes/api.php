<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PeminjamController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GudangController;
use App\Http\Controllers\KategoriAsetController;
use App\Http\Controllers\TrxAsetInController;
use App\Http\Controllers\TrxAsetOutController;
use App\Http\Controllers\TrxAsetController;
use App\Http\Controllers\AssetController;

// Public Routes (tanpa auth)
Route::post('login', [AuthController::class, 'login'])->name('login');
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('assets/{id}', [AssetController::class, 'show']);

// Routes untuk semua role (auth:sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', [AuthController::class, 'user']);
    Route::post('logout', [AuthController::class, 'logout']);
});

// Routes khusus manager dan admin (GET-only)
Route::middleware(['auth:sanctum', 'checkrole:manager,admin'])->group(function () {
    // Users
    Route::get('users', [UserController::class, 'index']);

    // Gudang
    Route::get('gudang', [GudangController::class, 'index']);

    // Kategori Aset
    Route::get('kategori-aset', [KategoriAsetController::class, 'index']);

    // Aset
    Route::get('assets', [AssetController::class, 'index']);

    // Peminjam
    Route::get('peminjam', [PeminjamController::class, 'index']);

    // Transaksi Aset - View Only (manager dapat melihat, tapi tidak bisa aksi)
    Route::get('aset-in', [TrxAsetInController::class, 'index']);
    Route::get('aset-out', [TrxAsetOutController::class, 'index']);
});

// Routes khusus admin (full akses)
Route::middleware(['auth:sanctum', 'checkrole:admin'])->group(function () {
    // Users
    Route::get('users/{id}', [UserController::class, 'show']);
    Route::post('users', [UserController::class, 'store']);
    Route::put('users/{id}', [UserController::class, 'update']);
    Route::delete('users/{id}', [UserController::class, 'destroy']);

    // Gudang
    Route::get('gudang/{id}', [GudangController::class, 'show']);
    Route::post('gudang', [GudangController::class, 'store']);
    Route::put('gudang/{id}', [GudangController::class, 'update']);
    Route::delete('gudang/{id}', [GudangController::class, 'destroy']);

    // Kategori Aset
    Route::get('kategori-aset/{id}', [KategoriAsetController::class, 'show']);
    Route::post('kategori-aset', [KategoriAsetController::class, 'store']);
    Route::put('kategori-aset/{id}', [KategoriAsetController::class, 'update']);
    Route::delete('kategori-aset/{id}', [KategoriAsetController::class, 'destroy']);

    // Aset
    Route::post('assets', [AssetController::class, 'store']);
    Route::put('assets/{id}', [AssetController::class, 'update']);
    Route::delete('assets/{id}', [AssetController::class, 'destroy']);

    // Peminjam
    Route::get('peminjam/{id}', [PeminjamController::class, 'show']);
    Route::post('peminjam', [PeminjamController::class, 'store']);
    Route::put('peminjam/{id}', [PeminjamController::class, 'update']);
    Route::delete('peminjam/{id}', [PeminjamController::class, 'destroy']);

    // Transaksi Aset (Aset Masuk & Keluar) - Mutasi khusus admin
    Route::post('aset-in', [TrxAsetInController::class, 'store']);
    Route::post('aset-out', [TrxAsetOutController::class, 'store']);
});
