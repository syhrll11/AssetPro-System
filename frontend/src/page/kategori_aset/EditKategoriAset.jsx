import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { HiOutlineTag, HiOutlineCheck, HiOutlineArrowLeft } from "react-icons/hi2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getKategoriById, updateKategori } from "../../_services/kategoriService";

const EditKategoriAset = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [katAset, setKatAset] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getKategoriById(id);
        setKatAset(data.kat_aset);
      } catch (error) {
        console.error("Gagal fetch data kategori:", error);
        toast.error("Gagal mengambil data kategori");
        navigate("/kategori-aset");
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!katAset.trim()) {
      toast.warn("Nama kategori tidak boleh kosong");
      return;
    }

    setLoading(true);
    try {
      await updateKategori(id, { kat_aset: katAset });
      toast.success("Kategori berhasil diperbarui");
      setTimeout(() => navigate("/kategori-aset"), 600);
    } catch (error) {
      console.error("Gagal update kategori:", error);
      toast.error("Gagal memperbarui kategori");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-4">
      <ToastContainer position="top-right" autoClose={1500} />

      <div>
        <Link
          to="/kategori-aset"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
        >
          <HiOutlineArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Kategori Aset
        </Link>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-subtle">
        <div className="mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center gap-2">
            <HiOutlineTag className="w-5 h-5 text-blue-600" />
            Edit Kategori Aset
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Perbarui nama klasifikasi kategori unit aset.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Kategori Aset <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={katAset}
              onChange={(e) => setKatAset(e.target.value)}
              placeholder="Contoh: Elektronik, Kendaraan..."
              required
              className="w-full px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate("/kategori-aset")}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-70 rounded-lg shadow-sm transition-colors"
            >
              <HiOutlineCheck className="w-4 h-4" />
              {loading ? "Menyimpan..." : "Perbarui Kategori"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditKategoriAset;
