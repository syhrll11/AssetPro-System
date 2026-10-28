import API from "../_api";

export const fetchKategori = async () => {
  const res = await API.get("/kategori-aset");
  const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
  const map = {};
  list.forEach((kat) => {
    map[kat.id_kat_aset] = kat.kat_aset;
  });
  return map;
};

export const fetchAsets = async (kategoriMap = {}) => {
  const res = await API.get("/assets");
  const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
  return data.map((it) => {
    const rawStatus = (it.inout_aset || "").toLowerCase();
    let displayStatus = "In";
    if (rawStatus === "out") displayStatus = "Out";
    else if (rawStatus === "service") displayStatus = "Service";
    else if (rawStatus === "bap") displayStatus = "BAP";

    return {
      ...it,
      id: it.id_asets,
      id_asets: it.id_asets,
      nama_aset: it.name_asets,
      name_asets: it.name_asets,
      kode_gudang: it.kd_gudang,
      kd_gudang: it.kd_gudang,
      tipe: kategoriMap[it.id_kat_aset] || "-",
      serial_number: it.serial_number || "",
      harga: it.harga,
      status: displayStatus,
      inout_aset: it.inout_aset,
      tanggal: it.tanggal_perolehan,
      tanggal_perolehan: it.tanggal_perolehan,
      deskripsi: it.spec || "-",
      spec: it.spec || "",
      id_user: it.id_user || 1,
      id_kat_aset: it.id_kat_aset,
      gambar: it.cover_photo
        ? `${(import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api").replace("/api", "")}/storage/${it.cover_photo}`
        : null,
    };
  });
};

export const deleteAset = async (id) => {
  return await API.delete(`/assets/${id}`);
};
