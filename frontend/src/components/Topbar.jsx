import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineBell,
  HiOutlineArrowRightOnRectangle,
  HiOutlineUserCircle,
} from 'react-icons/hi2';

const Topbar = () => {
  const navigate = useNavigate();

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch (e) {
    user = null;
  }

  const role = localStorage.getItem('role') || user?.role || 'Staff';
  const displayName = user?.nama_karyawan || 'Pengguna Sistem';

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <header className="w-full h-16 bg-white border-b border-slate-200/90 px-6 flex items-center justify-between select-none shrink-0 z-30">
      {/* Kiri: Title Context / Breadcrumb minimalis */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Workspace
        </span>
        <span className="text-slate-300">/</span>
        <span className="text-xs font-medium text-slate-700">
          Operasional Gudang
        </span>
      </div>

      {/* Kanan: Notifikasi + User Profile + Logout */}
      <div className="flex items-center gap-4">
        {/* Notifikasi Bell */}
        <button
          type="button"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Notifikasi"
        >
          <HiOutlineBell className="w-4 h-4" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* User Card */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
            <HiOutlineUserCircle className="w-6 h-6 text-slate-500" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-slate-900 leading-tight">
              {displayName}
            </div>
            <div className="text-[11px] text-slate-500 capitalize">
              {role}
            </div>
          </div>
        </div>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 transition-colors ml-2"
          title="Keluar dari sistem"
        >
          <HiOutlineArrowRightOnRectangle className="w-4 h-4 text-rose-600" />
          <span className="hidden sm:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
