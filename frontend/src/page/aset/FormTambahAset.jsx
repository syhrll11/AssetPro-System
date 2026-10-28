import React, { useState, useEffect, useRef } from "react";
import { fetchKategoriAset, fetchGudang, createAset, updateAset } from "../../_services/asetService";
import {
  HiOutlinePhoto,
  HiOutlineXMark,
  HiOutlineCheck,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

const FormTambahAset = ({ onCancel, onSubmit, currentUserId, defaultData }) => {
  const getActiveUserId = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      return user?.id_user || currentUserId || 1;
    } catch {
      return currentUserId || 1;
    }
  };

  const [formData, setFormData] = useState({
    name_asets: "",
    tanggal_perolehan: "",
    kd_gudang: "",
    id_kat_aset: "",
    serial_number: "",
    harga: "",
    spec: "",
    id_user: getActiveUserId(),
    cover_photo: null,
    inout_aset: "",
  });

  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [gudangOptions, setGudangOptions] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const parseRawHarga = (val) => {
    if (val === undefined || val === null || val === "") return "";
    if (typeof val === "number") {
      return Math.round(val);
    }
    const str = String(val).trim();
    if (/^\d+\.\d+$/.test(str)) {
      return Math.round(parseFloat(str));
    }
    const digits = str.replace(/\D/g, "");
    return digits ? parseInt(digits, 10) : 0;
  };

  useEffect(() => {
    loadKategoriAset();
    loadGudang();

    if (defaultData) {
      const parsedNum = parseRawHarga(defaultData.harga);
      const formattedPrice = parsedNum !== "" && !isNaN(parsedNum) && parsedNum > 0
        ? parsedNum.toLocaleString("id-ID")
        : "";

      let rawStatus = (defaultData.inout_aset || defaultData.status || "").toString();
      if (rawStatus.toUpperCase() === "BAP") {
        rawStatus = "BAP";
      } else {
        rawStatus = rawStatus.toLowerCase();
      }

      let localUser = null;
      try {
        localUser = JSON.parse(localStorage.getItem("user") || "null");
      } catch (e) {
        localUser = null;
      }
      const activeUser = defaultData.id_user || localUser?.id_user || currentUserId || 1;

      setFormData({
        name_asets: defaultData.name_asets || defaultData.nama_aset || "",
        tanggal_perolehan: defaultData.tanggal_perolehan || defaultData.tanggal || "",
        kd_gudang: defaultData.kd_gudang || defaultData.kode_gudang || "",
        id_kat_aset: (defaultData.id_kat_aset !== undefined && defaultData.id_kat_aset !== null) ? defaultData.id_kat_aset.toString() : "",
        serial_number: defaultData.serial_number || "",
        harga: formattedPrice,
        spec: defaultData.spec || (defaultData.deskripsi !== "-" ? defaultData.deskripsi : "") || "",
        id_user: activeUser,
        cover_photo: null,
        inout_aset: rawStatus,
      });

      if (defaultData.gambar) {
        setPreviewImage(defaultData.gambar);
      }
    }
  }, [defaultData]);

  const loadKategoriAset = async () => {
    try {
      const data = await fetchKategoriAset();
      const list = Array.isArray(data) ? data : (data?.data || []);
      const seen = new Set();
      const options = [];
      list.forEach((item) => {
        const nameKey = item.kat_aset?.trim().toLowerCase();
        if (nameKey && !seen.has(nameKey)) {
          seen.add(nameKey);
          options.push({ value: item.id_kat_aset?.toString(), label: item.kat_aset });
        }
      });
      setKategoriOptions([{ value: "", label: "-- Pilih Kategori --" }, ...options]);
    } catch (error) {
      console.error("Gagal mengambil kategori aset:", error);
    }
  };

  const loadGudang = async () => {
    try {
      const data = await fetchGudang();
      const list = Array.isArray(data) ? data : (data?.data || []);
      const seen = new Set();
      const options = [];
      list.forEach((item) => {
        const codeKey = item.kd_gudang?.trim().toUpperCase();
        if (codeKey && !seen.has(codeKey)) {
          seen.add(codeKey);
          options.push({ value: item.kd_gudang, label: `${item.kd_gudang} - ${item.nama_gudang}` });
        }
      });
      setGudangOptions([{ value: "", label: "-- Pilih Gudang --" }, ...options]);
    } catch (error) {
      console.error("Gagal mengambil data gudang:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((fd) => ({ ...fd, [name]: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((fd) => ({ ...fd, [name]: value }));
    }
  };

  const handleHargaChange = (e) => {
    let val = e.target.value;
    const cleanDigits = val.replace(/\D/g, "");
    if (!cleanDigits) {
      setFormData((fd) => ({ ...fd, harga: "" }));
      return;
    }
    const num = parseInt(cleanDigits, 10);
    setFormData((fd) => ({ ...fd, harga: num.toLocaleString("id-ID") }));
  };

  const handleRemoveImage = () => {
    setFormData((fd) => ({ ...fd, cover_photo: null }));
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_kat_aset || !formData.kd_gudang || !formData.inout_aset) {
      alert("Kategori, Gudang, dan Status Aset wajib dipilih!");
      return;
    }

    if (!formData.cover_photo && !defaultData) {
      alert("Cover photo wajib diupload!");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      for (const [key, value] of Object.entries(formData)) {
        if (key === "id_kat_aset") {
          data.append(key, parseInt(value, 10));
        } else if (key === "harga") {
          const hargaClean = String(value).replace(/\D/g, "");
          data.append(key, parseInt(hargaClean, 10) || 0);
        } else if (key === "inout_aset") {
          const formattedStatus = (value === "BAP" || String(value).toLowerCase() === "bap") ? "BAP" : String(value).toLowerCase();
          data.append(key, formattedStatus);
        } else if (value !== null && value !== undefined && value !== "") {
          data.append(key, value);
        }
      }
      let response;
      if (defaultData) {
        const targetId = defaultData.id || defaultData.id_asets;
        response = await updateAset(targetId, data);
      } else {
        response = await createAset(data);
      }
      onSubmit(response.data);
      resetForm();
    } catch (error) {
      console.error("Gagal simpan:", error.response?.data || error.message);
      if (error.response?.status === 403) {
        const userRole = localStorage.getItem("role") || "user";
        alert(
          `Akses Ditolak (403 Forbidden):\nAkun Anda saat ini memiliki role "${userRole}".\nBerdasarkan aturan sistem, penambahan dan perubahan data aset HANYA dapat dilakukan oleh akun dengan role "admin".\n\nSilakan masuk (login) menggunakan akun Admin (contoh: admin@example.com) untuk mengelola aset.`
        );
      } else {
        const errMsg = error.response?.data?.message || (typeof error.response?.data === "string" ? error.response.data : JSON.stringify(error.response?.data || error.message));
        alert("Gagal simpan: " + errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name_asets: "",
      tanggal_perolehan: "",
      kd_gudang: "",
      id_kat_aset: "",
      serial_number: "",
      harga: "",
      spec: "",
      id_user: currentUserId || 1,
      cover_photo: null,
      inout_aset: "",
    });
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-subtle max-w-4xl">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h2 className="text-lg font-bold font-display text-slate-900">
          {defaultData ? "Edit Data Aset" : "Form Registrasi Aset Baru"}
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Pastikan kode gudang, kategori, dan nomor seri unit diisi dengan tepat.
        </p>
      </div>

      {localStorage.getItem("role")?.toLowerCase() !== "admin" && (
        <div className="mb-6 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
          <HiOutlineExclamationTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-amber-950">Pemberitahuan Hak Akses:</span> Saat ini Anda login sebagai <strong>{localStorage.getItem("role") || "Staff"}</strong>. Backend sistem membatasi penambahan atau pengubahan aset khusus untuk pengguna ber-role <strong>Admin</strong>. Jika Anda menyimpan form ini, sistem akan menolak dengan error <em>Forbidden (403)</em>. Silakan beralih ke akun Admin.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kolom Kiri */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Aset <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="name_asets"
                value={formData.name_asets}
                onChange={handleChange}
                required
                placeholder="Contoh: Laptop ThinkPad T14"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kode Gudang <span className="text-rose-500">*</span>
              </label>
              <select
                name="kd_gudang"
                value={formData.kd_gudang}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              >
                {gudangOptions.map((opt, idx) => (
                  <option key={idx} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kategori Aset <span className="text-rose-500">*</span>
              </label>
              <select
                name="id_kat_aset"
                value={formData.id_kat_aset}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              >
                {kategoriOptions.map((opt, idx) => (
                  <option key={idx} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Status Sirkulasi <span className="text-rose-500">*</span>
              </label>
              <select
                name="inout_aset"
                value={formData.inout_aset}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="">-- Pilih Status --</option>
                <option value="in">In (Tersedia di Gudang)</option>
                <option value="out">Out (Dipinjam)</option>
                <option value="service">Service (Perbaikan)</option>
                <option value="BAP">BAP (Berita Acara)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nomor Seri / Serial Number
              </label>
              <input
                type="text"
                name="serial_number"
                value={formData.serial_number}
                onChange={handleChange}
                placeholder="Contoh: SN-LEN123456"
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Harga Perolehan <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                  Rp
                </span>
                <input
                  type="text"
                  name="harga"
                  value={formData.harga}
                  onChange={handleHargaChange}
                  required
                  placeholder="0"
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tanggal Perolehan <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal_perolehan"
                value={formData.tanggal_perolehan}
                onChange={handleChange}
                max={today}
                required
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Foto / Cover Aset {!defaultData && <span className="text-rose-500">*</span>}
              </label>
              {!previewImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/30"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    name="cover_photo"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                  <HiOutlinePhoto className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-medium text-slate-600">
                    Klik untuk unggah gambar aset
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Format JPG, PNG (Maks 2MB)
                  </p>
                </div>
              ) : (
                <div className="relative inline-block border border-slate-200 rounded-lg p-1 bg-white">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-28 h-28 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center text-xs shadow-sm"
                    title="Hapus gambar"
                  >
                    <HiOutlineXMark className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Rincian Spesifikasi & Kondisi <span className="text-rose-500">*</span>
              </label>
              <textarea
                name="spec"
                value={formData.spec}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Rincian prosesor, memori, kelengkapan aksesoris, dll..."
                className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 rounded-lg shadow-sm transition-colors"
          >
            <HiOutlineCheck className="w-4 h-4" />
            {loading ? "Menyimpan..." : defaultData ? "Perbarui Aset" : "Simpan Aset"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormTambahAset;
