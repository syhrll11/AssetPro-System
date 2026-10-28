import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getPeminjamById, updatePeminjam } from "../../../_services/peminjam";
import { getGudang } from "../../../_services/gudang";
import {
  HiOutlineIdentification,
  HiOutlineCheck,
  HiOutlineArrowLeft,
} from "react-icons/hi2";

export default function PeminjamEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nik_karyawan: "",
    nama_karyawan: "",
    kd_gudang: "",
  });

  const [gudang, setGudang] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [peminjamData, gudangData] = await Promise.all([
          getPeminjamById(id),
          getGudang(),
        ]);
        setForm(peminjamData);
        setGudang(Array.isArray(gudangData) ? gudangData : []);
      } catch (err) {
        alert("Gagal mengambil data!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updatePeminjam(id, form);
      navigate("/peminjams");
    } catch (err) {
      alert("Gagal mengupdate data peminjam!");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-slate-500">
        Memuat data peminjam...
      </div>
    );
  }

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
            Edit Data Peminjam
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Perbarui informasi NIK atau lokasi gudang penempatan karyawan.
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
              onClick={() => navigate("/peminjams")}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 rounded-lg shadow-sm transition-colors"
            >
              <HiOutlineCheck className="w-4 h-4" />
              {submitting ? "Menyimpan..." : "Perbarui Peminjam"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
