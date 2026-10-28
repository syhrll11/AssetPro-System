import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  HiOutlineBuildingOffice2,
  HiOutlineMapPin,
  HiOutlineArrowPath,
  HiOutlineCheck,
  HiOutlineArrowLeft,
} from 'react-icons/hi2';

export default function TambahGudang() {
  const { id } = useParams();
  const isEdit = Boolean(id && id !== 'undefined');
  const navigate = useNavigate();

  const [form, setForm] = useState({
    kd_gudang: '',
    nama_gudang: '',
    alamat_gudang: '',
    koordinat: '',
    status: 'Aktif',
  });

  useEffect(() => {
    if (isEdit) {
      fetch(`http://127.0.0.1:8000/api/gudang/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.kd_gudang) {
            setForm(data);
          } else if (data.data) {
            setForm(data.data);
          } else {
            console.warn('Format data tidak dikenali:', data);
          }
        })
        .catch((err) => {
          console.error('Gagal fetch gudang:', err);
          alert('Data tidak ditemukan');
        });
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/gudang${isEdit ? `/${id}` : ''}`, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Gagal menyimpan gudang');

      alert(isEdit ? 'Gudang berhasil diupdate' : 'Gudang berhasil ditambahkan');
      navigate('/gudang');
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan data');
    }
  };

  const handleReset = () => {
    setForm({
      kd_gudang: '',
      nama_gudang: '',
      alamat_gudang: '',
      koordinat: '',
      status: 'Aktif',
    });
  };

  const handleDetectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setForm((prev) => ({ ...prev, koordinat: `${latitude}, ${longitude}` }));
      },
      (err) => {
        console.error('Gagal mendapatkan lokasi:', err);
        alert('Tidak dapat mendeteksi lokasi');
      }
    );
  };

  return (
    <div className="max-w-2xl space-y-4">
      <div>
        <Link
          to="/gudang"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <HiOutlineArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Daftar Gudang
        </Link>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-subtle">
        <div className="mb-6 border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
              <HiOutlineBuildingOffice2 className="w-5 h-5 text-blue-600" />
              {isEdit ? 'Edit Data Gudang' : 'Form Tambah Gudang'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Lengkapi data berikut untuk {isEdit ? 'mengedit' : 'mendaftarkan'} fasilitas penyimpanan.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kode Gudang <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="kd_gudang"
              value={form.kd_gudang}
              onChange={handleChange}
              placeholder="Contoh: GD01"
              required
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Gudang <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="nama_gudang"
              value={form.nama_gudang}
              onChange={handleChange}
              placeholder="Contoh: Gudang Utama Logistik"
              required
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alamat Lengkap <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="alamat_gudang"
              value={form.alamat_gudang}
              onChange={handleChange}
              rows={3}
              placeholder="Alamat jalan, kelurahan, kecamatan..."
              required
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Titik Koordinat (GPS)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                name="koordinat"
                value={form.koordinat}
                onChange={handleChange}
                placeholder="Contoh: -6.200000, 106.816666"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 font-mono placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                onClick={handleDetectLocation}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-subtle transition-colors shrink-0"
              >
                <HiOutlineMapPin className="w-4 h-4 text-slate-500" />
                Deteksi GPS
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Status Gudang
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Aktif">Aktif</option>
              <option value="Nonaktif">Nonaktif</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
            >
              <HiOutlineArrowPath className="w-3.5 h-3.5 text-slate-400" />
              Reset
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors"
            >
              <HiOutlineCheck className="w-4 h-4" />
              {isEdit ? 'Perbarui Gudang' : 'Simpan Gudang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
