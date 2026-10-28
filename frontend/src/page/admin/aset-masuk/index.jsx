import React, { useEffect, useState } from "react";
import { getAsetMasuk } from "../../../_services/asetMasuk";
import { getPeminjam } from "../../../_services/peminjam";
import Select from "react-select";
import { createTrxAsetIn } from "../../../_services/trxAset";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlineCheck,
} from "react-icons/hi2";

export default function AsetMasuk() {
  const [asets, setAsets] = useState([]);
  const [peminjamOptions, setPeminjamOptions] = useState([]);
  const [selectedTipe, setSelectedTipe] = useState("");
  const [searchSerial, setSearchSerial] = useState("");
  const [selectedAset, setSelectedAset] = useState(null);
  const [selectedPeminjam, setSelectedPeminjam] = useState(null);
  const [selectedLokasi, setSelectedLokasi] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPurpose, setModalPurpose] = useState("");

  const userRole = localStorage.getItem("role") || "";
  const isAdmin = userRole.toLowerCase() === "admin";

  const itemsPerPage = 5;

  const lokasiOptions = [
    { value: "office", label: "Office (Kantor)" },
    { value: "operational", label: "Operational (Operasional)" },
    { value: "vum", label: "VUM" },
    { value: "logistik", label: "Logistik Gudang" },
  ];

  useEffect(() => {
    fetchAset();
    fetchPeminjam();
  }, []);

  const fetchAset = async () => {
    try {
      const data = await getAsetMasuk();
      setAsets(data);
    } catch (error) {
      console.error("Gagal ambil data aset:", error);
    }
  };

  const [loadingTrx, setLoadingTrx] = useState(false);

  const fetchPeminjam = async () => {
    try {
      const resData = await getPeminjam();
      const list = Array.isArray(resData) ? resData : (resData?.data || []);
      const options = list.map((item) => ({
        value: item.id_peminjam,
        label: `(${item.nik_karyawan || item.nik_user || "-"}) ${item.nama_karyawan || item.nama_user || "-"}`,
      }));
      setPeminjamOptions(options);
    } catch (error) {
      console.error("Gagal ambil data peminjam:", error);
    }
  };

  const filteredAsets = asets.filter((item) => {
    const matchesTipe = selectedTipe ? item.tipe_aset === selectedTipe : true;
    const matchesSerial = item.serial_number
      .toLowerCase()
      .includes(searchSerial.toLowerCase());
    return matchesTipe && matchesSerial;
  });

  const uniqueTypes = [...new Set(asets.map((item) => item.tipe_aset))];
  const totalPages = Math.ceil(filteredAsets.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentData = filteredAsets.slice(startIdx, startIdx + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleOpenModal = (aset, purpose) => {
    setSelectedAset(aset);
    setModalPurpose(purpose);
  };

  const handleCloseModal = () => {
    setSelectedAset(null);
    setSelectedPeminjam(null);
    setSelectedLokasi("");
    setModalPurpose("");
  };

  const handleSubmitTrx = async (status) => {
    if (!selectedAset || !selectedPeminjam || !selectedLokasi) {
      alert("Silakan pilih karyawan peminjam dan tujuan lokasi penempatan terlebih dahulu.");
      return;
    }

    const payload = {
      kd_cabang: selectedAset.kd_gudang || "GD01",
      name_asset: selectedAset.name_asets || selectedAset.nama_aset,
      tipe_asset: selectedAset.tipe_aset || selectedAset.tipe || "Umum",
      serial_number: selectedAset.serial_number || "-",
      kd_aktiva: selectedAset.kd_aktiva || "-",
      lokasi: selectedLokasi,
      id_peminjam: selectedPeminjam.value,
      id_asets: selectedAset.id_asets || selectedAset.id,
      trx_status: status === "pinjam" ? "out" : status,
    };

    setLoadingTrx(true);
    try {
      await createTrxAsetIn(payload);
      alert(`Transaksi sirkulasi (${status.toUpperCase()}) untuk unit "${selectedAset.name_asets}" berhasil diproses.`);
      handleCloseModal();
      fetchAset();
    } catch (error) {
      console.error("Error simpan transaksi:", error);
      if (error.response?.status === 403) {
        alert("Akses Ditolak (403): Hanya akun dengan role 'admin' yang dapat melakukan sirkulasi aset. Silakan gunakan akun Admin.");
      } else {
        const msg = error.response?.data?.message || (typeof error.response?.data === "string" ? error.response.data : JSON.stringify(error.response?.data || error.message));
        alert("Gagal simpan transaksi: " + msg);
      }
    } finally {
      setLoadingTrx(false);
    }
  };

  const customSelectStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: '8px',
      fontSize: '12px',
      minHeight: '36px',
      borderColor: state.isFocused ? '#2563eb' : '#cbd5e1',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(37,99,235,0.2)' : 'none',
      '&:hover': { borderColor: '#94a3b8' },
    }),
    option: (base, state) => ({
      ...base,
      fontSize: '12px',
      backgroundColor: state.isSelected ? '#2563eb' : state.isFocused ? '#eff6ff' : '#ffffff',
      color: state.isSelected ? '#ffffff' : '#0f172a',
    }),
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">
            Aset Masuk (Tersedia)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar unit aset yang siap disirkulasikan (dipinjamkan, service, atau BAP).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="w-48">
            <Select
              options={[{ value: "", label: "Semua Tipe Aset" }, ...uniqueTypes.map((tipe) => ({ value: tipe, label: tipe }))]}
              value={selectedTipe ? { value: selectedTipe, label: selectedTipe } : { value: "", label: "Semua Tipe Aset" }}
              onChange={(selected) => setSelectedTipe(selected.value)}
              placeholder="Pilih Tipe Aset"
              styles={customSelectStyles}
            />
          </div>

          <div className="relative flex-1 sm:w-56">
            <HiOutlineMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari Serial Number..."
              value={searchSerial}
              onChange={(e) => setSearchSerial(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      {/* Tabel Aset */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">No.</th>
                <th className="py-3 px-4">Nama Aset</th>
                <th className="py-3 px-4">Tipe Aset</th>
                <th className="py-3 px-4">Serial Number</th>
                <th className="py-3 px-4">Kode Gudang</th>
                <th className="py-3 px-4">Tanggal Perolehan</th>
                <th className="py-3 px-4 text-right">Aksi Sirkulasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada data aset tersedia.
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr key={item.id_asets} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {startIdx + index + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {item.name_asets}
                    </td>
                    <td className="py-3 px-4">{item.tipe_aset}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {item.serial_number}
                    </td>
                    <td className="py-3 px-4 font-mono text-blue-600 font-semibold">
                      {item.kd_gudang}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {item.tanggal_perolehan}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => handleOpenModal(item, "pinjam")}
                            className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded transition-colors"
                          >
                            Pinjam
                          </button>
                          <button
                            onClick={() => handleOpenModal(item, "service")}
                            className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded transition-colors"
                          >
                            Service
                          </button>
                          <button
                            onClick={() => handleOpenModal(item, "bap")}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 rounded transition-colors"
                          >
                            BAP
                          </button>
                        </>
                      ) : (
                        <span className="px-2.5 py-1 text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-200/60 rounded">
                          Monitoring
                        </span>
                      )}
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
            Menampilkan {startIdx + 1}–{Math.min(startIdx + itemsPerPage, filteredAsets.length)} dari {filteredAsets.length} unit
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

      {/* Modal Dialog Form */}
      {selectedAset && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md shadow-card space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-display font-bold text-base text-slate-900 uppercase">
                Proses Sirkulasi: {modalPurpose}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-1">
              <div>
                <span className="text-slate-500">Nama Unit: </span>
                <span className="font-semibold text-slate-900">{selectedAset.name_asets}</span>
              </div>
              <div>
                <span className="text-slate-500">Nomor Seri: </span>
                <span className="font-mono text-slate-900">{selectedAset.serial_number}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pilih Karyawan Peminjam <span className="text-rose-500">*</span>
                </label>
                <Select
                  options={peminjamOptions}
                  value={selectedPeminjam}
                  onChange={(val) => setSelectedPeminjam(val)}
                  placeholder="Ketik nama atau NIK peminjam..."
                  styles={customSelectStyles}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tujuan Lokasi Penempatan <span className="text-rose-500">*</span>
                </label>
                <Select
                  options={lokasiOptions}
                  value={lokasiOptions.find((opt) => opt.value === selectedLokasi)}
                  onChange={(val) => setSelectedLokasi(val.value)}
                  placeholder="Pilih lokasi penempatan..."
                  styles={customSelectStyles}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={loadingTrx}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleSubmitTrx(modalPurpose)}
                disabled={loadingTrx || !selectedPeminjam || !selectedLokasi}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiOutlineCheck className="w-4 h-4" />
                {loadingTrx ? "Memproses..." : "Konfirmasi Transaksi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
