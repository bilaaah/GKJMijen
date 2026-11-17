/**
 * Skema Database TypeScript (Scaffolding / Placeholder).
 * File ini merepresentasikan skema tabel Supabase PostgreSQL untuk SIM GKJ Mijen.
 * Pada implementasi produksi, file ini dapat di-generate otomatis via:
 * `npm run supabase:gen-types`
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'super_admin' | 'pendeta' | 'majelis' | 'tata_usaha' | 'bendahara' | 'warga';

export interface Database {
  public: {
    Tables: {
      // -----------------------------------------------------------------------
      // MODUL F: PENGGUNA DAN HAK AKSES
      // -----------------------------------------------------------------------
      roles: {
        Row: {
          id: string;
          name: UserRole;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: UserRole;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: UserRole;
          description?: string | null;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string; // references auth.users
          jemaat_id: string | null; // references jemaat
          full_name: string;
          role: UserRole;
          phone: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          jemaat_id?: string | null;
          full_name: string;
          role?: UserRole;
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          jemaat_id?: string | null;
          full_name?: string;
          role?: UserRole;
          phone?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      activity_logs: {
        Row: {
          id: string;
          user_id: string | null;
          module: string;
          action: string;
          description: string;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          module: string;
          action: string;
          description: string;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          module?: string;
          action?: string;
          description?: string;
          ip_address?: string | null;
        };
      };

      // -----------------------------------------------------------------------
      // MODUL A: DATA JEMAAT
      // -----------------------------------------------------------------------
      wilayah: {
        Row: {
          id: string;
          kode_wilayah: string;
          nama_wilayah: string;
          keterangan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kode_wilayah: string;
          nama_wilayah: string;
          keterangan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          kode_wilayah?: string;
          nama_wilayah?: string;
          keterangan?: string | null;
          updated_at?: string;
        };
      };
      keluarga: {
        Row: {
          id: string;
          nomor_kk: string;
          nama_kepala_keluarga: string;
          wilayah_id: string;
          alamat: string;
          rt_rw: string | null;
          telepon: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nomor_kk: string;
          nama_kepala_keluarga: string;
          wilayah_id: string;
          alamat: string;
          rt_rw?: string | null;
          telepon?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nomor_kk?: string;
          nama_kepala_keluarga?: string;
          wilayah_id?: string;
          alamat?: string;
          rt_rw?: string | null;
          telepon?: string | null;
          updated_at?: string;
        };
      };
      jemaat: {
        Row: {
          id: string;
          nomor_induk: string;
          keluarga_id: string;
          wilayah_id: string;
          nama_lengkap: string;
          nama_panggilan: string | null;
          jenis_kelamin: 'L' | 'P';
          tempat_lahir: string;
          tanggal_lahir: string;
          status_dalam_keluarga: string;
          status_pernikahan: string;
          golongan_darah: string | null;
          pendidikan_terakhir: string | null;
          pekerjaan: string | null;
          status_jemaat: 'aktif' | 'titipan' | 'pindah' | 'meninggal';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nomor_induk: string;
          keluarga_id: string;
          wilayah_id: string;
          nama_lengkap: string;
          nama_panggilan?: string | null;
          jenis_kelamin: 'L' | 'P';
          tempat_lahir: string;
          tanggal_lahir: string;
          status_dalam_keluarga: string;
          status_pernikahan: string;
          golongan_darah?: string | null;
          pendidikan_terakhir?: string | null;
          pekerjaan?: string | null;
          status_jemaat?: 'aktif' | 'titipan' | 'pindah' | 'meninggal';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nomor_induk?: string;
          keluarga_id?: string;
          wilayah_id?: string;
          nama_lengkap?: string;
          nama_panggilan?: string | null;
          jenis_kelamin?: 'L' | 'P';
          tempat_lahir?: string;
          tanggal_lahir?: string;
          status_dalam_keluarga?: string;
          status_pernikahan?: string;
          golongan_darah?: string | null;
          pendidikan_terakhir?: string | null;
          pekerjaan?: string | null;
          status_jemaat?: 'aktif' | 'titipan' | 'pindah' | 'meninggal';
          updated_at?: string;
        };
      };
      riwayat_sakramen: {
        Row: {
          id: string;
          jemaat_id: string;
          jenis_sakramen: 'baptis_anak' | 'baptis_dewasa' | 'sidi' | 'pernikahan';
          nomor_piagam: string | null;
          tanggal_pelaksanaan: string;
          tempat_pelaksanaan: string;
          pelayan_firman: string;
          keterangan: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          jemaat_id: string;
          jenis_sakramen: 'baptis_anak' | 'baptis_dewasa' | 'sidi' | 'pernikahan';
          nomor_piagam?: string | null;
          tanggal_pelaksanaan: string;
          tempat_pelaksanaan: string;
          pelayan_firman: string;
          keterangan?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          jemaat_id?: string;
          jenis_sakramen?: 'baptis_anak' | 'baptis_dewasa' | 'sidi' | 'pernikahan';
          nomor_piagam?: string | null;
          tanggal_pelaksanaan?: string;
          tempat_pelaksanaan?: string;
          pelayan_firman?: string;
          keterangan?: string | null;
        };
      };

      // -----------------------------------------------------------------------
      // MODUL B: LAYANAN SURAT DAN ARSIP
      // -----------------------------------------------------------------------
      jenis_surat: {
        Row: {
          id: string;
          kode_surat: string;
          nama_surat: string;
          template_content: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          kode_surat: string;
          nama_surat: string;
          template_content?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          kode_surat?: string;
          nama_surat?: string;
          template_content?: string | null;
        };
      };
      permohonan_surat: {
        Row: {
          id: string;
          nomor_permohonan: string;
          jenis_surat_id: string;
          jemaat_id: string;
          status: 'pending' | 'diproses' | 'selesai' | 'ditolak';
          keperluan: string;
          catatan: string | null;
          file_arsip_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nomor_permohonan: string;
          jenis_surat_id: string;
          jemaat_id: string;
          status?: 'pending' | 'diproses' | 'selesai' | 'ditolak';
          keperluan: string;
          catatan?: string | null;
          file_arsip_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nomor_permohonan?: string;
          jenis_surat_id?: string;
          jemaat_id?: string;
          status?: 'pending' | 'diproses' | 'selesai' | 'ditolak';
          keperluan?: string;
          catatan?: string | null;
          file_arsip_url?: string | null;
          updated_at?: string;
        };
      };
      arsip_dokumen: {
        Row: {
          id: string;
          judul_dokumen: string;
          kategori: string;
          nomor_dokumen: string | null;
          file_url: string;
          file_size: number | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          judul_dokumen: string;
          kategori: string;
          nomor_dokumen?: string | null;
          file_url: string;
          file_size?: number | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          judul_dokumen?: string;
          kategori?: string;
          nomor_dokumen?: string | null;
          file_url?: string;
          file_size?: number | null;
        };
      };

      // -----------------------------------------------------------------------
      // MODUL C: KEUANGAN
      // -----------------------------------------------------------------------
      kategori_keuangan: {
        Row: {
          id: string;
          tipe: 'pemasukan' | 'pengeluaran';
          kode: string;
          nama_kategori: string;
          deskripsi: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tipe: 'pemasukan' | 'pengeluaran';
          kode: string;
          nama_kategori: string;
          deskripsi?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tipe?: 'pemasukan' | 'pengeluaran';
          kode?: string;
          nama_kategori?: string;
          deskripsi?: string | null;
        };
      };
      transaksi_keuangan: {
        Row: {
          id: string;
          nomor_transaksi: string;
          kategori_id: string;
          tanggal: string;
          tipe: 'pemasukan' | 'pengeluaran';
          jumlah: number;
          keterangan: string | null;
          bukti_transaksi_url: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nomor_transaksi: string;
          kategori_id: string;
          tanggal: string;
          tipe: 'pemasukan' | 'pengeluaran';
          jumlah: number;
          keterangan?: string | null;
          bukti_transaksi_url?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nomor_transaksi?: string;
          kategori_id?: string;
          tanggal?: string;
          tipe?: 'pemasukan' | 'pengeluaran';
          jumlah?: number;
          keterangan?: string | null;
          bukti_transaksi_url?: string | null;
          updated_at?: string;
        };
      };
      penghitungan_persembahan: {
        Row: {
          id: string;
          tanggal_kebaktian: string;
          jenis_kebaktian: string;
          kantong_merah: number;
          kantong_hitam: number;
          persembahan_khusus: number;
          total_persembahan: number;
          petugas_penghitung: string[];
          catatan: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tanggal_kebaktian: string;
          jenis_kebaktian: string;
          kantong_merah?: number;
          kantong_hitam?: number;
          persembahan_khusus?: number;
          total_persembahan: number;
          petugas_penghitung?: string[];
          catatan?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tanggal_kebaktian?: string;
          jenis_kebaktian?: string;
          kantong_merah?: number;
          kantong_hitam?: number;
          persembahan_khusus?: number;
          total_persembahan?: number;
          petugas_penghitung?: string[];
          catatan?: string | null;
        };
      };

      // -----------------------------------------------------------------------
      // MODUL D: JADWAL DAN KEGIATAN
      // -----------------------------------------------------------------------
      komisi: {
        Row: {
          id: string;
          nama_komisi: string;
          deskripsi: string | null;
          periode: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          nama_komisi: string;
          deskripsi?: string | null;
          periode: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          nama_komisi?: string;
          deskripsi?: string | null;
          periode?: string;
        };
      };
      anggota_komisi: {
        Row: {
          id: string;
          komisi_id: string;
          jemaat_id: string;
          jabatan: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          komisi_id: string;
          jemaat_id: string;
          jabatan: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          komisi_id?: string;
          jemaat_id?: string;
          jabatan?: string;
        };
      };
      jadwal_kegiatan: {
        Row: {
          id: string;
          judul_kegiatan: string;
          komisi_id: string | null;
          waktu_mulai: string;
          waktu_selesai: string | null;
          lokasi: string;
          keterangan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          judul_kegiatan: string;
          komisi_id?: string | null;
          waktu_mulai: string;
          waktu_selesai?: string | null;
          lokasi: string;
          keterangan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          judul_kegiatan?: string;
          komisi_id?: string | null;
          waktu_mulai?: string;
          waktu_selesai?: string | null;
          lokasi?: string;
          keterangan?: string | null;
          updated_at?: string;
        };
      };
      penugasan_petugas: {
        Row: {
          id: string;
          jadwal_kegiatan_id: string;
          jemaat_id: string;
          peran_petugas: string; // e.g. Pengkhotbah, Liturgos, Pemain Musik, Kolektan
          status_konfirmasi: 'menunggu' | 'bersedia' | 'berhalangan';
          created_at: string;
        };
        Insert: {
          id?: string;
          jadwal_kegiatan_id: string;
          jemaat_id: string;
          peran_petugas: string;
          status_konfirmasi?: 'menunggu' | 'bersedia' | 'berhalangan';
          created_at?: string;
        };
        Update: {
          id?: string;
          jadwal_kegiatan_id?: string;
          jemaat_id?: string;
          peran_petugas?: string;
          status_konfirmasi?: 'menunggu' | 'bersedia' | 'berhalangan';
        };
      };

      // -----------------------------------------------------------------------
      // MODUL E: WARTA DAN PENGUMUMAN
      // -----------------------------------------------------------------------
      warta_jemaat: {
        Row: {
          id: string;
          edisi: string;
          tanggal_terbit: string;
          tema: string | null;
          pdf_url: string | null;
          status_publikasi: 'draft' | 'dipublikasikan' | 'diarsipkan';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          edisi: string;
          tanggal_terbit: string;
          tema?: string | null;
          pdf_url?: string | null;
          status_publikasi?: 'draft' | 'dipublikasikan' | 'diarsipkan';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          edisi?: string;
          tanggal_terbit?: string;
          tema?: string | null;
          pdf_url?: string | null;
          status_publikasi?: 'draft' | 'dipublikasikan' | 'diarsipkan';
          updated_at?: string;
        };
      };
      pengumuman: {
        Row: {
          id: string;
          judul: string;
          konten: string;
          kategori: string;
          tanggal_mulai: string;
          tanggal_selesai: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          judul: string;
          konten: string;
          kategori: string;
          tanggal_mulai: string;
          tanggal_selesai?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          judul?: string;
          konten?: string;
          kategori?: string;
          tanggal_mulai?: string;
          tanggal_selesai?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
    };
  };
}
