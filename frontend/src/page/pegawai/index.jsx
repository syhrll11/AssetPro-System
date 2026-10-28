import React, { useEffect, useState } from "react";
import { getPegawai, deletePegawai } from "../../_services/pegawai";
import { Link, useNavigate } from "react-router-dom";
import Badge from "../../components/ui/Badge";
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineUserCircle,
} from "react-icons/hi2";

export default function AdminPegawai() {
  const [pegawai, setPegawai] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getPegawai();
      const list = Array.isArray(response) ? response : response.data || [];
      setPegawai(list);
    } catch (error) {
      console.error("Error fetching pegawai:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus akun pegawai ini?")) {
      try {
        await deletePegawai(id);
        fetchData();
      } catch (error) {
        alert("Gagal menghapus data!");
      }
    }
  };

  const totalPages = Math.ceil(pegawai.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = pegawai.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">
            Data Pegawai & Pengguna Sistem
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar kredensial akun pengguna sistem dan hak akses operasional (role).
          </p>
        </div>

        <Link
          to="/pegawai/create"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors shrink-0"
        >
          <HiOutlinePlus className="w-4 h-4" />
          Tambah Pegawai
        </Link>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">No.</th>
                <th className="py-3 px-4">NIK</th>
                <th className="py-3 px-4">Nama Pegawai</th>
                <th className="py-3 px-4">Email Akun</th>
                <th className="py-3 px-4">Role Akses</th>
                <th className="py-3 px-4">Gudang</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Belum ada data pegawai terdaftar.
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr key={item.id_user || index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {startIdx + index + 1}
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      {item.nik_user}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-7 h-7 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
                        <HiOutlineUserCircle className="w-4 h-4" />
                      </div>
                      <span>{item.nama_karyawan}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {item.email_karyawan}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={item.role}>
                        {item.role?.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono text-blue-600 font-medium">
                      GD0{item.id_gudang || 1}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <Link
                        to={`/pegawai/${item.id_user}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded transition-colors"
                      >
                        <HiOutlinePencilSquare className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id_user)}
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
            Menampilkan {pegawai.length === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + itemsPerPage, pegawai.length)} dari {pegawai.length} pegawai
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
