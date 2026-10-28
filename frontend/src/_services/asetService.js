import API from "../_api";

// Ambil data kategori aset (memerlukan token auth:sanctum)
export const fetchKategoriAset = async () => {
  const response = await API.get("/kategori-aset");
  return response.data;
};

// Ambil data gudang (memerlukan token auth:sanctum)
export const fetchGudang = async () => {
  const response = await API.get("/gudang");
  return response.data;
};

// Ambil semua aset
export const fetchAsets = async () => {
  const response = await API.get("/assets");
  return response.data;
};

// Hapus aset
export const deleteAset = async (id) => {
  return await API.delete(`/assets/${id}`);
};

// Tambah aset
export const createAset = async (formData) => {
  return await API.post("/assets", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Update aset
export const updateAset = async (id, formData) => {
  formData.append("_method", "PUT");
  return await API.post(`/assets/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
