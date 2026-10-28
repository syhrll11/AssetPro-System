import React from 'react';

const variantClasses = {
  in: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  tersedia: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  aktif: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  out: 'bg-blue-50 text-blue-700 border-blue-200',
  dipinjam: 'bg-blue-50 text-blue-700 border-blue-200',
  pinjam: 'bg-blue-50 text-blue-700 border-blue-200',
  service: 'bg-amber-50 text-amber-700 border-amber-200',
  rusak: 'bg-amber-50 text-amber-700 border-amber-200',
  bap: 'bg-rose-50 text-rose-700 border-rose-200',
  admin: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  manager: 'bg-purple-50 text-purple-700 border-purple-200',
  user: 'bg-slate-100 text-slate-700 border-slate-200',
  default: 'bg-slate-50 text-slate-600 border-slate-200',
};

export default function Badge({ children, variant, className = '' }) {
  const key = String(variant || children || '').toLowerCase().trim();
  const matched = variantClasses[key] || variantClasses.default;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${matched} ${className}`}
    >
      {children}
    </span>
  );
}
