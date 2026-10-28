import React, { useState, useEffect } from "react";
import { fetchKategori, fetchAsets, deleteAset } from "../../_services/aset";
import FormTambahAset from "./FormTambahAset";
import Badge from "../../components/ui/Badge";
import {
  HiOutlineCube,
  HiOutlineArrowDownTray,
  HiOutlineBanknotes,
  HiOutlinePlus,
  HiOutlineEye,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlinePhoto,
} from "react-icons/hi2";

const Aset = () => {
  const [search, setSearch] = useState("");
  const [asets, setAsets] = useState([]);
  const [kategoriMap, setKategoriMap] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingAset, setEditingAset] = useState(null);
  const [detailAset, setDetailAset] = useState(null);
  const [previewModalImage, setPreviewModalImage] = useState(null);

  useEffect(() => {
    loadKategori();
  }, []);

  useEffect(() => {
    loadAsets();
    const savedSearch = localStorage.getItem("search");
    if (savedSearch) setSearch(savedSearch);
  }, [kategoriMap]);

  useEffect(() => {
    localStorage.setItem("search", search);
  }, [search]);

  const loadKategori = async () => {
    try {
      const map = await fetchKategori();
      setKategoriMap(map);
    } catch (error) {
      console.error("Gagal mengambil kategori aset:", error);
    }
  };

  const loadAsets = async () => {
    try {
      const mapped = await fetchAsets(kategoriMap);
      setAsets(mapped);
    } catch (err) {
      console.error("Gagal mengambil data aset:", err);
    }
  };

  const handleAddAsetBaru = () => {
    setTimeout(() => {
      loadAsets();
    }, 600);
    setShowForm(false);
  };

  const handleEdit = (data) => {
    setEditingAset(data);
    setShowForm(true);
  };

  const handleUpdate = () => {
    setTimeout(() => {
      loadAsets();
    }, 600);
    setEditingAset(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus aset ini?")) return;
    try {
      await deleteAset(id);
      setAsets((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      alert("Gagal menghapus aset.");
      console.error("Gagal menghapus aset:", error);
    }
  };

  const filteredAsets = asets.filter((it) =>
    it.nama_aset.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    totalAset: asets.length,
    asetMasuk: asets.filter((a) => a.status === "In").length,
    totalNilai: asets.reduce((acc, cur) => acc + Number(cur.harga || 0), 0),
  };

  const handleExportCSV = () => {
    const headers = [
      "Nama Aset", "Kode Gudang", "Tipe",
      "Serial Number", "Harga", "Status", "Tanggal", "Deskripsi"
    ];

    const rows = filteredAsets.map((item) => [
      item.nama_aset,
      item.kode_gudang,
      item.tipe,
      item.serial_number,
      Number(item.harga).toLocaleString("id-ID"),
      item.status,
      item.tanggal,
      item.deskripsi,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((field) => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "data_aset.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          {/* Header & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">
                Daftar Aset Operasional
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola inventaris barang, spesifikasi unit, dan status penempatan.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <HiOutlineMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari aset..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-subtle transition-colors shrink-0"
              >
                <HiOutlineArrowDownTray className="w-4 h-4 text-slate-500" />
                Ekspor CSV
              </button>
              <button
                onClick={() => { setEditingAset(null); setShowForm(true); }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors shrink-0"
              >
                <HiOutlinePlus className="w-4 h-4" />
                Tambah Aset
              </button>
            </div>
          </div>

          {/* Statistik Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Aset
                </span>
                <div className="text-2xl font-bold font-display text-slate-900 mt-1">
                  {stats.totalAset}
                </div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <HiOutlineCube className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Aset Masuk (In)
                </span>
                <div className="text-2xl font-bold font-display text-emerald-600 mt-1">
                  {stats.asetMasuk}
                </div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <HiOutlineArrowDownTray className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Nilai Buku
                </span>
                <div className="text-2xl font-bold font-display text-slate-900 mt-1">
                  Rp {(stats.totalNilai / 1_000_000).toFixed(1)}M
                </div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <HiOutlineBanknotes className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Tabel Aset */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Cover</th>
                    <th className="py-3 px-4">Nama Aset</th>
                    <th className="py-3 px-4">Gudang</th>
                    <th className="py-3 px-4">Tipe</th>
                    <th className="py-3 px-4">Serial Number</th>
                    <th className="py-3 px-4">Harga Perolehan</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {filteredAsets.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        Tidak ada data aset ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredAsets.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          {item.gambar ? (
                            <button
                              type="button"
                              onClick={() => setPreviewModalImage({ url: item.gambar, title: item.nama_aset })}
                              className="group block relative w-11 h-11 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-zoom-in"
                              title="Klik untuk melihat foto"
                            >
                              <img
                                src={item.gambar}
                                alt={item.nama_aset}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  if (e.target.nextSibling) e.target.nextSibling.style.display = "flex";
                                }}
                              />
                              <div
                                style={{ display: "none" }}
                                className="w-full h-full bg-slate-100 items-center justify-center text-slate-400"
                              >
                                <HiOutlinePhoto className="w-5 h-5 text-slate-400" />
                              </div>
                            </button>
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                              <HiOutlinePhoto className="w-5 h-5 text-slate-400" />
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {item.nama_aset}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {item.kode_gudang}
                        </td>
                        <td className="py-3 px-4">{item.tipe}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">
                          {item.serial_number || "-"}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          Rp {Number(item.harga).toLocaleString("id-ID")}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={item.status}>{item.status}</Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-500">{item.tanggal}</td>
                        <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            onClick={() => setDetailAset(item)}
                            className="p-1 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100 transition-colors"
                            title="Detail"
                          >
                            <HiOutlineEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1 text-slate-500 hover:text-amber-600 rounded hover:bg-slate-100 transition-colors"
                            title="Edit"
                          >
                            <HiOutlinePencilSquare className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-slate-500 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors"
                            title="Hapus"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Detail */}
          {detailAset && (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md shadow-card space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-base text-slate-900">
                    Detail Spesifikasi Aset
                  </h3>
                  <button
                    onClick={() => setDetailAset(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <HiOutlineXMark className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Nama Aset</span>
                    <span className="font-semibold text-slate-900">{detailAset.nama_aset}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Kode Gudang</span>
                    <span className="font-mono text-slate-900">{detailAset.kode_gudang}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Tipe / Kategori</span>
                    <span className="text-slate-900">{detailAset.tipe}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Nomor Seri</span>
                    <span className="font-mono text-slate-900">{detailAset.serial_number || "-"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Harga Perolehan</span>
                    <span className="font-semibold text-slate-900">Rp {Number(detailAset.harga).toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Status Sirkulasi</span>
                    <Badge variant={detailAset.status}>{detailAset.status}</Badge>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-500">Tanggal Perolehan</span>
                    <span className="text-slate-900">{detailAset.tanggal}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-slate-500 block mb-1">Spesifikasi Unit:</span>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-700 leading-relaxed">
                      {detailAset.deskripsi || "Tidak ada rincian spesifikasi tambahan."}
                    </div>
                  </div>
                  {detailAset.gambar && (
                    <div className="pt-2">
                      <span className="text-slate-500 block mb-1">Foto Lampiran:</span>
                      <img
                        src={detailAset.gambar}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setDetailAset(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Modal Preview Foto Resolusi Penuh */}
          {previewModalImage && (
            <div
              className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setPreviewModalImage(null)}
            >
              <div
                className="bg-white border border-slate-200 rounded-xl overflow-hidden max-w-lg w-full shadow-card animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="font-semibold text-xs text-slate-800">
                    Foto: {previewModalImage.title}
                  </div>
                  <button
                    onClick={() => setPreviewModalImage(null)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
                  >
                    <HiOutlineXMark className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-3 bg-slate-100/50 flex items-center justify-center">
                  <img
                    src={previewModalImage.url}
                    alt={previewModalImage.title}
                    className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain shadow-sm"
                  />
                </div>
                <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setPreviewModalImage(null)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <FormTambahAset
          onSubmit={editingAset ? handleUpdate : handleAddAsetBaru}
          onCancel={() => { setShowForm(false); setEditingAset(null); }}
          defaultData={editingAset}
        />
      )}
    </div>
  );
};

export default Aset;
