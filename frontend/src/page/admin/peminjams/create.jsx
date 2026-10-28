import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createPeminjam } from "../../../_services/peminjam";
import { getGudang } from "../../../_services/gudang";
import {
  HiOutlineIdentification,
  HiOutlineCheck,
  HiOutlineArrowPath,
  HiOutlineArrowLeft,
} from "react-icons/hi2";

export default function PeminjamCreate() {
  const initialFormState = {
    nik_karyawan: "",
    nama_karyawan: "",
    kd_gudang: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [gudang, setGudang] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGudang() {
      try {
        const data = await getGudang();
        setGudang(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Gagal memuat gudang:", error);
      }
    }

    fetchGudang();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPeminjam(form);
      navigate("/peminjams");
    } catch (err) {
      alert("Gagal menambahkan data peminjam!");
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialFormState);
  };

  return (
    <div className="max-w-xl space-y-4">
      <div>
        <Link
          to="/peminjams"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <HiOutlineArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Data Peminjam
        </Link>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-subtle">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <HiOutlineIdentification className="w-5 h-5 text-blue-600" />
            Tambah Data Peminjam
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftarkan identitas staf internal yang diberi hak otorisasi peminjaman unit.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              NIK Karyawan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="nik_karyawan"
              value={form.nik_karyawan}
              onChange={handleChange}
              placeholder="Contoh: 100006"
              required
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Lengkap Karyawan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="nama_karyawan"
              value={form.nama_karyawan}
              onChange={handleChange}
              placeholder="Contoh: Fajar Pratama"
              required
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Gudang Penempatan <span className="text-rose-500">*</span>
            </label>
            <select
              name="kd_gudang"
              value={form.kd_gudang}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">-- Pilih Kode Gudang --</option>
              {gudang.map((g) => (
                <option key={g.kd_gudang} value={g.kd_gudang}>
                  {g.kd_gudang} - {g.nama_gudang}
                </option>
              ))}
            </select>
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
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 rounded-lg shadow-sm transition-colors"
            >
              <HiOutlineCheck className="w-4 h-4" />
              {loading ? "Menyimpan..." : "Simpan Peminjam"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
