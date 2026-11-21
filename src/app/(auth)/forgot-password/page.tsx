'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, ButtonLink, Icon } from '@/components/common';
import { FormInput } from '@/components/forms';
import { Alert, useToast } from '@/components/feedback';
import { useData } from '@/lib/data';
import { isValidEmail } from '@/utils/validators';
import { ROUTES } from '@/lib/constants/routes';

export default function ForgotPasswordPage() {
  const toast = useToast();
  const { kirimResetPassword, mode } = useData();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [gagal, setGagal] = useState('');

  const kirim = async (alamat: string) => {
    setLoading(true);
    const res = await kirimResetPassword(alamat);
    setLoading(false);
    if (!res.ok) {
      setGagal(res.message);
      return false;
    }
    setGagal('');
    return true;
  };
  const [error, setError] = useState('');
  const [sentTo, setSentTo] = useState('');

  if (sentTo) {
    return (
      <>
        <div className="success-box">
          <div className="ic-circle ok">
            <Icon name="envelope-check" />
          </div>
          <h1>Periksa Email Anda</h1>
          <p className="muted">
            Tautan reset telah dikirim ke <b>{sentTo}</b>. Tautan berlaku selama 60 menit.
          </p>
        </div>
        <div className="form-stack" style={{ marginTop: 22 }}>
          <ButtonLink href={ROUTES.AUTH.LOGIN} block>
            Kembali ke Halaman Masuk
          </ButtonLink>
          {mode === 'demo' && (
            <ButtonLink href={ROUTES.AUTH.RESET_PASSWORD} variant="ghost" block>
              Buka tautan reset (simulasi)
            </ButtonLink>
          )}
        </div>
        <p className="auth-switch">
          Belum menerima email?{' '}
          <button
            type="button"
            className="link"
            disabled={loading}
            onClick={async () => {
              if (await kirim(sentTo)) toast(`Tautan reset dikirim ulang ke ${sentTo}.`);
              else toast('Gagal mengirim ulang. Tunggu beberapa menit lalu coba lagi.', 'bad');
            }}
          >
            Kirim ulang
          </button>
        </p>
      </>
    );
  }

  return (
    <>
      <Link href={ROUTES.AUTH.LOGIN} className="auth-back">
        <Icon name="arrow-left" /> Kembali ke Masuk
      </Link>
      <div className="eyebrow">Lupa kata sandi</div>
      <h1>Atur Ulang Kata Sandi</h1>
      <p className="muted">Masukkan email akun Anda. Kami akan mengirim tautan untuk membuat kata sandi baru.</p>
      <form
        className="form-stack"
        noValidate
        onSubmit={async (e) => {
          e.preventDefault();
          if (!email) return setError('Email wajib diisi.');
          if (!isValidEmail(email)) return setError('Format email belum benar, contoh: nama@email.com');
          setError('');
          if (await kirim(email)) setSentTo(email);
        }}
      >
        <FormInput id="email" label="Email" type="email" placeholder="nama@email.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
        {gagal && <Alert tone="bad">Gagal mengirim tautan: {gagal}</Alert>}
        <Button type="submit" block disabled={loading}>
          {loading ? 'Mengirim…' : 'Kirim Tautan Reset'}
        </Button>
      </form>
    </>
  );
}
