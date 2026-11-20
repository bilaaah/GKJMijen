'use client';

/**
 * MODE DEMO: dipakai otomatis jika kunci Supabase belum diisi di .env.local.
 * Data contoh disimpan di memori & sessionStorage tab browser, jadi perubahan
 * bertahan saat pindah halaman atau refresh, tetapi hilang saat tab ditutup.
 * Berguna untuk tim frontend yang ingin mengerjakan tampilan tanpa database.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SEED } from './demo-seed';
import { DataContext, newId, type DataContextValue, type LoginResult, type RegisterResult, type SimpleResult } from './context';
import type { DB, Profile } from './types';

const STORAGE_KEY = 'gkj-mijen-mock-v1';

export function DemoDataProvider({ children }: { children: React.ReactNode }) {
  const [db, setDbState] = useState<DB>(SEED);
  const [userId, setUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { db?: DB; userId?: string | null };
        if (saved.db) setDbState(saved.db);
        if (saved.userId) setUserId(saved.userId);
      }
    } catch {
      /* sessionStorage tidak tersedia: tetap pakai data contoh */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ db, userId }));
    } catch {
      /* kuota penuh (misalnya gambar besar): abaikan */
    }
  }, [db, userId, ready]);

  const setDb = useCallback((updater: (db: DB) => DB) => setDbState((prev) => updater(prev)), []);

  const user = useMemo(() => db.profiles.find((p) => p.id === userId) ?? null, [db.profiles, userId]);

  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      const p = db.profiles.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
      if (!p || password.length < 8) return { ok: false, reason: 'invalid' };
      if (p.peran !== 'pengurus') return { ok: false, reason: 'warga' };
      setUserId(p.id);
      return { ok: true, nama: p.nama };
    },
    [db.profiles]
  );

  const logout = useCallback(async () => setUserId(null), []);

  const register = useCallback(
    async ({ nama, email }: { nama: string; email: string; password: string }): Promise<RegisterResult> => {
      if (db.profiles.some((p) => p.email.toLowerCase() === email.trim().toLowerCase())) {
        return { ok: false, field: 'email', message: 'Email ini sudah terdaftar. Silakan masuk.' };
      }
      const created = new Date().toISOString().slice(0, 10);
      setDbState((prev) => ({
        ...prev,
        profiles: [...prev.profiles, { id: newId(), nama: nama.trim(), email: email.trim(), peran: 'warga', created_at: created }],
      }));
      return { ok: true, perluKonfirmasi: false };
    },
    [db.profiles]
  );

  const kirimResetPassword = useCallback(async (): Promise<SimpleResult> => ({ ok: true }), []);
  const gantiPassword = useCallback(async (): Promise<SimpleResult> => ({ ok: true }), []);

  const updateUser = useCallback(
    (patch: Partial<Profile>) => {
      if (!userId) return;
      setDbState((prev) => ({ ...prev, profiles: prev.profiles.map((p) => (p.id === userId ? { ...p, ...patch } : p)) }));
    },
    [userId]
  );

  const resetData = useCallback(() => setDbState(SEED), []);

  const value = useMemo<DataContextValue>(
    () => ({ mode: 'demo', db, ready, user, setDb, login, logout, register, kirimResetPassword, gantiPassword, updateUser, resetData }),
    [db, ready, user, setDb, login, logout, register, kirimResetPassword, gantiPassword, updateUser, resetData]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
