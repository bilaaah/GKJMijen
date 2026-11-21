'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Icon, LogoMark } from '@/components/common';
import { FormInput, PasswordInput } from '@/components/forms';
import { Alert, useToast } from '@/components/feedback';
import { useData } from '@/lib/data';
import { isValidEmail } from '@/utils/validators';
import { ROUTES } from '@/lib/constants/routes';

type Errors = Partial<Record<'nama' | 'email' | 'password' | 'password2' | 'setuju' | 'form', string>>;

export default function RegisterPage() {
  const { register } = useData();
  const router = useRouter();
  const toast = useToast();
  const [f, setF] = useState({ nama: '', email: '', password: '', password2: '', setuju: false });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: Errors = {};
    if (f.nama.trim().length < 3) er.nama = 'Nama lengkap minimal 3 huruf.';
    if (!f.email) er.email = 'Email wajib diisi.';
    else if (!isValidEmail(f.email)) er.email = 'Format email belum benar, contoh: nama@email.com';
    if (f.password.length < 8) er.password = 'Kata sandi minimal 8 karakter.';
    if (!f.password2) er.password2 = 'Ulangi kata sandi.';
    else if (f.password2 !== f.password) er.password2 = 'Konfirmasi kata sandi tidak cocok.';
    if (!f.setuju) er.setuju = 'Centang persetujuan untuk melanjutkan.';
    let perluKonfirmasi = false;
    if (!er.email && Object.keys(er).length === 0) {
      setLoading(true);
      const res = await register({ nama: f.nama, email: f.email, password: f.password });
      setLoading(false);
      if (!res.ok) er[res.field] = res.message;
      else perluKonfirmasi = res.perluKonfirmasi;
    }
    setErrors(er);
    if (Object.keys(er).length) return;
    toast(perluKonfirmasi ? 'Akun dibuat sebagai Warga. Buka email Anda dan klik tautan konfirmasi, lalu masuk.' : 'Akun berhasil dibuat sebagai Warga. Silakan masuk.');
    router.push(ROUTES.AUTH.LOGIN);
  };

  return (
    <>
      <Link href={ROUTES.HOME} className="auth-back">
        <Icon name="arrow-left" /> Kembali ke Beranda
      </Link>
      <LogoMark tone="maroon" size="xl" />
      <div className="eyebrow">Pendaftaran akun</div>
      <h1>Buat Akun Baru</h1>
      <p className="muted">Isi data berikut untuk mendaftar sebagai jemaat GKJ Mijen.</p>
      <form className="form-stack" onSubmit={submit} noValidate>
        <FormInput id="nama" label="Nama Lengkap" required placeholder="Sesuai data jemaat" autoComplete="name" value={f.nama} onChange={(e) => setF({ ...f, nama: e.target.value })} error={errors.nama} />
        <FormInput id="email" label="Email" required type="email" placeholder="nama@email.com" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} error={errors.email} />
        <PasswordInput id="password" label="Kata Sandi" required placeholder="Minimal 8 karakter" autoComplete="new-password" helperText="Gunakan minimal 8 karakter." value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} error={errors.password} />
        <PasswordInput id="password2" label="Konfirmasi Kata Sandi" required placeholder="Ulangi kata sandi" autoComplete="new-password" value={f.password2} onChange={(e) => setF({ ...f, password2: e.target.value })} error={errors.password2} />
        <Alert tone="rose">
          Akun baru terdaftar sebagai <b>Warga</b>. Peran Pengurus diberikan oleh admin melalui menu Akun Pengguna.
        </Alert>
        <div className="field">
          <label className="check">
            <input type="checkbox" checked={f.setuju} onChange={(e) => setF({ ...f, setuju: e.target.checked })} /> <span>Saya menyetujui penggunaan data saya untuk pelayanan GKJ Mijen.</span>
          </label>
          {errors.setuju && <div className="err">{errors.setuju}</div>}
        </div>
        {errors.form && <Alert tone="bad">{errors.form}</Alert>}
        <Button type="submit" block disabled={loading}>
          {loading ? 'Memproses…' : 'Daftar'}
        </Button>
      </form>
      <p className="auth-switch">
        Sudah punya akun?{' '}
        <Link href={ROUTES.AUTH.LOGIN} className="link">
          Masuk
        </Link>
      </p>
    </>
  );
}
