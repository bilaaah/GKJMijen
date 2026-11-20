/**
 * Utilitas pemformatan data (Tanggal, Mata Uang Rupiah, Nomor Telepon)
 */

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string | Date, options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return '-';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...options,
  };
  return new Intl.DateTimeFormat('id-ID', defaultOptions).format(date);
}

export function formatDateTime(dateString: string | Date): string {
  return formatDate(dateString, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const NAMA_BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
export const NAMA_HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

/** Ubah 'YYYY-MM-DD' menjadi Date lokal (tanpa geser zona waktu). */
export function parseTanggal(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Tanggal hari ini dalam format 'YYYY-MM-DD'. */
export function hariIniISO(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

/** Contoh: 18 Nov 2026 */
export function formatTanggalPendek(iso: string): string {
  if (!iso) return '–';
  const d = parseTanggal(iso);
  return `${d.getDate()} ${NAMA_BULAN[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

/** Contoh: Rabu, 18 November 2026 */
export function formatHariTanggal(iso: string): string {
  if (!iso) return '–';
  const d = parseTanggal(iso);
  return `${NAMA_HARI[d.getDay()]}, ${d.getDate()} ${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

/** Contoh: 06:30 -> 06.30 */
export function formatJam(jam: string): string {
  return jam ? jam.replace(':', '.') : '–';
}

/** Contoh: Rp 1.250.000 */
export function formatRp(amount: number): string {
  return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
}

/** Inisial dua huruf untuk avatar, mengabaikan gelar Pdt./Pnt. */
export function inisial(nama: string): string {
  return nama
    .replace(/^(Pdt|Pnt)\.\s*/, '')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();
}

/** Ambil nama berkas dari path/URL. */
export function namaBerkas(path: string): string {
  if (!path) return '';
  if (path.startsWith('data:')) return 'berkas-terunggah';
  const nama = path.split('?')[0].split('#')[0].split('/').pop() ?? path;
  let bersih = nama;
  try {
    bersih = decodeURIComponent(nama);
  } catch {
    /* biarkan apa adanya */
  }
  // Berkas di Supabase Storage diberi awalan cap waktu, mis. 1763620000000-nota.jpg
  return bersih.replace(/^\d{13}-/, '');
}

export function formatPhoneNumber(phone: string): string {
  if (!phone) return '-';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return `+62 ${cleaned.slice(1, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8)}`;
  }
  return phone;
}
