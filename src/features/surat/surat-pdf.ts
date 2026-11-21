/**
 * Pembuat PDF SURAT RESMI GKJ Mijen dari data permohonan (UC04 / UC08).
 *
 * Format mengikuti surat resmi gereja: kertas A4, huruf Times (setara Times New Roman) 12 pt,
 * hitam, paragraf rata kanan-kiri, kop dengan logo dan garis ganda, salam pembuka gerejawi,
 * nomor "<urut>/GKJ-MJ/<bulan romawi>/<tahun>", dan ruang tanda tangan serta stempel basah.
 *
 * Isi surat diambil dari data jemaat + isian formulir warga (kolom permohonan_surat.keterangan).
 * Kalimat setiap jenis surat ada di fungsi isiSurat() dan dapat disesuaikan oleh sekretariat.
 */
import type { jsPDF as JsPDF } from 'jspdf';
import type { Jemaat, PermohonanSurat } from '@/lib/data/types';
import { bacaKeterangan, namaLayanan } from '@/features/portal/layanan';
import { KOP, PENANDATANGAN, SALAM } from './kop-surat';

export interface InputSurat {
  s: PermohonanSurat;
  j: Jemaat;
  nomor: string;
  tanggal: Date;
  /** data:image/png;base64,... (opsional; di browser diambil otomatis dari KOP.logo) */
  logoDataUrl?: string;
}

const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
export const tanggalPanjang = (d: Date) => `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
const tglIsi = (v: string) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  return m ? tanggalPanjang(new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))) : v;
};
const hurufKecilAwal = (v: string) => (/^[A-Z][a-z]/.test(v) ? v[0].toLowerCase() + v.slice(1) : v);
const adaIsi = (v?: string) => !!v && v.trim() !== '' && v.trim() !== '-';

/* ------------------------------ Isi tiap jenis surat ------------------------------ */

interface Isi {
  /** 'keterangan' = judul di tengah (baptis/sidi); 'surat' = surat beralamat (atestasi) */
  bentuk: 'keterangan' | 'surat';
  judul: string;
  hal?: string;
  kepada?: string[];
  pembuka: string[];
  data: [string, string][];
  penutup: string[];
}

function isiSurat(s: PermohonanSurat, j: Jemaat): Isi {
  const k = Object.fromEntries(bacaKeterangan(s).map((x) => [x.label, x.isi]));
  const layanan = namaLayanan(s);
  const statusYa = (b: boolean) => (b ? 'Sudah' : 'Belum');
  const demikian = 'Demikian surat keterangan ini dibuat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.';

  if (s.jenis_surat === 'baptis' && adaIsi(k['Nama anak'])) {
    return {
      bentuk: 'keterangan',
      judul: 'SURAT KETERANGAN BAPTIS ANAK',
      pembuka: ['Majelis Gereja Kristen Jawa (GKJ) Mijen Semarang dengan ini menerangkan bahwa:'],
      data: [
        ['Nama anak', k['Nama anak']],
        ['Tanggal lahir', tglIsi(k['Tanggal lahir anak'] ?? '-')],
        ['Nama orang tua/wali', j.nama],
        ['Alamat', j.alamat || '-'],
        ['Wilayah', j.wilayah || '-'],
      ],
      penutup: [
        'telah menerima Sakramen Baptis Kudus (Baptis Anak) dan tercatat sebagai warga anak Gereja Kristen Jawa Mijen Semarang.',
        demikian,
      ],
    };
  }

  if (s.jenis_surat === 'baptis') {
    const ttl = [k['Tempat lahir'], adaIsi(k['Tanggal lahir']) ? tglIsi(k['Tanggal lahir']) : ''].filter(adaIsi).join(', ');
    return {
      bentuk: 'keterangan',
      judul: layanan === 'Baptis Dewasa' ? 'SURAT KETERANGAN BAPTIS DEWASA' : 'SURAT KETERANGAN BAPTIS',
      pembuka: ['Majelis Gereja Kristen Jawa (GKJ) Mijen Semarang dengan ini menerangkan bahwa:'],
      data: [
        ['Nama', j.nama],
        ...(ttl ? ([['Tempat, tanggal lahir', ttl]] as [string, string][]) : []),
        ['Alamat', j.alamat || '-'],
        ['Wilayah', j.wilayah || '-'],
      ],
      penutup: [
        `telah menerima Sakramen Baptis Kudus${layanan === 'Baptis Dewasa' ? ' (Baptis Dewasa)' : ''} dan tercatat sebagai warga Gereja Kristen Jawa Mijen Semarang.`,
        demikian,
      ],
    };
  }

  if (s.jenis_surat === 'sidi') {
    return {
      bentuk: 'keterangan',
      judul: 'SURAT KETERANGAN SIDI',
      pembuka: ['Majelis Gereja Kristen Jawa (GKJ) Mijen Semarang dengan ini menerangkan bahwa:'],
      data: [
        ['Nama', j.nama],
        ['Alamat', j.alamat || '-'],
        ['Wilayah', j.wilayah || '-'],
        ...(adaIsi(k['Angkatan katekisasi']) ? ([['Angkatan katekisasi', k['Angkatan katekisasi']]] as [string, string][]) : []),
        ...(adaIsi(k['Pembimbing']) ? ([['Pembimbing katekisasi', k['Pembimbing']]] as [string, string][]) : []),
      ],
      penutup: [
        'telah mengikuti katekisasi dan mengaku percaya (sidi) di hadapan jemaat, sehingga tercatat sebagai warga dewasa Gereja Kristen Jawa Mijen Semarang dan berhak mengikuti Perjamuan Kudus.',
        demikian,
      ],
    };
  }

  // Atestasi (pindah jemaat): surat beralamat ke majelis gereja tujuan
  const tujuan = adaIsi(k['Gereja tujuan']) ? k['Gereja tujuan'] : 'Gereja Tujuan';
  return {
    bentuk: 'surat',
    judul: 'SURAT ATESTASI',
    hal: 'Atestasi (Pindah Keanggotaan Jemaat)',
    kepada: ['Kepada Yth.', `Majelis ${tujuan}`, adaIsi(k['Alamat gereja tujuan']) ? `di ${k['Alamat gereja tujuan']}` : 'di tempat'],
    pembuka: [
      'Dengan hormat,',
      SALAM,
      'Bersama surat ini, Majelis Gereja Kristen Jawa (GKJ) Mijen Semarang memberitahukan bahwa warga jemaat kami:',
    ],
    data: [
      ['Nama', j.nama],
      ['Alamat', j.alamat || '-'],
      ['Wilayah', j.wilayah || '-'],
      ['Status baptis', statusYa(j.status_baptis)],
      ['Status sidi', statusYa(j.status_sidi)],
    ],
    penutup: [
      `mengajukan permohonan pindah keanggotaan (atestasi) ke ${tujuan}${adaIsi(k['Alasan pindah']) ? ` dengan alasan ${hurufKecilAwal(k['Alasan pindah'].replace(/\.$/, ''))}` : ''}. Selama menjadi warga GKJ Mijen Semarang, yang bersangkutan tercatat sebagai warga jemaat dengan baik. Kami mohon kiranya Majelis berkenan menerima dan menggembalakan saudara kami tersebut sebagai warga jemaat.`,
      'Demikian surat atestasi ini kami sampaikan. Atas perhatian dan kerja sama Majelis, kami mengucapkan terima kasih. Tuhan memberkati.',
    ],
  };
}

/* ---------------------------------- Tata letak ---------------------------------- */

const ML = 25; // margin kiri (mm)
const MR = 20; // margin kanan
const LEBAR = 210 - ML - MR;
const SPASI = 6.2; // jarak baris 12 pt ≈ 1,5 spasi

/** Paragraf rata kanan-kiri (baris terakhir rata kiri), dengan indentasi baris pertama. */
function paragraf(doc: JsPDF, teks: string, y: number, indent = 12.5, x = ML, lebar = LEBAR): number {
  const kata = teks.split(/\s+/).filter(Boolean);
  const spasiNormal = doc.getTextWidth(' ');
  let baris: string[] = [];
  let pertama = true;
  const tulis = (rata: boolean) => {
    const xMulai = x + (pertama ? indent : 0);
    const lebarBaris = lebar - (pertama ? indent : 0);
    const lebarKata = baris.reduce((t, w) => t + doc.getTextWidth(w), 0);
    const celah = rata && baris.length > 1 ? (lebarBaris - lebarKata) / (baris.length - 1) : spasiNormal;
    let cx = xMulai;
    baris.forEach((w) => {
      doc.text(w, cx, y);
      cx += doc.getTextWidth(w) + celah;
    });
    y += SPASI;
    pertama = false;
    baris = [];
  };
  for (const w of kata) {
    const lebarBaris = lebar - (pertama ? indent : 0);
    const uji = [...baris, w].join(' ');
    if (baris.length && doc.getTextWidth(uji) > lebarBaris) tulis(true);
    baris.push(w);
  }
  if (baris.length) tulis(false);
  return y;
}

async function ambilLogo(src: string): Promise<string | undefined> {
  try {
    const res = await fetch(src);
    if (!res.ok) return undefined;
    const blob = await res.blob();
    return await new Promise((ok, gagal) => {
      const r = new FileReader();
      r.onload = () => ok(String(r.result));
      r.onerror = gagal;
      r.readAsDataURL(blob);
    });
  } catch {
    return undefined;
  }
}

function kop(doc: JsPDF, logo?: string): number {
  if (logo) doc.addImage(logo, 'PNG', ML - 3, 10, 27, 27);
  const cx = 210 / 2 + 10;
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.text(KOP.nama, cx, 18.5, { align: 'center' });
  doc.setFontSize(10.5);
  doc.text(KOP.persekutuan, cx, 24, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.setFontSize(10.5);
  doc.text(KOP.alamat, cx, 29, { align: 'center' });
  doc.text(KOP.kontak, cx, 33.5, { align: 'center' });
  doc.setLineWidth(0.9);
  doc.line(ML - 3, 39, 210 - MR + 3, 39);
  doc.setLineWidth(0.25);
  doc.line(ML - 3, 40.3, 210 - MR + 3, 40.3);
  doc.setFontSize(12);
  return 50;
}

/** Membuat PDF surat resmi. Mengembalikan isi berkas (ArrayBuffer). */
export async function buatSuratPdf(inp: InputSurat): Promise<ArrayBuffer> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const isi = isiSurat(inp.s, inp.j);
  const logo = inp.logoDataUrl ?? (typeof window !== 'undefined' ? await ambilLogo(KOP.logo) : undefined);
  const tanggal = `${KOP.kota}, ${tanggalPanjang(inp.tanggal)}`;

  doc.setProperties({ title: `${isi.judul} - ${inp.j.nama}`, subject: inp.nomor, creator: 'SIM GKJ Mijen' });
  doc.setTextColor(0);
  let y = kop(doc, logo);
  doc.setFont('times', 'normal');
  doc.setFontSize(12);

  if (isi.bentuk === 'keterangan') {
    // Judul di tengah, bergaris bawah, nomor di bawahnya
    doc.setFont('times', 'bold');
    doc.setFontSize(13);
    doc.text(isi.judul, 105, y, { align: 'center' });
    const lj = doc.getTextWidth(isi.judul);
    doc.setLineWidth(0.3);
    doc.line(105 - lj / 2, y + 1.2, 105 + lj / 2, y + 1.2);
    doc.setFont('times', 'normal');
    doc.setFontSize(12);
    doc.text(`Nomor : ${inp.nomor}`, 105, y + 6.5, { align: 'center' });
    y += 17;
    doc.text(SALAM, ML, y);
    y += SPASI * 1.5;
  } else {
    // Surat beralamat: nomor & hal di kiri, tempat-tanggal di kanan (seperti surat resmi gereja)
    doc.text('Nomor', ML, y);
    doc.text(`: ${inp.nomor}`, ML + 16, y);
    doc.text(tanggal, 210 - MR, y, { align: 'right' });
    doc.text('Hal', ML, y + SPASI);
    doc.text(`: ${isi.hal}`, ML + 16, y + SPASI);
    y += SPASI * 2.8;
    isi.kepada?.forEach((b, i) => {
      doc.setFont('times', i === 0 ? 'bold' : 'normal');
      doc.text(b, ML, y);
      y += SPASI;
    });
    doc.setFont('times', 'normal');
    y += SPASI * 0.8;
  }

  isi.pembuka.forEach((p, i) => {
    const salam = isi.bentuk === 'surat' && i < 2;
    if (salam) {
      doc.text(p, ML, y);
      y += SPASI;
      if (i === 1) y += SPASI * 0.5;
    } else y = paragraf(doc, p, y);
  });

  // Tabel data (label : isi), isi tebal
  y += 2;
  const xLabel = ML + 12.5;
  const xTitik = ML + 62;
  isi.data.forEach(([label, nilai]) => {
    doc.setFont('times', 'normal');
    doc.text(label, xLabel, y);
    doc.text(':', xTitik, y);
    doc.setFont('times', 'bold');
    const baris = doc.splitTextToSize(nilai, 210 - MR - (xTitik + 4)) as string[];
    baris.forEach((b, i) => doc.text(b, xTitik + 4, y + i * SPASI));
    y += SPASI * baris.length;
  });
  doc.setFont('times', 'normal');
  y += 3;

  isi.penutup.forEach((p, i) => {
    // Kalimat pertama setelah tabel adalah lanjutan kalimat pembuka, jadi tanpa indentasi
    y = paragraf(doc, p, y, i === 0 ? 0 : 12.5);
    y += 1.5;
  });

  // Tanda tangan (kanan bawah): ruang kosong untuk tanda tangan & stempel basah
  if (y > 225) {
    doc.addPage();
    y = 30;
  }
  const xTtd = 125;
  y += SPASI;
  if (isi.bentuk === 'keterangan') {
    doc.text(tanggal, xTtd, y);
    y += SPASI;
  }
  doc.text(PENANDATANGAN.salamPenutup, xTtd, y);
  doc.text(PENANDATANGAN.jabatan, xTtd, y + SPASI);
  y += SPASI + 26;
  doc.setFont('times', 'bold');
  doc.text(PENANDATANGAN.nama, xTtd, y);
  const ln = doc.getTextWidth(PENANDATANGAN.nama);
  doc.setLineWidth(0.25);
  doc.line(xTtd, y + 1, xTtd + ln, y + 1);

  return doc.output('arraybuffer');
}

/** Nama berkas surat, mis. "Surat-Keterangan-Baptis-Anak-Yosua-Adi-Nugroho.pdf". */
export function namaBerkasSurat(s: PermohonanSurat, j: Jemaat): string {
  const isi = isiSurat(s, j);
  const judul = isi.judul.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
  const nama = isi.data[0]?.[1] || j.nama; // baptis anak: nama anak
  return `${judul} ${nama}`.replace(/[^\w]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '.pdf';
}
