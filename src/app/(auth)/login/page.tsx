'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Icon, LogoMark } from '@/components/common';
import { FormInput, PasswordInput } from '@/components/forms';
import { Alert, useToast } from '@/components/feedback';
import { useData, DEMO_EMAIL, DEMO_WARGA_EMAIL } from '@/lib/data';
import { isValidEmail } from '@/utils/validators';
import { ROUTES } from '@/lib/constants/routes';

export default function LoginPage() {
  const { login, mode } = useData();
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [alert, setAlert] = useState<'invalid' | 'warga' | 'unconfirmed' | 'error' | null>(null);
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);
    const er: typeof errors = {};
    if (!email) er.email = 'Email wajib diisi.';
    else if (!isValidEmail(email)) er.email = 'Format email belum benar, contoh: nama@email.com';
    if (!password) er.password = 'Kata sandi wajib diisi.';
    setErrors(er);
    if (Object.keys(er).length) return;
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) {
      setAlertMsg(res.message ?? '');
      return setAlert(res.reason);
    }
    toast(`Selamat datang, ${res.nama}.`);
    // Warga ke portal jemaat, pengurus ke panel admin. ?next= dipakai bila login dipicu dari halaman lain.
    const next = new URLSearchParams(window.location.search).get('next');
    if (res.peran === 'warga') router.push(next?.startsWith(ROUTES.PORTAL.ROOT) ? next : ROUTES.PORTAL.ROOT);
    else router.push(ROUTES.DASHBOARD.ROOT);
  };

  return (
    <>
      <LogoMark tone="maroon" size="xl" />
      <div className="eyebrow">Selamat datang kembali</div>
      <h1>Masuk ke Akun Anda</h1>
      <p className="muted">Gunakan email yang terdaftar di GKJ Mijen.</p>
      {alert === 'invalid' && (
        <Alert tone="bad" style={{ marginBottom: 16 }}>
          Email atau kata sandi salah. Periksa kembali lalu coba lagi.
        </Alert>
      )}
      {alert === 'warga' && (
        <Alert tone="warn" icon="shield-exclamation" style={{ marginBottom: 16 }}>
          Akun ini terdaftar sebagai Warga. Halaman admin hanya dapat dibuka oleh Pengurus Gereja.
        </Alert>
      )}
      {alert === 'unconfirmed' && (
        <Alert tone="warn" icon="envelope-exclamation" style={{ marginBottom: 16 }}>
          Email belum dikonfirmasi. Buka email dari GKJ Mijen (Supabase) dan klik tautan konfirmasi, lalu masuk lagi.
        </Alert>
      )}
      {alert === 'error' && (
        <Alert tone="bad" style={{ marginBottom: 16 }}>
          Gagal masuk: {alertMsg || 'terjadi kesalahan. Coba lagi beberapa saat lagi.'}
        </Alert>
      )}
      <form className="form-stack" onSubmit={submit} noValidate>
        <FormInput id="email" label="Email" type="email" placeholder="nama@email.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
        <PasswordInput id="password" label="Kata Sandi" placeholder="Masukkan kata sandi" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <div className="row-between">
          <label className="check">
            <input type="checkbox" defaultChecked /> <span>Ingat saya</span>
          </label>
          <Link href={ROUTES.AUTH.FORGOT_PASSWORD} className="link">
            Lupa kata sandi?
          </Link>
        </div>
        <Button type="submit" block disabled={loading}>
          {loading ? 'Memproses…' : 'Masuk'} <Icon name="arrow-right" />
        </Button>
      </form>
      {mode === 'demo' && (
        <div className="demo-hint">
          <Icon name="info-circle" />
          <div>
            Akun demo pengurus: <b>{DEMO_EMAIL}</b> dengan kata sandi apa saja (minimal 8 karakter).{' '}
            <button
              type="button"
              className="link"
              onClick={() => {
                setEmail(DEMO_EMAIL);
                setPassword('kasih2026');
              }}
            >
              Isi otomatis
            </button>
            <br />
            Akun demo warga: <b>{DEMO_WARGA_EMAIL}</b>.{' '}
            <button
              type="button"
              className="link"
              onClick={() => {
                setEmail(DEMO_WARGA_EMAIL);
                setPassword('kasih2026');
              }}
            >
              Isi otomatis
            </button>
          </div>
        </div>
      )}
      <p className="auth-switch">
        Belum punya akun?{' '}
        <Link href={ROUTES.AUTH.REGISTER} className="link">
          Daftar
        </Link>
      </p>
    </>
  );
}
