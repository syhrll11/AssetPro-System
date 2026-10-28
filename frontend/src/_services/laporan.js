import API from "../_api";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Sumber data laporan:
 * - Konsisten dengan Dashboard: membaca status SAAT INI dari tabel `aset`
 * - IN      : aset dengan inout_aset = 'in'
 * - OUT     : aset dengan inout_aset = 'out'
 * - SERVICE : aset dengan inout_aset = 'service'
 * - BAP     : aset dengan inout_aset = 'BAP'
 */
export const fetchLaporanGrouped = async () => {
  try {
    const [resAssets, resKategori] = await Promise.allSettled([
      API.get("/assets"),
      API.get("/kategori-aset"),
    ]);

    const allAssets = resAssets.status === "fulfilled"
      ? (Array.isArray(resAssets.value.data) ? resAssets.value.data : (resAssets.value.data?.data || []))
      : [];

    const kategoriList = resKategori.status === "fulfilled"
      ? (Array.isArray(resKategori.value.data) ? resKategori.value.data : (resKategori.value.data?.data || []))
      : [];

    // Build kategori map: id_kat_aset -> kat_aset
    const katMap = {};
    kategoriList.forEach((k) => { katMap[k.id_kat_aset] = k.kat_aset; });

    // Format satu baris laporan dari record aset
    const fmt = (item, statusOverride) => ({
      name_asset: item.name_asets || "-",
      kd_cabang: item.kd_gudang || "-",
      tipe_asset: katMap[item.id_kat_aset] || item.tipe_aset || "Umum",
      serial_number: item.serial_number || "-",
      trx_status: statusOverride || item.inout_aset || "-",
      tanggal_keluar: item.tanggal_perolehan || "-",
    });

    const inList      = allAssets.filter(a => (a.inout_aset || "").toLowerCase() === "in").map(a => fmt(a, "in"));
    const outList     = allAssets.filter(a => (a.inout_aset || "").toLowerCase() === "out").map(a => fmt(a, "out"));
    const serviceList = allAssets.filter(a => (a.inout_aset || "").toLowerCase() === "service").map(a => fmt(a, "service"));
    const bapList     = allAssets.filter(a => (a.inout_aset || "").toLowerCase() === "bap").map(a => fmt(a, "BAP"));

    return {
      data: {
        in: inList,
        out: outList,
        service: serviceList,
        bap: bapList,
        BAP: bapList,
      },
      total: {
        in: inList.length,
        out: outList.length,
        service: serviceList.length,
        bap: bapList.length,
        BAP: bapList.length,
      },
    };
  } catch (error) {
    console.error("Gagal mengambil data laporan grouped:", error);
    return {
      data: { in: [], out: [], service: [], bap: [], BAP: [] },
      total: { in: 0, out: 0, service: 0, bap: 0, BAP: 0 },
    };
  }
};

export const exportToExcel = (data, status) => {
  const worksheet = XLSX.utils.json_to_sheet(
    data.map(item => ({
      'Nama Aset': item.name_asset,
      'Kode Gudang': item.kd_cabang,
      'Tipe': item.tipe_asset || "-",
      'Serial Number': item.serial_number,
      'Status': (item.trx_status || "").toUpperCase(),
      'Tanggal': item.tanggal_keluar?.split('T')[0] || '-',
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Aset');
  XLSX.writeFile(workbook, `laporan_aset_${status}.xlsx`);
};

export const exportToPDF = (data, status) => {
  const doc = new jsPDF();

  doc.text(`Laporan Sirkulasi Aset (${(status || "").toUpperCase()})`, 14, 10);

  const tableData = data.map(item => [
    item.name_asset,
    item.kd_cabang,
    item.tipe_asset || "-",
    item.serial_number,
    (item.trx_status || "").toUpperCase(),
    item.tanggal_keluar?.split('T')[0] || '-',
  ]);

  autoTable(doc, {
    head: [['Nama Aset', 'Kode Gudang', 'Tipe', 'Serial Number', 'Status', 'Tanggal']],
    body: tableData,
    startY: 20,
  });

  doc.save(`laporan_aset_${status}.pdf`);
};
