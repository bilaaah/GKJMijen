/**
 * Daftar layanan surat yang bisa diajukan warga + helper status.
 *
 * Basis data (ERD) hanya punya 3 jenis_surat: baptis, sidi, atestasi.
 * Supaya warga lebih mudah memilih, "baptis" dipecah menjadi Baptis Anak dan
 * Baptis Dewasa. Pilihan layanan disimpan di baris pertama `keterangan`.
 */
import { JENIS_SURAT_LABEL, type Jemaat, type JenisSurat, type PermohonanSurat, type StatusSurat } from '@/lib/data';
import { formatTanggalPendek } from '@/utils/formatters';

export type LayananId = 'baptis-anak' | 'baptis-dewasa' | 'sidi' | 'atestasi';

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'date' | 'textarea';
  placeholder?: string;
  required?: boolean;
  hint?: string;
}

export interface Layanan {
  id: LayananId;
  jenis: JenisSurat;
  nama: string;
  ringkas: string;
  icon: string;
  lampiran: string;
  lampiranWajib: boolean;
  fields: FieldDef[];
}

export const LAYANAN: Layanan[] = [
  {
    id: 'baptis-anak',
    jenis: 'baptis',
    nama: 'Baptis Anak',
    ringkas: 'Untuk anak dari keluarga jemaat GKJ Mijen.',
    icon: 'droplet-half',
    lampiran: 'Akta kelahiran anak dan Kartu Keluarga',
    lampiranWajib: true,
    fields: [
      { key: 'Nama anak', label: 'Nama lengkap anak', type: 'text', placeholder: 'Sesuai akta kelahiran', required: true },
      { key: 'Tanggal lahir anak', label: 'Tanggal lahir anak', type: 'date', required: true },
      { key: 'Keperluan', label: 'Keperluan atau catatan', type: 'textarea', placeholder: 'Contoh: baptis anak pertama, mohon jadwal bulan Desember' },
    ],
  },
  {
    id: 'baptis-dewasa',
    jenis: 'baptis',
    nama: 'Baptis Dewasa',
    ringkas: 'Untuk jemaat dewasa yang belum dibaptis.',
    icon: 'droplet',
    lampiran: 'KTP dan Kartu Keluarga',
    lampiranWajib: true,
    fields: [
      { key: 'Tempat lahir', label: 'Tempat lahir', type: 'text', placeholder: 'Contoh: Semarang', required: true },
      { key: 'Tanggal lahir', label: 'Tanggal lahir', type: 'date', required: true },
      { key: 'Keperluan', label: 'Keperluan atau catatan', type: 'textarea', placeholder: 'Ceritakan singkat bila ada hal yang perlu diketahui pengurus' },
    ],
  },
  {
    id: 'sidi',
    jenis: 'sidi',
    nama: 'Sidi / Pengakuan Iman',
    ringkas: 'Setelah mengikuti katekisasi sidi.',
    icon: 'book',
    lampiran: 'Surat baptis',
    lampiranWajib: true,
    fields: [
      { key: 'Angkatan katekisasi', label: 'Angkatan katekisasi', type: 'text', placeholder: 'Contoh: Angkatan 2026', required: true },
      { key: 'Pembimbing', label: 'Nama pembimbing katekisasi', type: 'text', placeholder: 'Contoh: Pdt. Daniel Kurniawan' },
      { key: 'Keperluan', label: 'Keperluan atau catatan', type: 'textarea', placeholder: 'Opsional' },
    ],
  },
  {
    id: 'atestasi',
    jenis: 'atestasi',
    nama: 'Atestasi (Pindah Jemaat)',
    ringkas: 'Surat pindah ke gereja lain.',
    icon: 'signpost-split',
    lampiran: 'Surat keterangan dari gereja tujuan (bila ada)',
    lampiranWajib: false,
    fields: [
      { key: 'Gereja tujuan', label: 'Nama gereja tujuan', type: 'text', placeholder: 'Contoh: GKJ Ngaliyan', required: true },
      { key: 'Alamat gereja tujuan', label: 'Alamat gereja tujuan', type: 'text', placeholder: 'Kota atau alamat lengkap', required: true },
      { key: 'Alasan pindah', label: 'Alasan pindah', type: 'textarea', placeholder: 'Contoh: pindah domisili karena pekerjaan', required: true },
    ],
  },
];

export const layananById = (id: string | null | undefined) => LAYANAN.find((l) => l.id === id);

/**
 * Apakah layanan boleh diajukan oleh jemaat ini?
 * Mengembalikan alasan bila tidak boleh, atau null bila boleh.
 */
export function alasanTidakBisa(l: Layanan, j: Jemaat | null): string | null {
  if (!j) return null;
  if (l.id === 'baptis-dewasa' && j.status_baptis) return 'Anda sudah tercatat dibaptis.';
  if (l.id === 'sidi' && j.status_sidi) return 'Anda sudah tercatat sidi.';
  if (l.id === 'sidi' && !j.status_baptis) return 'Sidi memerlukan baptis terlebih dahulu.';
  return null;
}

/* ---------- keterangan: "Label: isi" per baris ---------- */

export function susunKeterangan(l: Layanan, isian: Record<string, string>): string {
  const baris = [`Layanan: ${l.nama}`];
  l.fields.forEach((f) => {
    const v = (isian[f.key] ?? '').trim();
    if (v) baris.push(`${f.key}: ${v.replace(/\n+/g, ' ')}`);
  });
  return baris.join('\n');
}

export function bacaKeterangan(s: PermohonanSurat): { label: string; isi: string }[] {
  return (s.keterangan ?? '')
    .split('\n')
    .map((b) => {
      const i = b.indexOf(':');
      return i < 0 ? null : { label: b.slice(0, i).trim(), isi: b.slice(i + 1).trim() };
    })
    .filter((x): x is { label: string; isi: string } => !!x && x.label !== 'Layanan' && !!x.isi);
}

/** Isian bertipe tanggal (YYYY-MM-DD) ditampilkan sebagai "10 Mei 2026". */
export const tampilIsi = (isi: string) => (/^\d{4}-\d{2}-\d{2}$/.test(isi) ? formatTanggalPendek(isi) : isi);

/** Nama layanan yang dipahami warga, mis. "Baptis Anak". */
export function namaLayanan(s: PermohonanSurat): string {
  const m = /^Layanan:\s*(.+)$/m.exec(s.keterangan ?? '');
  if (m) return m[1].trim();
  // Data lama tanpa isian: pakai nama layanan yang sama dengan formulir
  if (s.jenis_surat !== 'baptis') return LAYANAN.find((l) => l.jenis === s.jenis_surat)?.nama ?? JENIS_SURAT_LABEL[s.jenis_surat];
  return 'Baptis';
}

/** Cari id layanan dari permohonan lama (untuk "Ajukan ulang"). */
export function layananDariSurat(s: PermohonanSurat): LayananId {
  const nama = namaLayanan(s);
  const cocok = LAYANAN.find((l) => l.nama === nama);
  if (cocok) return cocok.id;
  return s.jenis_surat === 'baptis' ? 'baptis-anak' : (s.jenis_surat as LayananId);
}

/* ---------- status dalam bahasa warga ---------- */

export const STATUS_WARGA: Record<StatusSurat, string> = {
  diajukan: 'Menunggu diperiksa',
  diproses: 'Sedang diproses',
  selesai: 'Siap diunduh',
  ditolak: 'Perlu diperbaiki',
};

export interface Langkah {
  judul: string;
  ket?: string;
  state: 'done' | 'cur' | 'todo' | 'rej';
}

/** Langkah-langkah permohonan sesuai alur pada laporan (Diajukan → Diproses → Selesai / Ditolak). */
export function langkahStatus(s: PermohonanSurat, tglLabel: (iso: string) => string): Langkah[] {
  const diajukan: Langkah = { judul: 'Diajukan', ket: tglLabel(s.tanggal_pengajuan), state: 'done' };
  if (s.status === 'ditolak') {
    return [diajukan, { judul: 'Diperiksa pengurus', state: 'done' }, { judul: 'Ditolak', ket: 'Lihat catatan pengurus', state: 'rej' }];
  }
  if (s.status === 'diajukan') {
    return [diajukan, { judul: 'Diperiksa pengurus', ket: 'Sedang menunggu', state: 'cur' }, { judul: 'Diproses', state: 'todo' }, { judul: 'Surat terbit', state: 'todo' }];
  }
  if (s.status === 'diproses') {
    return [
      diajukan,
      { judul: 'Diperiksa pengurus', state: 'done' },
      { judul: 'Diproses', ket: s.nomor_surat ? `No. ${s.nomor_surat}` : 'Surat sedang disiapkan', state: 'cur' },
      { judul: 'Surat terbit', state: 'todo' },
    ];
  }
  return [
    diajukan,
    { judul: 'Diperiksa pengurus', state: 'done' },
    { judul: 'Diproses', ket: s.nomor_surat ? `No. ${s.nomor_surat}` : undefined, state: 'done' },
    { judul: 'Surat terbit', ket: 'Siap diunduh', state: 'done' },
  ];
}
