'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, ButtonLink, Icon } from '@/components/common';
import { FormInput } from '@/components/forms';
import { useToast } from '@/components/feedback';
import { isValidEmail } from '@/utils/validators';
import { ROUTES } from '@/lib/constants/routes';

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState('');
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
          <ButtonLink href={ROUTES.AUTH.RESET_PASSWORD} variant="ghost" block>
            Buka tautan reset (simulasi)
          </ButtonLink>
        </div>
        <p className="auth-switch">
          Belum menerima email?{' '}
          <button type="button" className="link" onClick={() => toast(`Tautan reset dikirim ulang ke ${sentTo}.`)}>
            Kirim ulang
          </button>
        </p>
      </>
    );
  }

  return (
    <>
      <Link href={ROUTES.AUTH.LOGIN} className="link d-inline-flex align-items-center gap-2 mb-3">
        <Icon name="arrow-left" /> Kembali
      </Link>
      <div className="eyebrow">Lupa kata sandi</div>
      <h1>Atur Ulang Kata Sandi</h1>
      <p className="muted">Masukkan email akun Anda. Kami akan mengirim tautan untuk membuat kata sandi baru.</p>
      <form
        className="form-stack"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (!email) return setError('Email wajib diisi.');
          if (!isValidEmail(email)) return setError('Format email belum benar, contoh: nama@email.com');
          setError('');
          setSentTo(email);
        }}
      >
        <FormInput id="email" label="Email" type="email" placeholder="nama@email.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} error={error} />
        <Button type="submit" block>
          Kirim Tautan Reset
        </Button>
      </form>
    </>
  );
}
