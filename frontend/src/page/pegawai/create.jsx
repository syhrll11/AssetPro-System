import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPegawai } from "../../_services/pegawai";
import {
  HiOutlineUserCircle,
  HiOutlineCheck,
  HiOutlineArrowPath,
  HiOutlineArrowLeft,
} from "react-icons/hi2";

export default function PegawaiCreate() {
  const initialFormState = {
    nik_user: "",
    nama_karyawan: "",
    email_karyawan: "",
    role: "",
    password_user: "",
    id_gudang: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user"));
    } catch (e) {
      user = null;
    }

    if (!isLoggedIn || !user || user.role !== "admin") {
      alert("Akses ditolak. Halaman ini hanya untuk administrator.");
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isFormValid = () => {
    return (
      form.nik_user &&
      form.nama_karyawan &&
      form.email_karyawan &&
      form.role &&
      form.password_user &&
      form.id_gudang
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Semua field wajib diisi.");
      return;
    }

    setIsLoading(true);
    try {
      await createPegawai(form);
      navigate("/pegawai");
    } catch (err) {
      alert("Gagal menambahkan data pegawai!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialFormState);
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <Link
          to="/pegawai"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <HiOutlineArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Data Pegawai
        </Link>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-subtle">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <HiOutlineUserCircle className="w-5 h-5 text-blue-600" />
            Tambah Akun Pegawai
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftarkan akun pengguna baru beserta role akses di SIMAO.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                NIK Karyawan <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="nik_user"
                value={form.nik_user}
                onChange={handleChange}
                placeholder="Contoh: 1234567890"
                required
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Lengkap <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="nama_karyawan"
                value={form.nama_karyawan}
                onChange={handleChange}
                placeholder="Nama staf/karyawan"
                required
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Alamat Email <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                name="email_karyawan"
                value={form.email_karyawan}
                onChange={handleChange}
                placeholder="nama@perusahaan.com"
                required
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kata Sandi Akun <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                name="password_user"
                value={form.password_user}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                required
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role Hak Akses <span className="text-rose-500">*</span>
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">-- Pilih Role --</option>
                <option value="admin">Administrator (Full Akses)</option>
                <option value="manager">Manager (Read & Laporan)</option>
                <option value="user">User Biasa</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Penempatan Gudang <span className="text-rose-500">*</span>
              </label>
              <select
                name="id_gudang"
                value={form.id_gudang}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">-- Pilih ID Gudang --</option>
                <option value="1">Gudang 1 (Utama)</option>
                <option value="2">Gudang 2 (Barat)</option>
                <option value="3">Gudang 3 (Timur)</option>
                <option value="4">Gudang 4 (Selatan)</option>
                <option value="5">Gudang 5 (Cadangan)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
            >
              <HiOutlineArrowPath className="w-3.5 h-3.5 text-slate-400" />
              Reset
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 rounded-lg shadow-sm transition-colors"
            >
              <HiOutlineCheck className="w-4 h-4" />
              {isLoading ? "Menyimpan..." : "Simpan Pegawai"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
