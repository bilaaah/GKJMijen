/**
 * Ekspor Laporan & Rekap keuangan (UC09 / Proses Usulan 2):
 * - cetakPdf()   → berkas PDF A4 siap cetak (jsPDF + jspdf-autotable)
 * - eksporExcel() → berkas .xlsx berisi 3 sheet: Rekap, Transaksi, Permohonan Surat (exceljs)
 *
 * Kedua pustaka dimuat hanya saat tombol diklik (dynamic import) supaya halaman lain tetap ringan.
 * Semua angka diambil dari data yang sama dengan yang tampil di halaman Laporan & Rekap.
 */
import type { TransaksiKeuangan } from '@/lib/data/types';

export interface DataRekap {
  periode: string; // "November 2026"
  labelSaldoAwal: string; // "Saldo awal (1 November 2026)"
  labelSaldoAkhir: string; // "Saldo akhir (30 November 2026)"
  awal: number;
  pemasukan: (readonly [string, number])[];
  pengeluaran: (readonly [string, number])[];
  totalMasuk: number;
  totalKeluar: number;
  akhir: number;
  /** Transaksi pada periode ini, urut tanggal. */
  transaksi: TransaksiKeuangan[];
  /** [label status, jumlah] */
  surat: [string, number][];
  dicetakOleh: string;
}

const NAMA_GEREJA = 'Gereja Kristen Jawa (GKJ) Mijen Semarang';

const rp = (n: number) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
const tglIndo = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
};
const sekarang = () => new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
const namaBerkas = (d: DataRekap, ext: string) => `Rekap-Keuangan-GKJ-Mijen-${d.periode.replace(/\s+/g, '-')}.${ext}`;

function unduh(blob: Blob, nama: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nama;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ================================== PDF ================================== */

/** Membuat PDF rekap dan mengembalikan isinya (dipakai cetakPdf & pengujian). */
export async function buatPdf(d: DataRekap): Promise<ArrayBuffer> {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = doc.internal.pageSize.getWidth();
  const merah: [number, number, number] = [122, 30, 30];

  // Kop
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...merah);
  doc.text(NAMA_GEREJA, W / 2, 18, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(40);
  doc.text(`Laporan Rekap Kas Bulanan — ${d.periode}`, W / 2, 25, { align: 'center' });
  doc.setDrawColor(...merah);
  doc.setLineWidth(0.6);
  doc.line(14, 29, W - 14, 29);

  // 1. Rekap kas
  const baris: (string | { content: string; styles?: object })[][] = [];
  const tebal = (s: string) => ({ content: s, styles: { fontStyle: 'bold' } });
  baris.push([tebal(d.labelSaldoAwal), tebal(rp(d.awal))]);
  baris.push([{ content: 'Pemasukan', styles: { fontStyle: 'bold', fillColor: [245, 238, 230] } }, { content: '', styles: { fillColor: [245, 238, 230] } }]);
  (d.pemasukan.length ? d.pemasukan : [['Tidak ada pemasukan', 0] as const]).forEach(([k, v]) => baris.push([`    ${k}`, v ? rp(v) : '–']));
  baris.push([tebal('Total pemasukan'), tebal(rp(d.totalMasuk))]);
  baris.push([{ content: 'Pengeluaran', styles: { fontStyle: 'bold', fillColor: [245, 238, 230] } }, { content: '', styles: { fillColor: [245, 238, 230] } }]);
  (d.pengeluaran.length ? d.pengeluaran : [['Tidak ada pengeluaran', 0] as const]).forEach(([k, v]) => baris.push([`    ${k}`, v ? rp(v) : '–']));
  baris.push([tebal('Total pengeluaran'), tebal(rp(d.totalKeluar))]);
  baris.push([
    { content: d.labelSaldoAkhir, styles: { fontStyle: 'bold', fillColor: merah, textColor: 255 } },
    { content: rp(d.akhir), styles: { fontStyle: 'bold', fillColor: merah, textColor: 255 } },
  ]);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. Rekap Kas', 14, 38);
  autoTable(doc, {
    startY: 41,
    body: baris,
    theme: 'grid',
    styles: { fontSize: 10, cellPadding: 2.2, lineColor: [220, 210, 200] },
    columnStyles: { 1: { halign: 'right', cellWidth: 55 } },
    margin: { left: 14, right: 14 },
  });

  // 2. Rincian transaksi
  type DocAT = typeof doc & { lastAutoTable: { finalY: number } };
  let y = (doc as DocAT).lastAutoTable.finalY + 10;
  doc.setFont('helvetica', 'bold');
  doc.text(`2. Rincian Transaksi (${d.transaksi.length})`, 14, y);
  autoTable(doc, {
    startY: y + 3,
    head: [['Tanggal', 'Kategori', 'Keterangan', 'Pemasukan', 'Pengeluaran']],
    body: d.transaksi.length
      ? d.transaksi.map((t) => [
          tglIndo(t.tanggal),
          t.kategori,
          t.keterangan || '-',
          t.jenis_transaksi === 'pemasukan' ? rp(t.nominal) : '',
          t.jenis_transaksi === 'pengeluaran' ? rp(t.nominal) : '',
        ])
      : [[{ content: 'Tidak ada transaksi pada periode ini.', colSpan: 5, styles: { halign: 'center', textColor: 120 } }]],
    foot: [['', '', 'Total', rp(d.totalMasuk), rp(d.totalKeluar)]],
    theme: 'striped',
    headStyles: { fillColor: merah },
    didParseCell: (c) => {
      if ((c.section === 'head' || c.section === 'foot') && c.column.index >= 3) c.cell.styles.halign = 'right';
    },
    footStyles: { fillColor: [245, 238, 230], textColor: 30, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: { 0: { cellWidth: 26 }, 1: { cellWidth: 30 }, 3: { halign: 'right', cellWidth: 32 }, 4: { halign: 'right', cellWidth: 32 } },
    margin: { left: 14, right: 14 },
  });

  // 3. Permohonan surat
  y = (doc as DocAT).lastAutoTable.finalY + 10;
  // Bagian 3 butuh ±22 mm; pindah halaman hanya jika tidak muat di atas kaki halaman
  if (y > 264) {
    doc.addPage();
    y = 20;
  }
  doc.setFont('helvetica', 'bold');
  doc.text('3. Permohonan Surat', 14, y);
  autoTable(doc, {
    startY: y + 3,
    head: [d.surat.map(([l]) => l)],
    body: [d.surat.map(([, n]) => String(n))],
    theme: 'grid',
    headStyles: { fillColor: merah, halign: 'center' },
    bodyStyles: { halign: 'center', fontSize: 11 },
    margin: { left: 14, right: 14 },
  });

  // Kaki halaman
  const dicetak = `Dicetak oleh ${d.dicetakOleh} pada ${sekarang()} — SIM GKJ Mijen`;
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(dicetak, 14, 290);
    doc.text(`Halaman ${i} dari ${total}`, W - 14, 290, { align: 'right' });
  }

  return doc.output('arraybuffer');
}

export async function cetakPdf(d: DataRekap): Promise<void> {
  unduh(new Blob([await buatPdf(d)], { type: 'application/pdf' }), namaBerkas(d, 'pdf'));
}

/* ================================= EXCEL ================================= */

/** Membuat workbook Excel rekap dan mengembalikan isinya (dipakai eksporExcel & pengujian). */
export async function buatExcel(d: DataRekap): Promise<ArrayBuffer> {
  const ExcelJS = (await import('exceljs')).default;
  const wb = new ExcelJS.Workbook();
  wb.creator = 'SIM GKJ Mijen';
  wb.created = new Date();
  wb.calcProperties.fullCalcOnLoad = true; // Excel menghitung ulang semua rumus saat dibuka

  const FORMAT_RP = '"Rp" #,##0;[Red]-"Rp" #,##0';
  const merah = 'FF7A1E1E';
  const krem = 'FFF5EEE6';
  const isi = (warna: string) => ({ type: 'pattern' as const, pattern: 'solid' as const, fgColor: { argb: warna } });
  const garis = { style: 'thin' as const, color: { argb: 'FFDCD2C8' } };
  const bingkai = { top: garis, left: garis, bottom: garis, right: garis };

  /* ---------- Sheet 1: Rekap ---------- */
  const s1 = wb.addWorksheet('Rekap', { pageSetup: { paperSize: 9, orientation: 'portrait', fitToPage: true, fitToWidth: 1, fitToHeight: 0 } });
  s1.columns = [{ width: 44 }, { width: 22 }];
  s1.mergeCells('A1:B1');
  s1.getCell('A1').value = NAMA_GEREJA;
  s1.getCell('A1').font = { bold: true, size: 14, color: { argb: merah } };
  s1.mergeCells('A2:B2');
  s1.getCell('A2').value = `Laporan Rekap Kas Bulanan — ${d.periode}`;
  s1.getCell('A2').font = { size: 11 };
  s1.addRow([]);

  const tambah = (label: string, nilai: number | { formula: string; result: number } | null, gaya: 'biasa' | 'kepala' | 'total' | 'grand' = 'biasa') => {
    const r = s1.addRow([label, nilai]);
    r.getCell(2).numFmt = FORMAT_RP;
    r.eachCell({ includeEmpty: true }, (c) => (c.border = bingkai));
    if (gaya === 'kepala') r.eachCell({ includeEmpty: true }, (c) => ((c.fill = isi(krem)), (c.font = { bold: true })));
    if (gaya === 'total') r.font = { bold: true };
    if (gaya === 'grand') r.eachCell({ includeEmpty: true }, (c) => ((c.fill = isi(merah)), (c.font = { bold: true, color: { argb: 'FFFFFFFF' } })));
    return r.number;
  };

  const rAwal = tambah(d.labelSaldoAwal, d.awal, 'total');
  tambah('Pemasukan', null, 'kepala');
  const mulaiIn = s1.rowCount + 1;
  (d.pemasukan.length ? d.pemasukan : [['Tidak ada pemasukan', 0] as const]).forEach(([k, v]) => tambah(`   ${k}`, v));
  const akhirIn = s1.rowCount;
  const rTin = tambah('Total pemasukan', { formula: `SUM(B${mulaiIn}:B${akhirIn})`, result: d.totalMasuk }, 'total');
  tambah('Pengeluaran', null, 'kepala');
  const mulaiOut = s1.rowCount + 1;
  (d.pengeluaran.length ? d.pengeluaran : [['Tidak ada pengeluaran', 0] as const]).forEach(([k, v]) => tambah(`   ${k}`, v));
  const akhirOut = s1.rowCount;
  const rTout = tambah('Total pengeluaran', { formula: `SUM(B${mulaiOut}:B${akhirOut})`, result: d.totalKeluar }, 'total');
  tambah(d.labelSaldoAkhir, { formula: `B${rAwal}+B${rTin}-B${rTout}`, result: d.akhir }, 'grand');
  s1.addRow([]);
  const kaki = s1.addRow([`Dicetak oleh ${d.dicetakOleh} pada ${sekarang()}`]);
  kaki.font = { italic: true, size: 9, color: { argb: 'FF787878' } };

  /* ---------- Sheet 2: Transaksi ---------- */
  const s2 = wb.addWorksheet('Transaksi', { views: [{ state: 'frozen', ySplit: 1 }] });
  s2.columns = [
    { header: 'Tanggal', key: 'tanggal', width: 13 },
    { header: 'Jenis', key: 'jenis', width: 13 },
    { header: 'Kategori', key: 'kategori', width: 16 },
    { header: 'Keterangan', key: 'ket', width: 42 },
    { header: 'Pemasukan', key: 'masuk', width: 17 },
    { header: 'Pengeluaran', key: 'keluar', width: 17 },
    { header: 'Saldo Berjalan', key: 'saldo', width: 18 },
  ];
  s2.getRow(1).eachCell((c) => {
    c.fill = isi(merah);
    c.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    c.border = bingkai;
  });
  // Baris saldo awal agar kolom Saldo Berjalan bisa dihitung dengan rumus
  const rowAwal = s2.addRow({ tanggal: '', jenis: '', kategori: '', ket: d.labelSaldoAwal, masuk: null, keluar: null, saldo: d.awal });
  rowAwal.font = { italic: true };
  let berjalan = d.awal;
  d.transaksi.forEach((t) => {
    berjalan += t.jenis_transaksi === 'pemasukan' ? t.nominal : -t.nominal;
    const [yy, mm, dd] = t.tanggal.split('-').map(Number);
    const r = s2.addRow({
      tanggal: new Date(Date.UTC(yy, mm - 1, dd)),
      jenis: t.jenis_transaksi === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran',
      kategori: t.kategori,
      ket: t.keterangan,
      masuk: t.jenis_transaksi === 'pemasukan' ? t.nominal : null,
      keluar: t.jenis_transaksi === 'pengeluaran' ? t.nominal : null,
    });
    const n = r.number;
    r.getCell('saldo').value = { formula: `G${n - 1}+N(E${n})-N(F${n})`, result: berjalan };
  });
  const akhirTr = s2.rowCount;
  const rTot = s2.addRow({
    ket: 'Total',
    masuk: { formula: `SUM(E3:E${Math.max(3, akhirTr)})`, result: d.totalMasuk },
    keluar: { formula: `SUM(F3:F${Math.max(3, akhirTr)})`, result: d.totalKeluar },
    saldo: { formula: `G${akhirTr}`, result: d.akhir },
  });
  rTot.font = { bold: true };
  rTot.eachCell({ includeEmpty: true }, (c) => (c.fill = isi(krem)));
  s2.getColumn('tanggal').numFmt = 'dd/mm/yyyy';
  ['masuk', 'keluar', 'saldo'].forEach((k) => (s2.getColumn(k).numFmt = FORMAT_RP));
  s2.eachRow((r) => r.eachCell({ includeEmpty: true }, (c) => (c.border = bingkai)));
  if (d.transaksi.length) s2.autoFilter = { from: 'A1', to: `G${akhirTr}` };

  /* ---------- Sheet 3: Permohonan Surat ---------- */
  const s3 = wb.addWorksheet('Permohonan Surat');
  s3.columns = [
    { header: `Status (${d.periode})`, key: 'st', width: 26 },
    { header: 'Jumlah', key: 'n', width: 12 },
  ];
  s3.getRow(1).eachCell((c) => ((c.fill = isi(merah)), (c.font = { bold: true, color: { argb: 'FFFFFFFF' } })));
  d.surat.forEach(([st, n]) => s3.addRow({ st, n }));
  const rS = s3.addRow({ st: 'Total', n: { formula: `SUM(B2:B${s3.rowCount})`, result: d.surat.reduce((a, [, n]) => a + n, 0) } });
  rS.font = { bold: true };
  s3.eachRow((r) => r.eachCell({ includeEmpty: true }, (c) => (c.border = bingkai)));

  return (await wb.xlsx.writeBuffer()) as ArrayBuffer;
}

export async function eksporExcel(d: DataRekap): Promise<void> {
  unduh(new Blob([await buatExcel(d)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), namaBerkas(d, 'xlsx'));
}
