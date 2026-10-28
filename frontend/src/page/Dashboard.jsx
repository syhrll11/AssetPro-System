import React, { useEffect, useState } from 'react';
import API from '../_api';
import CardMenu from '../components/CardMenu';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get('/dashboard')
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error('Gagal mengambil data dashboard:', error);
      });
  }, []);

  const formatStatusLabel = (key) => {
    const map = {
      in: 'Tersedia (In)',
      out: 'Dipinjam (Out)',
      service: 'Service (Perbaikan)',
      bap: 'Berita Acara (BAP)',
      BAP: 'Berita Acara (BAP)',
    };
    return map[key] || key;
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-medium">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div>
        <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight">
          Ringkasan Inventaris
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Monitoring status sirkulasi dan kondisi aset operasional terkini.
        </p>
      </div>

      {/* Cards Statistik */}
      <CardMenu data={data} />

      {/* Row 1: Status & Proporsi Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle">
          <div className="mb-4">
            <h2 className="text-sm font-bold font-display text-slate-800">
              Status Aset Keseluruhan
            </h2>
            <p className="text-xs text-slate-500">
              Komposisi kondisi aset (tersedia, dipinjam, service, dsb)
            </p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <PieChart
              data={Object.entries(data.status_aset || {}).map(([label, value]) => ({
                label: formatStatusLabel(label),
                value,
              }))}
            />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle">
          <div className="mb-4">
            <h2 className="text-sm font-bold font-display text-slate-800">
              Proporsi Aset Dipinjam
            </h2>
            <p className="text-xs text-slate-500">
              Perbandingan aset aktif digunakan karyawan vs tersedia di gudang
            </p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <PieChart
              data={[
                { label: 'Dipinjam', value: data.proporsi_dipinjam.dipinjam },
                { label: 'Tersedia', value: data.proporsi_dipinjam.tersedia },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Distribusi Kerusakan & Tren Bulanan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle">
          <div className="mb-4">
            <h2 className="text-sm font-bold font-display text-slate-800">
              Distribusi Kerusakan Aset per Kategori
            </h2>
            <p className="text-xs text-slate-500">
              Jumlah unit aset yang mengalami kendala per kelompok barang
            </p>
          </div>
          <div className="h-64">
            <BarChart data={data.kerusakan_per_kategori} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-subtle">
          <div className="mb-4">
            <h2 className="text-sm font-bold font-display text-slate-800">
              Tren Kerusakan Aset Bulanan
            </h2>
            <p className="text-xs text-slate-500">
              Histori frekuensi perbaikan unit operasional sepanjang tahun berjalan
            </p>
          </div>
          <div className="h-64">
            <LineChart data={data.tren_bulanan} />
          </div>
        </div>
      </div>
    </div>
  );
}
