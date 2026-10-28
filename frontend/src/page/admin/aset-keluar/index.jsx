import React, { useEffect, useState } from "react";
import { getAsetKeluar, kembalikanAset } from "../../../_services/asetKeluar";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineArrowUturnLeft,
} from "react-icons/hi2";

export default function AsetKeluar() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterNama, setFilterNama] = useState("");
  const [statusTab, setStatusTab] = useState("out");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchPeminjam, setSearchPeminjam] = useState("");

  const userRole = localStorage.getItem("role") || "";
  const isAdmin = userRole.toLowerCase() === "admin";

  const labelMap = {
    out: "Lokasi Pinjam",
    service: "Lokasi Service",
    bap: "Lokasi BAP",
  };

  useEffect(() => {
    setLoading(true);
    fetchAsetKeluar(statusTab);
    setCurrentPage(1);
  }, [statusTab]);

  const fetchAsetKeluar = async (status) => {
    try {
      const result = await getAsetKeluar(status);
      const list = Array.isArray(result) ? result : (result?.data || []);
      setData(list);
      setFilteredData(list);
    } catch (error) {
      console.error("Gagal mengambil data aset keluar:", error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterNama(value);
    applyFilters(value, searchPeminjam);
  };

  const handleSearchPeminjamChange = (e) => {
    const value = e.target.value;
    setSearchPeminjam(value);
    applyFilters(filterNama, value);
  };

  const applyFilters = (namaFilter, peminjamFilter) => {
    let result = [...data];

    if (namaFilter !== "") {
      result = result.filter((item) =>
        item.name_asets?.toLowerCase().includes(namaFilter.toLowerCase())
      );
    }

    if (peminjamFilter !== "") {
      result = result.filter((item) =>
        item.nama_karyawan?.toLowerCase().includes(peminjamFilter.toLowerCase())
      );
    }

    setFilteredData(result);
    setCurrentPage(1);
  };

  const handleKembalikan = async (id_trx) => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin mengembalikan aset ini ke gudang?"
    );
    if (!confirmed) return;

    try {
      await kembalikanAset(id_trx);
      alert("Aset berhasil dikembalikan.");
      fetchAsetKeluar(statusTab);
    } catch (error) {
      console.error("Gagal mengembalikan aset:", error);
      alert("Terjadi kesalahan saat mengembalikan aset.");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">
          Monitoring Aset Keluar
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Pelacakan unit aset yang sedang dipinjam karyawan, proses perbaikan teknis, atau BAP.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { key: "out", label: "Dipinjam (Out)" },
          { key: "service", label: "Service / Perbaikan" },
          { key: "bap", label: "Berita Acara (BAP)" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              statusTab === tab.key
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filter Section */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Filter Tipe/Nama Aset:
          </label>
          <select
            value={filterNama}
            onChange={handleFilterChange}
            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">-- Semua Aset --</option>
            {[...new Set(data.map((item) => item.name_asets).filter(Boolean))].map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-semibold text-slate-600 mb-1">
            Cari Nama Peminjam:
          </label>
          <div className="relative">
            <HiOutlineMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ketik nama karyawan..."
              value={searchPeminjam}
              onChange={handleSearchPeminjamChange}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-subtle overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Memuat data sirkulasi aset...
          </div>
        ) : currentItems.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Tidak ada unit aset keluar pada kategori ini.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">No.</th>
                    <th className="py-3 px-4">Nama Aset</th>
                    <th className="py-3 px-4">Tipe Aset</th>
                    <th className="py-3 px-4">Serial Number</th>
                    <th className="py-3 px-4">{labelMap[statusTab] || "Lokasi"}</th>
                    <th className="py-3 px-4">NIK</th>
                    <th className="py-3 px-4">Peminjam</th>
                    <th className="py-3 px-4">Tanggal Keluar</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {currentItems.map((item, i) => (
                    <tr key={item.id_trx || item.id || i} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {indexOfFirstItem + i + 1}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {item.name_asets}
                      </td>
                      <td className="py-3 px-4">{item.tipe_asset}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {item.serial_number}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {item.lokasi}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {item.nik_karyawan}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {item.nama_karyawan}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {item.tanggal_keluar?.split("T")[0] || item.tanggal_keluar}
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        {isAdmin ? (
                          <button
                            onClick={() => handleKembalikan(item.id_trx)}
                            className="inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded transition-colors"
                          >
                            <HiOutlineArrowUturnLeft className="w-3.5 h-3.5 text-emerald-600" />
                            Kembalikan
                          </button>
                        ) : (
                          <span className="px-2.5 py-1 text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-200/60 rounded">
                            Monitoring
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-5 py-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <span className="text-xs text-slate-500">
                Menampilkan {indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredData.length)} dari {filteredData.length} data
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Sebelumnya
                </button>
                <span className="px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded">
                  {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
