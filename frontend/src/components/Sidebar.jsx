import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HiOutlineCube,
  HiOutlineSquares2X2,
  HiOutlineUsers,
  HiOutlineIdentification,
  HiOutlineBuildingOffice2,
  HiOutlineTag,
  HiOutlineArrowDownTray,
  HiOutlineArrowUpTray,
  HiOutlineDocumentChartBar,
} from 'react-icons/hi2';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  const menuItems = [
    { name: 'Dashboard', icon: HiOutlineSquares2X2, path: '/dashboard' },
    { name: 'Pegawai', icon: HiOutlineUsers, path: '/pegawai' },
    { name: 'Peminjam', icon: HiOutlineIdentification, path: '/peminjams' },
    { name: 'Gudang', icon: HiOutlineBuildingOffice2, path: '/gudang' },
    { name: 'Aset', icon: HiOutlineCube, path: '/aset' },
    { name: 'Kategori Aset', icon: HiOutlineTag, path: '/kategori-aset' },
  ];

  const transaksiItems = [
    { name: 'Aset Masuk', icon: HiOutlineArrowDownTray, path: '/aset-masuk' },
    { name: 'Aset Keluar', icon: HiOutlineArrowUpTray, path: '/aset-keluar' },
    { name: 'Laporan', icon: HiOutlineDocumentChartBar, path: '/laporan' },
  ];

  const renderLink = (item) => {
    const itemPath = item.path.toLowerCase();
    const isActive = currentPath === itemPath || currentPath.startsWith(itemPath + '/');
    const IconComponent = item.icon;

    return (
      <Link
        key={item.name}
        to={item.path}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors mb-1 ${
          isActive
            ? 'bg-blue-50 text-blue-700 font-semibold'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
        }`}
      >
        <IconComponent
          className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-500'}`}
        />
        <span>{item.name}</span>
      </Link>
    );
  };

  return (
    <aside className="w-[250px] shrink-0 bg-white border-r border-slate-200/90 flex flex-col h-screen font-sans select-none">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
          <HiOutlineCube className="w-5 h-5" />
        </div>
        <div className="overflow-hidden">
          <div className="font-display font-bold text-base text-slate-900 leading-tight">
            AssetPro
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Management System
          </div>
        </div>
      </div>

      {/* Nav Menu Items */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4">
        <div className="space-y-0.5">
          {menuItems.map((item) => renderLink(item))}
        </div>

        <div className="mt-6 mb-2 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Transaksi
        </div>

        <div className="space-y-0.5">
          {transaksiItems.map((item) => renderLink(item))}
        </div>
      </div>

      {/* Bottom version info */}
      <div className="px-5 py-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span>SIMAO v2.4</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Sistem Aktif" />
      </div>
    </aside>
  );
};

export default Sidebar;
