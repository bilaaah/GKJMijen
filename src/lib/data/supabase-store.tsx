'use client';

/**
 * Sumber data ASLI: Supabase (PostgreSQL + Auth + Storage).
 *
 * Cara kerja:
 * 1. Saat halaman dibuka / setelah login, semua tabel dibaca memakai token pengguna,
 *    jadi Row Level Security di database tetap berlaku (pengurus melihat semua data).
 * 2. Komponen memanggil setDb(...) seperti biasa. Tampilan langsung berubah, lalu
 *    perbedaannya (baris baru / berubah / terhapus) dikirim ke Supabase.
 * 3. Jika penyimpanan gagal (misalnya ditolak RLS), muncul notifikasi merah dan
 *    data dimuat ulang dari database supaya tampilan kembali sesuai isi database.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/feedback/Toast';
import { DataContext, type DataContextValue, type LoginResult, type RegisterResult, type SimpleResult } from './context';
import {
  DB_KOSONG,
  jemaatDariDb,
  kegiatanDariDb,
  profileDariDb,
  suratDariDb,
  transaksiDariDb,
  wartaDariDb,
} from './mapping';
import { tandatanganiBerkas } from './files';
import { simpanPerbedaan } from './sync';
import type { DB, Profile } from './types';


function pesanError(e: unknown): string {
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message: unknown }).message);
  return String(e);
}

export function SupabaseDataProvider({ children }: { children: React.ReactNode }) {
  const sb = useMemo(() => createClient(), []);
  /** Klien tanpa tipe untuk operasi generik lintas tabel (nama tabel ditentukan saat runtime). */
  const sbUmum = sb as unknown as SupabaseClient;
  const toast = useToast();
  const [db, setDbState] = useState<DB>(DB_KOSONG);
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const dbRef = useRef<DB>(DB_KOSONG);
  const antrean = useRef<Promise<void>>(Promise.resolve());

  const pasangDb = useCallback((next: DB) => {
    dbRef.current = next;
    setDbState(next);
  }, []);

  /** Baca seluruh data yang boleh dilihat pengguna ini. */
  const muat = useCallback(async (): Promise<Profile | null> => {
    const {
      data: { user: authUser },
    } = await sb.auth.getUser();
    if (!authUser) {
      // Pengunjung publik (belum login) dapat melihat jadwal kegiatan dan warta terbit
      const [kegiatan, warta] = await Promise.all([
        sb.from('kegiatan').select('*').order('tanggal'),
        sb.from('warta').select('*').eq('status', 'terbit').order('created_at', { ascending: false }),
      ]);
      const baru: DB = {
        ...DB_KOSONG,
        kegiatan: (kegiatan.data ?? []).map(kegiatanDariDb),
        warta: (warta.data ?? []).map(wartaDariDb),
      };
      pasangDb(baru);
      setUserId(null);
      return null;
    }

    const { data: me, error: errProfil } = await sb.from('profiles').select('*').eq('id', authUser.id).maybeSingle();
    if (errProfil) throw errProfil;
    const profil = me ? profileDariDb(me) : null;
    if (!profil) {
      pasangDb(DB_KOSONG);
      setUserId(null);
      return null;
    }

    if (profil.peran === 'warga') {
      // Warga jemaat: profil pribadi, data jemaat tertaut, permohonan surat miliknya, kegiatan & warta terbit
      const [jemaat, surat, kegiatan, warta] = await Promise.all([
        sb.from('jemaat').select('*').eq('id_profiles', authUser.id).order('nama'),
        sb.from('permohonan_surat').select('*').order('tanggal_pengajuan', { ascending: false }),
        sb.from('kegiatan').select('*').order('tanggal'),
        sb.from('warta').select('*').eq('status', 'terbit').order('created_at', { ascending: false }),
      ]);
      const baru: DB = {
        profiles: [profil],
        jemaat: (jemaat.data ?? []).map(jemaatDariDb),
        surat: (surat.data ?? []).map(suratDariDb),
        transaksi: [],
        kegiatan: (kegiatan.data ?? []).map(kegiatanDariDb),
        warta: (warta.data ?? []).map(wartaDariDb),
      };
      pasangDb(await tandatanganiBerkas(baru));
      setUserId(profil.id);
      return profil;
    }

    const [profiles, jemaat, surat, transaksi, kegiatan, warta] = await Promise.all([
      sb.from('profiles').select('*').order('created_at'),
      sb.from('jemaat').select('*').order('nama'),
      sb.from('permohonan_surat').select('*').order('tanggal_pengajuan', { ascending: false }),
      sb.from('transaksi_keuangan').select('*').order('tanggal'),
      sb.from('kegiatan').select('*').order('tanggal'),
      sb.from('warta').select('*').order('created_at', { ascending: false }),
    ]);
    const gagal = [profiles, jemaat, surat, transaksi, kegiatan, warta].find((r) => r.error);
    if (gagal?.error) toast(`Gagal memuat data: ${gagal.error.message}`, 'bad');

    const baru: DB = {
      profiles: (profiles.data ?? []).map(profileDariDb),
      jemaat: (jemaat.data ?? []).map(jemaatDariDb),
      surat: (surat.data ?? []).map(suratDariDb),
      transaksi: (transaksi.data ?? []).map(transaksiDariDb),
      kegiatan: (kegiatan.data ?? []).map(kegiatanDariDb),
      warta: (warta.data ?? []).map(wartaDariDb),
    };
    pasangDb(await tandatanganiBerkas(baru));
    setUserId(profil.id);
    return profil;
  }, [sb, pasangDb, toast]);

  useEffect(() => {
    let aktif = true;
    muat()
      .catch((e) => toast(`Gagal terhubung ke Supabase: ${pesanError(e)}`, 'bad'))
      .finally(() => aktif && setReady(true));
    const { data: sub } = sb.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        pasangDb(DB_KOSONG);
        setUserId(null);
      }
    });
    return () => {
      aktif = false;
      sub.subscription.unsubscribe();
    };
  }, [muat, sb, pasangDb, toast]);

  const simpanPerubahan = useCallback((lama: DB, baru: DB) => simpanPerbedaan(sbUmum, lama, baru), [sbUmum]);

  const setDb = useCallback(
    (updater: (db: DB) => DB) => {
      const lama = dbRef.current;
      const baru = updater(lama);
      if (baru === lama) return;
      pasangDb(baru);
      antrean.current = antrean.current.then(async () => {
        try {
          await simpanPerubahan(lama, baru);
        } catch (e) {
          toast(`Perubahan gagal disimpan ke database: ${pesanError(e)}`, 'bad');
          await muat();
        }
      });
    },
    [pasangDb, simpanPerubahan, toast, muat]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        if (/confirm/i.test(error.message)) return { ok: false, reason: 'unconfirmed' };
        if (/invalid/i.test(error.message)) return { ok: false, reason: 'invalid' };
        return { ok: false, reason: 'error', message: error.message };
      }
      let profil: Profile | null;
      try {
        profil = await muat();
      } catch (e) {
        await sb.auth.signOut();
        return { ok: false, reason: 'error', message: `profil akun tidak dapat dibaca (${pesanError(e)})` };
      }
      if (!profil) {
        await sb.auth.signOut();
        return { ok: false, reason: 'error', message: 'akun ini belum punya baris di tabel profiles.' };
      }
      return { ok: true, nama: profil.nama, peran: profil.peran };
    },
    [sb, muat]
  );

  const logout = useCallback(async () => {
    await sb.auth.signOut();
    pasangDb(DB_KOSONG);
    setUserId(null);
  }, [sb, pasangDb]);

  const register = useCallback(
    async ({ nama, email, password }: { nama: string; email: string; password: string }): Promise<RegisterResult> => {
      const { data, error } = await sb.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { nama: nama.trim() }, emailRedirectTo: `${window.location.origin}/login` },
      });
      if (error) {
        if (/registered|exists/i.test(error.message)) return { ok: false, field: 'email', message: 'Email ini sudah terdaftar. Silakan masuk.' };
        if (/password/i.test(error.message)) return { ok: false, field: 'form', message: `Kata sandi ditolak: ${error.message}` };
        return { ok: false, field: 'form', message: error.message };
      }
      // Supabase tidak memberi error untuk email yang sudah terdaftar bila konfirmasi email aktif
      if (data.user && data.user.identities && data.user.identities.length === 0) {
        return { ok: false, field: 'email', message: 'Email ini sudah terdaftar. Silakan masuk.' };
      }
      // Akun baru selalu berperan warga; jangan biarkan sesi warga aktif di panel admin
      if (data.session) await sb.auth.signOut();
      return { ok: true, perluKonfirmasi: !data.session };
    },
    [sb]
  );

  const kirimResetPassword = useCallback(
    async (email: string): Promise<SimpleResult> => {
      const { error } = await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
      return error ? { ok: false, message: error.message } : { ok: true };
    },
    [sb]
  );

  const gantiPassword = useCallback(
    async (passwordBaru: string): Promise<SimpleResult> => {
      const { error } = await sb.auth.updateUser({ password: passwordBaru });
      if (error) {
        const msg = /session/i.test(error.message) ? 'Tautan reset tidak valid atau sudah kedaluwarsa. Minta tautan baru dari halaman Lupa Kata Sandi.' : error.message;
        return { ok: false, message: msg };
      }
      await sb.auth.signOut();
      return { ok: true };
    },
    [sb]
  );

  const updateUser = useCallback(
    (patch: Partial<Profile>) => {
      if (!userId) return;
      setDb((d) => ({ ...d, profiles: d.profiles.map((p) => (p.id === userId ? { ...p, ...patch } : p)) }));
    },
    [userId, setDb]
  );

  const resetData = useCallback(() => {
    void muat();
  }, [muat]);

  const user = useMemo(() => db.profiles.find((p) => p.id === userId) ?? null, [db.profiles, userId]);

  const value = useMemo<DataContextValue>(
    () => ({ mode: 'supabase', db, ready, user, setDb, login, logout, register, kirimResetPassword, gantiPassword, updateUser, resetData }),
    [db, ready, user, setDb, login, logout, register, kirimResetPassword, gantiPassword, updateUser, resetData]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
