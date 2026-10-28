import React, { useEffect, useState } from "react";
import { getPeminjam, deletePeminjam } from "../../../_services/peminjam";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineIdentification,
} from "react-icons/hi2";

export default function AdminPeminjam() {
  const [peminjam, setPeminjam] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getPeminjam();
      setPeminjam(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching peminjam:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus peminjam ini?")) {
      try {
        await deletePeminjam(id);
        fetchData();
      } catch (error) {
        alert("Gagal menghapus data!");
      }
    }
  };

  const totalPages = Math.ceil(peminjam.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = peminjam.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">
            Data Karyawan Peminjam
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar profil karyawan dan nomor induk staf yang berhak meminjam aset.
          </p>
        </div>

        <Link
          to="/peminjams/create"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors shrink-0"
        >
          <HiOutlinePlus className="w-4 h-4" />
          Tambah Peminjam
        </Link>
      </div>

      {/* Table container */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">No.</th>
                <th className="py-3 px-4">NIK Karyawan</th>
                <th className="py-3 px-4">Nama Peminjam</th>
                <th className="py-3 px-4">Gudang Basis</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Belum ada data peminjam terdaftar.
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr key={item.id_peminjam || index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {startIdx + index + 1}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-900">
                      {item.nik_karyawan}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <HiOutlineIdentification className="w-4 h-4" />
                      </div>
                      <span>{item.nama_karyawan}</span>
                    </td>
                    <td className="py-3 px-4 font-mono text-blue-600 font-semibold">
                      {item.kd_gudang}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/peminjams/${item.id_peminjam}/edit`)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded transition-colors"
                      >
                        <HiOutlinePencilSquare className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id_peminjam)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 rounded transition-colors"
                      >
                        <HiOutlineTrash className="w-3.5 h-3.5" />
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-slate-500">
            Menampilkan {peminjam.length === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + itemsPerPage, peminjam.length)} dari {peminjam.length} peminjam
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-7 h-7 text-xs font-semibold rounded flex items-center justify-center transition-colors ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
