import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGudang, deleteGudang } from '../_services/gudang';
import Badge from '../components/ui/Badge';
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineBuildingOffice2,
  HiOutlineCheckCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
} from 'react-icons/hi2';

export default function MainGudang() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await getGudang();
      setData(result);
    } catch (err) {
      console.error("Gagal memuat data gudang:", err);
      alert("Gagal memuat data gudang (mungkin belum login atau akses ditolak)");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-gudang/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus gudang ini?")) return;
    try {
      await deleteGudang(id);
      alert("Gudang berhasil dihapus");
      setData(prev => prev.filter(item => item.id_gudang !== id));
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus gudang");
    }
  };

  const filtered = data.filter(item =>
    item.nama_gudang.toLowerCase().includes(search.toLowerCase()) ||
    item.kd_gudang.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">
            Data Gudang & Fasilitas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar lokasi gudang penyimpanan unit aset dan koordinat operasional.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <HiOutlineMagnifyingGlass className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari gudang atau kode..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <button
            onClick={() => navigate('/tambah-gudang')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors shrink-0"
          >
            <HiOutlinePlus className="w-4 h-4" />
            Tambah Gudang
          </button>
        </div>
      </div>

      {/* Card Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Gudang
            </span>
            <div className="text-2xl font-bold font-display text-slate-900 mt-1">
              {data.length}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <HiOutlineBuildingOffice2 className="w-5 h-5 text-blue-600" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Gudang Aktif
            </span>
            <div className="text-2xl font-bold font-display text-emerald-600 mt-1">
              {data.length}
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <HiOutlineCheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Tabel Gudang */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-subtle overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold font-display text-slate-800">
            Daftar Lokasi Gudang
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Kode Gudang</th>
                <th className="py-3 px-4">Nama Gudang</th>
                <th className="py-3 px-4">Alamat Fasilitas</th>
                <th className="py-3 px-4">Koordinat GPS</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Terdaftar</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada data gudang ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((g, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-blue-600">
                      {g.kd_gudang}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {g.nama_gudang}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                      {g.alamat_gudang}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <HiOutlineMapPin className="w-3.5 h-3.5 text-slate-400" />
                        {g.koordinat || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={g.status || 'aktif'}>
                        {g.status || 'Aktif'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatDate(g.created_at)}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(g.id_gudang)}
                        className="p-1 text-slate-500 hover:text-amber-600 rounded hover:bg-slate-100 transition-colors"
                        title="Edit Gudang"
                      >
                        <HiOutlinePencilSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(g.id_gudang)}
                        className="p-1 text-slate-500 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors"
                        title="Hapus Gudang"
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
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
