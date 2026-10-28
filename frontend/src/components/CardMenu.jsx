import React from 'react';
import {
  HiOutlineArrowUpTray,
  HiOutlineCube,
  HiOutlineWrenchScrewdriver,
  HiOutlineCheckCircle,
  HiOutlineDocumentText,
} from 'react-icons/hi2';

const CardMenu = ({ data }) => {
  const statusAset = data?.status_aset || {};
  const proporsi = data?.proporsi_dipinjam || {};

  // Hitung nilai masing-masing status dengan fallback yang presisi
  const dipinjamVal = statusAset.out ?? proporsi.dipinjam ?? statusAset.dipinjam ?? 0;
  const tersediaVal = statusAset.in ?? proporsi.tersedia ?? statusAset.tersedia ?? 0;
  const serviceVal = statusAset.service ?? statusAset.rusak ?? 0;
  const bapVal = statusAset.BAP ?? statusAset.bap ?? 0;

  // Total seluruh unit aset
  const totalAsetVal =
    data?.aset_keseluruhan ??
    Object.values(statusAset).reduce((acc, cur) => acc + (Number(cur) || 0), 0);

  const menuItems = [
    {
      title: 'Aset Tersedia',
      value: tersediaVal,
      icon: HiOutlineCheckCircle,
      textCol: 'text-emerald-600',
    },
    {
      title: 'Dipinjam',
      value: dipinjamVal,
      icon: HiOutlineArrowUpTray,
      textCol: 'text-blue-600',
    },
    {
      title: 'Service',
      value: serviceVal,
      icon: HiOutlineWrenchScrewdriver,
      textCol: 'text-amber-600',
    },
    {
      title: 'BAP',
      value: bapVal,
      icon: HiOutlineDocumentText,
      textCol: 'text-slate-700',
    },
    {
      title: 'Total Aset',
      value: totalAsetVal,
      icon: HiOutlineCube,
      textCol: 'text-slate-900',
    },
  ];

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
      {menuItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div
            key={index}
            className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-subtle hover:border-slate-300 transition-colors flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {item.title}
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-center text-slate-600">
                <IconComponent className="w-4 h-4 text-slate-600" />
              </div>
            </div>
            <div className={`text-2xl font-bold font-display mt-2 ${item.textCol || 'text-slate-900'}`}>
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardMenu;
