import React, { useState, useEffect } from 'react';
import 'jspdf-autotable';
import { fetchLaporanGrouped, exportToExcel, exportToPDF } from '../_services/laporan';
import Badge from '../components/ui/Badge';
import {
  HiOutlineCube,
  HiOutlineArrowDownTray,
  HiOutlineArrowUpTray,
  HiOutlineWrenchScrewdriver,
  HiOutlineDocumentText,
  HiOutlineDocumentArrowDown,
} from 'react-icons/hi2';

const Laporan = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({ in: 0, out: 0, service: 0, BAP: 0 });
  const [status, setStatus] = useState('in');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchLaporanGrouped()
      .then((res) => {
        const targetKey = status.toLowerCase() === 'bap' ? 'BAP' : status;
        setData(res.data[targetKey] || res.data[status] || []);
        if (res.total) setTotal(res.total);
      })
      .catch((err) => {
        console.error("Gagal memuat laporan:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [status]);

  const statItems = [
    { title: 'Total Sirkulasi', value: total.in + total.out + total.service + total.BAP, icon: HiOutlineCube },
    { title: 'Aset Masuk (In)', value: total.in, icon: HiOutlineArrowDownTray, textCol: 'text-emerald-600' },
    { title: 'Aset Keluar (Out)', value: total.out, icon: HiOutlineArrowUpTray, textCol: 'text-blue-600' },
    { title: 'Service', value: total.service, icon: HiOutlineWrenchScrewdriver, textCol: 'text-amber-600' },
    { title: 'BAP', value: total.BAP, icon: HiOutlineDocumentText, textCol: 'text-slate-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">
            Laporan Sirkulasi Aset
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Rekapitulasi transaksi aset operasional berdasarkan kategori status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500">Filter:</label>
            <select
              className="px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="in">Status: IN (Masuk)</option>
              <option value="out">Status: OUT (Dipinjam)</option>
              <option value="service">Status: SERVICE (Perbaikan)</option>
              <option value="BAP">Status: BAP (Berita Acara)</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => exportToExcel(data, status)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-subtle transition-colors"
            >
              <HiOutlineDocumentArrowDown className="w-4 h-4 text-emerald-600" />
              Ekspor Excel
            </button>
            <button
              onClick={() => exportToPDF(data, status)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-subtle transition-colors"
            >
              <HiOutlineDocumentArrowDown className="w-4 h-4 text-rose-600" />
              Ekspor PDF
            </button>
          </div>
        </div>
      </div>

      {/* Grid 5 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statItems.map((st, i) => {
          const IconComp = st.icon;
          return (
            <div
              key={i}
              className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  {st.title}
                </span>
                <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-center text-slate-500">
                  <IconComp className="w-4 h-4" />
                </div>
              </div>
              <div className={`text-2xl font-bold font-display mt-2 ${st.textCol || 'text-slate-900'}`}>
                {st.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabel Data Laporan */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-subtle overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold font-display text-slate-800">
            Daftar Aset Status: <span className="uppercase text-blue-600">{status}</span>
          </h2>
          <span className="text-xs text-slate-500">{data.length} transaksi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Nama Aset</th>
                <th className="py-3 px-4">Kode Gudang</th>
                <th className="py-3 px-4">Tipe Aset</th>
                <th className="py-3 px-4">Nomor Seri</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tanggal Keluar / Transaksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Memuat data sirkulasi aset...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Tidak ada catatan transaksi untuk kategori ini.
                  </td>
                </tr>
              ) : (
                data.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{item.name_asset}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{item.kd_cabang}</td>
                    <td className="py-3 px-4">{item.tipe_asset}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{item.serial_number || '-'}</td>
                    <td className="py-3 px-4">
                      <Badge variant={item.trx_status}>
                        {item.trx_status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {item.tanggal_keluar?.split('T')[0] || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Laporan;
