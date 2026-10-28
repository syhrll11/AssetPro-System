import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineCube,
  HiOutlineArrowPath,
  HiOutlineBuildingOffice2,
  HiOutlineDocumentChartBar,
  HiOutlineArrowRight,
  HiOutlineArrowLeft,
  HiOutlineShieldCheck,
  HiOutlineCheckCircle,
  HiOutlineCpuChip,
  HiOutlineServerStack,
  HiOutlineLockClosed,
  HiOutlineArrowDownTray,
  HiOutlineArrowUpTray,
  HiOutlineWrenchScrewdriver,
  HiOutlineDocumentText,
} from 'react-icons/hi2';

export default function LandingPage() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const [activeTab, setActiveTab] = useState('fitur'); // 'fitur' | 'tentang'
  const sliderRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      title: 'Inventaris & Kategori Aset',
      desc: 'Pencatatan spesifikasi teknis, nomor seri unik, nilai perolehan, dan pengelompokan jenis barang.',
      tag: 'Katalog Unit',
      icon: HiOutlineCube,
    },
    {
      title: 'Aset Masuk & Keluar',
      desc: 'Siklus sirkulasi aset operasional: peminjaman staf, jadwal perbaikan/service berkala, hingga berita acara (BAP).',
      tag: 'Sirkulasi Transaksi',
      icon: HiOutlineArrowPath,
    },
    {
      title: 'Multi-Gudang & Lokasi',
      desc: 'Pengelompokan aset berdasarkan cabang fasilitas gudang dengan koordinat GPS dan status ketersediaan.',
      tag: 'Distribusi Fasilitas',
      icon: HiOutlineBuildingOffice2,
    },
    {
      title: 'Laporan & Audit Ekspor',
      desc: 'Rekapitulasi status inventaris secara berkala yang dapat diekspor langsung ke format lembar kerja Excel & dokumen PDF.',
      tag: 'Pelaporan Resmi',
      icon: HiOutlineDocumentChartBar,
    },
  ];

  const handleScrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 scroll-smooth">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <HiOutlineCube className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-slate-900 tracking-tight">
                AssetPro
              </span>
              <span className="text-xs text-slate-500 font-medium ml-1.5 hidden sm:inline">
                System
              </span>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <button
              onClick={() => {
                setActiveTab('fitur');
                document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`text-sm font-medium transition-colors hidden md:inline ${
                activeTab === 'fitur' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fitur Utama
            </button>
            <button
              onClick={() => {
                setActiveTab('tentang');
                document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`text-sm font-medium transition-colors hidden md:inline ${
                activeTab === 'tentang' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tentang Sistem
            </button>
            <Link
              to={isLoggedIn ? '/dashboard' : '/login'}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors duration-150"
            >
              {isLoggedIn ? 'Buka Dashboard' : 'Masuk'}
              <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section Bersih Tanpa 3D */}
      <main className="flex-1">
        <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200/60 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Kolom Kiri: Value Proposition */}
              <motion.div
                className="lg:col-span-7 space-y-6"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium">
                  <HiOutlineShieldCheck className="w-4 h-4 text-blue-600" />
                  Sistem Informasi Manajemen Aset & Logistik (SIMAO)
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.15]">
                  Monitoring inventaris dan pelacakan sirkulasi aset operasional.
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                  Platform manajemen aset terpadu untuk mendata kepemilikan unit, mencatat pergerakan peminjaman staf, menjadwalkan perbaikan, dan mengelola multi-gudang secara terstruktur.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    to={isLoggedIn ? '/dashboard' : '/login'}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors"
                  >
                    {isLoggedIn ? 'Akses Dashboard' : 'Masuk ke Sistem'}
                    <HiOutlineArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => {
                      document.getElementById('explore-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-subtle transition-colors"
                  >
                    Eksplorasi Fitur & Tentang
                  </button>
                </div>

                <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200/80 text-left">
                  <div>
                    <div className="text-xl font-bold font-display text-slate-900">100%</div>
                    <div className="text-xs text-slate-500 mt-0.5">Audit Terlacak</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold font-display text-slate-900">Real-time</div>
                    <div className="text-xs text-slate-500 mt-0.5">Sirkulasi Unit</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold font-display text-slate-900">5 Gudang</div>
                    <div className="text-xs text-slate-500 mt-0.5">Terpusat & Sinkron</div>
                  </div>
                </div>
              </motion.div>

              {/* Kolom Kanan: Pratinjau Dashboard Bersih Enterprise (Bukan 3D) */}
              <motion.div
                className="lg:col-span-5"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
              >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-5 space-y-4">
                  {/* Status Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-semibold text-slate-800 font-display">
                        Sistem Aktif Terhubung
                      </span>
                    </div>
                  </div>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                      <div className="text-[11px] font-medium text-slate-500">Tersedia</div>
                      <div className="text-lg font-bold font-display text-emerald-600 mt-0.5">5 Unit</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                      <div className="text-[11px] font-medium text-slate-500">Dipinjam</div>
                      <div className="text-lg font-bold font-display text-blue-600 mt-0.5">2 Unit</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
                      <div className="text-[11px] font-medium text-slate-500">Service</div>
                      <div className="text-lg font-bold font-display text-amber-600 mt-0.5">1 Unit</div>
                    </div>
                  </div>

                  {/* Sample Live Table Stream */}
                  <div className="rounded-lg border border-slate-200/80 overflow-hidden text-xs">
                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-200/80 font-semibold text-slate-600 flex justify-between">
                      <span>Daftar Aset Terkini</span>
                      <span className="text-[11px] text-slate-400">Database Live</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      <div className="px-3 py-2.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
                        <div>
                          <div className="font-semibold text-slate-800">Laptop Lenovo ThinkPad</div>
                          <div className="text-[11px] text-slate-400 font-mono">SN-LEN123456 • GD01</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          In
                        </span>
                      </div>
                      <div className="px-3 py-2.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
                        <div>
                          <div className="font-semibold text-slate-800">Mobil Pickup Gran Max</div>
                          <div className="text-[11px] text-slate-400 font-mono">SN-VEH778899 • GD03</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          Out
                        </span>
                      </div>
                      <div className="px-3 py-2.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors">
                        <div>
                          <div className="font-semibold text-slate-800">Printer Epson L3150</div>
                          <div className="text-[11px] text-slate-400 font-mono">SN-PRT098765 • GD01</div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Service
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs text-slate-400">
                    <span>Otorisasi Sanctum Token</span>
                    <span>Role: Admin, Manager, User</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section yang Bisa Digeser / Switch Antara Fitur & Tentang */}
        <section id="explore-section" className="py-16 md:py-24 bg-white border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Bagian Bawah dengan Tab Switcher Geser */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Eksplorasi Sistem
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight mt-1.5">
                  {activeTab === 'fitur'
                    ? 'Fitur Terintegrasi AssetPro'
                    : 'Tentang Arsitektur AssetPro'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {activeTab === 'fitur'
                    ? 'Geser kartu fitur di bawah ini atau beralih ke informasi tentang sistem.'
                    : 'Prinsip tata kelola data aset, keamanan otorisasi, dan efisiensi operasional.'}
                </p>
              </div>

              {/* Segmented Tab Slider Control (Bisa Digeser / Diklik) */}
              <div className="flex items-center gap-3">
                <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 self-start md:self-auto">
                  <button
                    onClick={() => setActiveTab('fitur')}
                    className={`relative px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      activeTab === 'fitur'
                        ? 'bg-white text-blue-700 shadow-subtle'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Fitur Utama
                  </button>
                  <button
                    onClick={() => setActiveTab('tentang')}
                    className={`relative px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      activeTab === 'tentang'
                        ? 'bg-white text-blue-700 shadow-subtle'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Tentang Sistem
                  </button>
                </div>

                {/* Tombol Geser Panah Khusus Tab Fitur */}
                {activeTab === 'fitur' && (
                  <div className="hidden sm:flex items-center gap-1.5">
                    <button
                      onClick={() => handleScrollSlider('left')}
                      className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors shadow-subtle"
                      title="Geser ke kiri"
                    >
                      <HiOutlineArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleScrollSlider('right')}
                      className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-colors shadow-subtle"
                      title="Geser ke kanan"
                    >
                      <HiOutlineArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Konten Geser: Fitur vs Tentang */}
            <AnimatePresence mode="wait">
              {activeTab === 'fitur' ? (
                <motion.div
                  key="fitur"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Slider Kartu Fitur yang Bisa Digeser (Horizontal Scroll / Swipe) */}
                  <div
                    ref={sliderRef}
                    className="flex gap-6 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory focus:outline-none"
                    style={{ scrollbarWidth: 'thin' }}
                  >
                    {features.map((item, idx) => {
                      const IconComponent = item.icon;
                      return (
                        <div
                          key={idx}
                          className="min-w-[280px] sm:min-w-[320px] max-w-[340px] shrink-0 snap-start bg-slate-50 border border-slate-200/80 rounded-xl p-6 hover:border-slate-300 hover:bg-slate-50/80 transition-all flex flex-col justify-between shadow-subtle"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-subtle">
                                <IconComponent className="w-5 h-5 text-blue-600" />
                              </div>
                              <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200/80">
                                {item.tag}
                              </span>
                            </div>

                            <h3 className="text-base font-bold font-display text-slate-900">
                              {item.title}
                            </h3>

                            <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>

                          <div className="pt-6 mt-4 border-t border-slate-200/70 flex items-center justify-between text-xs font-semibold text-blue-600">
                            <span>Tersedia di Dashboard</span>
                            <HiOutlineCheckCircle className="w-4 h-4 text-emerald-600" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-400 sm:hidden">
                    <span>← Geser layar ke kiri atau kanan →</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="tentang"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 shadow-subtle">
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 mb-4 shadow-subtle">
                        <HiOutlineServerStack className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-base font-bold font-display text-slate-900">
                        Penyimpanan Data Terpusat
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Data aset, mutasi sirkulasi, dan data karyawan tersimpan dalam database relasional yang terintegrasi di seluruh unit gudang operasional.
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 shadow-subtle">
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 mb-4 shadow-subtle">
                        <HiOutlineLockClosed className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-base font-bold font-display text-slate-900">
                        Otorisasi Berbasis Peran
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Hak akses terbagi rapi antara Administrator (kontrol penuh & mutasi), Manager (monitoring laporan), dan Staf peminjam.
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-6 shadow-subtle">
                      <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-blue-600 mb-4 shadow-subtle">
                        <HiOutlineCpuChip className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-base font-bold font-display text-slate-900">
                        Akurasi Siklus Inventaris
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Mencegah kehilangan unit operasional dan mencatat riwayat pemeliharaan secara digital tanpa berkas formulir fisik yang berceceran.
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50/70 border border-blue-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold font-display text-blue-900">
                        Dikembangkan untuk Keperluan Internal Perusahaan
                      </h4>
                      <p className="text-xs text-blue-700 mt-0.5">
                        Sistem Informasi Manajemen Aset Operasional (SIMAO) siap digunakan dengan kredensial staf yang aktif.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('fitur')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-700 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors shrink-0"
                    >
                      Kembali ke Fitur
                      <HiOutlineArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* CTA Bar */}
        <section className="py-14 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-slate-200 rounded-xl p-8 md:p-10 shadow-subtle flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold font-display text-slate-900">
                  Mulai Akses AssetPro System
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Gunakan kredensial akun staf internal yang telah terdaftar di database.
                </p>
              </div>
              <Link
                to={isLoggedIn ? '/dashboard' : '/login'}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
              >
                {isLoggedIn ? 'Masuk ke Dashboard' : 'Buka Halaman Login'}
                <HiOutlineArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} AssetPro System. Seluruh hak cipta dilindungi.</p>
          <p className="text-slate-400">Sistem Informasi Manajemen Aset Operasional</p>
        </div>
      </footer>
    </div>
  );
}
