import React from 'react';

export default function StatCard({ title, value, icon: Icon, description, trend, className = '' }) {
  return (
    <div
      className={`bg-white border border-slate-200/90 rounded-lg p-4 shadow-subtle flex flex-col justify-between transition-all duration-150 hover:border-slate-300 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
            <Icon className="w-4 h-4 text-slate-600" />
          </div>
        )}
      </div>

      <div className="mt-2">
        <div className="text-2xl font-bold text-slate-900 tracking-tight font-display">
          {value}
        </div>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        )}
      </div>
    </div>
  );
}
